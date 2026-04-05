'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight, Brain, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getSessionsForMonth, FocusSessionRecord } from '@/lib/focus/focus-db'
import { formatDuration } from '@/lib/focus-storage'

interface FocusHeatmapCalendarProps {
  className?: string
}

export function FocusHeatmapCalendar({ className }: FocusHeatmapCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [sessions, setSessions] = React.useState<FocusSessionRecord[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedDay, setSelectedDay] = React.useState<number | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Load sessions for current month
  React.useEffect(() => {
    async function loadSessions() {
      setIsLoading(true)
      try {
        const monthSessions = await getSessionsForMonth(year, month)
        setSessions(monthSessions)
      } catch (error) {
        console.error('Failed to load sessions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSessions()
  }, [year, month])

  // Calculate focus time per day
  const focusTimeByDay = React.useMemo(() => {
    const map: Record<number, number> = {}
    sessions
      .filter(s => s.type === 'focus' && !s.interrupted)
      .forEach(s => {
        const day = new Date(s.completedAt).getDate()
        map[day] = (map[day] || 0) + s.duration
      })
    return map
  }, [sessions])

  // Get max focus time for color scaling
  const maxFocusTime = React.useMemo(() => {
    const times = Object.values(focusTimeByDay)
    return times.length > 0 ? Math.max(...times) : 0
  }, [focusTimeByDay])

  // Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDay(null)
  }
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDay(null)
  }

  // Calendar grid
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Get intensity class based on focus time
  const getIntensityClass = (focusTime: number): string => {
    if (!focusTime || maxFocusTime === 0) return ''
    const ratio = focusTime / maxFocusTime
    if (ratio >= 0.75) return 'bg-primary text-primary-foreground'
    if (ratio >= 0.5) return 'bg-primary/70 text-primary-foreground'
    if (ratio >= 0.25) return 'bg-primary/40'
    return 'bg-primary/20'
  }

  // Get sessions for selected day
  const selectedDaySessions = selectedDay
    ? sessions.filter(s => new Date(s.completedAt).getDate() === selectedDay)
    : []

  const selectedDayFocusTime = selectedDay ? (focusTimeByDay[selectedDay] || 0) : 0
  const selectedDaySessionCount = selectedDay
    ? selectedDaySessions.filter(s => s.type === 'focus' && !s.interrupted).length
    : 0

  return (
    <div className={cn("space-y-3", className)}>
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">{monthName}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          onClick={nextMonth}
          disabled={isCurrentMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs text-muted-foreground font-medium py-1">
            {day}
          </div>
        ))}
        
        {/* Empty cells before first day */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const focusTime = focusTimeByDay[day] || 0
          const isToday = isCurrentMonth && day === today.getDate()
          const isSelected = selectedDay === day
          const isFuture = isCurrentMonth && day > today.getDate()
          
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              disabled={isFuture || isLoading}
              className={cn(
                "relative h-8 w-full rounded-md text-xs font-medium transition-all",
                "hover:ring-2 hover:ring-primary/50 focus:outline-none focus:ring-2 focus:ring-primary",
                "disabled:pointer-events-none disabled:opacity-50",
                getIntensityClass(focusTime),
                !focusTime && "hover:bg-muted/50",
                isToday && "ring-1 ring-primary",
                isSelected && "ring-2 ring-primary scale-105"
              )}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-muted/50" />
        <div className="w-3 h-3 rounded-sm bg-primary/20" />
        <div className="w-3 h-3 rounded-sm bg-primary/40" />
        <div className="w-3 h-3 rounded-sm bg-primary/70" />
        <div className="w-3 h-3 rounded-sm bg-primary" />
        <span>More</span>
      </div>

      {/* Selected Day Details */}
      {selectedDay && (
        <div className="rounded-lg bg-card/40 backdrop-blur-sm border border-border/50 shadow-sm p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {new Date(year, month, selectedDay).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => setSelectedDay(null)}
            >
              <span className="text-xs">✕</span>
            </Button>
          </div>
          
          {selectedDaySessionCount > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Brain className="h-4 w-4 text-primary" />
                <span>{selectedDaySessionCount} sessions</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatDuration(selectedDayFocusTime)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No focus sessions</p>
          )}
        </div>
      )}

      {/* Monthly Summary */}
      <div className="text-center pt-2 border-t border-border/50">
        <div className="text-2xl font-bold text-primary">
          {formatDuration(Object.values(focusTimeByDay).reduce((a, b) => a + b, 0))}
        </div>
        <div className="text-xs text-muted-foreground">Total focus time this month</div>
      </div>
    </div>
  )
}
