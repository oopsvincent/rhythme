"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { WeeklyReviewCarousel } from "@/components/dashboard/weekly-review-carousel"
import { getWeekBounds, fmtLocalDate } from "@/lib/week-helpers"
import {
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Coffee,
  Rocket,
  Zap,
  PartyPopper,
} from "lucide-react"

// ── Day-specific gate messages ─────────────────────────────
interface GateMessage {
  emoji: string
  icon: React.ElementType
  headline: string
  subtext: string
  canProceed: boolean
}

function getGateMessage(daysSinceStart: number): GateMessage {
  if (daysSinceStart <= 0) {
    return {
      emoji: "🏃",
      icon: Rocket,
      headline: "Whoa, speedrunner!",
      subtext: "It's only the first day of the week. Your week hasn't even started warming up yet.",
      canProceed: false,
    }
  }

  if (daysSinceStart === 1) {
    return {
      emoji: "🤔",
      icon: Coffee,
      headline: "Already reviewing? Bold move.",
      subtext: "It's only been a day. Give your week a chance to surprise you — there's so much week left!",
      canProceed: false,
    }
  }

  if (daysSinceStart === 2) {
    return {
      emoji: "📊",
      icon: Zap,
      headline: "Midweek review? Half the data, half the picture.",
      subtext: "You're gathering momentum. The best insights come from a full week of data.",
      canProceed: false,
    }
  }

  if (daysSinceStart === 3) {
    return {
      emoji: "🔥",
      icon: Clock,
      headline: "Getting warmer! But one more day would be chef's kiss.",
      subtext: "Thursday is tempting, but Friday's review hits different. Trust the process.",
      canProceed: false,
    }
  }

  if (daysSinceStart === 4) {
    return {
      emoji: "✨",
      icon: PartyPopper,
      headline: "It's Friday! Your week is practically gift-wrapped.",
      subtext: "Close enough — let's see what your week had to say. Ready to review?",
      canProceed: true,
    }
  }

  // Day 5+ (Saturday, Sunday, or later)
  return {
    emoji: "🎯",
    icon: Sparkles,
    headline: "Perfect timing.",
    subtext: "Your full week of data is ready. Let's reflect and close the loop.",
    canProceed: true,
  }
}

// ── Followup messages for early days ───────────────────────
function getFollowup(daysSinceStart: number): string {
  switch (daysSinceStart) {
    case 0:
      return "Come back when your week has some stories to tell."
    case 1:
      return "Check back in a few days, your future self will thank you!"
    case 2:
      return "You're almost there, the best insights come from a full week."
    case 3:
      return "Hold tight, tomorrow's review will be worth the wait."
    default:
      return ""
  }
}

export default function WeeklyReviewPage() {
  const searchParams = useSearchParams()
  const urlWeekStart = searchParams.get("weekStart")
  const defaultBounds = getWeekBounds()
  const weekStart = urlWeekStart || defaultBounds.weekStart

  const weekEnd = useMemo(() => {
    const d = new Date(weekStart + "T00:00:00")
    d.setDate(d.getDate() + 6)
    return fmtLocalDate(d)
  }, [weekStart])

  const [showReview, setShowReview] = useState(false)
  const [showFollowup, setShowFollowup] = useState(false)

  // Calculate days since week start
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDate = new Date(weekStart + "T00:00:00")
  const daysSinceStart = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  const gate = getGateMessage(daysSinceStart)
  const followup = getFollowup(daysSinceStart)
  const GateIcon = gate.icon

  // Auto-proceed for weekend days (6+)
  const autoReady = daysSinceStart >= 5

  const formatRange = () => {
    const fmt = (d: string) => {
      const [y, m, day] = d.split("-")
      const dt = new Date(parseInt(y), parseInt(m) - 1, parseInt(day))
      return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
    return `${fmt(weekStart)} – ${fmt(weekEnd)}`
  }

  // If autoReady or user confirmed, show the carousel
  if (showReview || autoReady) {
    return (
      <div className="flex flex-col gap-6 px-4 sm:px-6 py-4 sm:py-6 h-full min-h-[calc(100vh-4rem)]">
        {/* Header */}
        <header className="flex flex-col gap-1 max-w-6xl mx-auto w-full px-2">
          <h1 className="text-2xl font-primary font-bold tracking-tight text-muted-foreground/50">
            Weekly <span className="text-foreground/80">Review</span>
          </h1>
        </header>

        {/* Carousel */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <WeeklyReviewCarousel weekStart={weekStart} />
        </div>
      </div>
    )
  }

  // Gate screen
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <AnimatePresence mode="wait">
        {!showFollowup ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center text-center max-w-lg gap-6"
          >
            {/* Icon */}
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-2">
              <GateIcon className="w-10 h-10 text-primary" />
            </div>

            {/* Message */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-primary font-black tracking-tight">
                {gate.emoji} {gate.headline}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {gate.subtext}
              </p>
            </div>

            {/* Week range */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground/70 bg-muted/40 px-4 py-2 rounded-full">
              <Calendar className="w-4 h-4" />
              <span>{formatRange()}</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
              {gate.canProceed ? (
                <Button
                  size="lg"
                  onClick={() => setShowReview(true)}
                  className="gap-2 shadow-lg shadow-primary/20 px-8 h-14 text-base rounded-2xl"
                >
                  I&apos;m ready, let&apos;s review
                  <ArrowRight className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowFollowup(true)}
                  className="gap-2 px-8 h-14 text-base rounded-2xl"
                >
                  But I really want to review now...
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center text-center max-w-lg gap-6"
          >
            <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center mb-2">
              <Coffee className="w-10 h-10 text-accent" />
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-primary font-bold tracking-tight">
                {followup}
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                A complete week makes for a meaningful review. But hey, it&apos;s your call.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
              <Button
                size="lg"
                onClick={() => setShowReview(true)}
                className="gap-2 shadow-lg shadow-primary/20 px-8 h-14 text-base rounded-2xl"
              >
                Review anyway
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setShowFollowup(false)}
                className="gap-2 text-muted-foreground px-6 h-14 text-base"
              >
                You&apos;re right, I&apos;ll wait
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}