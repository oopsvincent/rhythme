/**
 * =============================================================================
 * DASHBOARD GREETING (Client Component)
 * =============================================================================
 *
 * Renders the time-aware greeting, subtitle, dynamic date illustration,
 * and the client-side smart section navigator.
 * =============================================================================
 */

"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getCalmTimeGreeting } from "@/lib/greetings/getCalmTimeGreeting"
import { getGentleSubtitle } from "@/lib/greetings/getGentleSubtitle"

interface DashboardGreetingProps {
  userName?: string | null
}

interface TimeIllustrationProps {
  hour: number
}

function TimeIllustration({ hour }: TimeIllustrationProps) {
  const isMorning = hour >= 5 && hour < 12
  const isAfternoon = hour >= 12 && hour < 17
  const isEvening = hour >= 17 && hour < 22
  const isNight = hour >= 22 || hour < 5

  // Orbit position coords
  let cx = 45
  let cy = 20
  if (isMorning) {
    cx = 25
    cy = 28
  } else if (isAfternoon) {
    cx = 45
    cy = 18
  } else if (isEvening) {
    cx = 65
    cy = 28
  } else if (isNight) {
    cx = 45
    cy = 18
  }

  return (
    <svg width="90" height="60" viewBox="0 0 90 60" className="overflow-visible select-none pointer-events-none">
      <defs>
        {/* Sun Gradient */}
        <radialGradient id="illustrationSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD066" />
          <stop offset="70%" stopColor="#E07A5F" />
          <stop offset="100%" stopColor="#C26B55" />
        </radialGradient>
        
        {/* Moon Gradient */}
        <linearGradient id="illustrationMoon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F8F4F0" />
          <stop offset="60%" stopColor="#D2C3B4" />
          <stop offset="100%" stopColor="#8FAFC9" />
        </linearGradient>

        <filter id="illustrationGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        </filter>
      </defs>

      {/* Orbit Axis Line */}
      <path
        d="M 10,48 Q 45,18 80,48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4,4"
        className="text-muted-foreground/25"
      />

      {/* Sun/Moon Body & Glow */}
      {!isNight ? (
        <>
          {/* Sun Glow */}
          <circle
            cx={cx}
            cy={cy}
            r="12"
            fill="url(#illustrationSun)"
            opacity="0.3"
            filter="url(#illustrationGlow)"
          />
          {/* Sun Core */}
          <circle cx={cx} cy={cy} r="7.5" fill="url(#illustrationSun)" />
        </>
      ) : (
        <>
          {/* Moon Glow */}
          <g filter="url(#illustrationGlow)" opacity="0.35">
            <path
              d={`M ${cx - 5},${cy - 5} A 9,9 0 1,0 ${cx + 5},${cy + 5} A 6.5,6.5 0 1,1 ${cx - 5},${cy - 5} Z`}
              fill="url(#illustrationMoon)"
            />
          </g>
          {/* Moon Core */}
          <path
            d={`M ${cx - 5},${cy - 5} A 9,9 0 1,0 ${cx + 5},${cy + 5} A 6.5,6.5 0 1,1 ${cx - 5},${cy - 5} Z`}
            fill="url(#illustrationMoon)"
          />
          {/* Sparkly night stars */}
          <circle cx="20" cy="18" r="0.8" fill="#F8F4F0" opacity="0.6" />
          <circle cx="72" cy="22" r="0.6" fill="#F8F4F0" opacity="0.8" />
          <circle cx="32" cy="30" r="0.8" fill="#F8F4F0" opacity="0.5" />
        </>
      )}

      {/* Cloud Illustration (Back) */}
      <path
        d="M 12,46 A 5,5 0 0,1 17,41 H 36 A 5,5 0 0,1 41,46 A 5,5 0 0,1 36,51 H 17 A 5,5 0 0,1 12,46 Z"
        fill="currentColor"
        className="text-card/80 dark:text-muted/20"
      />

      {/* Cloud Illustration (Front) */}
      <path
        d="M 28,49 A 6.5,6.5 0 0,1 34.5,42.5 H 62 A 6.5,6.5 0 0,1 68.5,49 A 6.5,6.5 0 0,1 62,55.5 H 34.5 A 6.5,6.5 0 0,1 28,49 Z"
        fill="currentColor"
        className="text-muted/90 dark:text-muted/40"
      />
    </svg>
  )
}

export function DashboardGreeting({ userName }: DashboardGreetingProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Minimal loading skeleton to prevent hydration flicker
  if (!mounted) {
    return (
      <div className="space-y-6 flex flex-col items-center md:items-start">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full text-center md:text-left">
          <div className="flex flex-col gap-1.5 items-center md:items-start w-full md:w-auto">
            <div className="h-9 w-72 bg-muted/30 rounded-lg animate-pulse" />
            <div className="h-5 w-60 bg-muted/20 rounded-lg animate-pulse" />
          </div>
          <div className="h-24 w-[285px] bg-muted/20 border border-border/30 rounded-3xl animate-pulse shrink-0 self-center md:self-auto" />
        </header>
        {/* Navigation pill loading placeholder (Mobile only) */}
        <div className="h-8 w-64 bg-muted/20 border border-border/20 rounded-2xl animate-pulse mx-auto lg:hidden" />
      </div>
    )
  }

  const hour = new Date().getHours()
  const greeting = getCalmTimeGreeting(userName)
  const subtitle = getGentleSubtitle()
  
  const isMorning = hour >= 5 && hour < 12
  const isAfternoon = hour >= 12 && hour < 17
  const isEvening = hour >= 17 && hour < 22
  const isNight = hour >= 22 || hour < 5

  const weekdayStr = new Date().toLocaleDateString("en-US", { weekday: "long" })
  const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })

  return (
    <div className="space-y-6 flex flex-col items-center md:items-start">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full text-center md:text-left">
        <div className="flex flex-col gap-1.5 max-w-xl items-center md:items-start w-full md:w-auto">
          <h1 className="text-3xl md:text-4xl font-semibold font-primary tracking-tight text-foreground/90 leading-tight">
            {greeting}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Illustrative Date Widget */}
        <div className="flex items-center gap-2.5 shrink-0 self-center md:self-auto">
          <div className="relative overflow-hidden rounded-3xl p-4 sm:p-5 border border-border/40 bg-card/45 backdrop-blur-md shadow-sm flex items-center justify-between gap-6 min-w-[285px] group transition-all duration-300 hover:border-primary/20">
            
            {/* Dynamic ambient color glow to match time-of-day */}
            <div className={cn(
              "absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none transition-all duration-500",
              isMorning && "bg-amber-400",
              isAfternoon && "bg-sky-400",
              isEvening && "bg-orange-500",
              isNight && "bg-indigo-400"
            )} />

            {/* Date text description */}
            <div className="flex flex-col gap-0.5 relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/70 leading-none">
                {dateStr}
              </span>
              <span className="text-xl sm:text-2xl font-bold font-primary tracking-tight text-foreground/90">
                {weekdayStr}
              </span>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground/60 leading-none mt-0.5">
                {isMorning && "A fresh start to your day"}
                {isAfternoon && "Stay steady, keep focus"}
                {isEvening && "Unwind, look back"}
                {isNight && "Time for quiet and rest"}
              </span>
            </div>

            {/* Sun/Moon Axis Illustration */}
            <div className="relative z-10 bg-muted/20 dark:bg-muted/10 p-1.5 rounded-2xl border border-border/20 shadow-inner">
              <TimeIllustration hour={hour} />
            </div>
          </div>
        </div>
      </header>

      {/* Smart Section Navigation Pill (Only visible and centered on Mobile) */}
      <div className="flex lg:hidden items-center gap-1.5 bg-muted/60 dark:bg-muted/20 border border-border/30 rounded-2xl p-1 w-fit select-none mx-auto relative z-20">
        <button
          onClick={() => document.getElementById("routines-column")?.scrollIntoView({ behavior: "smooth" })}
          className="text-[9px] sm:text-[10px] tracking-widest uppercase font-bold text-muted-foreground/80 hover:text-primary px-3 py-1.5 rounded-xl cursor-pointer hover:bg-card/40 transition-all duration-200"
        >
          Routines
        </button>
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
        <button
          onClick={() => document.getElementById("now-column")?.scrollIntoView({ behavior: "smooth" })}
          className="text-[9px] sm:text-[10px] tracking-widest uppercase font-bold text-muted-foreground/80 hover:text-primary px-3 py-1.5 rounded-xl cursor-pointer hover:bg-card/40 transition-all duration-200"
        >
          Here &amp; Now
        </button>
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
        <button
          onClick={() => document.getElementById("reflection-column")?.scrollIntoView({ behavior: "smooth" })}
          className="text-[9px] sm:text-[10px] tracking-widest uppercase font-bold text-muted-foreground/80 hover:text-primary px-3 py-1.5 rounded-xl cursor-pointer hover:bg-card/40 transition-all duration-200"
        >
          Reflection
        </button>
      </div>
    </div>
  )
}
