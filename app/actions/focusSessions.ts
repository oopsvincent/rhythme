'use server'

import { createClient } from "@/lib/supabase/server"
import type {
  ActionResponse,
  FocusSession,
  StartFocusSessionInput,
  EndFocusSessionInput,
} from "@/types/database"

async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Not authenticated')
  }

  return { user, supabase }
}

const FOCUS_SESSION_SELECT = `
  *,
  tasks:task_id (
    task_id,
    title,
    status,
    priority
  )
`

export async function getFocusSessions(limit = 50): Promise<ActionResponse<FocusSession[]>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from('focus_sessions')
      .select(FOCUS_SESSION_SELECT)
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { data: data as FocusSession[] }
  } catch (error) {
    console.error('getFocusSessions error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to fetch focus sessions' }
  }
}

export async function getFocusSession(sessionId: number): Promise<ActionResponse<FocusSession>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from('focus_sessions')
      .select(FOCUS_SESSION_SELECT)
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    return { data: data as FocusSession }
  } catch (error) {
    console.error('getFocusSession error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to fetch focus session' }
  }
}

export async function getFocusSessionsForMonth(year: number, month: number): Promise<ActionResponse<FocusSession[]>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    // month is 0-indexed in JS dates
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999)

    const { data, error } = await supabase
      .from('focus_sessions')
      .select(FOCUS_SESSION_SELECT)
      .eq('user_id', user.id)
      .gte('started_at', startDate.toISOString())
      .lte('started_at', endDate.toISOString())
      .order('started_at', { ascending: false })

    if (error) throw error

    return { data: data as FocusSession[] }
  } catch (error) {
    console.error('getFocusSessionsForMonth error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to fetch focus sessions for month' }
  }
}

export async function getFocusSessionsPaginated(
  page: number,
  pageSize: number,
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<ActionResponse<{ sessions: FocusSession[]; total: number }>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const from = page * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
      .from('focus_sessions')
      .select(FOCUS_SESSION_SELECT, { count: 'exact' })
      .eq('user_id', user.id)
      .order('started_at', { ascending: sortOrder === 'asc' })
      .range(from, to)

    if (error) throw error

    return { data: { sessions: data as FocusSession[], total: count ?? 0 } }
  } catch (error) {
    console.error('getFocusSessionsPaginated error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to fetch focus sessions' }
  }
}

export async function startFocusSession(input: StartFocusSessionInput): Promise<ActionResponse<FocusSession>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()
    const taskIdStr = input.taskId !== null && input.taskId !== undefined ? String(input.taskId).trim() : ''
    const taskId = taskIdStr.length > 0 ? Number(taskIdStr) : null

    if (taskId !== null && !Number.isFinite(taskId)) {
      throw new Error('Invalid task selected')
    }

    const { data, error } = await supabase
      .from('focus_sessions')
      .insert({
        user_id: user.id,
        task_id: taskId,
        custom_task_text: input.customTaskText?.trim() || null,
        planned_duration: input.plannedDuration,
        energy_start: input.energyStart ?? null,
        mood_before: input.moodBefore ?? null,
        tags: input.tags ?? null,
        interruptions: 0,
        interruption_details: [],
        metadata: input.metadata ?? {},
      })
      .select()
      .single()

    if (error) throw error

    return { data: data as FocusSession }
  } catch (error) {
    console.error('startFocusSession error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to start focus session' }
  }
}

export async function updateFocusSession(
  sessionId: number,
  updates: {
    interruptions?: number
    interruptionDetails?: Array<{ type: string; label?: string; timestamp: string }>
    metadata?: Record<string, unknown>
  }
): Promise<ActionResponse<FocusSession>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const updateObj: Record<string, unknown> = {}
    if (updates.interruptions !== undefined) updateObj.interruptions = updates.interruptions
    if (updates.interruptionDetails !== undefined) updateObj.interruption_details = updates.interruptionDetails
    if (updates.metadata !== undefined) updateObj.metadata = updates.metadata

    const { data, error } = await supabase
      .from('focus_sessions')
      .update(updateObj)
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return { data: data as FocusSession }
  } catch (error) {
    console.error('updateFocusSession error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to update focus session' }
  }
}

export async function endFocusSession(input: EndFocusSessionInput): Promise<ActionResponse<FocusSession>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from('focus_sessions')
      .update({
        actual_duration: Math.max(0, Math.round(input.actualDuration)),
        mood_after: input.moodAfter,
        energy_end: input.energyEnd ?? null,
        interruptions: input.interruptions ?? 0,
        interruption_details: input.interruptionDetails ?? [],
        ended_at: new Date().toISOString(),
        ...(input.metadata !== undefined && { metadata: input.metadata }),
      })
      .eq('session_id', input.sessionId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return { data: data as FocusSession }
  } catch (error) {
    console.error('endFocusSession error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to finish focus session' }
  }
}

export async function updateFocusSessionNotes(
  sessionId: number,
  metadata: Record<string, unknown>
): Promise<ActionResponse<FocusSession>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from('focus_sessions')
      .update({ metadata })
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return { data: data as FocusSession }
  } catch (error) {
    console.error('updateFocusSessionNotes error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to update session notes' }
  }
}

export async function clearFocusSessions(): Promise<ActionResponse<{ success: boolean }>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { error } = await supabase
      .from('focus_sessions')
      .delete()
      .eq('user_id', user.id)

    if (error) throw error

    return { data: { success: true } }
  } catch (error) {
    console.error('clearFocusSessions error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to delete focus sessions' }
  }
}

export async function getFocusSessionsHistory(days = 14): Promise<ActionResponse<Pick<FocusSession, 'started_at' | 'actual_duration' | 'planned_duration'>[]>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const { data, error } = await supabase
      .from('focus_sessions')
      .select('started_at, actual_duration, planned_duration')
      .eq('user_id', user.id)
      .eq('is_active', false)
      .gte('started_at', cutoffDate.toISOString())
      .order('started_at', { ascending: false })

    if (error) throw error

    return { data: data as Pick<FocusSession, 'started_at' | 'actual_duration' | 'planned_duration'>[] }
  } catch (error) {
    console.error('getFocusSessionsHistory error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to fetch focus sessions history' }
  }
}

