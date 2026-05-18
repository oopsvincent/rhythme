// app/(dashboard)/settings/security/page.tsx
// Security settings page

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SecuritySection from "./_components/security-section"
import { getAmplecenLoginUrl } from "@/lib/auth-redirect"
import { ExternalLink } from "lucide-react"

export default async function SecurityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(getAmplecenLoginUrl('/settings/security'))
  }

  const accountsSettingsUrl = `${process.env.NEXT_PUBLIC_ACCOUNTS_URL || 'https://accounts.amplecen.com'}/settings/security`

  return (
    <div className="space-y-6">
      {/* Moved notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <ExternalLink className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          Security settings are now managed in your{" "}
          <strong className="text-foreground">Amplecen ID</strong>.{" "}
          <a
            href={accountsSettingsUrl}
            className="text-primary hover:underline font-medium"
          >
            Go to Account Settings →
          </a>
        </p>
      </div>

      <SecuritySection userId={user.id} />
    </div>
  )
}

