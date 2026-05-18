// app/(dashboard)/settings/account/page.tsx
// Redirect from old /settings/account to new /settings/profile

import { redirect } from "next/navigation"

export default function AccountRedirect() {
  redirect("/settings/profile")
}
