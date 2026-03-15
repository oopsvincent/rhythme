"use client"

import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWeeklyStats } from "@/hooks/use-weekly-stats"
import { useWeeklyPlan } from "@/hooks/use-weekly-plan"

interface WeeklyWidgetProps {
  className?: string
}

export function WeeklyWidget({ className }: WeeklyWidgetProps) {
  const { data: stats, isLoading: statsLoading } = useWeeklyStats()
  const { data: plan, isLoading: planLoading } = useWeeklyPlan()

  const isLoading = statsLoading || planLoading

  // Compute week number of the year
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const weekNumber = Math.ceil(
    ((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
  )

  // Date range from stats or compute locally
  const dateRange = stats
    ? (() => {
        const fmt = (d: string) => {
          const [year, month, day] = d.split("-")
          const dt = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
          return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        }
        return `${fmt(stats.weekStart)} – ${fmt(stats.weekEnd)}`
      })()
    : ""

  // Days: show habit completion per day from mood entries (as a proxy for "active" days)
  // A day is "completed" if the user had at least one habit log or journal entry
  const days = stats
    ? stats.moodEntries.map((m) => m.value > 0)
    : [false, false, false, false, false, false, false]

  // Theme: first focus item from the plan, or fallback
  const focusItems = plan?.content?.focus || []
  const theme = focusItems[0] || "Plan your week to set a theme"

  // Tags: top habits or plan focus items
  const tags = stats?.topHabits?.length
    ? stats.topHabits.slice(0, 3).map((h) => h.name)
    : focusItems.length > 1
      ? focusItems.slice(1, 4)
      : []

  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"]

  return (
    <div className={cn("bg-[#1A1A1A] text-white p-5 rounded-2xl flex flex-col gap-4 border border-white/5", className)}>
      {/* Header */}
      <div className="flex flex-col">
        <span className="text-zinc-400 text-sm font-medium">week {weekNumber}</span>
        {isLoading ? (
          <div className="flex items-center gap-2 mt-1">
            <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
            <span className="text-zinc-500 text-sm">Loading...</span>
          </div>
        ) : (
          <h2 className="text-2xl font-bold tracking-tight">{dateRange}</h2>
        )}
      </div>

      {/* Days Row */}
      <div className="flex flex-wrap items-center gap-2 justify-between">
        {days.map((isCompleted, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-medium text-zinc-500 uppercase">
              {dayLabels[i]}
            </span>
            <div
              className={cn(
                "w-9 h-9 sm:w-11 sm:h-11 rounded-[10px] flex items-center justify-center transition-all shrink-0",
                isCompleted
                  ? "bg-[#2A1C14] border border-[#ff6a00] text-[#ff6a00]"
                  : "bg-[#111111] border border-white/10 shadow-inner"
              )}
            >
              {isCompleted && <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />}
            </div>
          </div>
        ))}
      </div>

      {/* Theme */}
      <div className="flex flex-col gap-0.5 mt-2">
        <span className="text-zinc-400 text-sm font-medium">This Week&apos;s Focus</span>
        <h3 className="text-xl font-bold line-clamp-1">{theme}</h3>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {tags.map((tag, i) => (
            <div
              key={i}
              className="px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-sm font-medium text-zinc-200 line-clamp-1"
            >
              {tag}
            </div>
          ))}
        </div>
      )}

      {/* Quick stats bar */}
      {stats && !isLoading && (
        <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-zinc-400">
          <span>{stats.tasksCompleted}/{stats.tasksTotal} tasks</span>
          <span>{stats.habitCompletionPct}% habits</span>
          <span>{stats.journalCount} journal{stats.journalCount !== 1 ? "s" : ""}</span>
        </div>
      )}
    </div>
  )
}
