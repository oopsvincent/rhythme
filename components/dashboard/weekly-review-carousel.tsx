"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { MoodSparkline } from "@/components/dashboard/mood-sparkline"
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Lightbulb,
  PenLine,
  LayoutDashboard,
  CheckCircle2,
  Target,
  Flame,
  Zap,
  Download,
  Loader2,
  Check,
} from "lucide-react"
import { toast } from "sonner"
import { toPng } from "html-to-image"
import jsPDF from "jspdf"
import { useWeeklyReview, useAutoSaveWeeklyReview } from "@/hooks/use-weekly-review"
import { useSaveWeeklyReview } from "@/hooks/use-weekly-review"
import { useWeeklyStats } from "@/hooks/use-weekly-stats"
import type { WeeklyStats } from "@/app/actions/weekly"

// ── Slide Components ───────────────────────────────────────

function OverviewSlide({ stats }: { stats: WeeklyStats | null }) {
  const moodData = (stats?.moodEntries || []).map((m) => ({
    day: m.day,
    value: m.value || 0,
  }))
  const hasMoodData = moodData.some((d) => d.value > 0)

  return (
    <div className="flex flex-col h-full justify-between gap-6 p-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-primary font-bold tracking-tight">Week in Review</h2>
          <p className="text-muted-foreground text-base mt-2">
            {stats?.weekLabel || "This week"}
          </p>
        </div>
        {stats && stats.tasksCompletionPct >= 70 && (
          <div className="rounded-2xl px-5 py-3 border border-emerald-500/20 bg-emerald-500/5">
            <p className="text-sm font-semibold text-emerald-500">
              Strong week — {stats.tasksCompletionPct}% tasks done
            </p>
          </div>
        )}
        {stats && stats.tasksCompletionPct < 70 && stats.tasksCompletionPct > 0 && (
          <div className="rounded-2xl px-5 py-3 border border-primary/20 bg-primary/5">
            <p className="text-sm font-semibold text-primary">
              A balanced week with room to grow
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 mt-4">
        {/* Mood sparkline */}
        <div className="rounded-2xl p-6 flex flex-col justify-between bg-card border border-border/50">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-4">
              Mood this week
            </p>
            {hasMoodData ? (
              <MoodSparkline data={moodData} className="h-32 w-full" />
            ) : (
              <div className="h-32 flex items-center justify-center text-muted-foreground/50 text-sm">
                No journal entries this week
              </div>
            )}
          </div>
          {hasMoodData && (
            <div className="flex justify-between mt-4 text-xs font-medium text-muted-foreground/70">
              {moodData.map((d) => (
                <span key={d.day}>{d.day}</span>
              ))}
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: "Tasks Done",
              value: stats ? `${stats.tasksCompleted}/${stats.tasksTotal}` : "—",
              pct: stats?.tasksCompletionPct || 0,
            },
            {
              label: "Habits Hit",
              value: stats ? `${stats.habitCompletionPct}%` : "—",
              pct: stats?.habitCompletionPct || 0,
            },
            {
              label: "Avg Mood",
              value: stats && stats.avgMood > 0 ? `${stats.avgMood}/5` : "—",
              pct: stats ? (stats.avgMood / 5) * 100 : 0,
            },
            {
              label: "Journals",
              value: stats ? `${stats.journalCount}` : "—",
              pct: stats ? Math.min(stats.journalCount * 14, 100) : 0,
            },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl p-5 flex flex-col justify-center items-center text-center bg-card border border-border/50">
              <p className="text-3xl font-black font-primary tracking-tighter">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-2 font-medium bg-muted/50 px-3 py-1 rounded-full">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WinsSlide({
  stats,
  winsText,
  setWinsText,
}: {
  stats: WeeklyStats | null
  winsText: string
  setWinsText: (v: string) => void
}) {
  const topHabits = stats?.topHabits || []
  const tasksCompleted = stats?.tasksCompleted || 0

  const autoWins = [
    ...(tasksCompleted > 0
      ? [{ icon: Target, text: `Completed ${tasksCompleted} task${tasksCompleted !== 1 ? "s" : ""} this week` }]
      : []),
    ...topHabits.slice(0, 3).map((h) => ({
      icon: Flame,
      text: `${h.name}: ${h.completions} completion${h.completions !== 1 ? "s" : ""} this week`,
    })),
  ]

  return (
    <div className="flex flex-col h-full gap-8 p-2">
      <div>
        <h2 className="text-3xl sm:text-4xl font-primary font-bold flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Wins
        </h2>
        <p className="text-muted-foreground text-base mt-2">
          Celebrate what worked. Momentum starts here.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Auto-populated wins */}
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
            Data Highlights
          </p>
          <div className="flex flex-col gap-3 h-full justify-start">
            {autoWins.length > 0 ? (
              autoWins.map((win, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 flex items-center gap-4 border-l-4 border-l-primary/50 bg-card border border-border/50"
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <win.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-[15px] font-medium leading-snug">{win.text}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl p-6 bg-muted/20 text-center text-muted-foreground text-sm">
                No activity data yet this week. Keep logging!
              </div>
            )}
          </div>
        </div>

        {/* User input */}
        <div className="flex flex-col gap-4 h-full">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
            Anything else?
          </p>
          <Textarea
            value={winsText}
            onChange={(e) => setWinsText(e.target.value)}
            placeholder="What else went well this week?"
            className="flex-1 min-h-[200px] lg:h-full resize-none bg-muted/20 border-border/50 rounded-2xl p-5 text-base leading-relaxed focus-visible:ring-primary/20"
          />
        </div>
      </div>
    </div>
  )
}

function ChallengesSlide({
  stats,
  challengeText,
  setChallengeText,
}: {
  stats: WeeklyStats | null
  challengeText: string
  setChallengeText: (v: string) => void
}) {
  const tasksPending = stats?.tasksPending || 0
  const habitPct = stats?.habitCompletionPct || 0

  return (
    <div className="flex flex-col h-full gap-8 p-2">
      <div>
        <h2 className="text-3xl sm:text-4xl font-primary font-bold flex items-center gap-3">
          <Zap className="w-8 h-8 text-amber-500" />
          Challenges
        </h2>
        <p className="text-muted-foreground text-base mt-2">
          Acknowledge the tough parts — awareness is growth.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Auto friction points */}
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
            Key Friction Points
          </p>
          <div className="flex flex-col gap-3">
            {tasksPending > 0 && (
              <div className="rounded-2xl p-4 flex items-center gap-4 border-l-4 border-l-amber-500/50 bg-card border border-border/50">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-[15px] font-medium leading-snug">
                  {tasksPending} task{tasksPending !== 1 ? "s" : ""} still pending from this week
                </p>
              </div>
            )}
            {habitPct < 50 && habitPct > 0 && (
              <div className="rounded-2xl p-4 flex items-center gap-4 border-l-4 border-l-amber-500/50 bg-card border border-border/50">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-[15px] font-medium leading-snug">
                  Habit completion at {habitPct}% — below your usual rhythm
                </p>
              </div>
            )}
            {tasksPending === 0 && habitPct >= 50 && (
              <div className="rounded-2xl p-6 bg-emerald-500/5 border border-emerald-500/20 text-center text-emerald-600 text-sm font-medium">
                No major friction this week — well done! 🎉
              </div>
            )}
          </div>
        </div>

        {/* User input */}
        <div className="flex flex-col gap-4 h-full">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
            What was tough this week?
          </p>
          <Textarea
            value={challengeText}
            onChange={(e) => setChallengeText(e.target.value)}
            placeholder="What challenged you?"
            className="flex-1 min-h-[200px] lg:h-full resize-none bg-muted/20 border-border/50 rounded-2xl p-5 text-base leading-relaxed focus-visible:ring-primary/20"
          />
        </div>
      </div>
    </div>
  )
}

function PatternsSlide({ stats }: { stats: WeeklyStats | null }) {
  const patterns: { headline: string; detail: string; trend: "up" | "down" | "neutral" }[] = []

  if (stats) {
    if (stats.tasksCompletionPct >= 70) {
      patterns.push({
        headline: `Task completion at ${stats.tasksCompletionPct}%`,
        detail: `You completed ${stats.tasksCompleted} of ${stats.tasksTotal} tasks. Strong execution this week.`,
        trend: "up",
      })
    } else if (stats.tasksTotal > 0) {
      patterns.push({
        headline: `Task completion at ${stats.tasksCompletionPct}%`,
        detail: `${stats.tasksPending} tasks remain incomplete. Consider adjusting your weekly planning scope.`,
        trend: "down",
      })
    }

    if (stats.habitCompletionPct >= 60) {
      patterns.push({
        headline: `Habit consistency at ${stats.habitCompletionPct}%`,
        detail: `${stats.habitLogsThisWeek} habit completions across ${stats.habitsTotal} active habits. Good rhythm.`,
        trend: "up",
      })
    } else if (stats.habitsTotal > 0) {
      patterns.push({
        headline: `Habit consistency at ${stats.habitCompletionPct}%`,
        detail: `Room to improve — ${stats.habitLogsThisWeek} completions out of a possible ${stats.habitsTotal * 7}.`,
        trend: "down",
      })
    }

    if (stats.topHabits.length > 0) {
      const top = stats.topHabits[0]
      patterns.push({
        headline: `Strongest habit: ${top.name}`,
        detail: `${top.completions} completions this week — your most consistent habit.`,
        trend: "up",
      })
    }

    if (stats.avgMood >= 4) {
      patterns.push({
        headline: `Positive mood trend (${stats.avgMood}/5 avg)`,
        detail: `Based on ${stats.journalCount} journal entries. Keep doing what's working.`,
        trend: "up",
      })
    } else if (stats.avgMood > 0 && stats.avgMood < 3) {
      patterns.push({
        headline: `Lower mood this week (${stats.avgMood}/5 avg)`,
        detail: `From ${stats.journalCount} journal entries. Be kind to yourself.`,
        trend: "down",
      })
    } else if (stats.avgMood > 0) {
      patterns.push({
        headline: `Balanced mood (${stats.avgMood}/5 avg)`,
        detail: `Based on ${stats.journalCount} journal entries this week.`,
        trend: "neutral",
      })
    }
  }

  return (
    <div className="flex flex-col h-full gap-8 p-2">
      <div>
        <h2 className="text-3xl sm:text-4xl font-primary font-bold flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-cyan-400" />
          Patterns
        </h2>
        <p className="text-muted-foreground text-base mt-2">
          Observations from your tasks, habits, and mood this week.
        </p>
      </div>

      <div className="flex-1 w-full bg-card/50 rounded-3xl p-6 border border-border/50">
        {patterns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {patterns.map((p, i) => (
              <div
                key={i}
                className={`rounded-2xl p-5 border flex flex-col gap-2 ${
                  p.trend === "up"
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : p.trend === "down"
                      ? "border-amber-500/20 bg-amber-500/5"
                      : "border-border/50 bg-muted/20"
                }`}
              >
                <p className="font-semibold text-[15px]">{p.headline}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.detail}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            Not enough data yet to identify patterns. Keep logging this week!
          </div>
        )}
      </div>

      <p className="text-sm font-medium text-muted-foreground text-center bg-muted/30 py-2 rounded-full w-max mx-auto px-6">
        These are simple observations — not prescriptions.
      </p>
    </div>
  )
}

function ReflectionSlide({
  reflectionText,
  setReflectionText,
  moodTakeaway,
  setMoodTakeaway,
}: {
  reflectionText: string
  setReflectionText: (v: string) => void
  moodTakeaway: string
  setMoodTakeaway: (v: string) => void
}) {
  return (
    <div className="flex flex-col h-full gap-8 p-2">
      <div>
        <h2 className="text-3xl sm:text-4xl font-primary font-bold flex items-center gap-3">
          <PenLine className="w-8 h-8 text-primary" />
          Reflection
        </h2>
        <p className="text-muted-foreground text-base mt-2">
          Close the loop — what did this week teach you?
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        <div className="flex-1 flex flex-col gap-3 h-full">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold pl-1">
            Free-form reflection
          </p>
          <Textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="What's the one thing you'll carry forward from this week?"
            className="flex-1 min-h-[150px] lg:h-full resize-none bg-muted/20 border-border/50 rounded-2xl p-5 text-base leading-relaxed focus-visible:ring-primary/20"
          />
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold pl-1">
            Mood takeaway
          </p>
          <Textarea
            value={moodTakeaway}
            onChange={(e) => setMoodTakeaway(e.target.value)}
            placeholder="In one line, how would you summarize your emotional week?"
            className="min-h-[120px] lg:h-full resize-none bg-muted/20 border-border/50 rounded-2xl p-5 text-base leading-relaxed focus-visible:ring-primary/20"
          />
        </div>
      </div>
    </div>
  )
}

function DoneSlide({
  onExport,
  isExporting,
}: {
  onExport: () => void
  isExporting: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-4 text-center">
      <div className="w-24 h-24 bg-primary/10 flex items-center justify-center rounded-full mb-4">
        <CheckCircle2 className="w-12 h-12 text-primary" />
      </div>

      <div className="max-w-md space-y-4">
        <h2 className="text-4xl sm:text-5xl font-primary font-black tracking-tight">
          Reflection complete.
        </h2>
        <p className="text-muted-foreground text-lg">
          Your week has been captured. These reflections build clarity over time — keep showing up.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full max-w-sm">
        <Button
          onClick={onExport}
          disabled={isExporting}
          className="w-full h-14 rounded-2xl text-base shadow-lg shadow-primary/25 border border-primary/20"
        >
          {isExporting ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Download className="w-5 h-5 mr-2" />
          )}
          {isExporting ? "Capturing..." : "Download PDF Report"}
        </Button>
      </div>
    </div>
  )
}

// ── Slide config ───────────────────────────────────────────

const SLIDES = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "wins", label: "Wins", icon: Trophy },
  { id: "challenges", label: "Challenges", icon: Zap },
  { id: "patterns", label: "Patterns", icon: Lightbulb },
  { id: "reflection", label: "Reflection", icon: PenLine },
  { id: "done", label: "Done", icon: CheckCircle2 },
]

// ── Main Carousel Component ────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
  }),
}

export function WeeklyReviewCarousel({ onClose }: { onClose?: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const fullReportRef = useRef<HTMLDivElement>(null)

  // Lifted slide state
  const [winsText, setWinsText] = useState("")
  const [challengeText, setChallengeText] = useState("")
  const [reflectionText, setReflectionText] = useState("")
  const [moodTakeaway, setMoodTakeaway] = useState("")
  const [dataLoaded, setDataLoaded] = useState(false)

  // Supabase hooks
  const { data: reviewData } = useWeeklyReview()
  const { triggerSave, isSaving, isSaved } = useAutoSaveWeeklyReview()
  const manualSaveMutation = useSaveWeeklyReview()

  // Real stats
  const { data: stats, isLoading: statsLoading } = useWeeklyStats()

  // Load data from Supabase on mount
  useEffect(() => {
    if (reviewData && !dataLoaded) {
      const content = reviewData.content
      if (content) {
        setWinsText(content.winsText || "")
        setChallengeText(content.challengeText || "")
        setReflectionText(content.reflectionText || "")
        setMoodTakeaway(content.moodTakeaway || "")
      }
      setDataLoaded(true)
    } else if (reviewData === null && !dataLoaded) {
      setDataLoaded(true)
    }
  }, [reviewData, dataLoaded])

  // Auto-save when text fields change
  useEffect(() => {
    if (!dataLoaded) return
    triggerSave({
      winsText,
      challengeText,
      reflectionText,
      moodTakeaway,
    })
  }, [winsText, challengeText, reflectionText, moodTakeaway, dataLoaded, triggerSave])

  const isFirst = currentSlide === 0
  const isLast = currentSlide === SLIDES.length - 1

  const goNext = () => {
    if (!isLast) {
      setDirection(1)
      setCurrentSlide((s) => s + 1)
    }
  }

  const goPrev = () => {
    if (!isFirst) {
      setDirection(-1)
      setCurrentSlide((s) => s - 1)
    }
  }

  const goToStep = (idx: number) => {
    if (idx === currentSlide) return
    setDirection(idx > currentSlide ? 1 : -1)
    setCurrentSlide(idx)
  }

  const handleExportPDF = async () => {
    if (!fullReportRef.current) return
    setIsExporting(true)

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      const slidesToExport = Array.from(fullReportRef.current.children)

      for (let i = 0; i < slidesToExport.length; i++) {
        const slideNode = slidesToExport[i] as HTMLElement
        const dataUrl = await toPng(slideNode, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: document.documentElement.classList.contains("dark")
            ? "#09090b"
            : "#ffffff",
          fetchRequestInit: { cache: "no-cache" },
          skipFonts: true,
        })

        const imgProps = pdf.getImageProperties(dataUrl)
        const renderHeight = (imgProps.height * pdfWidth) / imgProps.width
        const yPos = renderHeight < pdfHeight ? (pdfHeight - renderHeight) / 2 : 0

        if (i > 0) pdf.addPage()
        pdf.addImage(dataUrl, "PNG", 0, yPos, pdfWidth, renderHeight)
      }

      pdf.save(`weekly-review-full-report.pdf`)
      toast.success("Exported successfully", {
        description: "Your full weekly report has been saved as a PDF.",
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast.error("Export failed", {
        description: "There was an error generating your full PDF report.",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleSave = () => {
    manualSaveMutation.mutate(
      {
        content: { winsText, challengeText, reflectionText, moodTakeaway },
      },
      {
        onSuccess: () => {
          toast.success("Weekly review saved!", {
            description: "Your reflections have been recorded.",
          })
        },
        onError: () => {
          toast.error("Save failed", {
            description: "Could not save your review. Please try again.",
          })
        },
      }
    )
  }

  const realStats = stats || null

  // Render the correct slide
  function renderSlide(slideId: string) {
    switch (slideId) {
      case "overview":
        return <OverviewSlide stats={realStats} />
      case "wins":
        return <WinsSlide stats={realStats} winsText={winsText} setWinsText={setWinsText} />
      case "challenges":
        return <ChallengesSlide stats={realStats} challengeText={challengeText} setChallengeText={setChallengeText} />
      case "patterns":
        return <PatternsSlide stats={realStats} />
      case "reflection":
        return (
          <ReflectionSlide
            reflectionText={reflectionText}
            setReflectionText={setReflectionText}
            moodTakeaway={moodTakeaway}
            setMoodTakeaway={setMoodTakeaway}
          />
        )
      case "done":
        return <DoneSlide onExport={handleExportPDF} isExporting={isExporting} />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto py-2">
      {/* Top Controls: Navigation Dots + Save indicator */}
      <div className="w-full flex items-center justify-center mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {SLIDES.map((slide, idx) => {
              const isActive = idx === currentSlide
              return (
                <button
                  key={slide.id}
                  onClick={() => goToStep(idx)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? "w-8 bg-primary"
                      : "w-2 bg-primary/20 hover:bg-primary/40"
                  }`}
                  aria-label={`Go to ${slide.label}`}
                />
              )
            })}
          </div>

          {/* Save indicator */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-2">
            {statsLoading && (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Loading data...</span>
              </>
            )}
            {!statsLoading && isSaving && (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Saving...</span>
              </>
            )}
            {!statsLoading && isSaved && !isSaving && (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500">Saved</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Presentation Frame */}
      <div className="relative w-full flex items-center justify-center aspect-[4/5] sm:aspect-[4/3] lg:aspect-[16/9] lg:max-h-[75vh]">
        {/* Navigation Floating Buttons */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 z-20 pointer-events-none">
          <div className="pointer-events-auto">
            {!isFirst && (
              <Button
                variant="ghost"
                size="icon"
                onClick={goPrev}
                className="w-10 h-10 sm:w-14 sm:h-14 -translate-x-1/2 rounded-full bg-background/80 backdrop-blur-xl shadow-xl border border-border/50 hover:scale-105 hover:bg-background transition-transform duration-200"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 ml-0.5 sm:ml-1" />
              </Button>
            )}
          </div>

          <div className="pointer-events-auto">
            {isLast ? (
              <Button
                variant="default"
                size="icon"
                onClick={handleSave}
                className="w-10 h-10 sm:w-14 sm:h-14 translate-x-1/2 rounded-full shadow-xl shadow-primary/25 hover:scale-105 transition-transform duration-200 group"
              >
                <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={goNext}
                className="w-10 h-10 sm:w-14 sm:h-14 translate-x-1/2 rounded-full bg-background/80 backdrop-blur-xl shadow-xl border border-border/50 hover:scale-105 hover:bg-background transition-transform duration-200"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 mr-0.5 sm:mr-1" />
              </Button>
            )}
          </div>
        </div>

        {/* The Slide Itself */}
        <div className="w-full bg-card rounded-3xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.03)] overflow-hidden relative h-full">
          <div className="relative w-full h-full p-6 sm:p-10 lg:p-14 flex flex-col pt-12 sm:pt-14">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full flex flex-col"
              >
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-bold mb-6 flex justify-between w-full shrink-0">
                  <span>Rhythmé • Weekly Report</span>
                  <span>{SLIDES[currentSlide].label}</span>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {renderSlide(SLIDES[currentSlide].id)}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full max-w-sm mx-auto mt-10">
        <Progress value={((currentSlide + 1) / SLIDES.length) * 100} className="h-1.5 shadow-md" />
      </div>

      {/* Hidden Full Report Container for Export */}
      <div className="absolute left-[-9999px] top-[-9999px] pointer-events-none opacity-0 overflow-hidden">
        <div ref={fullReportRef} className="flex flex-col gap-8 bg-background p-8">
          {SLIDES.filter((s) => s.id !== "done").map((slide) => (
            <div
              key={slide.id}
              className="w-[1280px] h-[720px] bg-card rounded-3xl border border-border shadow-sm overflow-hidden relative p-14 flex flex-col"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-bold mb-8 flex justify-between w-full shrink-0">
                <span>Rhythmé • Weekly Report</span>
                <span>{slide.label}</span>
              </div>

              <div className="flex-1 overflow-hidden">
                {renderSlide(slide.id)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
