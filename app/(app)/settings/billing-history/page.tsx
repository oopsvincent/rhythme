import { getUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BillingHistorySection } from "./_components/billing-history-section"
import { getAmplecenLoginUrl } from "@/lib/auth-redirect"
import { RHYTHME_PRODUCT_KEY } from "@/lib/payments/dodo"

export default async function BillingHistoryPage() {
  const user = await getUser()
  if (!user) {
    redirect(getAmplecenLoginUrl("/settings/billing-history"))
  }

  const supabase = await createClient()
  const { data: invoices } = await supabase
    .from("billing_events")
    .select("id, provider_payment_id, plan_key, amount, currency, status, paid_at, receipt_url")
    .eq("user_id", user.id)
    .eq("product_key", RHYTHME_PRODUCT_KEY)
    .order("paid_at", { ascending: false, nullsFirst: false })

  return <BillingHistorySection invoices={invoices ?? []} />
}
