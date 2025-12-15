// app/(dashboard)/dashboard/page.tsx
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { Separator } from "@/components/ui/separator"
import { getUser } from "../../actions/auth"
import { getGreeting } from "@/utils/getGreetings"

// Dashboard components
import {
  QuickActions,
  TodayOverview,
  QuickActionsSkeleton,
  TodayOverviewSkeleton,
} from "@/components/dashboard"

export default async function DashboardPage() {
  const user = await getUser()
  const greetings = getGreeting()

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="@container/main flex flex-1 flex-col gap-4 md:gap-6 overflow-x-hidden">
          {/* Hero Section */}
          <div className="flex flex-col gap-4 py-4 md:py-6 px-3 sm:px-4 lg:px-6">
            {/* Welcome Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold font-primary tracking-tight">
                  {greetings},{" "}
                  <span className="text-gradient-primary">
                    {user?.name?.split(" ")[0] ?? "there"}
                  </span>
                </h1>
                <p className="text-muted-foreground text-sm md:text-base mt-1">
                  Here&apos;s what&apos;s happening with your productivity today.
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </header>

            <Separator className="my-2" />

            {/* Quick Actions Dock - macOS style */}
            <Suspense fallback={<QuickActionsSkeleton />}>
              <QuickActions />
            </Suspense>

            {/* Today's Overview - Full width for now */}
            <Suspense fallback={<TodayOverviewSkeleton />}>
              <TodayOverview />
            </Suspense>

            {/* 
              HIDDEN FOR NOW - Analytics Section
              TODO: Enable when ready to show real analytics data
              
              <DashboardStats />
              <ActivityFeed />
              <ProductivityCharts />
            */}
          </div>
        </div>
      </div>
    </>
  )
}
