// app/actions/update-username.ts
"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateUsername(formData: FormData) {
  const supabase = await createClient()
  const username = formData.get("username") as string

  if (!username || username.trim() === "") {
    throw new Error("Username is required")
  }

  // Update the full_name in user_metadata (this is what OAuth providers use)
  const { data, error } = await supabase.auth.updateUser({
    data: { 
      full_name: username.trim(),
      display_name: username.trim() // Also set display_name as backup
    },
  })

  if (error) {
    console.error("Error updating username:", error)
    throw new Error(error.message)
  }

  // Revalidate the dashboard page
  revalidatePath("/dashboard")
  
  // Force a hard refresh by redirecting to the same page
  redirect("/dashboard")
}