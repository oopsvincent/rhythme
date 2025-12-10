// app/(dashboard)/settings/layout.tsx
import { getUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SettingsLayoutClient } from "./settings-layout-client"

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  
  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="flex-1 px-4 py-6 md:px-6 lg:px-8">
        <SettingsLayoutClient>
          {children}
        </SettingsLayoutClient>
      </div>
    </div>
  )
}