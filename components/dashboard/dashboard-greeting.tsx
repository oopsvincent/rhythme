/**
 * =============================================================================
 * DASHBOARD GREETING (Client Component)
 * =============================================================================
 *
 * Renders the time-aware greeting, subtitle, time icon, and formatted date.
 * This MUST be a client component so it uses the browser's local time,
 * not the server's timezone.
 * =============================================================================
 */

"use client"

import { useState, useEffect } from "react"
import { Sun, CloudSun, Sunset, Moon } from "lucide-react"
import { getCalmTimeGreeting } from "@/lib/greetings/getCalmTimeGreeting"
import { getGentleSubtitle } from "@/lib/greetings/getGentleSubtitle"

interface DashboardGreetingProps {
  userName?: string | null
}

function getTimeIcon(hour: number) {
  if (hour >= 5 && hour < 12) return CloudSun
  if (hour >= 12 && hour < 17) return Sun
  if (hour >= 17 && hour < 22) return Sunset
  return Moon
}

export function DashboardGreeting({ userName }: DashboardGreetingProps) {
  // Use state to avoid hydration mismatch — render neutral on first paint,
  // then update to the correct local-time values after mount.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Before mount, render a minimal skeleton to avoid hydration mismatch
  if (!mounted) {
    return (
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="h-8 w-64 bg-muted/30 rounded-lg animate-pulse" />
          <div className="h-5 w-48 bg-muted/20 rounded-lg animate-pulse" />
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm shrink-0">
          <div className="h-7 w-7 bg-muted/30 rounded-full animate-pulse" />
          <div className="h-4 w-36 bg-muted/20 rounded animate-pulse" />
        </div>
      </header>
    )
  }

  const hour = new Date().getHours()
  const TimeIcon = getTimeIcon(hour)
  const greeting = getCalmTimeGreeting(userName)
  const subtitle = getGentleSubtitle()
  const dateString = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl md:text-3xl font-semibold font-primary tracking-tight text-foreground/90">
          {greeting}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {subtitle}
        </p>
      </div>
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm shrink-0">
        <div className="p-1.5 bg-primary/10 rounded-full text-primary">
          <TimeIcon className="w-4 h-4" />
        </div>
        <div className="text-sm font-medium text-muted-foreground/80">
          {dateString}
        </div>
      </div>
    </header>
  )
}
