// app/(dashboard)/settings/subscription/page.tsx
// Subscription settings page

import { getUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { SubscriptionSection } from "./_components/subscription-section"

export default async function SubscriptionPage() {
  const user = await getUser()
  
  if (!user) {
    redirect("/login")
  }

  // TODO: Get actual subscription status from billing/payment provider
  const currentPlan = "starter" as const

  return <SubscriptionSection currentPlan={currentPlan} />
}

