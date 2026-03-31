// app/(dashboard)/dashboard/page.tsx
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { Separator } from "@/components/ui/separator"
import { getUser } from "../../actions/auth"
import { getGreeting } from "@/lib/getGreetings"
import { getJournals } from "@/app/actions/journals"

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
  WeeklyWidget,
} from "@/components/dashboard"

export default async function DashboardPage() {
  const user = await getUser()
  const greetings = getGreeting()
  const journals = await getJournals()

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
                {/* Weekly Focus Widget */}
                <Suspense fallback={<div className="h-[200px] rounded-2xl bg-muted animate-pulse" />}>
                  <WeeklyWidget />
                </Suspense>

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
    </>
  )
}
