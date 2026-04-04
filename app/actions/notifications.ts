// app/actions/notifications.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath, unstable_noStore as noStore } from "next/cache"
import type { Notification } from "@/types/database"

// ============================================================================
// FETCH NOTIFICATIONS
// ============================================================================

export async function getNotifications(limit = 50): Promise<Notification[]> {
  noStore()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching notifications:", error)
    return []
  }

  return data as Notification[]
}

// ============================================================================
// UNREAD COUNT
// ============================================================================

export async function getUnreadNotificationCount(): Promise<number> {
  noStore()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return 0

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false)

  if (error) {
    console.error("Error fetching unread count:", error)
    return 0
  }

  return count ?? 0
}

// ============================================================================
// MARK AS READ
// ============================================================================

import { createClient as createSupabaseAdmin } from "@supabase/supabase-js"

function getAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY!
  )
}

export async function markNotificationAsRead(
  notificationId: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const supabaseAdmin = getAdminClient()
  const { error } = await supabaseAdmin
    .from("notifications")
    .update({ is_read: true })
    .eq("notification_id", notificationId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error marking notification as read:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard")
  return { success: true }
}

// ============================================================================
// MARK ALL AS READ
// ============================================================================

export async function markAllNotificationsAsRead(): Promise<{
  success: boolean
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const supabaseAdmin = getAdminClient()
  const { error } = await supabaseAdmin
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false)

  if (error) {
    console.error("Error marking all notifications as read:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard")
  return { success: true }
}
