'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { EnergyBadge } from '@/components/focus/energy-selector'
import { useFocusSessionController } from '@/components/focus/focus-session-provider'
import { formatTime } from '@/lib/focus-mode'
import { cn } from '@/lib/utils'
import {
  Plus,
  Square,
  AlertCircle,
  Smartphone,
  Brain,
  Bell,
  Users,
  HelpCircle,
  ExternalLink,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
} from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { getBackgroundsForMode, getDefaultBackground, type BackgroundMode } from '@/components/focus/focus-backgrounds'
import type { FocusSession, InterruptionDetail } from '@/types/database'

const INTERRUPTION_TYPES = [
  { type: 'notification' as const, label: 'Notification', icon: Bell },
  { type: 'mind_wandering' as const, label: 'Mind Wandering', icon: Brain },
  { type: 'phone' as const, label: 'Phone', icon: Smartphone },
  { type: 'external' as const, label: 'External', icon: Users },
  { type: 'other' as const, label: 'Other', icon: HelpCircle },
]



interface ActiveTimerProps {
  session: FocusSession
}

export function ActiveTimer({ session }: ActiveTimerProps) {
  const { remainingSeconds, elapsedSeconds, addInterruption, endSession, isEnding } = useFocusSessionController()
  const [showInterruptionModal, setShowInterruptionModal] = useState(false)
  const [customInterruptionText, setCustomInterruptionText] = useState('')
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [isImmersiveMode, setIsImmersiveMode] = useState(() => {
    const startedAt = new Date(session.started_at).getTime()
    return Date.now() - startedAt < 10000
  })

  const { resolvedTheme } = useTheme()
  const currentMode = (resolvedTheme === 'dark' ? 'dark' : 'light') as BackgroundMode
  const availableBackgrounds = useMemo(() => getBackgroundsForMode(currentMode), [currentMode])

  const [immersiveBg, setImmersiveBg] = useState<string>(() => getDefaultBackground(currentMode).id)

  useEffect(() => {
    if (!availableBackgrounds.find((b) => b.id === immersiveBg)) {
      setImmersiveBg(getDefaultBackground(currentMode).id)
    }
  }, [availableBackgrounds, currentMode, immersiveBg])
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rhythme-focus-sound') !== 'false'
    }
    return true
  })

  const toggleSound = useCallback(() => {
    const next = !soundEnabled
    setSoundEnabled(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('rhythme-focus-sound', String(next))
      if (next) {
        // Quick preview sound
        const audio = new Audio('/sounds/bell.mp3')
        audio.volume = 0.6
        void audio.play().catch(() => {})
      }
    }
  }, [soundEnabled])

  const activeBg = useMemo(
    () => availableBackgrounds.find((b) => b.id === immersiveBg) || getDefaultBackground(currentMode),
    [immersiveBg, availableBackgrounds, currentMode]
  )

  const toggleImmersiveMode = useCallback(() => {
    const next = !isImmersiveMode
    if (next) {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => console.error('Fullscreen request denied:', err))
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.error('Fullscreen exit denied:', err))
      }
    }
    setIsImmersiveMode(next)
  }, [isImmersiveMode])

  const interruptions = useMemo(
    () => ((session.interruption_details as InterruptionDetail[] | null) ?? []),
    [session.interruption_details]
  )

  const plannedDuration = session.planned_duration
  const taskLabel = session.custom_task_text || session.tasks?.title || 'Focus Session'
  const progress = plannedDuration > 0 ? 1 - remainingSeconds / plannedDuration : 1

  const estimatedEnd = useMemo(
    () =>
      new Date(new Date(session.started_at).getTime() + plannedDuration * 1000).toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      }),
    [plannedDuration, session.started_at]
  )

  const handleAddInterruption = useCallback(
    async (type: InterruptionDetail['type'], label?: string) => {
      const detail: InterruptionDetail = {
        type,
        label: label?.trim() || undefined,
        timestamp: new Date().toISOString(),
      }

      await addInterruption(detail)
      setShowInterruptionModal(false)
      setCustomInterruptionText('')
    },
    [addInterruption]
  )

  const handleEndEarly = useCallback(async () => {
    await endSession({
      actualDuration: elapsedSeconds,
      interruptionDetails: interruptions,
      interruptions: interruptions.length,
      reason: 'manual',
      showCompletion: true,
      metadata: {
        completed: false,
      },
    })
  }, [elapsedSeconds, endSession, interruptions])

  const size = 320
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(Math.max(progress, 0), 1))

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bg-gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-bg-gradient {
          background-size: 200% 200%;
          animation: bg-gradient-shift 15s ease infinite;
        }
      `}} />
      <div className={cn(
        isImmersiveMode 
          ? `fixed inset-0 z-[49] overflow-y-auto flex flex-col items-center justify-center p-4 sm:p-8 ${activeBg.containerClass}` 
          : "w-full max-w-4xl mx-auto space-y-6"
      )}>
      <div className={cn("w-full max-w-4xl mx-auto space-y-4 sm:space-y-6", isImmersiveMode && "my-auto flex flex-col items-center")}>
        <div className={cn("flex flex-col md:flex-row items-center justify-between gap-4", isImmersiveMode && "w-full justify-center text-center")}>
          <div className={cn(isImmersiveMode && "flex flex-col items-center")}>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Active Session
            </p>
            <h1 className={cn("font-bold tracking-tight", isImmersiveMode ? "mt-4 text-3xl sm:text-4xl text-center" : "mt-2 text-2xl")}>{taskLabel}</h1>
          </div>
          {!isImmersiveMode && (
            <Link
              href={`/dashboard/focus/${session.session_id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Session Detail
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              title={soundEnabled ? "Mute bell" : "Enable bell"}
              className={cn(
                "rounded-full text-muted-foreground hover:text-foreground shrink-0 w-9 h-9",
                isImmersiveMode ? "hidden" : "flex"
              )}
              onClick={toggleSound}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full items-center gap-2 text-muted-foreground hover:text-foreground shrink-0",
                isImmersiveMode ? "hidden" : "flex"
              )}
              onClick={toggleImmersiveMode}
            >
              <Maximize2 className="h-4 w-4" />
              Immersive Mode
            </Button>
          </div>
        </div>

        <div className={cn(
          "rounded-[28px] border border-border/60 bg-card/40 p-4 sm:p-5 shadow-sm md:p-8",
          isImmersiveMode && `w-full max-w-5xl mx-auto rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 md:p-12 ${activeBg.cardClass}`
        )}>
          <div className="grid gap-6 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
            <div className="flex flex-col items-center justify-center">
              <div className={cn("relative flex aspect-square w-full items-center justify-center mx-auto", isImmersiveMode ? "max-w-[260px] sm:max-w-[320px]" : "max-w-[280px] sm:max-w-[320px]")}>
                <svg
                  className="-rotate-90 absolute inset-0 h-full w-full"
                  viewBox={`0 0 ${size} ${size}`}
                  aria-hidden="true"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className={isImmersiveMode ? "text-zinc-800" : "text-muted/20"}
                  />
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={cn("transition-all duration-700 ease-linear", isImmersiveMode ? activeBg.ringClass : "text-primary")}
                  />
                </svg>

                <div className="flex flex-col items-center justify-center text-center">
                  <span className={cn("font-bold tracking-tight text-foreground tabular-nums", isImmersiveMode ? "text-5xl sm:text-6xl md:text-7xl" : "text-5xl sm:text-6xl")}>
                    {formatTime(remainingSeconds)}
                  </span>
                  <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    ends around {estimatedEnd}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <span>Elapsed: {formatTime(elapsedSeconds)}</span>
                {interruptions.length > 0 && (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {interruptions.length} interruption{interruptions.length !== 1 ? 's' : ''}
                  </span>
                )}
                {session.energy_start && <EnergyBadge value={session.energy_start} size="sm" />}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Session Status
                </p>
                <div className={cn("mt-3 h-1.5 overflow-hidden rounded-full", isImmersiveMode ? "bg-zinc-800" : "bg-muted/50")}>
                  <div
                    className={cn("h-full rounded-full transition-[width] duration-500 ease-out", isImmersiveMode ? "bg-zinc-300" : "bg-primary")}
                    style={{
                      width: `${Math.max(0, Math.min(100, progress * 100))}%`,
                    }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Planned</span>
                  <span className="font-medium text-foreground">{formatTime(plannedDuration)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-medium text-foreground">{formatTime(remainingSeconds)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-10 sm:h-12 rounded-full px-4 sm:px-5 text-sm w-full"
                  onClick={() => setShowInterruptionModal(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Interruption
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  className="h-10 sm:h-12 rounded-full px-4 sm:px-5 text-sm w-full"
                  disabled={isEnding}
                  onClick={() => setShowEndConfirm(true)}
                >
                  <Square className="mr-2 h-4 w-4" />
                  End Session
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {isImmersiveMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:bottom-auto md:top-6 md:left-6 md:translate-x-0 z-[120] flex items-center gap-1.5 md:gap-2 animate-in fade-in bg-black/30 backdrop-blur-xl p-2 rounded-[24px] md:rounded-full border border-white/10 max-w-[90vw] overflow-x-auto hide-scrollbar">
          {availableBackgrounds.map((bg) => (
            <button
              key={bg.id}
              onClick={() => setImmersiveBg(bg.id)}
              title={bg.name}
              className={cn(
                "shrink-0 w-6 h-6 rounded-full border-2 transition-all hover:scale-110 focus:outline-hidden focus:ring-2 focus:ring-white/50",
                immersiveBg === bg.id ? "border-white scale-110" : "border-transparent",
                bg.swatchClass
              )}
            />
          ))}
        </div>
      )}

      {isImmersiveMode && (
        <div className="fixed top-6 right-6 z-[120] flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Button
            variant="outline"
            size="icon"
            title={soundEnabled ? "Mute bell" : "Enable bell"}
            className={cn("rounded-full shadow-sm font-medium transition-colors w-9 h-9", activeBg.btnClass)}
            onClick={toggleSound}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn("rounded-full shadow-sm font-medium transition-colors", activeBg.btnClass)}
            onClick={toggleImmersiveMode}
          >
            <Minimize2 className="mr-2 h-4 w-4" />
            Exit Immersive
          </Button>
        </div>
      )}

      <Dialog open={showInterruptionModal} onOpenChange={setShowInterruptionModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">What interrupted you?</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 py-2">
            {INTERRUPTION_TYPES.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => void handleAddInterruption(item.type)}
                  className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-3 text-sm font-medium transition-colors hover:bg-muted/60"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {item.label}
                </button>
              )
            })}
          </div>
          <div className="flex gap-2">
            <Input
              value={customInterruptionText}
              onChange={(e) => setCustomInterruptionText(e.target.value)}
              placeholder="Custom reason…"
              className="text-sm"
              maxLength={80}
            />
            <Button
              size="sm"
              variant="outline"
              disabled={!customInterruptionText.trim()}
              onClick={() => void handleAddInterruption('other', customInterruptionText)}
            >
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEndConfirm} onOpenChange={setShowEndConfirm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">End session now?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            You&apos;ve focused for {formatTime(elapsedSeconds)} of your planned {formatTime(plannedDuration)}.
            You can still add your ending mood and notes right after.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowEndConfirm(false)}>
              Keep Going
            </Button>
            <Button
              variant="destructive"
              disabled={isEnding}
              onClick={() => {
                setShowEndConfirm(false)
                void handleEndEarly()
              }}
            >
              End Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </>
  )
}
