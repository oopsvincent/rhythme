"use server";
import {createClient} from "@/lib/supabase/server"

export async function getWorkspaceGoal(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_preferences")
    .select("onboarding_data")
    .eq("user_id", userId)
    .single()

  if (error || !data?.onboarding_data) return null

  const obData = data.onboarding_data

  if (!obData.long_term_goal) return null

  return {
    title: obData.long_term_goal,
    description: obData.long_term_goal_description,
  }
}