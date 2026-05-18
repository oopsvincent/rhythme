// app/(dashboard)/settings/appearance/page.tsx
// Redirect from old /settings/appearance to new /settings/theme

import { redirect } from "next/navigation"

export default function AppearanceRedirect() {
  redirect("/settings/theme")
}
