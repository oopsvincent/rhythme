'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Coffee, Play, Pause, SkipForward, X, GripHorizontal, EyeOff } from 'lucide-react'
import { useFocusStore, SessionType } from '@/store/useFocusStore'
import { formatTime, getFocusData } from '@/lib/focus-storage'
import { saveSession, getDeviceId } from '@/lib/focus/focus-db'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'

const STORAGE_KEY = 'focus-widget-position'
const DISMISSED_KEY = 'focus-widget-dismissed'

interface Position {
  x: number
  y: number
}

const sessionConfig: Record<SessionType, { label: string; color: string; bgColor: string; borderColor: string }> = {
  focus: { 
    label: 'Focus', 
    color: 'text-orange-500', 
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30'
  },
  short_break: { 
    label: 'Break', 
    color: 'text-green-500', 
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30'
  },
  long_break: { 
    label: 'Long Break', 
    color: 'text-blue-500', 
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
}

// Padding from viewport edges
const EDGE_PADDING = 8

export function FocusFloatingWidget() {
  const router = useRouter()
  const pathname = usePathname()
  const { 
    isRunning, sessionType, timeLeft, sessionsCompleted,
    getDisplayTime, start, pause, switchSession, markCompleted, completeSession 
  } = useFocusStore()
  
  const [position, setPosition] = React.useState<Position>({ x: 20, y: 100 })
  const [isDragging, setIsDragging] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isDismissed, setIsDismissed] = React.useState(false)
  const [displayTime, setDisplayTime] = React.useState(timeLeft)
  const [mounted, setMounted] = React.useState(false)
  const [isBouncing, setIsBouncing] = React.useState(false)
  
  const dragRef = React.useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null)
  const widgetRef = React.useRef<HTMLDivElement>(null)
  const completedRef = React.useRef(false)
  const prevIsRunningRef = React.useRef(false)

  // --- Clamp position to keep widget fully within the viewport ---
  const clampPosition = React.useCallback((pos: Position): Position => {
    if (typeof window === 'undefined' || !widgetRef.current) return pos

    const rect = widgetRef.current.getBoundingClientRect()
    const w = rect.width
    const h = rect.height

    const maxX = window.innerWidth - w - EDGE_PADDING
    const maxY = window.innerHeight - h - EDGE_PADDING

    return {
      x: Math.max(EDGE_PADDING, Math.min(maxX, pos.x)),
      y: Math.max(EDGE_PADDING, Math.min(maxY, pos.y)),
    }
  }, [])

  // --- Load saved position and dismissed state on mount ---
  React.useEffect(() => {
    setMounted(true)
    const savedPos = localStorage.getItem(STORAGE_KEY)
    const savedDismissed = localStorage.getItem(DISMISSED_KEY)
    
    if (savedPos) {
      try {
        const parsed = JSON.parse(savedPos)
        setPosition(parsed)
      } catch {}
    }
    
    if (savedDismissed === 'true') {
      setIsDismissed(true)
    }
  }, [])

  // --- Clamp position after mount and on window resize ---
  React.useEffect(() => {
    if (!mounted || !widgetRef.current) return

    // Clamp once after first render to fix stale saved positions
    const timer = setTimeout(() => {
      setPosition(prev => {
        const clamped = clampPosition(prev)
        if (clamped.x !== prev.x || clamped.y !== prev.y) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(clamped))
        }
        return clamped
      })
    }, 100)

    const handleResize = () => {
      setPosition(prev => clampPosition(prev))
    }

    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [mounted, clampPosition])

  // --- Auto-show when a session starts (un-dismiss) ---
  React.useEffect(() => {
    if (isRunning && !prevIsRunningRef.current && isDismissed) {
      setIsDismissed(false)
      localStorage.setItem(DISMISSED_KEY, 'false')
    }
    prevIsRunningRef.current = isRunning
  }, [isRunning, isDismissed])

  // --- Update display time + detect completion (background timer) ---
  React.useEffect(() => {
    let animationId: number
    
    const updateDisplay = () => {
      const current = getDisplayTime()
      setDisplayTime(current)

      // Background completion detection
      if (isRunning && current <= 0 && !completedRef.current) {
        completedRef.current = true
        handleWidgetSessionComplete()
      }

      if (isRunning) {
        animationId = requestAnimationFrame(updateDisplay)
      }
    }
    
    if (isRunning) {
      completedRef.current = false
      updateDisplay()
    } else {
      setDisplayTime(timeLeft)
    }
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [isRunning, timeLeft, getDisplayTime])

  // --- Handle session completion from the widget (background) ---
  const handleWidgetSessionComplete = React.useCallback(async () => {
    const settings = getFocusData().settings

    // Play bell sound
    if (settings.soundEnabled) {
      try {
        const audio = new Audio('/sounds/bell.mp3')
        await audio.play()
      } catch {}
    }

    // Browser notification
    try {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('Focus Timer', {
            body: `${sessionConfig[sessionType].label} session completed!`,
            icon: '/favicon.ico',
          })
        } else if (Notification.permission !== 'denied') {
          const perm = await Notification.requestPermission()
          if (perm === 'granted') {
            new Notification('Focus Timer', {
              body: `${sessionConfig[sessionType].label} session completed!`,
              icon: '/favicon.ico',
            })
          }
        }
      }
    } catch {}

    markCompleted()

    // Save session to IndexedDB
    const getDuration = (type: SessionType): number => {
      switch (type) {
        case 'focus': return settings.focusDuration
        case 'short_break': return settings.shortBreakDuration
        case 'long_break': return settings.longBreakDuration
      }
    }

    const duration = getDuration(sessionType) * 60
    try {
      await saveSession({
        type: sessionType,
        duration,
        completedAt: new Date().toISOString(),
        interrupted: false,
        deviceId: getDeviceId(),
      })
    } catch (error) {
      console.error('Failed to save session:', error)
    }

    completeSession()

    // Determine next session
    if (sessionType === 'focus') {
      const newCount = sessionsCompleted + 1
      if (newCount % (settings.sessionsUntilLongBreak || 4) === 0) {
        switchSession('long_break', getDuration('long_break') * 60)
      } else {
        switchSession('short_break', getDuration('short_break') * 60)
      }
      if (settings.autoStartBreaks) {
        setTimeout(() => start(), 1000)
      }
    } else {
      switchSession('focus', getDuration('focus') * 60)
      if (settings.autoStartFocus) {
        setTimeout(() => start(), 1000)
      }
    }

    toast.success(`${sessionConfig[sessionType].label} completed!`)
  }, [sessionType, sessionsCompleted, markCompleted, completeSession, switchSession, start])

  // --- Save position to localStorage ---
  const savePosition = React.useCallback((pos: Position) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos))
  }, [])

  // --- Dismiss widget ---
  const dismiss = React.useCallback(() => {
    setIsDismissed(true)
    localStorage.setItem(DISMISSED_KEY, 'true')
  }, [])

  // --- Drag handlers ---
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      startPosX: position.x,
      startPosY: position.y,
    }
    setIsDragging(true)
  }

  const handleDragMove = React.useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragRef.current || !isDragging) return
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    const deltaX = clientX - dragRef.current.startX
    const deltaY = clientY - dragRef.current.startY
    
    // Allow free movement during drag (no clamping while dragging — clamp on release)
    const newX = dragRef.current.startPosX + deltaX
    const newY = dragRef.current.startPosY + deltaY
    
    setPosition({ x: newX, y: newY })
  }, [isDragging])

  const handleDragEnd = React.useCallback(() => {
    if (isDragging) {
      // Clamp position to viewport and animate bounce-back if needed
      const clamped = clampPosition(position)
      const didBounce = clamped.x !== position.x || clamped.y !== position.y

      if (didBounce) {
        setIsBouncing(true)
        setTimeout(() => setIsBouncing(false), 500)
      }

      setPosition(clamped)
      savePosition(clamped)
    }
    setIsDragging(false)
    dragRef.current = null
  }, [isDragging, position, savePosition, clampPosition])

  // --- Attach global listeners for drag ---
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('touchmove', handleDragMove)
      window.addEventListener('touchend', handleDragEnd)
    }
    
    return () => {
      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchmove', handleDragMove)
      window.removeEventListener('touchend', handleDragEnd)
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  // --- Don't render during SSR ---
  if (!mounted) return null

  // --- Never render on focus page (main timer UI is there) ---
  const isOnFocusPage = pathname?.startsWith('/dashboard/focus')
  if (isOnFocusPage) return null
  
  // --- Don't render if dismissed ---
  if (isDismissed) return null

  // --- Only show when timer has been started at least once ---
  const hasActiveSession = isRunning || timeLeft < 25 * 60
  if (!hasActiveSession) return null

  // Check if widget is on the right half of screen
  const isOnRightSide = position.x > window.innerWidth / 2

  const config = sessionConfig[sessionType]

  return (
    <AnimatePresence>
      <motion.div
        ref={widgetRef}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: isBouncing ? [1, 1.08, 0.95, 1.02, 1] : 1,
          y: 0,
          x: 0,
          boxShadow: isDragging ? '0 8px 32px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.1)'
        }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={
          isBouncing 
            ? { scale: { duration: 0.4, ease: 'easeOut' }, type: 'spring', damping: 20, stiffness: 300 }
            : { type: 'spring', damping: 20, stiffness: 300 }
        }
        className={cn(
          "fixed z-50 select-none",
          "rounded-2xl border shadow-lg backdrop-blur-xl",
          "bg-background/95",
          config.borderColor,
          isDragging && "cursor-grabbing"
        )}
        style={{ 
          left: position.x, 
          top: position.y,
          touchAction: 'none'
        }}
      >
        {/* Main widget content */}
        <div className={cn(
          "flex items-center gap-2 p-2",
          isOnRightSide ? "flex-row-reverse pl-2 pr-3" : "pr-3 pl-2"
        )}>
          {/* Drag handle */}
          <div
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted/50 transition-colors"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <GripHorizontal className="w-4 h-4 text-muted-foreground" />
          </div>
          
          {/* Session indicator */}
          <div className={cn("p-1.5 rounded-lg", config.bgColor)}>
            {sessionType === 'focus' ? (
              <Brain className={cn("w-4 h-4", config.color)} />
            ) : (
              <Coffee className={cn("w-4 h-4", config.color)} />
            )}
          </div>
          
          {/* Timer display */}
          <button
            onClick={() => router.push('/dashboard/focus')}
            className="text-lg font-mono font-bold tabular-nums hover:text-primary transition-colors"
          >
            {formatTime(displayTime)}
          </button>
          
          {/* Controls (expanded) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex items-center gap-1 overflow-hidden"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => isRunning ? pause() : start()}
                >
                  {isRunning ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    const settings = getFocusData().settings
                    const nextType = sessionType === 'focus' ? 'short_break' : 'focus'
                    const nextDuration = nextType === 'focus' 
                      ? settings.focusDuration * 60 
                      : settings.shortBreakDuration * 60
                    switchSession(nextType, nextDuration)
                  }}
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Expand/collapse toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isExpanded ? (
                <X className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3" />
              )}
            </motion.div>
          </Button>
          
          {/* Dismiss button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={dismiss}
                >
                  <EyeOff className="w-3 h-3 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Dismiss widget
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Running indicator pulse */}
        {isRunning && (
          <motion.div
            className={cn(
              "absolute -top-1 w-3 h-3 rounded-full",
              isOnRightSide ? "-left-1" : "-right-1",
              sessionType === 'focus' ? 'bg-orange-500' : 'bg-green-500'
            )}
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
