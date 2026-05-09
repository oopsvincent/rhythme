'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useFocusSessionController } from '@/components/focus/focus-session-provider'
import { formatTime } from '@/lib/focus-mode'
import { PauseCircle, Square, X, Minimize2, Maximize2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { InterruptionDetail } from '@/types/database'

export function FocusFloatingWidget() {
  const pathname = usePathname()
  const router = useRouter()
  const { activeSession, remainingSeconds, elapsedSeconds, endSession, isEnding } = useFocusSessionController()
  const [isDismissed, setIsDismissed] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isExpanding, setIsExpanding] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)
  const constraintsRef = useRef<HTMLDivElement>(null)

  const taskLabel = useMemo(
    () => activeSession?.custom_task_text || activeSession?.tasks?.title || 'Focus Session',
    [activeSession]
  )

  useEffect(() => {
    if (activeSession) {
      setIsDismissed(false)
      setConfirmEnd(false)
    }
  }, [activeSession])

  const handleExpand = useCallback(() => {
    setIsExpanding(true)
    window.setTimeout(() => {
      router.push('/dashboard/focus')
      window.setTimeout(() => setIsExpanding(false), 800)
    }, 400)
  }, [router])

  const [confirmEnd, setConfirmEnd] = useState(false)

  const handleQuickEnd = useCallback(async () => {
    if (!activeSession) return

    try {
      await endSession({
        actualDuration: elapsedSeconds,
        interruptionDetails: (activeSession.interruption_details as InterruptionDetail[] | null) ?? [],
        interruptions: activeSession.interruptions ?? 0,
        reason: 'widget',
        showCompletion: false,
        metadata: {
          endedFromWidget: true,
          completed: false,
        },
      })
      toast.success('Focus session ended.')
    } catch (error) {
      console.error('Failed to end focus session from widget:', error)
      toast.error('Could not end the active session.')
    }
  }, [activeSession, elapsedSeconds, endSession])

  if (pathname === '/dashboard/focus') return null
  if (isDismissed) return null
  if (!activeSession) return null

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-4 pointer-events-none z-[-1]" />
      <motion.div
        ref={widgetRef}
        drag={!isExpanding}
        dragMomentum={false}
        dragElastic={0.05}
        dragConstraints={constraintsRef}
        className="fixed bottom-4 right-4 z-[100] flex cursor-grab flex-col active:cursor-grabbing select-none touch-none"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <motion.div
        animate={{ opacity: isExpanding ? 0 : 1, scale: isExpanding ? 0.92 : 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'overflow-hidden rounded-[24px] border border-white/20 bg-background/70 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] backdrop-blur-3xl transition-all duration-300 ease-out',
          isMinimized ? 'w-auto' : 'w-[min(360px,calc(100vw-2rem))]'
        )}
      >
        {isMinimized ? (
          <div className="flex items-center gap-3 p-3">
            <div className="mx-2 flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Focus
              </span>
              <span className="text-sm font-bold leading-none tabular-nums">{formatTime(remainingSeconds)}</span>
            </div>
            <div className="flex items-center gap-1 border-l border-border/50 pl-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => setIsMinimized(false)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => setIsDismissed(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Focus in progress
                  </p>
                </div>
                <p className="mt-2 truncate text-sm text-muted-foreground">{taskLabel}</p>
                <p className="mt-3 text-4xl font-bold tracking-tight text-foreground tabular-nums">
                  {formatTime(remainingSeconds)}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMinimized(true)}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => setIsDismissed(true)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted/50">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                style={{
                  width: `${Math.max(0, Math.min(100, (elapsedSeconds / activeSession.planned_duration) * 100))}%`,
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Elapsed {formatTime(elapsedSeconds)}</span>
            </div>

            <div className="mt-6 flex items-center justify-between gap-2">
              <Button
                variant={confirmEnd ? "destructive" : "outline"}
                size={confirmEnd ? "default" : "icon"}
                className={cn("h-10 rounded-full transition-all", confirmEnd ? "px-4" : "w-10 border-white/10 bg-background/50")}
                disabled={isEnding}
                onClick={() => {
                  if (confirmEnd) {
                    void handleQuickEnd()
                  } else {
                    setConfirmEnd(true)
                    setTimeout(() => setConfirmEnd(false), 3000)
                  }
                }}
              >
                {confirmEnd ? (
                  <span className="text-sm font-medium">Confirm End</span>
                ) : (
                  <Square className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-10 rounded-full px-4 font-medium"
                onClick={handleExpand}
              >
                <PauseCircle className="mr-2 h-4 w-4" />
                Open Focus
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
    </>
  )
}
