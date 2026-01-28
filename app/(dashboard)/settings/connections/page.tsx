// app/(dashboard)/settings/connections/page.tsx
// Connected accounts settings page

import { getUser, getUserIdentities } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { ConnectionsSection } from "./_components/connections-section"

interface ConnectionsPageProps {
  searchParams: Promise<{ linked?: string }>
}

export default async function ConnectionsPage({ searchParams }: ConnectionsPageProps) {
  const user = await getUser()
  
  if (!user) {
    redirect("/login")
  }

  const identities = await getUserIdentities()
  const params = await searchParams
  const linkedProvider = params.linked || null

  return <ConnectionsSection identities={identities} linkedProvider={linkedProvider} />
}
