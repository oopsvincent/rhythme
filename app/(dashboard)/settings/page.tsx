// app/settings/page.tsx (default redirect)
import { redirect } from "next/navigation"

export default function SettingsPage() {
  redirect("/settings/account")
}