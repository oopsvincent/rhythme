// app/actions/settings.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// ============================================================================
// TYPES
// ============================================================================

export interface UserPreferences {
  user_preferences_id: string
  user_id: string
  notifications_enabled: boolean
  email_notifications: boolean
  push_notifications: boolean
  marketing_emails: boolean
  profile_visible: boolean
  show_activity_status: boolean
  onboarding_data: {
    role: "student" | "working_professional" | "freelancer" | "entrepreneur" | "other"
    daily_habits_target: number
    daily_tasks_target: number
  } | null
  created_at: string
  updated_at: string
}

export interface SettingsActionResult {
  success: boolean
  error?: string
}

// ============================================================================
// GET USER PREFERENCES
// ============================================================================

export async function getUserPreferences(): Promise<UserPreferences | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("Error fetching user preferences:", error)
    return null
  }

  return data as UserPreferences
}

// ============================================================================
// UPDATE USER PROFILE (Display Name)
// ============================================================================

export async function updateUserProfile(formData: FormData): Promise<SettingsActionResult> {
  const supabase = await createClient()
  
  const displayName = formData.get("displayName") as string
  
  if (!displayName || displayName.trim() === "") {
    return { success: false, error: "Display name is required" }
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: displayName.trim(),
      display_name: displayName.trim()
    }
  })

  if (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/settings/account")
  revalidatePath("/dashboard")
  
  return { success: true }
}

// ============================================================================
// UPDATE NOTIFICATION PREFERENCES
// ============================================================================

export async function updateNotificationPreferences(formData: FormData): Promise<SettingsActionResult> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const emailNotifications = formData.get("emailNotifications") === "on"
  const pushNotifications = formData.get("pushNotifications") === "on"
  const marketingEmails = formData.get("marketingEmails") === "on"

  const { error } = await supabase
    .from("user_preferences")
    .update({
      email_notifications: emailNotifications,
      push_notifications: pushNotifications,
      marketing_emails: marketingEmails,
      notifications_enabled: emailNotifications || pushNotifications,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating notification preferences:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/settings/notifications")
  
  return { success: true }
}

// ============================================================================
// UPDATE PRIVACY SETTINGS
// ============================================================================

export async function updatePrivacySettings(formData: FormData): Promise<SettingsActionResult> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const profileVisible = formData.get("profileVisible") === "on"
  const showActivityStatus = formData.get("showActivityStatus") === "on"

  const { error } = await supabase
    .from("user_preferences")
    .update({
      profile_visible: profileVisible,
      show_activity_status: showActivityStatus,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating privacy settings:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/settings/privacy")
  
  return { success: true }
}

// ============================================================================
// UPDATE ONBOARDING DATA (role, targets)
// ============================================================================

export async function updateOnboardingData(formData: FormData): Promise<SettingsActionResult> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const role = formData.get("role") as string
  const dailyHabitsTarget = parseInt(formData.get("dailyHabitsTarget") as string) || 3
  const dailyTasksTarget = parseInt(formData.get("dailyTasksTarget") as string) || 3

  const onboardingData = {
    role: role as "student" | "working_professional" | "freelancer" | "entrepreneur" | "other",
    daily_habits_target: dailyHabitsTarget,
    daily_tasks_target: dailyTasksTarget
  }

  const { error } = await supabase
    .from("user_preferences")
    .update({
      onboarding_data: onboardingData,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating onboarding data:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/settings/account")
  
  return { success: true }
}
