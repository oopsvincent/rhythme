import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { WeeklyPageClient } from "@/components/weekly/weekly-page-client"
import { createClient } from "@/lib/supabase/server"
import { isCurrentUserPremium } from "@/app/actions/subscription"

export const metadata: Metadata = {
  title: "Weekly | Rhythmé",
  description: "Your simple, calm weekly rhythm.",
}

export default async function WeeklyPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("You need to be signed in to view your weekly rhythm.")
  }

  // Fetch active habits to populate the Multi-select
  const { data: activeHabits } = await supabase
    .from("habits")
    .select("habit_id, name")
    .eq("user_id", user.id)
    .eq("is_active", true)

  const isPremium = await isCurrentUserPremium();

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="@container/main flex flex-1 flex-col overflow-x-hidden">
          <WeeklyPageClient activeHabits={activeHabits || []} isPremium={isPremium} />
        </div>
      </div>
    </>
  )
}
