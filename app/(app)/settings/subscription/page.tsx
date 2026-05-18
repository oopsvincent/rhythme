import { getUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { SubscriptionSection } from "./_components/subscription-section"
import { createClient } from "@/lib/supabase/server"
import { getAmplecenLoginUrl } from "@/lib/auth-redirect"
import { RHYTHME_PRODUCT_KEY } from "@/lib/payments/dodo"

export default async function SubscriptionPage() {
  const user = await getUser()

  if (!user) {
    redirect(getAmplecenLoginUrl("/settings/subscription"))
  }

  const supabase = await createClient()
  const { data: subscription } = await supabase
    .from("account_subscriptions")
    .select("plan_key, status, entitlement_active, amount, currency, billing_interval, current_period_end, cancel_at_period_end, provider_subscription_id")
    .eq("user_id", user.id)
    .eq("product_key", RHYTHME_PRODUCT_KEY)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: billingHistory } = await supabase
    .from("billing_events")
    .select("id, provider_payment_id, plan_key, amount, currency, status, paid_at, receipt_url")
    .eq("user_id", user.id)
    .eq("product_key", RHYTHME_PRODUCT_KEY)
    .order("paid_at", { ascending: false, nullsFirst: false })
    .limit(6)

  const currentPlan = subscription?.entitlement_active ? "premium" : "starter"

  return (
    <SubscriptionSection
      currentPlan={currentPlan}
      details={{
        plan: subscription?.plan_key,
        status: subscription?.status,
        amount: subscription?.amount,
        currency: subscription?.currency,
        billingInterval: subscription?.billing_interval,
        currentPeriodEnd: subscription?.current_period_end,
        cancelAtPeriodEnd: subscription?.cancel_at_period_end,
        subscriptionId: subscription?.provider_subscription_id,
        billingHistory: billingHistory ?? [],
      }}
    />
  )
}
