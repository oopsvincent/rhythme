import { createClient } from '@/lib/supabase/client'
import type {
  FocusSession,
  InterruptionDetail,
  StartFocusSessionInput,
  Task,
} from '@/types/database'

const FOCUS_SESSION_SELECT = `
  session_id,
  user_id,
  task_id,
  is_active,
  planned_duration,
  actual_duration,
  interruptions,
  mood_before,
  mood_after,
  energy_start,
  energy_end,
  started_at,
  ended_at,
  interruption_details,
  custom_task_text,
  tags,
  metadata,
  created_at,
  tasks:task_id (
    task_id,
    title,
    status,
    priority
  )
`

type FocusTaskRelation = Pick<Task, 'task_id' | 'title' | 'status' | 'priority'> | null

interface FocusSessionRow extends Omit<FocusSession, 'tasks'> {
  tasks?: FocusTaskRelation | FocusTaskRelation[]
}

export interface EndFocusSessionPayload {
  sessionId: number
  actualDuration: number
  moodAfter?: number | null
  energyEnd?: number | null
  interruptions?: number
  interruptionDetails?: InterruptionDetail[]
  endedAt?: string
  metadata?: Record<string, unknown>
}

export interface UpdateFocusSessionPayload {
  actualDuration?: number
  moodAfter?: number | null
  energyEnd?: number | null
  interruptions?: number
  interruptionDetails?: InterruptionDetail[]
  metadata?: Record<string, unknown>
  isActive?: boolean
  endedAt?: string | null
}

function getSupabase() {
  return createClient()
}

async function getAuthenticatedUserId() {
  const supabase = getSupabase()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Not authenticated')
  }

  return { supabase, userId: user.id }
}

function mapSession(row: FocusSessionRow): FocusSession {
  const taskRelation = Array.isArray(row.tasks) ? row.tasks[0] ?? null : row.tasks ?? null

  return {
    ...row,
    tasks: taskRelation,
  }
}

export async function fetchActiveFocusSession(): Promise<FocusSession | null> {
  const { supabase, userId } = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('focus_sessions')
    .select(FOCUS_SESSION_SELECT)
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('started_at', { ascending: false })
    .limit(1)

  if (error) {
    throw error
  }

  const row = data?.[0] as FocusSessionRow | undefined
  return row ? mapSession(row) : null
}

export async function fetchRecentCompletedFocusSessions(limit = 4): Promise<FocusSession[]> {
  const { supabase, userId } = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('focus_sessions')
    .select(FOCUS_SESSION_SELECT)
    .eq('user_id', userId)
    .eq('is_active', false)
    .order('started_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  return ((data ?? []) as FocusSessionRow[]).map(mapSession)
}

export async function fetchFocusSessionsPage(
  page: number,
  pageSize: number,
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{ sessions: FocusSession[]; total: number }> {
  const { supabase, userId } = await getAuthenticatedUserId()
  const from = page * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('focus_sessions')
    .select(FOCUS_SESSION_SELECT, { count: 'exact' })
    .eq('user_id', userId)
    .eq('is_active', false)
    .order('started_at', { ascending: sortOrder === 'asc' })
    .range(from, to)

  if (error) {
    throw error
  }

  return {
    sessions: ((data ?? []) as FocusSessionRow[]).map(mapSession),
    total: count ?? 0,
  }
}

export async function fetchFocusSessionsForMonth(year: number, month: number): Promise<FocusSession[]> {
  const { supabase, userId } = await getAuthenticatedUserId()
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999)

  const { data, error } = await supabase
    .from('focus_sessions')
    .select(FOCUS_SESSION_SELECT)
    .eq('user_id', userId)
    .eq('is_active', false)
    .gte('started_at', startDate.toISOString())
    .lte('started_at', endDate.toISOString())
    .order('started_at', { ascending: false })

  if (error) {
    throw error
  }

  return ((data ?? []) as FocusSessionRow[]).map(mapSession)
}

export async function fetchFocusSessionById(sessionId: number): Promise<FocusSession | null> {
  const { supabase, userId } = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('focus_sessions')
    .select(FOCUS_SESSION_SELECT)
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data ? mapSession(data as FocusSessionRow) : null
}

export async function createFocusSession(input: StartFocusSessionInput): Promise<FocusSession> {
  const { supabase, userId } = await getAuthenticatedUserId()
  const taskIdStr = input.taskId !== null && input.taskId !== undefined ? String(input.taskId).trim() : ''
  const taskId = taskIdStr.length > 0 ? Number(taskIdStr) : null

  if (taskId !== null && !Number.isFinite(taskId)) {
    throw new Error('Invalid task selected')
  }

  const startedAt = new Date().toISOString()

  const { data, error } = await supabase
    .from('focus_sessions')
    .insert({
      user_id: userId,
      task_id: taskId,
      is_active: true,
      started_at: startedAt,
      custom_task_text: input.customTaskText?.trim() || null,
      planned_duration: input.plannedDuration,
      energy_start: input.energyStart ?? null,
      mood_before: input.moodBefore ?? null,
      tags: input.tags ?? null,
      interruptions: 0,
      interruption_details: [],
      metadata: input.metadata ?? {},
    })
    .select(FOCUS_SESSION_SELECT)
    .single()

  if (error) {
    throw error
  }

  return mapSession(data as FocusSessionRow)
}

export async function endFocusSessionRecord(input: EndFocusSessionPayload): Promise<FocusSession> {
  const { supabase, userId } = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('focus_sessions')
    .update({
      is_active: false,
      actual_duration: Math.max(0, Math.round(input.actualDuration)),
      mood_after: input.moodAfter ?? null,
      energy_end: input.energyEnd ?? null,
      interruptions: input.interruptions ?? 0,
      interruption_details: input.interruptionDetails ?? [],
      ended_at: input.endedAt ?? new Date().toISOString(),
      ...(input.metadata !== undefined && { metadata: input.metadata }),
    })
    .eq('session_id', input.sessionId)
    .eq('user_id', userId)
    .select(FOCUS_SESSION_SELECT)
    .single()

  if (error) {
    throw error
  }

  return mapSession(data as FocusSessionRow)
}

export async function updateFocusSessionRecord(
  sessionId: number,
  updates: UpdateFocusSessionPayload
): Promise<FocusSession> {
  const { supabase, userId } = await getAuthenticatedUserId()
  const payload: Record<string, unknown> = {}

  if (updates.actualDuration !== undefined) payload.actual_duration = Math.max(0, Math.round(updates.actualDuration))
  if (updates.moodAfter !== undefined) payload.mood_after = updates.moodAfter
  if (updates.energyEnd !== undefined) payload.energy_end = updates.energyEnd
  if (updates.interruptions !== undefined) payload.interruptions = updates.interruptions
  if (updates.interruptionDetails !== undefined) payload.interruption_details = updates.interruptionDetails
  if (updates.metadata !== undefined) payload.metadata = updates.metadata
  if (updates.isActive !== undefined) payload.is_active = updates.isActive
  if (updates.endedAt !== undefined) payload.ended_at = updates.endedAt

  const { data, error } = await supabase
    .from('focus_sessions')
    .update(payload)
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .select(FOCUS_SESSION_SELECT)
    .single()

  if (error) {
    throw error
  }

  return mapSession(data as FocusSessionRow)
}
