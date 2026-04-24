import DodoPayments from "dodopayments"

export const RHYTHME_PRODUCT_KEY = "rhythme"

export const DODO_PRODUCT_IDS = {
  monthly: process.env.DODO_MONTHLY_SUBSCRIPTION_ID,
  yearly: process.env.DODO_YEARLY_SUBSCRIPTION_ID,
} as const

export type BillingPlan = keyof typeof DODO_PRODUCT_IDS

export function getDodoClient() {
  return new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment: process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode" ? "live_mode" : "test_mode",
  })
}

export function planFromProductId(productId?: string | null): BillingPlan | null {
  if (!productId) return null
  if (productId === DODO_PRODUCT_IDS.monthly) return "monthly"
  if (productId === DODO_PRODUCT_IDS.yearly) return "yearly"
  return null
}

export function isEntitledStatus(status?: string | null) {
  return status === "active" || status === "on_hold"
}
