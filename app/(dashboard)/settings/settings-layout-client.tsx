// app/(dashboard)/settings/settings-layout-client.tsx
"use client"

import { usePathname } from "next/navigation"
import SettingsTabs from "./settings-tabs"
import { SettingsMessages } from "./settings-messages"
import { Suspense } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface SettingsLayoutClientProps {
  children: React.ReactNode
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

export function SettingsLayoutClient({ children }: SettingsLayoutClientProps) {
  const pathname = usePathname()
  const isMainPage = pathname === "/settings"
  
  // For main settings page - simpler layout
  if (isMainPage) {
    return (
      <div className="max-w-lg mx-auto">
        <SettingsMessages />
        {children}
      </div>
    )
  }

  // For sub-pages - full layout with tabs
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button + Header */}
      <div className="space-y-4">
        <Link 
          href="/settings" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Settings
        </Link>
        
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-primary">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
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
  )
}
