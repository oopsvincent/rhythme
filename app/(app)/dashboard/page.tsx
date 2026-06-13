// app/(app)/dashboard/page.tsx
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { getUser } from "../../actions/auth"
import { getJournals } from "@/app/actions/journals"
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting"
import { isCurrentUserPremium } from "@/app/actions/subscription"

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
  PremiumUpsellBanner,
  NowPanel,
} from "@/components/dashboard"

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

        <div className="@container/main flex flex-1 flex-col gap-4 md:gap-6 overflow-x-hidden relative z-10">
          <div className="flex flex-col gap-6 py-4 md:py-6 px-3 sm:px-4 lg:px-6">
            
            {/* Dashboard Greeting Header (includes Client-side Section Navigator) */}
            <DashboardGreeting userName={user?.name} />

            {/* Premium Upsell for Free Users */}
            {!isPremium && (
              <div className="glass-card rounded-2xl p-0.5 border border-primary/10 shadow-sm overflow-hidden">
                <PremiumUpsellBanner />
              </div>
            )}

            {/* Main Responsive Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-8">
              
              {/* Column 1: Daily Routines (Self check-in, Habit tracking, Daily summary, Reflection Quote) */}
              <div id="routines-column" className="flex flex-col gap-6 scroll-mt-24">
                <div className="space-y-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pl-1">
                    Daily Routines
                  </h2>
                  <div className="flex flex-col gap-6">
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

                    {/* Daily Reflection Prompt / Quote */}
                    <Suspense fallback={<ReflectionPromptSkeleton />}>
                      <ReflectionPrompt />
                    </Suspense>
                  </div>
                </div>
              </div>

              {/* Column 2: Here & Now (Active focus task & tasks backlog) */}
              <div id="now-column" className="flex flex-col gap-6 scroll-mt-24">
                <div className="space-y-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pl-1">
                    Here &amp; Now
                  </h2>
                  <div className="flex flex-col gap-6">
                    {/* Recommended Task / Habit capacity indicator */}
                    <NowPanel />

                    {/* Today's Tasks Backlog */}
                    <Suspense fallback={<TodayOverviewSkeleton />}>
                      <TodayOverview />
                    </Suspense>
                  </div>
                </div>
              </div>

              {/* Column 3: Reflection & Analytics (Quick Journaling & Emotional Charts) */}
              <div id="reflection-column" className="flex flex-col gap-6 scroll-mt-24">
                <div className="space-y-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pl-1">
                    Reflection &amp; Analytics
                  </h2>
                  <div className="flex flex-col gap-6">
                    {/* Quick Journaling Card */}
                    <Suspense fallback={<QuickJournalSkeleton />}>
                      <QuickJournalCard journals={journals} />
                    </Suspense>

                    {/* 7-Day Mood Analytics */}
                    <Suspense fallback={<MoodChartSkeleton />}>
                      <MoodChart journals={journals} />
                    </Suspense>

                    {/* Sentiment Analysis Chart */}
                    <Suspense fallback={<SentimentChartSkeleton />}>
                      <SentimentChart journals={journals} />
                    </Suspense>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <QuickActionsFab />
    </>
  )
}
