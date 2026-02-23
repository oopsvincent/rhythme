"use client"

import Link from "next/link"
import { motion, Variants } from "framer-motion"
import { Pen, BookText, ChevronRight, Calendar, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

// Compute this week's Monday – Sunday range
function getWeekRange() {
  const now = new Date()
  const day = now.getDay()
  const diffToMon = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMon)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const year = sunday.getFullYear()

  return `${fmt(monday)} – ${fmt(sunday)}, ${year}`
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
  const weekRange = getWeekRange()

  return (
    <motion.div
      className="flex flex-col items-center gap-8 px-4 sm:px-6 py-8 sm:py-12 max-w-4xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Hero header */}
      <motion.div variants={fadeUp} className="text-center flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/60 rounded-full px-3 py-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{weekRange}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-primary font-black tracking-tight">
          Your{" "}
          <span className="text-gradient-primary">Week</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md">
          Set your intentions and reflect on what matters.
          One calm space for your weekly rhythm.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
        {/* Plan card */}
        <motion.div variants={scaleIn}>
          <Link href="/dashboard/week/plan" className="group block">
            <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col gap-5 h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/20 relative overflow-hidden">
              {/* Gradient accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/8 to-transparent rounded-bl-full" />

              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Pen className="w-6 h-6 text-primary" />
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-xl sm:text-2xl font-primary font-bold">
                  Plan Your Week
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Set your focus areas, intentions, and habits to protect.
                  A calm space to think ahead.
                </p>
              </div>

              {/* Dummy progress */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[30%] bg-primary/50 rounded-full" />
                </div>
                <span className="text-xs text-muted-foreground">Draft</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="self-start gap-1 px-0 text-primary group-hover:gap-2 transition-all"
              >
                Start planning
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </Link>
        </motion.div>

        {/* Review card */}
        <motion.div variants={scaleIn}>
          <Link href="/dashboard/week/review" className="group block">
            <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col gap-5 h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-accent/20 relative overflow-hidden">
              {/* Gradient accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/8 to-transparent rounded-bl-full" />

              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <BookText className="w-6 h-6 text-accent" />
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-xl sm:text-2xl font-primary font-bold">
                  Review Your Week
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Reflect on wins, challenges, and patterns.
                  A guided 5-step journey through your week.
                </p>
              </div>

              {/* Dummy progress */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-accent/50 rounded-full" />
                </div>
                <span className="text-xs text-muted-foreground">Not started</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="self-start gap-1 px-0 text-accent group-hover:gap-2 transition-all"
              >
                Begin review
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
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
          Tip: Planning on Sunday evening, reviewing on Friday — works for most people.
        </span>
      </motion.div>
    </motion.div>
  )
}