"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion, Variants } from "framer-motion"
import { Pen, BookText, ChevronRight, Calendar, Sparkles, Target, Heart, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useWeeklyStats } from "@/hooks/use-weekly-stats"
import { useWeeklyPlan } from "@/hooks/use-weekly-plan"
import { getWeekBounds, fmtLocalDate } from "@/lib/week-helpers"

function formatRange(startStr: string, endStr: string) {
  const fmt = (d: string) => {
    const [y, m, day] = d.split("-")
    const dt = new Date(parseInt(y), parseInt(m) - 1, parseInt(day))
    return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }
  const year = endStr.split("-")[0]
  return `${fmt(startStr)} – ${fmt(endStr)}, ${year}`
}

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

export default function WeekHomePage() {
  const defaultBounds = getWeekBounds()
  const [weekStart, setWeekStart] = useState(defaultBounds.weekStart)
  const [calOpen, setCalOpen] = useState(false)

  const weekEnd = useMemo(() => {
    const d = new Date(weekStart + "T00:00:00")
    d.setDate(d.getDate() + 6)
    return fmtLocalDate(d)
  }, [weekStart])

  const weekRange = formatRange(weekStart, weekEnd)

  // Real data hooks
  const { data: stats } = useWeeklyStats(weekStart)
  const { data: plan } = useWeeklyPlan(weekStart)

  // Derive plan insight
  const focusItems = plan?.content?.focus?.filter((f: string) => f.trim()) || []
  const planInsight = focusItems.length > 0
    ? `You have ${focusItems.length} focus area${focusItems.length !== 1 ? "s" : ""} set. Keep the momentum going.`
    : "Start planning to set your focus areas for the week."

  // Derive review insight
  const topHabit = stats?.topHabits?.[0]
  const reviewInsight = topHabit
    ? `${topHabit.name}: ${topHabit.completions} completion${topHabit.completions !== 1 ? "s" : ""} this week. Nice rhythm!`
    : stats && stats.tasksCompleted > 0
      ? `You've completed ${stats.tasksCompleted} task${stats.tasksCompleted !== 1 ? "s" : ""} so far. Keep going!`
      : "Log habits, tasks, and journals throughout the week to see insights here."

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    const { weekStart: ws } = getWeekBounds(date)
    setWeekStart(ws)
    setCalOpen(false)
  }

  const selectedDate = new Date(weekStart + "T00:00:00")

  return (
    <motion.div
      className="flex flex-col items-center gap-8 px-4 sm:px-6 pt-8 sm:pt-12 pb-24 max-w-4xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Hero header */}
      <motion.div variants={fadeUp} className="text-center flex flex-col items-center gap-4 w-full mb-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-primary font-black tracking-tight">
          This <span className="text-gradient-primary">Week</span>
        </h1>
        
        <Popover open={calOpen} onOpenChange={setCalOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 hover:bg-muted/50 px-4 py-2 rounded-xl transition-colors cursor-pointer group">
              <Calendar className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground/90">
                {weekRange}
              </h2>
              <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">change</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <CalendarUI
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md"
            />
          </PopoverContent>
        </Popover>

        <p className="text-muted-foreground text-sm sm:text-base max-w-md mt-2">
          Set your intentions and reflect on what matters.
          One calm space for your weekly rhythm.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Plan card */}
        <motion.div variants={scaleIn} className="flex flex-col h-full">
          <Link href={`/dashboard/week/plan?weekStart=${weekStart}`} className="group block h-full flex-1">
            <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col gap-6 h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/30 relative overflow-hidden bg-gradient-to-br from-card to-card/50">
              {/* Gradient accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
                  <Pen className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-primary font-bold">Plan Your Week</h2>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                    {focusItems.length > 0 ? "In progress" : "Draft"}
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                Set your focus areas, intentions, and habits to protect. A calm space to think ahead.
              </p>

              {/* Real insight */}
              <div className="mt-2 bg-muted/40 rounded-xl p-4 border border-border/50">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-primary/70 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">Weekly Focus</span>
                    <span className="text-xs text-muted-foreground mt-1">{planInsight}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(focusItems.length * 20, 100)}%` }}
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 px-2 text-primary group-hover:bg-primary/10 transition-all font-semibold"
                >
                  Start planning
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Review card */}
        <motion.div variants={scaleIn} className="flex flex-col h-full">
          <Link href={`/dashboard/week/review?weekStart=${weekStart}`} className="group block h-full flex-1">
            <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col gap-6 h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-accent/30 relative overflow-hidden bg-gradient-to-br from-card to-card/50">
              {/* Gradient accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full" />

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 shadow-inner">
                  <BookText className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-primary font-bold">Review Your Week</h2>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent uppercase tracking-wider">Not started</span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                Reflect on wins, challenges, and patterns. A guided 5-step journey through your week.
              </p>

              {/* Real insight */}
              <div className="mt-2 bg-muted/40 rounded-xl p-4 border border-border/50">
                <div className="flex items-start gap-3">
                  {topHabit ? (
                    <Flame className="w-5 h-5 text-accent/70 mt-0.5" />
                  ) : (
                    <Heart className="w-5 h-5 text-accent/70 mt-0.5" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {topHabit ? "Top Habit" : "Weekly Highlight"}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">{reviewInsight}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-gradient-to-r from-accent/50 to-accent rounded-full" />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 px-2 text-accent group-hover:bg-accent/10 transition-all font-semibold"
                >
                  Begin review
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Gentle nudge */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 text-xs text-muted-foreground/70 mt-2"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>
          Tip: Sunday evening or Monday morning is the perfect time to plan your week.
        </span>
      </motion.div>
    </motion.div>
  )
}