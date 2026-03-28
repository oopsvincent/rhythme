// app/(dashboard)/settings/layout.tsx
// Auth gating is handled by middleware (lib/supabase/proxy.ts).
// No need to call getUser() here — the user object wasn't used in the template anyway.
import { SiteHeader } from "@/components/site-header"
import { SettingsLayoutWrapper } from "./_components/settings-layout-wrapper"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="flex-1 px-4 py-6 md:px-6 lg:px-8">
        <SettingsLayoutWrapper>
          {children}
        </SettingsLayoutWrapper>
      </div>
    </div>
  )
}