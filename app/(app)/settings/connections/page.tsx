// app/(dashboard)/settings/connections/page.tsx
// Connected accounts settings page

import { getUser, getUserIdentities } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { ConnectionsSection } from "./_components/connections-section"
import { getAmplecenLoginUrl } from "@/lib/auth-redirect"

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

  return (
    <div className="space-y-6">
      <ConnectionsSection identities={identities} linkedProvider={linkedProvider} />
    </div>
  )
}

