"use client"

import { motion, Variants } from "framer-motion"
import { CalendarDays, History, Target, Flame, Heart, BookOpen, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWeeklyHistory } from "@/hooks/use-weekly-stats"
import Link from "next/link"

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
}

const MOOD_LABEL: Record<number, string> = {
  5: "Great",
  4: "Good",
  3: "Neutral",
  2: "Low",
  1: "Rough",
  0: "—",
}

export default function WeeklyHistoryPage() {
  const { data: history, isLoading } = useWeeklyHistory()

  return (
    <div className="flex flex-col gap-8 px-4 sm:px-8 md:px-12 py-6 sm:py-8 w-full max-w-4xl mx-auto h-full min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <motion.header
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-2 pt-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <History className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-primary font-black tracking-tight">
              Weekly <span className="text-gradient-primary">History</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Reflect on your past momentum and insights.
            </p>
          </div>
        </div>
      </motion.header>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading history...</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!history || history.length === 0) && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <History className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No history yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Start planning and reviewing your weeks — your history will appear here.
          </p>
        </div>
      )}

      {/* Timeline List */}
      {!isLoading && history && history.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6 relative"
        >
          {/* Decorative timeline line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border/50 hidden sm:block" />

          {history.map((week) => {
            const hasPlan = !!week.plan
            const hasReview = !!week.review
            const status = hasReview
              ? "Reviewed"
              : hasPlan
                ? "Planned"
                : "No data"
            const moodLabel =
              week.stats.avgMood > 0
                ? MOOD_LABEL[Math.round(week.stats.avgMood)] || `${week.stats.avgMood}/5`
                : "—"

            // Get a highlight from review content if available
            const highlight = week.review?.content?.reflectionText
              ? week.review.content.reflectionText.length > 120
                ? week.review.content.reflectionText.slice(0, 120) + "…"
                : week.review.content.reflectionText
              : week.plan?.content?.focus?.[0]
                ? `Focus: ${week.plan.content.focus[0]}`
                : null

            return (
              <motion.div
                key={week.weekStart}
                variants={fadeUp}
                className="relative flex items-stretch gap-6 group"
              >
                {/* Timeline node */}
                <div className="hidden sm:flex flex-col items-center pt-6">
                  <div className="w-12 h-12 rounded-full border-4 border-background bg-muted flex items-center justify-center z-10 shadow-sm group-hover:bg-primary/20 group-hover:border-primary/10 transition-colors">
                    <CalendarDays className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>

                {/* Content Card */}
                <div className="glass-card flex-1 rounded-2xl p-6 sm:p-8 flex flex-col gap-5 border border-border/50 transition-all hover:border-primary/30 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-xl font-bold font-primary">
                        {week.weekLabel}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            hasReview
                              ? "bg-emerald-500/10 text-emerald-500"
                              : hasPlan
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {status}
                        </span>
                        {week.stats.avgMood > 0 && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            Avg mood:{" "}
                            <span className="font-medium text-foreground">
                              {moodLabel}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasPlan && (
                        <Link href={`/dashboard/week/plan?week=${week.weekStart}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:inline-flex text-muted-foreground hover:text-foreground"
                          >
                            View Plan
                          </Button>
                        </Link>
                      )}
                      <Link href="/dashboard/week/review">
                        <Button variant="default" size="sm" className="shadow-sm">
                          View Report
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border/50">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Target className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wide">
                          Tasks
                        </span>
                      </div>
                      <span className="text-lg font-semibold">
                        {week.stats.tasksCompletionPct}%
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Flame className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wide">
                          Habits
                        </span>
                      </div>
                      <span className="text-lg font-semibold">
                        {week.stats.habitCompletionPct}%
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wide">
                          Journals
                        </span>
                      </div>
                      <span className="text-lg font-semibold">
                        {week.stats.journalCount}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wide">
                          Mood
                        </span>
                      </div>
                      <span className="text-lg font-semibold">
                        {week.stats.avgMood > 0 ? `${week.stats.avgMood}/5` : "—"}
                      </span>
                    </div>
                  </div>

                  {/* Highlight */}
                  {highlight && (
                    <div className="bg-muted/30 rounded-xl p-4 mt-2">
                      <p className="text-sm italic text-muted-foreground">
                        &ldquo;{highlight}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
