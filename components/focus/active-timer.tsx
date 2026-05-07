'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { EnergyBadge } from '@/components/focus/energy-selector'
import { updateFocusSession } from '@/app/actions/focusSessions'
import { formatTime } from '@/lib/focus-mode'
import { cn } from '@/lib/utils'
import {
  Pause,
  Play,
  Plus,
  Square,
  AlertCircle,
  Smartphone,
  Brain,
  Bell,
  Users,
  HelpCircle,
} from 'lucide-react'
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
  onSessionEnd: (actualDuration: number, interruptions: InterruptionDetail[]) => void
}

export function ActiveTimer({ session, onSessionEnd }: ActiveTimerProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [showInterruptionModal, setShowInterruptionModal] = useState(false)
  const [customInterruptionText, setCustomInterruptionText] = useState('')
  const [interruptions, setInterruptions] = useState<InterruptionDetail[]>(
    (session.interruption_details as InterruptionDetail[]) ?? []
  )
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [displaySeconds, setDisplaySeconds] = useState(0)

  const startedAtRef = useRef(new Date(session.started_at).getTime())
  const pausedAtRef = useRef<number | null>(null)
  const totalPausedRef = useRef(0)
  const frameRef = useRef(0)

  const plannedDuration = session.planned_duration
  const taskLabel = session.custom_task_text || session.tasks?.title || 'Focus Session'

  // Timer logic
  const getElapsedSeconds = useCallback(() => {
    const now = isPaused && pausedAtRef.current ? pausedAtRef.current : Date.now()
    const elapsed = Math.floor((now - startedAtRef.current - totalPausedRef.current) / 1000)
    return Math.max(0, elapsed)
  }, [isPaused])

  const getRemainingSeconds = useCallback(() => {
    return Math.max(0, plannedDuration - getElapsedSeconds())
  }, [plannedDuration, getElapsedSeconds])

  // Animation frame loop for timer
  useEffect(() => {
    const tick = () => {
      const remaining = getRemainingSeconds()
      setDisplaySeconds(remaining)

      if (remaining <= 0) {
        // Timer completed naturally
        onSessionEnd(plannedDuration, interruptions)
        return
      }

      if (!isPaused) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    if (!isPaused) {
      frameRef.current = requestAnimationFrame(tick)
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [isPaused, getRemainingSeconds, plannedDuration, onSessionEnd, interruptions])

  // Update display when paused
  useEffect(() => {
    if (isPaused) {
      setDisplaySeconds(getRemainingSeconds())
    }
  }, [isPaused, getRemainingSeconds])

  // Play completion sound when timer hits 0
  useEffect(() => {
    if (displaySeconds === 0) {
      try {
        const audio = new Audio('/sounds/bell.mp3')
        audio.play().catch(() => {})
      } catch {
        // Ignore autoplay errors
      }
    }
  }, [displaySeconds])

  const handlePause = useCallback(() => {
    pausedAtRef.current = Date.now()
    setIsPaused(true)
  }, [])

  const handleResume = useCallback(() => {
    if (pausedAtRef.current) {
      totalPausedRef.current += Date.now() - pausedAtRef.current
      pausedAtRef.current = null
    }
    setIsPaused(false)
  }, [])

  const handleAddInterruption = useCallback(
    async (type: InterruptionDetail['type'], label?: string) => {
      const detail: InterruptionDetail = {
        type,
        label: label?.trim() || undefined,
        timestamp: new Date().toISOString(),
      }

      const updated = [...interruptions, detail]
      setInterruptions(updated)
      setShowInterruptionModal(false)
      setCustomInterruptionText('')

      // Persist to DB
      try {
        await updateFocusSession(session.session_id, {
          interruptions: updated.length,
          interruptionDetails: updated,
        })
      } catch {
        // Non-critical, local state is source of truth during active session
      }
    },
    [interruptions, session.session_id]
  )

  const handleEndEarly = useCallback(() => {
    const actualDuration = getElapsedSeconds()
    onSessionEnd(actualDuration, interruptions)
  }, [getElapsedSeconds, interruptions, onSessionEnd])

  // Timer progress
  const progress = plannedDuration > 0 ? 1 - displaySeconds / plannedDuration : 1

  // Calculate estimated end time
  const estimatedEnd = new Date(
    Date.now() + displaySeconds * 1000
  ).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

  const size = 320
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(Math.max(progress, 0), 1))

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-6 animate-in fade-in-0 duration-300">
        {/* Task Label */}
        <div className="absolute top-8 left-0 right-0 text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider truncate px-8 max-w-lg mx-auto">
            {taskLabel}
          </p>
          {session.energy_start && (
            <div className="mt-2 flex justify-center">
              <EnergyBadge value={session.energy_start} />
            </div>
          )}
        </div>

        {/* Timer Dial */}
        <div className="relative flex items-center justify-center aspect-square w-[min(75vw,320px)] max-w-full">
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
              className="text-muted/20"
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
              className="text-primary transition-all duration-1000 ease-linear"
            />
          </svg>

          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-6xl sm:text-7xl font-bold tracking-tight text-foreground tabular-nums">
              {formatTime(displaySeconds)}
            </span>
            <span className="mt-2 text-xs text-muted-foreground">
              {isPaused ? 'PAUSED' : `ends ~${estimatedEnd}`}
            </span>
          </div>
        </div>

        {/* Elapsed info */}
        <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
          <span>Elapsed: {formatTime(getElapsedSeconds())}</span>
          {interruptions.length > 0 && (
            <span className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {interruptions.length} interruption{interruptions.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center gap-3">
          {/* Pause / Resume */}
          <Button
            size="lg"
            className="h-14 min-w-36 rounded-full text-base font-semibold"
            onClick={isPaused ? handleResume : handlePause}
          >
            {isPaused ? (
              <>
                <Play className="mr-2 h-5 w-5" />
                Resume
              </>
            ) : (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </>
            )}
          </Button>

          {/* Add Interruption */}
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => setShowInterruptionModal(true)}
            title="Log interruption"
          >
            <Plus className="h-5 w-5" />
          </Button>

          {/* End Session Early */}
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full text-destructive hover:bg-destructive/10 border-destructive/30"
            onClick={() => setShowEndConfirm(true)}
            title="End session early"
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Interruption Modal */}
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
                  onClick={() => handleAddInterruption(item.type)}
                  className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-3 text-sm font-medium hover:bg-muted/60 transition-colors"
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
              onClick={() => handleAddInterruption('other', customInterruptionText)}
            >
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* End Session Confirmation */}
      <Dialog open={showEndConfirm} onOpenChange={setShowEndConfirm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">End session early?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            You've focused for {formatTime(getElapsedSeconds())} of your planned {formatTime(plannedDuration)}.
            You'll still get to log your ending mood.
          </p>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setShowEndConfirm(false)}>
              Continue
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowEndConfirm(false)
                handleEndEarly()
              }}
            >
              End Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
