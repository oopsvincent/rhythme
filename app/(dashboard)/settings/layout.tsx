// app/(dashboard)/settings/layout.tsx
import { getUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import SettingsTabs from "./settings-tabs"
import { SiteHeader } from "@/components/site-header"
import { Suspense } from "react"
import { SettingsMessages } from "./settings-messages"

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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-primary">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          
          {/* URL-based messages (error/success) */}
          <SettingsMessages />
          
          {/* Tabs Navigation */}
          <SettingsTabs />
          
          {/* Content with loading state */}
          <Suspense fallback={<SettingsLoadingSkeleton />}>
            <div className="rounded-lg border bg-card p-6">
              {children}
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function SettingsLoadingSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-6">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-72 bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-4">
        <div className="h-10 w-full max-w-md bg-muted animate-pulse rounded" />
        <div className="h-10 w-full max-w-md bg-muted animate-pulse rounded" />
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      </div>
    </div>
  )
}