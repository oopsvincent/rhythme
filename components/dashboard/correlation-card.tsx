"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface CorrelationCardProps {
  headline: string
  detail: string
  trend: "up" | "down" | "neutral"
  className?: string
}

const trendConfig = {
  up: {
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  down: {
    icon: TrendingDown,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
  },
  neutral: {
    icon: Minus,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
}

export function CorrelationCard({
  headline,
  detail,
  trend,
  className,
}: CorrelationCardProps) {
  const { icon: Icon, color, bg } = trendConfig[trend]

  return (
    <div
      className={cn(
        "glass-card rounded-xl p-5 flex items-start gap-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01]",
        className
      )}
    >
      <div
        className={cn(
          "shrink-0 flex items-center justify-center w-10 h-10 rounded-lg",
          bg
        )}
      >
        <Icon className={cn("w-5 h-5", color)} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-sm font-semibold leading-snug">{headline}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {detail}
        </p>
      </div>
    </div>
  )
}
