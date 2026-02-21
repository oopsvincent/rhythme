/**
 * =============================================================================
 * JOURNAL SERVER ACTIONS
 * =============================================================================
 * 
 * SSR Implementation: These server actions handle all journal CRUD operations
 * via Supabase. Data is fetched server-side and passed to client components.
 * 
 * LOCAL-FIRST MVP INTEGRATION POINTS:
 * When implementing local-first, these actions will need to:
 * 1. Check network connectivity
 * 2. If offline: delegate to local storage via @/lib/journal-storage
 * 3. If online: sync local changes first, then perform operation
 * 4. Queue failed operations for retry
 * 
 * See @/lib/journal-storage.ts for local storage implementation.
 * Search for "LOCAL_OPS" comments in client components for integration points.
 * =============================================================================
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { Journal, JournalInput, MoodTags } from "@/types/database";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const getAuthenticatedUser = async (): Promise<{
  user: User;
  supabase: SupabaseClient;
}> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Not authenticated");
  }

  return { user, supabase };
};

/**
 * Fetch all journals for the authenticated user
 */
export const getJournals = async (): Promise<Journal[]> => {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("journals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Fetch a single journal by ID
 */
export const getJournalById = async (journalId: string): Promise<Journal | null> => {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("journals")
    .select("*")
    .eq("journal_id", journalId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data;
};

/**
 * Create a new journal entry
 * Supports both encrypted and plaintext content.
 * If encrypted_content and iv are provided, they take precedence.
 */
export const createJournal = async (input: JournalInput) => {
  const { supabase, user } = await getAuthenticatedUser();

  try {
    const insertData: Record<string, unknown> = {
      user_id: user.id,
      title: input.title,
      content: input.content,
      created_at: input.created_at,
      updated_at: input.updated_at,
      mood_tags: {
        mood: input.mood_tags || "neutral",
      },
    };

    // Include iv if provided (indicates encrypted content)
    if (input.iv) {
      insertData.iv = input.iv;
    }

    const { data, error } = await supabase
      .from("journals")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard/journal");
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create journal",
    };
  }
};

/**
 * Update an existing journal entry
 */
export const updateJournal = async (
  journalId: string,
  input: Partial<JournalInput>
) => {
  const { supabase, user } = await getAuthenticatedUser();

  try {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.title !== undefined) updateData.title = input.title;
    if (input.content !== undefined) updateData.content = input.content;
    if (input.iv !== undefined) updateData.iv = input.iv;
    if (input.mood_tags !== undefined) updateData.mood_tags = { mood: input.mood_tags };

    const { data, error } = await supabase
      .from("journals")
      .update(updateData)
      .eq("journal_id", journalId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard/journal");
    revalidatePath(`/dashboard/journal/${journalId}`);
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update journal",
    };
  }
};

/**
 * Delete a journal entry
 */
export const deleteJournal = async (journalId: string) => {
  const { supabase, user } = await getAuthenticatedUser();

  try {
    const { error } = await supabase
      .from("journals")
      .delete()
      .eq("journal_id", journalId)
      .eq("user_id", user.id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard/journal");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete journal",
    };
  }
};

/**
 * Analyze journal sentiment via ML endpoint.
 * Client sends decrypted text; this action calls the ML service
 * and persists results (sentiment_score + mood_tags) to Supabase.
 */
export const analyzeJournalSentiment = async (
  journalId: string,
  decryptedTitle: string,
  decryptedText: string
) => {
  const { supabase, user } = await getAuthenticatedUser();

  try {
    // Import the sentiment service dynamically to keep the server action lean
    const { fetchSentimentAnalysis } = await import("@/lib/journal-sentiment");

    const result = await fetchSentimentAnalysis({
      title: decryptedTitle,
      text: decryptedText,
    });

    if (!result) {
      return { error: "Sentiment analysis service is unavailable" };
    }

    // Fetch current mood_tags to preserve the existing mood field
    const { data: currentJournal, error: fetchError } = await supabase
      .from("journals")
      .select("mood_tags")
      .eq("journal_id", journalId)
      .eq("user_id", user.id)
      .single();

    if (fetchError) {
      return { error: fetchError.message };
    }

    // Merge sentiment data into existing mood_tags
    const existingMoodTags = (currentJournal?.mood_tags as Record<string, unknown>) || {};
    const updatedMoodTags = {
      ...existingMoodTags,
      sentiment: result.sentiment,
      emotions: result.emotions,
      model_used: result.model_used,
      analyzed_at: result.created_at,
    };

    // confidence (0.0–1.0) → sentiment_score (0–100)
    const sentimentScore = Math.round(result.confidence * 100);

    const { error: updateError } = await supabase
      .from("journals")
      .update({
        mood_tags: updatedMoodTags,
        sentiment_score: sentimentScore,
      })
      .eq("journal_id", journalId)
      .eq("user_id", user.id);

    if (updateError) {
      return { error: updateError.message };
    }

    revalidatePath(`/dashboard/journal/${journalId}`);

    return {
      data: {
        sentiment: result.sentiment,
        confidence: result.confidence,
        sentimentScore,
        emotions: result.emotions,
        model_used: result.model_used,
        analyzed_at: result.created_at,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to analyze sentiment",
    };
  }
};
