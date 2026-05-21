// app/(dashboard)/dashboard/page.tsx
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { Separator } from "@/components/ui/separator"
import { getUser } from "../../actions/auth"
import { getJournals } from "@/app/actions/journals"
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting"

// Dashboard components
import {
  TodayOverview,
  TodayOverviewSkeleton,
  MoodInputCard,
  HabitsWidget,
  QuickJournalCard,
  ReflectionPrompt,
  ProductivitySummary,
  MoodChart,
  SentimentChart,
  MoodInputSkeleton,
  HabitsWidgetSkeleton,
  QuickJournalSkeleton,
  ProductivitySummarySkeleton,
  ReflectionPromptSkeleton,
  MoodChartSkeleton,
  SentimentChartSkeleton,
  QuickActionsFab,
} from "@/components/dashboard"

export default async function DashboardPage() {
  const user = await getUser()
  const journals = await getJournals()

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="@container/main flex flex-1 flex-col gap-4 md:gap-6 overflow-x-hidden">
          {/* Hero Section */}
          <div className="flex flex-col gap-4 py-4 md:py-6 px-3 sm:px-4 lg:px-6">
            {/* Welcome Header — Client component for correct local timezone */}
            <DashboardGreeting userName={user?.name} />

            <Separator className="my-2" />

            {/* Daily Reflection Prompt */}
            <Suspense fallback={<ReflectionPromptSkeleton />}>
              <ReflectionPrompt />
            </Suspense>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start pb-8">
              {/* Left Column - Mood, Habits, Summary */}
              <div className="flex flex-col gap-4 md:gap-6">
                {/* Mood Check-in */}
                <Suspense fallback={<MoodInputSkeleton />}>
                  <MoodInputCard />
                </Suspense>

                {/* Today's Habits */}
                <Suspense fallback={<HabitsWidgetSkeleton />}>
                  <HabitsWidget />
                </Suspense>

                {/* Productivity Summary */}
                <Suspense fallback={<ProductivitySummarySkeleton />}>
                  <ProductivitySummary />
                </Suspense>

                {/* Quick Journal */}
                <Suspense fallback={<QuickJournalSkeleton />}>
                  <QuickJournalCard journals={journals} />
                </Suspense>

              </div>

              {/* Right Column - Mood Chart, Journal, Tasks */}
              <div className="flex flex-col gap-4 md:gap-6 mb-8 sm:mb-0">
                {/* Today's Tasks Overview */}
                <Suspense fallback={<TodayOverviewSkeleton />}>
                  <TodayOverview />
                </Suspense>

                {/* 7-Day Mood Chart */}
                <Suspense fallback={<MoodChartSkeleton />}>
                  <MoodChart journals={journals} />
                </Suspense>

                {/* Sentiment Confidence Chart */}
                <Suspense fallback={<SentimentChartSkeleton />}>
                  <SentimentChart journals={journals} />
                </Suspense>

              </div>
            </div>
          </div>
        </div>
      </div>
      <QuickActionsFab />
    </>
  )
}
