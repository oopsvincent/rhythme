"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Target, 
  Flame, 
  Heart, 
  Clock, 
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Lock,
  TrendingUp,
  Calendar,
  PenTool,
  Award,
  AlertOctagon,
  Loader2
} from "lucide-react"

import { ProgressBar } from "@/components/ui/progress-bar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { PremiumGateModal, PremiumGateReason } from "@/components/premium-gate-modal"

import { getWeekBounds, fmtLocalDate } from "@/lib/week-helpers"
import { useWeeklyPlan, useSaveWeeklyPlan } from "@/hooks/use-weekly-plan"
import { useWeeklyStats } from "@/hooks/use-weekly-stats"
import { useWeeklyReview, useSaveWeeklyReview } from "@/hooks/use-weekly-review"
import { fetchInsightsAction } from "@/app/actions/ml"
import { getUserTimezone, getLocalDateString } from "@/lib/timezone"
import { getLastWeekPlan } from "@/app/actions/weekly"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface WeeklyPageClientProps {
  activeHabits: { habit_id: number; name: string }[];
  isPremium: boolean;
}

export function WeeklyPageClient({ activeHabits, isPremium }: WeeklyPageClientProps) {
  const { weekStart: currentRealWeekStart } = getWeekBounds()
  const [weekStart, setWeekStart] = useState(currentRealWeekStart)
  
  const weekEnd = useMemo(() => {
    const d = new Date(weekStart + "T00:00:00")
    d.setDate(d.getDate() + 6)
    return fmtLocalDate(d)
  }, [weekStart])

  const weekProgressDays = useMemo(() => {
    const todayStr = getLocalDateString()
    if (todayStr < weekStart) return 0
    if (todayStr > weekEnd) return 7
    
    const start = new Date(weekStart + "T00:00:00")
    const today = new Date(todayStr + "T00:00:00")
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return Math.min(7, Math.max(0, diff + 1))
  }, [weekStart, weekEnd])

  // Formatting date range for header
  const headerDateRange = useMemo(() => {
    const dStart = new Date(weekStart + "T00:00:00")
    const dEnd = new Date(weekEnd + "T00:00:00")
    const startStr = dStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const endStr = dEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    return `${startStr} – ${endStr}, ${dEnd.getFullYear()}`
  }, [weekStart, weekEnd])

  const [activeTab, setActiveTab] = useState<"plan" | "review">("plan")
  const [isGateOpen, setIsGateOpen] = useState(false)
  const [gateReason, setGateReason] = useState<PremiumGateReason>("weekly")

  // Data Hooks
  const { data: planData, isLoading: isLoadingPlan } = useWeeklyPlan(weekStart)
  const { data: statsData, isLoading: isLoadingStats } = useWeeklyStats(weekStart)
  const { data: reviewData, isLoading: isLoadingReview } = useWeeklyReview(weekStart)
  
  const savePlanMutation = useSaveWeeklyPlan()
  const saveReviewMutation = useSaveWeeklyReview()

  // State for Plan
  const [focusList, setFocusList] = useState<string[]>(["", "", ""])
  const [selectedHabits, setSelectedHabits] = useState<string[]>([])

  // State for Review
  const [wins, setWins] = useState("")
  const [challenges, setChallenges] = useState("")
  const [improve, setImprove] = useState("")

  // Insights
  const [insight, setInsight] = useState<string | null>(null)
  const [isLoadingInsight, setIsLoadingInsight] = useState(false)

  // Sync Plan Data
  useEffect(() => {
    if (planData?.content) {
      const dbFocus = planData.content.focus || []
      setFocusList([
        dbFocus[0] || "",
        dbFocus[1] || "",
        dbFocus[2] || ""
      ])
      setSelectedHabits(planData.content.habits || [])
    } else {
      setFocusList(["", "", ""])
      setSelectedHabits([])
    }
  }, [planData])

  // Sync Review Data
  useEffect(() => {
    if (reviewData?.content) {
      setWins(reviewData.content.winsText || "")
      setChallenges(reviewData.content.challengeText || "")
      setImprove(reviewData.content.reflectionText || "")
    } else {
      setWins("")
      setChallenges("")
      setImprove("")
    }
  }, [reviewData])

  // Navigation
  const prevWeek = () => {
    const d = new Date(weekStart + "T00:00:00")
    d.setDate(d.getDate() - 7)
    setWeekStart(fmtLocalDate(d))
    setInsight(null)
  }

  const nextWeek = () => {
    const d = new Date(weekStart + "T00:00:00")
    d.setDate(d.getDate() + 7)
    setWeekStart(fmtLocalDate(d))
    setInsight(null)
  }

  // Load Insight
  const loadInsight = async () => {
    if (!isPremium) {
      setGateReason("weekly")
      setIsGateOpen(true)
      return
    }
    
    setIsLoadingInsight(true)
    try {
      const res = await fetchInsightsAction({
        from: weekStart,
        to: weekEnd,
        user_timezone: getUserTimezone(),
        localToday: getLocalDateString(),
      })
      if (res.insights && res.insights.length > 0) {
        const first = res.insights[0]
        setInsight(typeof first === 'string' ? first : (first.sentence || first.insight || "You are building strong habits."))
      } else {
        setInsight("No clear patterns surfaced for this week yet.")
      }
    } catch (e) {
      setInsight("Unable to generate insights right now.")
    } finally {
      setIsLoadingInsight(false)
    }
  }

  // Save Handlers
  const handleSavePlan = () => {
    const content = {
      wins: [],
      challenges: [],
      focus: focusList.filter(f => f.trim() !== ""),
      habits: selectedHabits,
      mood: []
    }
    savePlanMutation.mutate({ content, weekStart }, {
      onSuccess: () => toast.success("Weekly plan saved!")
    })
  }

  const handleSaveReview = () => {
    if (!isPremium && reviewData === null) {
      setGateReason("weekly")
      setIsGateOpen(true)
      return
    }
    
    const content = {
      winsText: wins,
      challengeText: challenges,
      reflectionText: improve,
      moodTakeaway: ""
    }
    saveReviewMutation.mutate({ content, weekStart }, {
      onSuccess: () => toast.success("Weekly review saved!")
    })
  }

  const handleCarryOver = async () => {
    toast.loading("Fetching last week's plan...", { id: "carry-over" })
    const res = await getLastWeekPlan(weekStart)
    if (res.data?.content) {
      const oldFocus = res.data.content.focus || []
      setFocusList([
        oldFocus[0] || "",
        oldFocus[1] || "",
        oldFocus[2] || ""
      ])
      setSelectedHabits(res.data.content.habits || [])
      toast.success("Carried over!", { id: "carry-over" })
    } else {
      toast.error("No plan found for last week.", { id: "carry-over" })
    }
  }

  const toggleHabit = (id: string) => {
    setSelectedHabits(prev => {
      if (prev.includes(id)) return prev.filter(h => h !== id)
      if (prev.length >= 5) {
        toast.error("Maximum 5 key habits allowed.")
        return prev
      }
      return [...prev, id]
    })
  }

  const isEarlyInWeek = new Date().getDay() >= 1 && new Date().getDay() <= 3
  const isCurrentWeek = weekStart === currentRealWeekStart

  return (
    <div className="flex flex-col flex-1 px-4 py-8 md:px-8 max-w-5xl mx-auto w-full gap-8 relative pb-32 md:pb-12">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.03] blur-[120px]"
          style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
        />
        <div 
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.02] blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
        />
      </div>

      {/* Overhauled Title Block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border/15 relative z-10">
        <div className="space-y-1.5 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E07A5F] bg-[#E07A5F]/10 px-2.5 py-1 rounded-md">
            RHYTHM
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-primary tracking-tight text-foreground/90 mt-1">
            Weekly Alignment
          </h1>
          <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-xl">
            A quiet space to reflect on the past week, recognize your efforts, and gently clarify your focus for the days ahead.
          </p>
        </div>
        
        {/* Navigation block */}
        <div className="flex items-center gap-3 bg-card/60 dark:bg-card/25 p-1.5 rounded-2xl border border-border/40 shadow-inner shrink-0 mx-auto md:mx-0">
          <Button variant="ghost" size="icon" onClick={prevWeek} className="rounded-xl h-9 w-9 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-xs font-bold tracking-wider uppercase min-w-[150px] text-center text-foreground/85">
            {headerDateRange}
          </span>
          <Button variant="ghost" size="icon" onClick={nextWeek} className="rounded-xl h-9 w-9 text-muted-foreground hover:text-foreground">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Week Progress Bar */}
      <div className="rounded-2xl border border-border/30 bg-card/30 dark:bg-card/15 backdrop-blur-md p-5 relative z-10">
        <ProgressBar
          value={weekProgressDays}
          max={7}
          showLabel
          label={
            weekProgressDays === 7 
              ? "Week completed" 
              : weekProgressDays === 0 
                ? "Week hasn't started" 
                : `Day ${weekProgressDays} of the weekly cycle`
          }
          color="primary"
          size="sm"
        />
      </div>

      {/* Switch Warning */}
      {isEarlyInWeek && isCurrentWeek && activeTab === "review" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-2xl text-sm flex items-center gap-3 relative z-10">
          <Sparkles className="w-5 h-5 shrink-0" />
          <p className="flex-1 text-xs sm:text-sm">It&apos;s early in the week! Consider using the <strong>Plan</strong> view to organize your core targets.</p>
          <Button variant="outline" size="sm" className="bg-transparent border-primary/30 hover:bg-primary/25 text-primary" onClick={() => setActiveTab("plan")}>
            Switch to Plan
          </Button>
        </motion.div>
      )}

      {/* Overhauled Tab Section: Custom Premium App Bar */}
      <div className="relative z-10 w-full">
        {/* Mobile: Bottom appbar | Desktop: Centered top nav */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:relative w-full flex items-center bg-[#12141A]/90 dark:bg-[#12141A]/95 backdrop-blur-xl md:backdrop-blur-md border-t border-[#1F2A38]/15 dark:border-border/10 md:border md:border-border/20 p-2 md:p-1.5 pb-safe-bottom md:pb-1.5 shadow-[0_-8px_30px_rgba(0,0,0,0.35)] md:shadow-sm max-w-none md:max-w-md mx-auto rounded-t-2xl md:rounded-2xl mb-0 md:mb-8">
          <button
            onClick={() => setActiveTab("plan")}
            className={cn(
              "flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2.5 py-1.5 md:py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 relative cursor-pointer select-none",
              activeTab === "plan" ? "text-[#E07A5F]" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {activeTab === "plan" && (
              <motion.div
                layoutId="weekly-appbar-tab"
                className="absolute inset-0 bg-background dark:bg-[#12141A]/50 border border-border/40 shadow-sm rounded-xl"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <Target className="w-5 h-5 md:w-4 md:h-4 relative z-10" />
            <span className="relative z-10">Weekly Plan</span>
          </button>
          
          <button
            onClick={() => setActiveTab("review")}
            className={cn(
              "flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2.5 py-1.5 md:py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 relative cursor-pointer select-none",
              activeTab === "review" ? "text-[#E07A5F]" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {activeTab === "review" && (
              <motion.div
                layoutId="weekly-appbar-tab"
                className="absolute inset-0 bg-background dark:bg-[#12141A]/50 border border-border/40 shadow-sm rounded-xl"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <TrendingUp className="w-5 h-5 md:w-4 md:h-4 relative z-10" />
            <span className="relative z-10">Weekly Review</span>
          </button>
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          {activeTab === "plan" ? (
            <motion.div
              key="plan-content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 outline-none"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Focus Card */}
                <Card className="rounded-[32px] border-border/30 bg-card/65 dark:bg-card/25 backdrop-blur-md p-6 shadow-sm flex flex-col space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold font-primary text-foreground/90">Weekly Focus</h2>
                      <p className="text-xs text-muted-foreground">List your three top priorities for this week cycle.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    {focusList.map((focus, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-[#E07A5F]/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-1">
                          {idx + 1}
                        </span>
                        <Textarea 
                          placeholder={`Specify focus priority area ${idx + 1}...`}
                          value={focus}
                          onChange={(e) => {
                            const next = [...focusList]
                            next[idx] = e.target.value
                            setFocusList(next)
                          }}
                          className="resize-none rounded-xl border-border/40 bg-background/50 h-20 text-sm focus:border-primary focus:ring-1 focus:ring-primary/40"
                        />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Key Habits Card */}
                <Card className="rounded-[32px] border-border/30 bg-card/65 dark:bg-card/25 backdrop-blur-md p-6 shadow-sm flex flex-col space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                      <Flame className="w-5 h-5 text-orange-500 animate-none" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold font-primary text-foreground/90">Key Habits</h2>
                      <p className="text-xs text-muted-foreground">Toggle and commit to up to 5 core habits to track.</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[268px] pr-1.5">
                    {activeHabits.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-10 text-muted-foreground text-sm space-y-2">
                        <Flame className="w-8 h-8 opacity-25 text-muted-foreground" />
                        <p>No active habits to show.<br />Add a habit on the dashboard first.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2.5">
                        {activeHabits.map((habit) => {
                          const idStr = habit.habit_id.toString()
                          const isChecked = selectedHabits.includes(idStr)
                          return (
                            <div 
                              key={habit.habit_id} 
                              onClick={() => toggleHabit(idStr)}
                              className={cn(
                                "flex items-center space-x-3.5 p-3 rounded-xl border cursor-pointer select-none transition-all duration-300",
                                isChecked 
                                  ? "bg-orange-500/10 border-orange-500/35 text-foreground" 
                                  : "bg-background/40 border-border/10 hover:bg-background/80 text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <Checkbox 
                                id={`habit-${idStr}`} 
                                checked={isChecked}
                                onCheckedChange={() => {}} // toggled via parent div click
                                className="rounded-md data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 border-border/40"
                              />
                              <span className="text-xs sm:text-sm font-semibold truncate leading-none">
                                {habit.name}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Bottom toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/15">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground w-full sm:w-auto text-xs font-semibold uppercase tracking-wider" onClick={handleCarryOver}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Carry over from last week plan
                </Button>
                <Button 
                  className="w-full sm:w-auto rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 font-semibold text-xs uppercase tracking-wider py-5 px-6"
                  onClick={handleSavePlan}
                  disabled={savePlanMutation.isPending || isLoadingPlan}
                >
                  {savePlanMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {savePlanMutation.isPending ? "Saving Plan..." : "Save Weekly Plan"}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="review-content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 outline-none"
            >
              {/* Dynamic Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="rounded-2xl border-border/30 bg-card/65 dark:bg-card/25 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1.5 opacity-90" />
                  <div className="text-xl sm:text-2xl font-bold font-primary">{statsData?.tasksCompletionPct ?? 0}%</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 mb-2.5 font-bold">Tasks</div>
                  <ProgressBar
                    value={statsData?.tasksCompletionPct ?? 0}
                    max={100}
                    color="emerald"
                    size="sm"
                  />
                </Card>
                
                <Card className="rounded-2xl border-border/30 bg-card/65 dark:bg-card/25 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center shadow-sm">
                  <Flame className="w-5 h-5 text-orange-500 mb-1.5 opacity-90" />
                  <div className="text-xl sm:text-2xl font-bold font-primary">{statsData?.habitCompletionPct ?? 0}%</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 mb-2.5 font-bold">Habits</div>
                  <ProgressBar
                    value={statsData?.habitCompletionPct ?? 0}
                    max={100}
                    color="primary"
                    size="sm"
                  />
                </Card>
                
                <Card className="rounded-2xl border-border/30 bg-card/65 dark:bg-card/25 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center shadow-sm">
                  <Heart className="w-5 h-5 text-rose-500 mb-2 opacity-90" />
                  <div className="text-xl sm:text-2xl font-bold font-primary">
                    {statsData?.avgMood ?? 0}
                    <span className="text-sm font-normal text-muted-foreground/60"> / 5</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">Average Mood</div>
                </Card>
                
                <Card className="rounded-2xl border-border/30 bg-card/65 dark:bg-card/25 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center shadow-sm">
                  <Clock className="w-5 h-5 text-indigo-500 mb-2 opacity-90" />
                  <div className="text-xl sm:text-2xl font-bold font-primary">
                    {statsData?.focusMinutes ?? 0} 
                    <span className="text-xs font-bold text-muted-foreground/60"> MIN</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">Focus Hours</div>
                </Card>
              </div>

              {/* AI Insight Section */}
              <Card className="rounded-3xl border-border/30 bg-gradient-to-br from-[#8FAFC9]/5 to-primary/5 p-6 relative overflow-hidden shadow-sm">
                 <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <Sparkles className="w-24 h-24 text-primary" />
                 </div>
                 <CardHeader className="p-0 mb-3">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#E07A5F] flex items-center gap-2 leading-none">
                      <Sparkles className="w-4 h-4" /> AI Rhythm Analysis
                      {!isPremium && <Lock className="w-3.5 h-3.5 ml-auto text-muted-foreground opacity-60" />}
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                   {insight ? (
                     <p className="text-base font-semibold leading-relaxed text-foreground/80 pr-6 relative z-10">{insight}</p>
                   ) : (
                     <div className="text-muted-foreground text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                        <span>Generate an intelligent weekly rhythm review derived from your focus logs and habits.</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={loadInsight} 
                          disabled={isLoadingInsight} 
                          className="rounded-xl border-[#E07A5F]/20 text-[#E07A5F] hover:bg-[#E07A5F]/5 font-semibold text-xs uppercase tracking-wider px-4 py-2 cursor-pointer shrink-0"
                        >
                          {isLoadingInsight ? "Analyzing Activity..." : "Generate Analysis"}
                        </Button>
                     </div>
                   )}
                 </CardContent>
              </Card>

              {/* Reflection Areas */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2 flex flex-col">
                   <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 px-1">
                     <Award className="w-3.5 h-3.5 text-yellow-500" />
                     Highlights &amp; Wins
                   </label>
                   <Textarea 
                     value={wins}
                     onChange={(e) => setWins(e.target.value)}
                     placeholder="What went well this week? Celebrate every positive step, no matter how small." 
                     className="resize-none h-36 rounded-2xl bg-background/50 border-border/40 focus:border-accent focus:ring-1 focus:ring-accent/40 text-sm"
                   />
                </div>
                
                <div className="space-y-2 flex flex-col">
                   <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 px-1">
                     <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                     Friction &amp; Obstacles
                   </label>
                   <Textarea 
                     value={challenges}
                     onChange={(e) => setChallenges(e.target.value)}
                     placeholder="What felt a bit heavy or tough this week? Obstacles are just opportunities to learn." 
                     className="resize-none h-36 rounded-2xl bg-background/50 border-border/40 focus:border-accent focus:ring-1 focus:ring-accent/40 text-sm"
                   />
                </div>
                
                <div className="space-y-2 flex flex-col">
                   <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 px-1">
                     <Sparkles className="w-3.5 h-3.5 text-primary" />
                     Gentle Adjustments
                   </label>
                   <Textarea 
                     value={improve}
                     onChange={(e) => setImprove(e.target.value)}
                     placeholder="What small adjustment would support your rhythm next week?" 
                     className="resize-none h-36 rounded-2xl bg-background/50 border-border/40 focus:border-accent focus:ring-1 focus:ring-accent/40 text-sm"
                   />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end pt-6 border-t border-border/15">
                <Button 
                  className="w-full sm:w-auto rounded-xl bg-accent text-accent-foreground hover:bg-accent/95 shadow-md shadow-accent/10 font-semibold text-xs uppercase tracking-wider py-5 px-6"
                  onClick={handleSaveReview}
                  disabled={saveReviewMutation.isPending || isLoadingReview}
                >
                  {!isPremium && <Lock className="w-3.5 h-3.5 mr-1.5 opacity-70" />}
                  {saveReviewMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {saveReviewMutation.isPending ? "Saving Review..." : "Save Review"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PremiumGateModal 
        open={isGateOpen} 
        onOpenChange={setIsGateOpen} 
        reason={gateReason} 
      />
    </div>
  )
}
