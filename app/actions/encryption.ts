"use server";

import { createClient } from "@/lib/supabase/server";

// ============================================================================
// ENCRYPTION VALIDATION TOKEN
// ============================================================================

/**
 * Get the encryption validation token for the current user.
 * Returns null if not set (user hasn't set up encryption passphrase yet).
 */
export async function getEncryptionToken(): Promise<string | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("user_preferences")
    .select("encryption_token")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    console.error("Error fetching encryption token:", error);
    return null;
  }

  return data.encryption_token || null;
}

/**
 * Save the encryption validation token for the current user.
 * Called when user sets up their encryption passphrase.
 */
export async function saveEncryptionToken(
  token: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("user_preferences")
    .update({
      encryption_token: token,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error saving encryption token:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Check if the current user has set up journal encryption.
 */
export async function hasEncryptionSetup(): Promise<boolean> {
  const token = await getEncryptionToken();
  return token !== null && token.length > 0;
}

/**
 * Re-encrypt all journals with a new passphrase.
 * Updates each journal's content + iv, and saves the new validation token.
 * Called when user changes their journal encryption passphrase.
 */
export async function reEncryptJournals(
  journals: { journalId: string; content: string; iv: string }[],
  newToken: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Update each journal's encrypted content and IV
    for (const journal of journals) {
      const { error } = await supabase
        .from("journals")
        .update({
          content: journal.content,
          iv: journal.iv,
          updated_at: new Date().toISOString(),
        })
        .eq("journal_id", journal.journalId)
        .eq("user_id", user.id);

      if (error) {
        console.error(
          `Error re-encrypting journal ${journal.journalId}:`,
          error
        );
        return {
          success: false,
          error: `Failed to re-encrypt journal: ${error.message}`,
        };
      }
    }

    // Update the validation token
    const { error: tokenError } = await supabase
      .from("user_preferences")
      .update({
        encryption_token: newToken,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (tokenError) {
      console.error("Error updating encryption token:", tokenError);
      return { success: false, error: tokenError.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Re-encryption failed:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to re-encrypt journals",
    };
  }
}
