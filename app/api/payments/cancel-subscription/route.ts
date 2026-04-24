import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { getDodoClient, RHYTHME_PRODUCT_KEY } from "@/lib/payments/dodo"

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: subscription, error } = await supabase
    .from("account_subscriptions")
    .select("id, provider_subscription_id")
    .eq("user_id", user.id)
    .eq("product_key", RHYTHME_PRODUCT_KEY)
    .eq("provider", "dodo")
    .eq("entitlement_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !subscription?.provider_subscription_id) {
    return NextResponse.json({ error: "No active subscription found" }, { status: 404 })
  }

  try {
    const updated = await getDodoClient().subscriptions.update(subscription.provider_subscription_id, {
      cancel_at_next_billing_date: true,
      cancel_reason: "cancelled_by_customer",
    })

    await getAdminClient()
      .from("account_subscriptions")
      .update({
        status: updated.status,
        entitlement_active: updated.status === "active" || updated.status === "on_hold",
        cancel_at_period_end: updated.cancel_at_next_billing_date,
        canceled_at: updated.cancelled_at,
        raw_payload: updated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id)

    return NextResponse.json({
      status: updated.status,
      cancel_at_period_end: updated.cancel_at_next_billing_date,
      current_period_end: updated.next_billing_date || updated.expires_at,
    })
  } catch (error) {
    console.error("Cancel subscription error:", error)
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
  }
}
