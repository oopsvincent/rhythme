// app/(dashboard)/settings/connections/page.tsx
// Connected accounts settings page

import { getUser, getUserIdentities } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { ConnectionsSection } from "./_components/connections-section"
import { getAmplecenLoginUrl } from "@/lib/auth-redirect"
import { ExternalLink } from "lucide-react"

interface ConnectionsPageProps {
  searchParams: Promise<{ linked?: string }>
}

export default async function ConnectionsPage({ searchParams }: ConnectionsPageProps) {
  const user = await getUser()
  
  if (!user) {
    redirect(getAmplecenLoginUrl('/settings/connections'))
  }

  const identities = await getUserIdentities()
  const params = await searchParams
  const linkedProvider = params.linked || null

  const accountsSettingsUrl = `${process.env.NEXT_PUBLIC_ACCOUNTS_URL || 'https://accounts.amplecen.com'}/settings/connections`

  return (
    <div className="space-y-6">
      {/* Moved notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <ExternalLink className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          Connected accounts are now managed in your{" "}
          <strong className="text-foreground">Amplecen ID</strong>.{" "}
          <a
            href={accountsSettingsUrl}
            className="text-primary hover:underline font-medium"
          >
            Go to Account Settings →
          </a>
        </p>
      </div>

      <ConnectionsSection identities={identities} linkedProvider={linkedProvider} />
    </div>
  )
}

