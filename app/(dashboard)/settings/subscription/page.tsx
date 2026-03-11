// app/(dashboard)/settings/subscription/page.tsx
// Subscription settings page — fetches real plan from profiles table

import { getUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { SubscriptionSection } from "./_components/subscription-section"
import { createClient } from "@/lib/supabase/server"

export default async function SubscriptionPage() {
  const user = await getUser()
  
  if (!user) {
    redirect("/login")
  }

  // Fetch real subscription status
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_premium")
    .eq("id", user.id)
    .single()

  const currentPlan = profile?.is_premium ? "premium" : "starter"

  return <SubscriptionSection currentPlan={currentPlan} />
}
