// app/(dashboard)/dashboard/page.tsx
import { Suspense } from "react"
import { Sun, CloudSun, Sunset, Moon } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Separator } from "@/components/ui/separator"
import { getUser } from "../../actions/auth"
import { getCalmTimeGreeting } from "@/lib/greetings/getCalmTimeGreeting"
import { getGentleSubtitle } from "@/lib/greetings/getGentleSubtitle"
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
  QuickActionsFab,
} from "@/components/dashboard"

export default async function DashboardPage() {
  const user = await getUser()
  const journals = await getJournals()

  const hour = new Date().getHours()
  let TimeIcon = Moon
  if (hour >= 5 && hour < 12) {
    TimeIcon = CloudSun
  } else if (hour >= 12 && hour < 17) {
    TimeIcon = Sun
  } else if (hour >= 17 && hour < 22) {
    TimeIcon = Sunset
  }

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="@container/main flex flex-1 flex-col gap-4 md:gap-6 overflow-x-hidden">
          {/* Hero Section */}
          <div className="flex flex-col gap-4 py-4 md:py-6 px-3 sm:px-4 lg:px-6">
            {/* Welcome Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl md:text-3xl font-semibold font-primary tracking-tight text-foreground/90">
                  {getCalmTimeGreeting(user?.name)}
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  {getGentleSubtitle()}
                </p>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm shrink-0">
                <div className="p-1.5 bg-primary/10 rounded-full text-primary">
                  <TimeIcon className="w-4 h-4" />
                </div>
                <div className="text-sm font-medium text-muted-foreground/80">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
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
