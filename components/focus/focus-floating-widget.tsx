'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { endFocusSession } from '@/app/actions/focusSessions'
import {
  formatTime,
  getBreakDurationSeconds,
  getFocusDurationSeconds,
  getFocusPreferences,
} from '@/lib/focus-mode'
import { useFocusStore } from '@/store/useFocusStore'
import { Button } from '@/components/ui/button'
import { Pause, Play, SkipForward, X, Minimize2, Maximize2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export function FocusFloatingWidget() {
  const pathname = usePathname()
  const router = useRouter()
  const {
    isRunning,
    sessionType,
    timeLeft,
    start,
    pause,
    switchSession,
    completeSession,
    getDisplayTime,
    markCompleted,
    activeSessionId,
    clearActiveFocusSession,
  } = useFocusStore()

  const [displayTime, setDisplayTime] = useState(timeLeft)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isExpanding, setIsExpanding] = useState(false)

  const activeSessionIdRef = useRef<number | null>(activeSessionId)
  const completionHandledRef = useRef(false)
  
  const widgetRef = useRef<HTMLDivElement>(null)
  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 })

  const preferences = getFocusPreferences()
  const phase = sessionType === 'focus' ? 'focus' : 'break'
  const focusDurationSeconds = getFocusDurationSeconds(preferences.presetId)
  const breakDurationSeconds = getBreakDurationSeconds(preferences.presetId)
  const currentDurationSeconds = phase === 'focus' ? focusDurationSeconds : breakDurationSeconds

  useEffect(() => {
    activeSessionIdRef.current = activeSessionId
  }, [activeSessionId])

  useEffect(() => {
    if (isRunning) {
      setIsDismissed(false)
    }
  }, [isRunning])

  useEffect(() => {
    let frameId = 0

    const updateTime = () => {
      const current = getDisplayTime()
      setDisplayTime(current)

      if (isRunning) {
        frameId = window.requestAnimationFrame(updateTime)
      }
    }

    if (isRunning) {
      completionHandledRef.current = false
      updateTime()
    } else {
      setDisplayTime(timeLeft)
    }

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [getDisplayTime, isRunning, timeLeft])

  useEffect(() => {
    const updateConstraints = () => {
      if (widgetRef.current) {
        const rect = widgetRef.current.getBoundingClientRect()
        setConstraints({
          left: -(window.innerWidth - rect.width - 32),
          right: 0,
          top: -(window.innerHeight - rect.height - 32),
          bottom: 0,
        })
      }
    }
    
    const t = setTimeout(updateConstraints, 100)
    window.addEventListener('resize', updateConstraints)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', updateConstraints)
    }
  }, [isMinimized, isDismissed])

  const playCompletionSound = useCallback(async () => {
    if (!preferences.soundEnabled) return

    try {
      const audio = new Audio('/sounds/bell.mp3')
      await audio.play()
    } catch {
      // Ignore autoplay errors.
    }
  }, [preferences.soundEnabled])

  const finishFocusSession = useCallback(
    async (reason: 'completed' | 'skip', actualDuration: number) => {
      const sessionId = activeSessionIdRef.current
      if (!sessionId) return

      const result = await endFocusSession({
        sessionId,
        actualDuration,
        metadata: {
          presetId: preferences.presetId,
          completed: reason === 'completed',
          endedReason: reason,
        },
      })

      if (result.error) {
        throw new Error(result.error)
      }

      clearActiveFocusSession()
    },
    [clearActiveFocusSession, preferences.presetId]
  )

  const moveToNextPhase = useCallback(
    (completed: boolean) => {
      if (phase === 'focus') {
        if (completed) {
          completeSession()
        }

        switchSession('break', breakDurationSeconds)
        return
      }

      switchSession('focus', focusDurationSeconds)
    },
    [breakDurationSeconds, completeSession, focusDurationSeconds, phase, switchSession]
  )

  const handleCompletion = useCallback(async () => {
    if (completionHandledRef.current) return
    completionHandledRef.current = true

    markCompleted()

    try {
      if (phase === 'focus') {
        await finishFocusSession('completed', focusDurationSeconds)
      }

      await playCompletionSound()
      moveToNextPhase(true)
      toast.success(phase === 'focus' ? 'Focus session completed.' : 'Break complete.')
    } catch (error) {
      console.error('Failed to complete session from widget:', error)
      toast.error('Could not finish the session cleanly.')
    }
  }, [finishFocusSession, focusDurationSeconds, markCompleted, moveToNextPhase, phase, playCompletionSound])

  useEffect(() => {
    if (!isRunning || displayTime > 0 || completionHandledRef.current) return
    void handleCompletion()
  }, [displayTime, handleCompletion, isRunning])

  const handleSkip = useCallback(async () => {
    const actualDuration = Math.max(0, currentDurationSeconds - displayTime)

    try {
      if (phase === 'focus' && activeSessionId) {
        await finishFocusSession('skip', actualDuration)
      }
    } catch (error) {
      console.error('Failed to skip from widget:', error)
      toast.error('Could not skip this session cleanly.')
      return
    }

    moveToNextPhase(false)
    completionHandledRef.current = false
  }, [activeSessionId, currentDurationSeconds, displayTime, finishFocusSession, moveToNextPhase, phase])

  const handleExpand = useCallback(() => {
    setIsExpanding(true)
    setTimeout(() => {
      router.push('/dashboard/focus')
      setTimeout(() => setIsExpanding(false), 800)
    }, 400)
  }, [router])

  if (pathname === '/dashboard/focus') return null
  if (isDismissed) return null
  if (!isRunning && !activeSessionId) return null

  return (
    <motion.div 
      ref={widgetRef}
      drag={!isExpanding}
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={constraints}
      className="fixed right-4 bottom-4 z-[100] flex flex-col cursor-grab active:cursor-grabbing"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <AnimatePresence>
        {isExpanding && (
          <motion.div
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 50, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-[-1] rounded-full bg-background/95 backdrop-blur-3xl supports-[backdrop-filter]:bg-background/80"
          />
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ opacity: isExpanding ? 0 : 1, scale: isExpanding ? 0.9 : 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
        "rounded-[24px] border border-white/20 bg-background/60 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300 ease-out",
        isMinimized ? "w-auto" : "w-[min(360px,calc(100vw-2rem))]"
      )}>
        
        {isMinimized ? (
          <div className="flex items-center gap-3 p-3">
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 pointer-events-auto" onClick={() => (isRunning ? pause() : start())}>
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </Button>
              <div className="flex flex-col mx-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">{phase}</span>
                <span className="font-bold tabular-nums text-sm leading-none">{formatTime(displayTime)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 border-l border-border/50 pl-3">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full pointer-events-auto text-muted-foreground hover:text-foreground" onClick={() => setIsMinimized(false)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full pointer-events-auto text-muted-foreground hover:text-foreground" onClick={() => setIsDismissed(true)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", isRunning ? "bg-primary animate-pulse" : "bg-muted-foreground")} />
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {phase === 'focus' ? 'Focus in progress' : 'Break in progress'}
                  </p>
                </div>
                <p className="mt-3 text-4xl font-bold tracking-tight text-foreground tabular-nums">
                  {formatTime(displayTime)}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1 pointer-events-auto">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground" onClick={() => setIsMinimized(true)}>
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground" onClick={() => setIsDismissed(true)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted/50 pointer-events-none">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                style={{
                  width: `${Math.max(0, Math.min(100, ((currentDurationSeconds - displayTime) / currentDurationSeconds) * 100))}%`,
                }}
              />
            </div>

            <div className="mt-6 flex items-center justify-between gap-2 pointer-events-auto">
              <Button size="default" className="rounded-full shadow-sm font-medium w-32" onClick={() => (isRunning ? pause() : start())}>
                {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isRunning ? 'Pause' : 'Resume'}
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-white/10 bg-background/50" onClick={() => void handleSkip()}>
                  <SkipForward className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="sm" className="rounded-full h-10 px-4 font-medium" onClick={handleExpand}>
                  Expand
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
