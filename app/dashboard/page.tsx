// app/dashboard/page.tsx
"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SettingsDialog } from "@/components/settings-dialog"
import { useNavigationStore } from "@/store/nav-store"
import data from "./data.json"

export default function Page() {
  const activeSection = useNavigationStore((state) => state.activeSection)

  return (
    <>    
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            
            {/* Render different content based on activeSection */}
            {activeSection === 'overview' && (
              <>
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
              </>
            )}

            {activeSection === 'analytics' && (
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
                {/* Add more analytics-specific components */}
              </div>
            )}

            {activeSection === 'data-table' && (
              <DataTable data={data} />
            )}

            {activeSection === 'settings' && (
                <>Settings</>
            )}
              <div className="px-4 lg:px-6">
                <SettingsDialog />
              </div>

          </div>
        </div>
      </div>
    </>
  )
}