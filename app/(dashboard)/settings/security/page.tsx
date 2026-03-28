// app/(dashboard)/settings/security/page.tsx
// Security settings page

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SecuritySection from "./_components/security-section"

export default async function SecurityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <SecuritySection userId={user.id} />
}
