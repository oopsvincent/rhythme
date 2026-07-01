// app/(app)/dashboard/page.tsx
import { SiteHeader } from "@/components/site-header"
import { getUser } from "../../actions/auth"
import { getJournals } from "@/app/actions/journals"
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting"
import { isCurrentUserPremium } from "@/app/actions/subscription"
import { PremiumUpsellBanner } from "@/components/dashboard"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

export default async function DashboardPage() {
  const user = await getUser()
  const journals = await getJournals()
  const isPremium = await isCurrentUserPremium()

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Soft, safe, ambient glow effects to evoke a sense of home and comfort */}
        <div className="absolute top-[-5%] left-[-10%] w-[60%] h-[50%] rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[120px] pointer-events-none" />

        <div className="@container/main flex flex-1 flex-col overflow-x-hidden relative z-10">
          <div className="flex flex-col gap-6 py-4 md:py-6 px-3 sm:px-4 lg:px-6">
            
            {/* Dashboard Greeting Header */}
            <DashboardGreeting userName={user?.name} />

            {/* Premium Upsell for Free Users */}
            {!isPremium && (
              <div className="glass-card rounded-2xl p-0.5 border border-primary/10 shadow-sm overflow-hidden">
                <PremiumUpsellBanner />
              </div>
            )}

            {/* Main Single Column Layout */}
            <DashboardClient userName={user?.name} journals={journals} isPremium={isPremium} />
            
          </div>
        </div>
      </div>
    </>
  )
}
