'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Coffee, Play, Pause, SkipForward, X, GripHorizontal, Eye, EyeOff } from 'lucide-react'
import { useFocusStore, SessionType } from '@/store/useFocusStore'
import { formatTime } from '@/lib/focus-storage'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const STORAGE_KEY = 'focus-widget-position'
const VISIBILITY_KEY = 'focus-widget-visible'

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

export function FocusFloatingWidget() {
  const router = useRouter()
  const pathname = usePathname()
  const { isRunning, sessionType, timeLeft, getDisplayTime, start, pause, switchSession } = useFocusStore()
  
  const [position, setPosition] = React.useState<Position>({ x: 20, y: 100 })
  const [isDragging, setIsDragging] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(true)
  const [displayTime, setDisplayTime] = React.useState(timeLeft)
  const [mounted, setMounted] = React.useState(false)
  
  const dragRef = React.useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null)
  const widgetRef = React.useRef<HTMLDivElement>(null)

  // Load saved position and visibility on mount
  React.useEffect(() => {
    setMounted(true)
    const savedPos = localStorage.getItem(STORAGE_KEY)
    const savedVis = localStorage.getItem(VISIBILITY_KEY)
    
    if (savedPos) {
      try {
        const parsed = JSON.parse(savedPos)
        setPosition(parsed)
      } catch {}
    }
    
    if (savedVis !== null) {
      setIsVisible(savedVis === 'true')
    }
  }, [])

  // Update display time using requestAnimationFrame
  React.useEffect(() => {
    let animationId: number
    
    const updateDisplay = () => {
      setDisplayTime(getDisplayTime())
      if (isRunning) {
        animationId = requestAnimationFrame(updateDisplay)
      }
    }
    
    if (isRunning) {
      updateDisplay()
    } else {
      setDisplayTime(timeLeft)
    }
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [isRunning, timeLeft, getDisplayTime])

  // Save position to localStorage
  const savePosition = React.useCallback((pos: Position) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos))
  }, [])

  // Toggle visibility
  const toggleVisibility = React.useCallback(() => {
    const newVis = !isVisible
    setIsVisible(newVis)
    localStorage.setItem(VISIBILITY_KEY, String(newVis))
  }, [isVisible])

  // Drag handlers
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
    
    const newX = Math.max(0, Math.min(window.innerWidth - 150, dragRef.current.startPosX + deltaX))
    const newY = Math.max(0, Math.min(window.innerHeight - 60, dragRef.current.startPosY + deltaY))
    
    setPosition({ x: newX, y: newY })
  }, [isDragging])

  const handleDragEnd = React.useCallback(() => {
    if (isDragging) {
      savePosition(position)
    }
    setIsDragging(false)
    dragRef.current = null
  }, [isDragging, position, savePosition])

  // Attach global listeners for drag
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

  // Don't render on focus page (main timer is visible)
  const isOnFocusPage = pathname?.startsWith('/dashboard/focus')
  
  // Don't render during SSR
  if (!mounted) return null
  
  // Only show when timer has been started at least once (timeLeft < initial value or isRunning)
  const hasActiveSession = isRunning || timeLeft < 25 * 60

  // Check if widget is on the right half of screen
  const isOnRightSide = mounted && position.x > window.innerWidth / 2

  const config = sessionConfig[sessionType]

  // Show/Hide toggle button when widget is hidden
  if (!isVisible) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "fixed z-50 p-2 rounded-full shadow-lg border backdrop-blur-sm",
                "bg-background/80 hover:bg-background transition-colors",
                config.borderColor
              )}
              style={{ left: position.x, top: position.y }}
              onClick={toggleVisibility}
            >
              <Eye className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="right">
            Show focus timer
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Don't show on focus page when visible
  if (isOnFocusPage) return null
  
  // Don't show if no active session
  if (!hasActiveSession) return null

  return (
    <AnimatePresence>
      <motion.div
        ref={widgetRef}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          boxShadow: isDragging ? '0 8px 32px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.1)'
        }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
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
                    const nextType = sessionType === 'focus' ? 'short_break' : 'focus'
                    const nextDuration = nextType === 'focus' ? 25 * 60 : 5 * 60
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
          
          {/* Hide button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={toggleVisibility}
                >
                  <EyeOff className="w-3 h-3 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Hide widget
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
