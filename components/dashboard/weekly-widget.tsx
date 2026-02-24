"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface WeeklyWidgetProps {
  weekNumber?: number
  dateRange?: string
  theme?: string
  tags?: string[]
  className?: string
}

export function WeeklyWidget({
  weekNumber = 6,
  dateRange = "Feb 3 - Feb 9",
  theme = "Focus on deep work",
  tags = ["Launch MVP", "Run 5k", "Read book"],
  className,
}: WeeklyWidgetProps) {
  // Dummy data for days: true = completed, false = not completed
  const days = [true, false, false, true, false, false, false]

  return (
    <div className={cn("bg-[#1A1A1A] text-white p-5 rounded-2xl flex flex-col gap-4 border border-white/5", className)}>
      {/* Header */}
      <div className="flex flex-col">
        <span className="text-zinc-400 text-sm font-medium">week {weekNumber}</span>
        <h2 className="text-2xl font-bold tracking-tight">{dateRange}</h2>
      </div>

      {/* Days Row */}
      <div className="flex items-center gap-2 justify-between">
        {days.map((isCompleted, i) => (
          <div
            key={i}
            className={cn(
              "w-10 h-10 sm:w-11 sm:h-11 rounded-[10px] flex items-center justify-center transition-all",
              isCompleted 
                ? "bg-[#2A1C14] border border-[#ff6a00] text-[#ff6a00]" 
                : "bg-[#111111] border border-white/10 shadow-inner"
            )}
          >
            {isCompleted && <Check className="w-5 h-5 stroke-[3]" />}
          </div>
        ))}
      </div>

      {/* Theme */}
      <div className="flex flex-col gap-0.5 mt-2">
        <span className="text-zinc-400 text-sm font-medium">This Week's Theme</span>
        <h3 className="text-xl font-bold">{theme}</h3>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 mt-1">
        {tags.map((tag, i) => (
          <div
            key={i}
            className="px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-sm font-medium text-zinc-200"
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  )
}
