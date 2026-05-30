"use server";
import {createClient} from "@/lib/supabase/server"

export async function getWorkspaceGoal(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_goals")
    .select("title, description")
    .eq("user_id", userId)
    .eq("is_primary", true)
    .single()

  if (error || !data) return null

  return {
    title: data.title,
    description: data.description ?? undefined,
  }
}