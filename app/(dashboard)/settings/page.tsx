// app/(dashboard)/settings/page.tsx
// Main settings page - redirects to profile

import { redirect } from "next/navigation"
import { defaultSettingsPath } from "./_config/settings-sections"

export default function SettingsPage() {
  redirect(defaultSettingsPath)
}
