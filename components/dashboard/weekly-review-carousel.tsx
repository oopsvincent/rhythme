"use client"

import { useState, useRef } from "react"
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
  Download,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { toast } from "sonner"
import { toPng } from "html-to-image"
import jsPDF from "jspdf"

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

function OverviewSlide(props: any) {
  return (
    <div className="flex flex-col h-full justify-between gap-6 p-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-primary font-bold tracking-tight">Week in Review</h2>
          <p className="text-muted-foreground text-base mt-2">
            Feb 17 – Feb 23, 2026
          </p>
        </div>
        <div className="glass-card rounded-2xl px-5 py-3 border-primary/20 bg-primary/5">
          <p className="text-sm font-semibold text-gradient-primary">
            A balanced week with room to grow
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 mt-4">
        {/* Mood sparkline */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-4">
              Mood this week
            </p>
            <MoodSparkline data={DUMMY_MOOD_DATA} className="h-32 w-full" />
          </div>
          <div className="flex justify-between mt-4 text-xs font-medium text-muted-foreground/70">
            {DUMMY_MOOD_DATA.map((d) => (
              <span key={d.day}>{d.day}</span>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Tasks Done", value: "12/15", pct: 80 },
            { label: "Habits Hit", value: "78%", pct: 78 },
            { label: "Avg Mood", value: "3.6/5", pct: 72 },
            { label: "Focus Hrs", value: "8.5h", pct: 85 },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-5 flex flex-col justify-center items-center text-center">
              <p className="text-3xl font-black font-primary tracking-tighter">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-2 font-medium bg-muted/50 px-3 py-1 rounded-full">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WinsSlide({ winsText, setWinsText }: any) {
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
        {/* Auto-populated dummy wins */}
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
            Data Highlights
          </p>
          <div className="flex flex-col gap-3 h-full justify-start">
            {DUMMY_WINS.map((win, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-4 flex items-center gap-4 border-l-4 border-l-primary/50"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <win.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-[15px] font-medium leading-snug">{win.text}</p>
              </div>
            ))}
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

function ChallengesSlide({ challengeText, setChallengeText }: any) {
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
        {/* Highlight correlation */}
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
            Key Friction Point
          </p>
          <div className="h-full">
            <CorrelationCard
              headline="Missed habits clustered on negative-mood days"
              detail="3 of your 4 missed habits happened on days you logged low mood. That's normal — be gentle."
              trend="down"
            />
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

function PatternsSlide(props: any) {
  return (
    <div className="flex flex-col h-full gap-8 p-2">
      <div>
        <h2 className="text-3xl sm:text-4xl font-primary font-bold flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-cyan-400" />
          Patterns
        </h2>
        <p className="text-muted-foreground text-base mt-2">
          Simple correlations from your mood, habits, and tasks this week.
        </p>
      </div>

      <div className="flex-1 w-full bg-card/50 rounded-3xl p-6 border border-border/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {DUMMY_CORRELATIONS.map((c, i) => (
            <div key={i} className="h-full">
               <CorrelationCard {...c} />
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm font-medium text-muted-foreground text-center bg-muted/30 py-2 rounded-full w-max mx-auto px-6">
        These are simple observations — not prescriptions.
      </p>
    </div>
  )
}

function ReflectionSlide({ reflectionText, setReflectionText, moodTakeaway, setMoodTakeaway }: any) {
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

function DoneSlide({ onExport, isExporting, ...props }: any) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-4 text-center">
      <div className="w-24 h-24 bg-primary/10 flex items-center justify-center rounded-full mb-4 animate-pulse">
        <CheckCircle2 className="w-12 h-12 text-primary" />
      </div>
      
      <div className="max-w-md space-y-4">
        <h2 className="text-4xl sm:text-5xl font-primary font-black tracking-tight">
          You survived.
        </h2>
        <p className="text-muted-foreground text-lg">
          Another week in the books. Print this out and put it on your fridge, or just save it before it disappears into the digital abyss.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full max-w-sm">
        <Button 
          onClick={onExport} 
          disabled={isExporting}
          className="w-full h-14 rounded-2xl text-base shadow-lg shadow-primary/25 border border-primary/20"
        >
          {isExporting ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
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
  { id: "overview", label: "Overview", icon: LayoutDashboard, component: OverviewSlide },
  { id: "wins", label: "Wins", icon: Trophy, component: WinsSlide },
  { id: "challenges", label: "Challenges", icon: Zap, component: ChallengesSlide },
  { id: "patterns", label: "Patterns", icon: Lightbulb, component: PatternsSlide },
  { id: "reflection", label: "Reflection", icon: PenLine, component: ReflectionSlide },
  { id: "done", label: "Done", icon: CheckCircle2, component: DoneSlide },
]

// ── Main Carousel Component ────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.98
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.98
  }),
}

export function WeeklyReviewCarousel({ onClose }: { onClose?: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0) // Re-added as it's used by AnimatePresence
  const [isExporting, setIsExporting] = useState(false) // Re-added as it's used by DoneSlide and handleExportPDF
  const [isMaximized, setIsMaximized] = useState(false) // Re-added as it's used for maximizing the carousel
  const fullReportRef = useRef<HTMLDivElement>(null)

  // Lifted slide state
  const [winsText, setWinsText] = useState(
    "I stayed consistent with my morning routine and knocked out two big tasks on Thursday."
  )
  const [challengeText, setChallengeText] = useState(
    "I struggled with staying focused during afternoon meetings and missed two habit days."
  )
  const [reflectionText, setReflectionText] = useState("")
  const [moodTakeaway, setMoodTakeaway] = useState("")

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
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // The slides we want to export are all children of the hidden container
      const slidesToExport = Array.from(fullReportRef.current.children)

      for (let i = 0; i < slidesToExport.length; i++) {
        const slideNode = slidesToExport[i] as HTMLElement
        const dataUrl = await toPng(slideNode, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: document.documentElement.classList.contains('dark') ? '#09090b' : '#ffffff',
          fetchRequestInit: { cache: 'no-cache' },
          skipFonts: true, // Prevents errors related to parsing cross-origin stylesheets and Next.js fonts
        })
        
        const imgProps = pdf.getImageProperties(dataUrl)
        const renderHeight = (imgProps.height * pdfWidth) / imgProps.width
        
        // Center vertically if height is smaller than A4
        const yPos = renderHeight < pdfHeight ? (pdfHeight - renderHeight) / 2 : 0

        if (i > 0) pdf.addPage()
        pdf.addImage(dataUrl, 'PNG', 0, yPos, pdfWidth, renderHeight)
      }

      pdf.save(`weekly-review-full-report.pdf`)
      
      toast.success("Exported successfully", {
        description: "Your full weekly report has been saved as a PDF."
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast.error("Export failed", {
        description: "There was an error generating your full PDF report."
      })
    } finally {
      setIsExporting(false)
    }
  }

  const slideProps = {
    winsText, setWinsText,
    challengeText, setChallengeText,
    reflectionText, setReflectionText,
    moodTakeaway, setMoodTakeaway,
    onExport: handleExportPDF,
    isExporting
  }

  const handleSave = () => {
    toast.success("Weekly review saved!", {

      description: "Your reflections have been recorded."
    })
  }

  const SlideComponent = SLIDES[currentSlide].component

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto py-2">
      
      {/* Top Controls: Navigation Dots */}
      <div className="w-full flex items-center justify-center mb-6 px-2">
        <div className="flex items-center gap-2">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide
            return (
              <button
                key={slide.id}
                onClick={() => goToStep(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive ? "w-8 bg-primary" : "w-2 bg-primary/20 hover:bg-primary/40"
                }`}
                aria-label={`Go to ${slide.label}`}
              />
            )
          })}
        </div>
      </div>

      {/* Presentation Frame Wrapper */}
      <div 
        className={`relative w-full flex items-center justify-center transition-all duration-500 ease-in-out z-40 ${
          isMaximized 
            ? "fixed inset-0 bg-background/95 backdrop-blur-sm p-4 sm:p-12 z-50 h-screen" 
            : "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[16/9] lg:max-h-[75vh]"
        }`}
      >
        
        {/* Navigation Floating Buttons */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 sm:px-[-2rem] z-20 pointer-events-none">
          <div className="pointer-events-auto">
            {!isFirst && (
              <Button
                variant="ghost"
                size="icon"
                onClick={goPrev}
                className="w-10 h-10 sm:w-14 sm:h-14 -translate-x-1/2 rounded-full bg-background/80 backdrop-blur-xl shadow-xl border border-border/50 hover:scale-110 hover:bg-background transition-transform"
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
                className="w-10 h-10 sm:w-14 sm:h-14 translate-x-1/2 rounded-full shadow-xl shadow-primary/25 hover:scale-110 transition-transform group"
              >
                <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={goNext}
                className="w-10 h-10 sm:w-14 sm:h-14 translate-x-1/2 rounded-full bg-background/80 backdrop-blur-xl shadow-xl border border-border/50 hover:scale-110 hover:bg-background transition-transform"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 mr-0.5 sm:mr-1" />
              </Button>
            )}
          </div>
        </div>

        {/* The Slide Itself */}
        <div 
          className={`w-full bg-card rounded-3xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.03)] overflow-hidden relative transition-all duration-300 ${
             isMaximized ? "h-full max-w-7xl" : "h-full"
          }`}
        >
          {/* Decorative background blur */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />
          
          {isMaximized && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 rounded-full bg-background/50 backdrop-blur-md"
              onClick={() => setIsMaximized(false)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          )}

          <div className="relative w-full h-full p-6 sm:p-10 lg:p-14 flex flex-col pt-12 sm:pt-14">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} 
                className="w-full h-full flex flex-col"
              >
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-bold mb-6 flex justify-between w-full shrink-0">
                  <span>Rhythmé • Weekly Report</span>
                  <span>{SLIDES[currentSlide].label}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <SlideComponent {...slideProps} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Bottom Progress Bar */}
      <div className={`w-full max-w-sm mx-auto transition-all duration-300 ${isMaximized ? "fixed bottom-8 z-50 left-1/2 -translate-x-1/2 px-8" : "mt-10"}`}>
         <Progress value={((currentSlide + 1) / SLIDES.length) * 100} className="h-1.5 shadow-md" />
      </div>

      {/* Hidden Full Report Container for Export */}
      <div className="absolute left-[-9999px] top-[-9999px] pointer-events-none opacity-0 overflow-hidden">
        <div ref={fullReportRef} className="flex flex-col gap-8 bg-background p-8">
          {SLIDES.filter(s => s.id !== "done").map((slide) => {
            const SlideComp = slide.component as React.FC<any>
            return (
              <div 
                key={slide.id} 
                className="w-[1280px] h-[720px] bg-card rounded-3xl border border-border shadow-sm overflow-hidden relative p-14 flex flex-col"
              >
                {/* Decorative background blur */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-bold mb-8 flex justify-between w-full shrink-0">
                  <span>Rhythmé • Weekly Report</span>
                  <span>{slide.label}</span>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <SlideComp {...slideProps} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
