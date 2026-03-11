// app/actions/usage-limits.ts
// Server-side checks for free-tier usage limits

'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Check if the user can create a journal entry today.
 * Free users: 1 journal/day. Premium users: unlimited.
 */
export async function canCreateJournal(): Promise<{ allowed: boolean; count: number; limit: number }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { allowed: false, count: 0, limit: 1 }

  // Check if premium
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', user.id)
    .single()

  if (profile?.is_premium) return { allowed: true, count: 0, limit: Infinity }

  // Count today's journals
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).toISOString()

  const { count } = await supabase
    .from('journals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay)

  const currentCount = count ?? 0
  return { allowed: currentCount < 1, count: currentCount, limit: 1 }
}

/**
 * Check if the user can create a task today.
 * Free users: 10 tasks/day. Premium users: unlimited.
 */
export async function canCreateTask(): Promise<{ allowed: boolean; count: number; limit: number }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { allowed: false, count: 0, limit: 10 }

  // Check if premium
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', user.id)
    .single()

  if (profile?.is_premium) return { allowed: true, count: 0, limit: Infinity }

  // Count today's tasks
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).toISOString()

  const { count } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay)

  const currentCount = count ?? 0
  return { allowed: currentCount < 10, count: currentCount, limit: 10 }
}

/**
 * Check if the user can create a habit.
 * Free users: 5 habits total (active). Premium users: unlimited.
 */
export async function canCreateHabit(): Promise<{ allowed: boolean; count: number; limit: number }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { allowed: false, count: 0, limit: 5 }

  // Check if premium
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', user.id)
    .single()

  if (profile?.is_premium) return { allowed: true, count: 0, limit: Infinity }

  // Count total active habits
  const { count } = await supabase
    .from('habits')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_active', true)

  const currentCount = count ?? 0
  return { allowed: currentCount < 5, count: currentCount, limit: 5 }
}
