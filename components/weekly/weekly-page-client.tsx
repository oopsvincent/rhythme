"use client"

import { useState, useEffect, useMemo } from "react"
import { format } from "date-fns"
import { motion } from "framer-motion"
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
  Lock
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { getLastWeekPlan } from "@/app/actions/weekly"
import { toast } from "sonner"

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
      const res = await fetchInsightsAction({ from: weekStart, to: weekEnd })
      if (res.insights && res.insights.length > 0) {
        setInsight(res.insights[0].sentence || res.insights[0].insight || "You are building strong habits.")
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
    <div className="flex flex-col flex-1 px-4 py-6 md:px-8 max-w-5xl mx-auto w-full gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weekly</h1>
          <p className="text-muted-foreground mt-1">Your simple, calm weekly rhythm.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-card/60 p-1.5 rounded-2xl border border-border/50 shadow-sm">
          <Button variant="ghost" size="icon" onClick={prevWeek} className="rounded-xl h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm font-semibold tracking-wide min-w-[140px] text-center">
            {headerDateRange}
          </span>
          <Button variant="ghost" size="icon" onClick={nextWeek} className="rounded-xl h-9 w-9">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isEarlyInWeek && isCurrentWeek && activeTab === "review" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-2xl text-sm flex items-center gap-3">
          <Sparkles className="w-5 h-5 shrink-0" />
          <p>It's early in the week! Consider starting with the <strong>Plan</strong> tab to set your focus.</p>
          <Button variant="outline" size="sm" className="ml-auto bg-transparent border-primary/30 hover:bg-primary/20 text-primary hover:text-primary" onClick={() => setActiveTab("plan")}>
            Switch to Plan
          </Button>
        </motion.div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-2 p-1 bg-muted/60 rounded-2xl h-12 mb-6">
          <TabsTrigger value="plan" className="rounded-xl h-full data-[state=active]:bg-background data-[state=active]:shadow-sm">Plan</TabsTrigger>
          <TabsTrigger value="review" className="rounded-xl h-full data-[state=active]:bg-background data-[state=active]:shadow-sm">Review</TabsTrigger>
        </TabsList>

        {/* ======================= PLAN TAB ======================= */}
        <TabsContent value="plan" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500 outline-none">
          
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Focus Section */}
            <Card className="rounded-[28px] border-border/60 shadow-sm bg-card/40 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Weekly Focus</CardTitle>
                    <CardDescription>Set 1-3 main priorities.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {focusList.map((focus, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0 mt-2">
                      {idx + 1}
                    </span>
                    <Textarea 
                      placeholder={`Focus area ${idx + 1}...`}
                      value={focus}
                      onChange={(e) => {
                        const next = [...focusList]
                        next[idx] = e.target.value
                        setFocusList(next)
                      }}
                      className="resize-none rounded-xl border-border/60 bg-background/50 h-20"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Habits Section */}
            <Card className="rounded-[28px] border-border/60 shadow-sm bg-card/40 backdrop-blur-sm flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle>Key Habits</CardTitle>
                    <CardDescription>Protect up to 5 habits this week.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                {activeHabits.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground text-sm">
                    No active habits found. <br /> Create some on your dashboard first!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeHabits.map((habit) => {
                      const idStr = habit.habit_id.toString()
                      const isChecked = selectedHabits.includes(idStr)
                      return (
                        <div 
                          key={habit.habit_id} 
                          className={`flex items-center space-x-3 p-3 rounded-xl border transition-colors cursor-pointer ${isChecked ? 'bg-orange-500/5 border-orange-500/30' : 'bg-background/50 border-border/50 hover:bg-muted/50'}`}
                          onClick={() => toggleHabit(idStr)}
                        >
                          <Checkbox 
                            id={`habit-${idStr}`} 
                            checked={isChecked}
                            className="rounded-md data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                          />
                          <label 
                            htmlFor={`habit-${idStr}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                          >
                            {habit.name}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/50">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground w-full sm:w-auto" onClick={handleCarryOver}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Carry over from last week
            </Button>
            <Button 
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
              size="lg"
              onClick={handleSavePlan}
              disabled={savePlanMutation.isPending || isLoadingPlan}
            >
              <Save className="w-4 h-4 mr-2" />
              {savePlanMutation.isPending ? "Saving..." : "Save Plan"}
            </Button>
          </div>

        </TabsContent>

        {/* ======================= REVIEW TAB ======================= */}
        <TabsContent value="review" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500 outline-none">
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="rounded-[24px] border-border/60 bg-background/60 shadow-sm flex flex-col items-center justify-center p-6 text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-3 opacity-80" />
              <div className="text-2xl font-bold">{statsData?.tasksCompletionPct ?? 0}%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-medium">Task Completion</div>
            </Card>
            <Card className="rounded-[24px] border-border/60 bg-background/60 shadow-sm flex flex-col items-center justify-center p-6 text-center">
              <Flame className="w-6 h-6 text-orange-500 mb-3 opacity-80" />
              <div className="text-2xl font-bold">{statsData?.habitCompletionPct ?? 0}%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-medium">Habit Completion</div>
            </Card>
            <Card className="rounded-[24px] border-border/60 bg-background/60 shadow-sm flex flex-col items-center justify-center p-6 text-center">
              <Heart className="w-6 h-6 text-rose-500 mb-3 opacity-80" />
              <div className="text-2xl font-bold">{statsData?.avgMood ?? 0}<span className="text-lg text-muted-foreground">/5</span></div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-medium">Average Mood</div>
            </Card>
            <Card className="rounded-[24px] border-border/60 bg-background/60 shadow-sm flex flex-col items-center justify-center p-6 text-center">
              <Clock className="w-6 h-6 text-indigo-500 mb-3 opacity-80" />
              <div className="text-2xl font-bold">{statsData?.focusMinutes ?? 0} <span className="text-sm font-normal text-muted-foreground">min</span></div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-medium">Total Focus</div>
            </Card>
          </div>

          {/* AI Insight */}
          <Card className="rounded-[28px] border-border/60 shadow-sm bg-gradient-to-br from-indigo-500/5 to-purple-500/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Sparkles className="w-32 h-32" />
             </div>
             <CardHeader>
                <CardTitle className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> Behavioral Insight
                  {!isPremium && <Lock className="w-4 h-4 ml-auto text-muted-foreground opacity-50" />}
                </CardTitle>
             </CardHeader>
             <CardContent>
               {insight ? (
                 <p className="text-lg font-medium leading-relaxed max-w-3xl relative z-10">{insight}</p>
               ) : (
                 <div className="text-muted-foreground text-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
                    <span>Generate an AI-driven insight based on this week's logs.</span>
                    <Button variant="secondary" size="sm" onClick={loadInsight} disabled={isLoadingInsight} className="rounded-full">
                      {isLoadingInsight ? "Analyzing..." : "Generate Insight"}
                    </Button>
                 </div>
               )}
             </CardContent>
          </Card>

          {/* Reflection */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
               <label className="text-sm font-semibold px-1">Biggest Win</label>
               <Textarea 
                 value={wins}
                 onChange={(e) => setWins(e.target.value)}
                 placeholder="What went well?" 
                 className="resize-none h-32 rounded-2xl bg-background/50 border-border/60"
               />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-semibold px-1">Biggest Challenge</label>
               <Textarea 
                 value={challenges}
                 onChange={(e) => setChallenges(e.target.value)}
                 placeholder="What held you back?" 
                 className="resize-none h-32 rounded-2xl bg-background/50 border-border/60"
               />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-semibold px-1">Improvement</label>
               <Textarea 
                 value={improve}
                 onChange={(e) => setImprove(e.target.value)}
                 placeholder="One thing for next week..." 
                 className="resize-none h-32 rounded-2xl bg-background/50 border-border/60"
               />
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-border/50">
            <Button 
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground"
              size="lg"
              onClick={handleSaveReview}
              disabled={saveReviewMutation.isPending || isLoadingReview}
            >
              {!isPremium && <Lock className="w-4 h-4 mr-2 opacity-70" />}
              <Save className="w-4 h-4 mr-2" />
              {saveReviewMutation.isPending ? "Saving..." : "Save Review"}
            </Button>
          </div>

        </TabsContent>
      </Tabs>

      <PremiumGateModal 
        open={isGateOpen} 
        onOpenChange={setIsGateOpen} 
        reason={gateReason} 
      />
    </div>
  )
}
