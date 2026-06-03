// app/(dashboard)/settings/security/page.tsx
// Security settings page

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SecuritySection from "./_components/security-section"
import { getAmplecenLoginUrl } from "@/lib/auth-redirect"

export default async function SecurityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(getAmplecenLoginUrl('/settings/security'))
  }

  return (
    <div className="space-y-6">
      <SecuritySection userId={user.id} />
    </div>
  )
}

