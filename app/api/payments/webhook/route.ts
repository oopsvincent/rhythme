import { NextResponse } from "next/server"
import type { UnwrapWebhookEvent } from "dodopayments/resources/webhooks"
import { getAdminClient } from "@/lib/supabase/admin"
import { getDodoClient, isEntitledStatus, planFromProductId, RHYTHME_PRODUCT_KEY } from "@/lib/payments/dodo"

const webhookSecret = process.env.DODO_WEBHOOK_SECRET

function amountFromSmallestUnit(amount?: number | null) {
  if (typeof amount !== "number") return null
  return amount / 100
}

type DodoMetadata = Record<string, string | undefined>
type DodoCustomer = {
  customer_id?: string
  email?: string
  metadata?: DodoMetadata
}
type DodoWebhookData = {
  metadata?: DodoMetadata
  customer?: DodoCustomer
  subscription_id?: string | null
  customer_id?: string | null
}

async function findUserId(supabase: ReturnType<typeof getAdminClient>, data: DodoWebhookData) {
  const metadataUserId = data?.metadata?.user_id || data?.customer?.metadata?.user_id
  if (metadataUserId) return metadataUserId as string

  const subscriptionId = data?.subscription_id
  if (subscriptionId) {
    const { data: subscription } = await supabase
      .from("account_subscriptions")
      .select("user_id")
      .eq("provider", "dodo")
      .eq("provider_subscription_id", subscriptionId)
      .maybeSingle()

    if (subscription?.user_id) return subscription.user_id as string
  }

  const customerId = data?.customer_id || data?.customer?.customer_id
  if (customerId) {
    const { data: subscription } = await supabase
      .from("account_subscriptions")
      .select("user_id")
      .eq("provider", "dodo")
      .eq("provider_customer_id", customerId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (subscription?.user_id) return subscription.user_id as string
  }

  const email = data?.customer?.email
  if (email) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (profile?.id) return profile.id as string
  }

  return null
}

export async function POST(request: Request) {
  const body = await request.text()
  const headers = Object.fromEntries(request.headers.entries()) as Record<string, string>

  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 400 })
  }

  let event: UnwrapWebhookEvent

  try {
    event = getDodoClient().webhooks.unwrap(body, { headers, key: webhookSecret })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("Webhook signature verification failed.", message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = getAdminClient()

  try {
    switch (event.type) {
      case "subscription.active":
      case "subscription.renewed":
      case "subscription.updated":
      case "subscription.plan_changed":
      case "subscription.on_hold":
      case "subscription.cancelled":
      case "subscription.failed":
      case "subscription.expired": {
        const subscription = event.data
        const userId = await findUserId(supabase, subscription)

        if (!userId) {
          console.warn("Dodo subscription webhook missing user mapping", {
            type: event.type,
            subscription_id: subscription.subscription_id,
          })
          break
        }

        const status = subscription.status ?? event.type.replace("subscription.", "")

        await supabase
          .from("account_subscriptions")
          .upsert({
            user_id: userId,
            product_key: subscription.metadata?.product_key || RHYTHME_PRODUCT_KEY,
            provider: "dodo",
            provider_customer_id: subscription.customer?.customer_id,
            provider_subscription_id: subscription.subscription_id,
            provider_product_id: subscription.product_id,
            plan_key: subscription.metadata?.plan_key || planFromProductId(subscription.product_id),
            status,
            entitlement_active: isEntitledStatus(status) && !subscription.cancelled_at,
            amount: amountFromSmallestUnit(subscription.recurring_pre_tax_amount),
            currency: subscription.currency,
            billing_interval: subscription.payment_frequency_interval,
            current_period_start: subscription.previous_billing_date,
            current_period_end: subscription.next_billing_date || subscription.expires_at,
            cancel_at_period_end: subscription.cancel_at_next_billing_date ?? false,
            canceled_at: subscription.cancelled_at,
            raw_payload: subscription,
            updated_at: new Date().toISOString(),
          }, { onConflict: "provider,provider_subscription_id" })

        break
      }

      case "payment.succeeded":
      case "payment.failed":
      case "payment.cancelled":
      case "payment.processing": {
        const payment = event.data
        const userId = await findUserId(supabase, payment)

        if (!userId) {
          console.warn("Dodo payment webhook missing user mapping", {
            type: event.type,
            payment_id: payment.payment_id,
          })
          break
        }

        await supabase
          .from("billing_events")
          .upsert({
            user_id: userId,
            product_key: payment.metadata?.product_key || RHYTHME_PRODUCT_KEY,
            provider: "dodo",
            provider_payment_id: payment.payment_id,
            provider_subscription_id: payment.subscription_id,
            plan_key: payment.metadata?.plan_key,
            amount: amountFromSmallestUnit(payment.total_amount),
            currency: payment.currency,
            status: payment.status || event.type.replace("payment.", ""),
            paid_at: payment.created_at,
            receipt_url: payment.invoice_url,
            raw_payload: payment,
          }, { onConflict: "provider,provider_payment_id" })

        break
      }

      default:
        console.log(`Unhandled Dodo event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
