"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { CorrelationCard } from "@/components/dashboard/correlation-card"
import { MoodSparkline } from "@/components/dashboard/mood-sparkline"
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  TrendingUp,
  Lightbulb,
  PenLine,
  LayoutDashboard,
  Save,
  CheckCircle2,
  Target,
  Flame,
  Zap,
} from "lucide-react"
import { toast } from "sonner"

// ── Dummy Data ─────────────────────────────────────────────
const DUMMY_MOOD_DATA = [
  { day: "Mon", value: 3 },
  { day: "Tue", value: 4 },
  { day: "Wed", value: 2 },
  { day: "Thu", value: 4 },
  { day: "Fri", value: 5 },
  { day: "Sat", value: 3 },
  { day: "Sun", value: 4 },
]

const DUMMY_WINS = [
  { icon: Flame, text: "5-day meditation streak maintained" },
  { icon: CheckCircle2, text: "Completed 12 of 15 planned tasks" },
  { icon: Target, text: "Hit daily reading goal 4 days in a row" },
]

const DUMMY_CORRELATIONS = [
  {
    headline: "Habit completion 78% on positive-mood days",
    detail: "Compared to 41% on neutral or negative days — your mood drives consistency.",
    trend: "up" as const,
  },
  {
    headline: "High-priority tasks 2.1× more likely completed on positive days",
    detail: "Tackling hard stuff when you feel good seems to be your pattern.",
    trend: "up" as const,
  },
  {
    headline: "Streaks lasted 2.4× longer with positive mood",
    detail: "Emotional momentum powers your habits more than willpower.",
    trend: "up" as const,
  },
  {
    headline: "Habits stronger on lighter-task days",
    detail: "65% completion vs 38% on heavy days — less is more sometimes.",
    trend: "down" as const,
  },
]

// ── Slide Components ───────────────────────────────────────

function OverviewSlide() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-primary font-bold">Week in Review</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Feb 17 – Feb 23, 2026
          </p>
        </div>
        <div className="glass-card rounded-xl px-4 py-3">
          <p className="text-sm font-medium text-gradient-primary">
            A balanced week with room to grow
          </p>
        </div>
      </div>

      {/* Mood sparkline */}
      <div className="glass-card rounded-xl p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">
          Mood this week
        </p>
        <MoodSparkline data={DUMMY_MOOD_DATA} className="h-20 w-full" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          {DUMMY_MOOD_DATA.map((d) => (
            <span key={d.day}>{d.day}</span>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Tasks Done", value: "12/15", pct: 80 },
          { label: "Habits Hit", value: "78%", pct: 78 },
          { label: "Avg Mood", value: "3.6/5", pct: 72 },
          { label: "Focus Hrs", value: "8.5h", pct: 85 },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold font-primary">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function WinsSlide() {
  const [winsText, setWinsText] = useState(
    "I stayed consistent with my morning routine and knocked out two big tasks on Thursday."
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-primary font-bold flex items-center gap-2">
          <Trophy className="w-7 h-7 text-amber-400" />
          Wins This Week
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Celebrate what went well — even the small things count.
        </p>
      </div>

      {/* Auto-detected wins */}
      <div className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Detected from your data
        </p>
        {DUMMY_WINS.map((win, i) => (
          <div
            key={i}
            className="glass-card rounded-xl p-4 flex items-center gap-3"
          >
            <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <win.icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm">{win.text}</p>
          </div>
        ))}
      </div>

      {/* User input */}
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
          Anything else?
        </p>
        <Textarea
          value={winsText}
          onChange={(e) => setWinsText(e.target.value)}
          placeholder="What else went well this week?"
          className="min-h-24 resize-none bg-transparent"
        />
      </div>
    </div>
  )
}

function ChallengesSlide() {
  const [challengeText, setChallengeText] = useState(
    "I struggled with staying focused during afternoon meetings and missed two habit days."
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-primary font-bold flex items-center gap-2">
          <Zap className="w-7 h-7 text-amber-500" />
          Challenges
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Acknowledge the tough parts — awareness is growth.
        </p>
      </div>

      {/* Highlight correlation */}
      <CorrelationCard
        headline="Missed habits clustered on negative-mood days"
        detail="3 of your 4 missed habits happened on days you logged low mood. That's normal — be gentle."
        trend="down"
      />

      {/* User input */}
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
          What was tough this week?
        </p>
        <Textarea
          value={challengeText}
          onChange={(e) => setChallengeText(e.target.value)}
          placeholder="What challenged you?"
          className="min-h-28 resize-none bg-transparent"
        />
      </div>
    </div>
  )
}

function PatternsSlide() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-primary font-bold flex items-center gap-2">
          <Lightbulb className="w-7 h-7 text-cyan-400" />
          Patterns
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Simple correlations from your mood, habits, and tasks this week.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DUMMY_CORRELATIONS.map((c, i) => (
          <CorrelationCard key={i} {...c} />
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        These are simple pattern observations — not prescriptions. You know yourself best.
      </p>
    </div>
  )
}

function ReflectionSlide() {
  const [reflectionText, setReflectionText] = useState("")
  const [moodTakeaway, setMoodTakeaway] = useState("")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-primary font-bold flex items-center gap-2">
          <PenLine className="w-7 h-7 text-primary" />
          Reflection
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Close the loop — what did this week teach you?
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
          Free-form reflection
        </p>
        <Textarea
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="What's the one thing you'll carry forward from this week?"
          className="min-h-32 resize-none bg-transparent"
        />
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
          Mood takeaway
        </p>
        <Textarea
          value={moodTakeaway}
          onChange={(e) => setMoodTakeaway(e.target.value)}
          placeholder="In one line, how would you summarize your emotional week?"
          className="min-h-16 resize-none bg-transparent"
        />
      </div>
    </div>
  )
}

// ── Slide config ───────────────────────────────────────────

const SLIDES = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, component: OverviewSlide },
  { id: "wins", label: "Wins", icon: Trophy, component: WinsSlide },
  { id: "challenges", label: "Challenges", icon: Zap, component: ChallengesSlide },
  { id: "patterns", label: "Patterns", icon: Lightbulb, component: PatternsSlide },
  { id: "reflection", label: "Reflection", icon: PenLine, component: ReflectionSlide },
]

// ── Main Carousel Component ────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
}

export function WeeklyReviewCarousel() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)

  const isFirst = currentStep === 0
  const isLast = currentStep === SLIDES.length - 1

  const goNext = () => {
    if (!isLast) {
      setDirection(1)
      setCurrentStep((s) => s + 1)
    }
  }

  const goPrev = () => {
    if (!isFirst) {
      setDirection(-1)
      setCurrentStep((s) => s - 1)
    }
  }

  const goToStep = (idx: number) => {
    setDirection(idx > currentStep ? 1 : -1)
    setCurrentStep(idx)
  }

  const handleSave = () => {
    toast.success("Weekly review saved!", {
      description: "Your reflections have been recorded.",
    })
  }

  const SlideComponent = SLIDES[currentStep].component

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {SLIDES.length}
          </p>
          <p className="text-xs font-medium">{SLIDES[currentStep].label}</p>
        </div>
        <Progress value={((currentStep + 1) / SLIDES.length) * 100} />
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2">
        {SLIDES.map((slide, idx) => {
          const Icon = slide.icon
          const isActive = idx === currentStep
          const isCompleted = idx < currentStep

          return (
            <button
              key={slide.id}
              onClick={() => goToStep(idx)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300
                ${isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : isCompleted
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{slide.label}</span>
            </button>
          )
        })}
      </div>

      {/* Slide content with animation */}
      <div className="relative min-h-[420px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <SlideComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <Button
          variant="ghost"
          onClick={goPrev}
          disabled={isFirst}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        {isLast ? (
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Review
          </Button>
        ) : (
          <Button onClick={goNext} className="gap-1">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
