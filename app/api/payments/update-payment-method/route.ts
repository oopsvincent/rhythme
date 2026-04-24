import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getDodoClient, RHYTHME_PRODUCT_KEY } from "@/lib/payments/dodo"

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: subscription, error } = await supabase
    .from("account_subscriptions")
    .select("provider_subscription_id")
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
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const response = await getDodoClient().subscriptions.updatePaymentMethod(
      subscription.provider_subscription_id,
      {
        type: "new",
        return_url: `${appUrl}/settings/subscription`,
      },
    )

    if (!response.payment_link) {
      return NextResponse.json({ error: "Dodo did not return a payment update link" }, { status: 502 })
    }

    return NextResponse.json({ url: response.payment_link })
  } catch (error) {
    console.error("Update payment method error:", error)
    return NextResponse.json({ error: "Failed to create payment method update link" }, { status: 500 })
  }
}
