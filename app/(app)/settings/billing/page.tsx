// app/(dashboard)/settings/billing/page.tsx
// Redirect from old /settings/billing to new /settings/subscription

import { redirect } from "next/navigation"

export default function BillingRedirect() {
  redirect("/settings/subscription")
}
