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
import { motion } from "framer-motion"
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
  const isEvening = hour >= 17 && hour < 19
  const isNight = hour >= 19 || hour < 5

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
  const [subtitle, setSubtitle] = useState("")

  useEffect(() => {
    setMounted(true)
    const subtitles = [
      "Your rhythm feels steady today. Protect your focus and move with intention.",
      "One quiet step at a time. The work will find its shape.",
      "Be proud of your quiet progress. Steady efforts compound over time.",
      "Deep work comes from a calm mind. Give yourself space to think.",
      "Focus on what matters today, and let go of the noise.",
      "A productive day starts with a peaceful mind. Take it slow.",
      "Protect your energy. Quality of attention exceeds quantity of hours.",
      "Find your tempo. There is no need to rush to be productive.",
      "Sustain your momentum with gentle breaks. Rest is part of the work.",
      "Clear skies, clear mind. Center yourself and begin when ready."
    ];
    // Stable but changing index using day + hour
    const index = (new Date().getDate() + new Date().getHours()) % subtitles.length;
    setSubtitle(subtitles[index]);
  }, [])

  // Minimal loading skeleton to prevent hydration flicker
  if (!mounted) {
    return (
      <div className="space-y-4 flex flex-col items-center md:items-start w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full text-center md:text-left">
          <div className="flex flex-col gap-1.5 items-center md:items-start w-full md:w-auto">
            <div className="h-8 w-64 bg-muted/30 rounded-lg animate-pulse" />
            <div className="h-5 w-48 bg-muted/20 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-24 bg-muted/20 rounded-lg animate-pulse self-center md:self-auto" />
        </header>
      </div>
    )
  }

  const hour = new Date().getHours()
  const greeting = getCalmTimeGreeting(userName)

  const weekdayStr = new Date().toLocaleDateString("en-US", { weekday: "long" })
  const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })

  return (
    <div className="w-full select-none">
      <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4 w-full">
        <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left max-w-xl w-full md:w-auto">
          <h1 className="text-2xl md:text-3xl font-semibold font-primary tracking-tight text-foreground/90 leading-tight">
            {greeting}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Clean, minimalist date display */}
        <div className="flex flex-col items-center md:items-end shrink-0 select-none bg-muted/20 border border-border/20 px-4 py-2 rounded-2xl">
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80">
            {dateStr}
          </span>
          <span className="text-sm font-bold font-primary text-foreground/90 mt-0.5">
            {weekdayStr}
          </span>
        </div>
      </div>
    </div>
  )
}
