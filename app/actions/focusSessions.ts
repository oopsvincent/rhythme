'use server'

import { createClient } from "@/lib/supabase/server"
import type { ActionResponse, FocusSession } from "@/types/database"

async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Not authenticated')
  }

  return { user, supabase }
}

export async function getFocusSessions(limit = 50): Promise<ActionResponse<FocusSession[]>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from('focus_sessions')
      .select(`
        *,
        tasks:task_id (
          task_id,
          title,
          status,
          priority
        )
      `)
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

export async function getFocusSessionsForMonth(year: number, month: number): Promise<ActionResponse<FocusSession[]>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    // month is 0-indexed in JS dates
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999)

    const { data, error } = await supabase
      .from('focus_sessions')
      .select(`
        *,
        tasks:task_id (
          task_id,
          title
        )
      `)
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

export async function startFocusSession(input: {
  taskId?: string | null
  plannedDuration: number
  metadata?: Record<string, unknown>
}): Promise<ActionResponse<FocusSession>> {
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
        planned_duration: input.plannedDuration,
        interruptions: 0,
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
    metadata?: Record<string, unknown>
  }
): Promise<ActionResponse<FocusSession>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from('focus_sessions')
      .update({
        ...(updates.interruptions !== undefined && { interruptions: updates.interruptions }),
        ...(updates.metadata !== undefined && { metadata: updates.metadata }),
      })
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

export async function endFocusSession(input: {
  sessionId: number
  actualDuration: number
  interruptions?: number
  metadata?: Record<string, unknown>
}): Promise<ActionResponse<FocusSession>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from('focus_sessions')
      .update({
        actual_duration: Math.max(0, Math.round(input.actualDuration)),
        interruptions: input.interruptions ?? 0,
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
