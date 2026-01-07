// app/(dashboard)/settings/billing/page.tsx
import BillingSettingsContent from "./billing-settings-content"

export default function BillingPage() {
  // In future, fetch current subscription from database
  const currentPlan = "starter" // or "premium"
  
  return <BillingSettingsContent currentPlan={currentPlan} />
}
