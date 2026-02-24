"use client"

import { motion, Variants } from "framer-motion"
import { CalendarDays, History, Target, TrendingUp, Zap, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

// ── Dummy History Data ──────────────────────────────────────

const DUMMY_HISTORY = [
  {
    id: "week-feb-9",
    range: "Feb 9 – Feb 15, 2026",
    status: "Completed",
    stats: {
      tasks: 85,
      habitStreak: 7,
      focusScore: "+12%",
    },
    mood: "Energized",
    highlight: "Crushed all priority tasks by Thursday.",
  },
  {
    id: "week-feb-2",
    range: "Feb 2 – Feb 8, 2026",
    status: "Completed",
    stats: {
      tasks: 62,
      habitStreak: 3,
      focusScore: "-5%",
    },
    mood: "Overwhelmed",
    highlight: "Struggled with context switching, but kept meditation going.",
  },
  {
    id: "week-jan-26",
    range: "Jan 26 – Feb 1, 2026",
    status: "Completed",
    stats: {
      tasks: 92,
      habitStreak: 14,
      focusScore: "+20%",
    },
    mood: "Flow state",
    highlight: "Incredible momentum this week. Perfect habit execution.",
  },
]

export default function WeeklyHistoryPage() {
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

      {/* Timeline List */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 relative"
      >
        {/* Decorative timeline line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border/50 hidden sm:block" />

        {DUMMY_HISTORY.map((week, idx) => (
          <motion.div key={week.id} variants={fadeUp} className="relative flex items-stretch gap-6 group">
            
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
                  <h3 className="text-xl font-bold font-primary">{week.range}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wider">
                      {week.status}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      Target mood: <span className="font-medium text-foreground">{week.mood}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                    View Plan
                  </Button>
                  <Button variant="default" size="sm" className="shadow-sm">
                    View Report
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Target className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Tasks</span>
                  </div>
                  <span className="text-lg font-semibold">{week.stats.tasks}%</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Steak</span>
                  </div>
                  <span className="text-lg font-semibold">{week.stats.habitStreak} days</span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Focus</span>
                  </div>
                  <span className={`text-lg font-semibold ${week.stats.focusScore.startsWith("+") ? "text-emerald-500" : "text-rose-500"}`}>
                    {week.stats.focusScore}
                  </span>
                </div>
              </div>

              {/* Highlight */}
              <div className="bg-muted/30 rounded-xl p-4 mt-2">
                <p className="text-sm italic text-muted-foreground">
                  "{week.highlight}"
                </p>
              </div>

            </div>
          </motion.div>
        ))}

        {/* Load More (Dummy) */}
        <motion.div variants={fadeUp} className="flex justify-center pt-4 pb-8 relative z-10">
          <Button variant="ghost" className="rounded-full px-8 bg-background shadow-sm border border-border">
            Load older weeks
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
