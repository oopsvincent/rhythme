'use server'

import { canCreateMoodLog } from '@/app/actions/usage-limits'
import { createClient } from '@/lib/supabase/server'
import type {
  ActionResponse,
  CreateMoodLogInput,
  MoodLog,
  UpdateMoodLogInput,
} from '@/types/database'

function extractErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return fallback
}


async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Not authenticated')
  }

  return { user, supabase }
}

function normalizeMoodScore(value: number) {
  const rounded = Math.round(value * 2) / 2

  if (rounded < 1 || rounded > 5) {
    throw new Error('Mood score must be between 1 and 5.')
  }

  return rounded
}

function normalizeLoggedAt(value?: string) {
  // IMPORTANT: Client must provide local_date to avoid UTC day-boundary bugs.
  // Fallback uses server time which may differ from user's local date.
  if (!value) {
    console.warn('[moodLogs] logged_at not provided — falling back to server date. Client should send getLocalDateString().')
  }
  return value ?? new Date().toISOString().split('T')[0]
}

export async function getMoodLogs(limit = 90): Promise<ActionResponse<MoodLog[]>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('logged_at', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { data: (data ?? []) as MoodLog[] }
  } catch (error) {
    console.error('getMoodLogs error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to fetch mood logs' }
  }
}

export async function createMoodLog(input: CreateMoodLogInput): Promise<ActionResponse<MoodLog>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()
    const loggedAt = normalizeLoggedAt(input.logged_at)
    const moodScore = normalizeMoodScore(input.mood_score)

    const limit = await canCreateMoodLog(loggedAt)
    if (!limit.allowed) {
      throw new Error('Free users can save 1 mood log per day. Upgrade to Premium for more.')
    }

    const { data, error } = await supabase
      .from('mood_logs')
      .insert({
        user_id: user.id,
        mood_score: moodScore,
        note: input.note?.trim() || null,
        logged_at: loggedAt,
      })
      .select()
      .single()

    if (error) throw error

    return { data: data as MoodLog }
  } catch (error) {
    console.error('createMoodLog error:', error)
    return { error: extractErrorMessage(error, 'Failed to create mood log') }
  }
}

export async function updateMoodLog(
  id: number,
  input: UpdateMoodLogInput
): Promise<ActionResponse<MoodLog>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { data: existing, error: existingError } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (existingError || !existing) {
      throw new Error('Mood log not found.')
    }

    const loggedAt = normalizeLoggedAt(input.logged_at ?? existing.logged_at)
    if (loggedAt !== existing.logged_at) {
      const limit = await canCreateMoodLog(loggedAt)
      if (!limit.allowed) {
        throw new Error('Free users can save 1 mood log per day. Upgrade to Premium for more.')
      }
    }

    const updates: Record<string, unknown> = {}

    if (input.mood_score !== undefined) {
      updates.mood_score = normalizeMoodScore(input.mood_score)
    }

    if (input.note !== undefined) {
      updates.note = input.note?.trim() || null
    }

    if (input.logged_at !== undefined) {
      updates.logged_at = loggedAt
    }

    const { data, error } = await supabase
      .from('mood_logs')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return { data: data as MoodLog }
  } catch (error) {
    console.error('updateMoodLog error:', error)
    return { error: extractErrorMessage(error, 'Failed to update mood log') }
  }
}

export async function deleteMoodLog(id: number): Promise<ActionResponse<{ success: boolean }>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { error } = await supabase
      .from('mood_logs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return { data: { success: true } }
  } catch (error) {
    console.error('deleteMoodLog error:', error)
    return { error: extractErrorMessage(error, 'Failed to delete mood log') }
  }
}
