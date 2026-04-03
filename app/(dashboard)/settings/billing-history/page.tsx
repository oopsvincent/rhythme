// app/(dashboard)/settings/billing-history/page.tsx
// Billing history settings page

import { getUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BillingHistorySection } from "./_components/billing-history-section"

export default async function BillingHistoryPage() {
  const user = await getUser()
  if (!user) {
    redirect("/login")
  }
  
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("billing_history")
    .eq("id", user.id)
    .single()

  const invoices = Array.isArray(profile?.billing_history) ? profile.billing_history : []

  return <BillingHistorySection invoices={invoices} />
}
