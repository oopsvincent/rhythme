'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  endFocusSession,
  getFocusSessions,
  startFocusSession,
} from '@/app/actions/focusSessions'
import { useTasks } from '@/hooks/use-tasks'
import {
  DEFAULT_FOCUS_PREFERENCES,
  FOCUS_PRESETS,
  formatDuration,
  formatTime,
  getBreakDurationSeconds,
  getFocusDurationSeconds,
  getFocusPreferences,
  saveFocusPreferences,
  type FocusPreferences,
  type FocusPresetId,
} from '@/lib/focus-mode'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { useFocusStore } from '@/store/useFocusStore'
import type { FocusSession } from '@/types/database'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSidebar } from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import {
  Expand,
  History,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { toast } from 'sonner'

const HISTORY_LIMIT = 8

export default function FocusTimer() {
  const {
    timeLeft,
    isRunning,
    sessionType,
    start,
    pause,
    reset,
    switchSession,
    completeSession,
    getDisplayTime,
    markCompleted,
    activeSessionId,
    activeTaskId,
    setActiveFocusSession,
    clearActiveFocusSession,
  } = useFocusStore()
  const { data: tasks = [], isLoading: tasksLoading } = useTasks()
  const { open: isSidebarOpen, setOpen: setSidebarOpen } = useSidebar()

  const [preferences, setPreferences] = useState<FocusPreferences>(DEFAULT_FOCUS_PREFERENCES)
  const [selectedTaskId, setSelectedTaskId] = useState<string>(activeTaskId ?? 'none')
  const [sessionName, setSessionName] = useState('')
  const [displayTime, setDisplayTime] = useState(timeLeft)
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const completionHandledRef = useRef(false)
  const previousSidebarOpenRef = useRef(isSidebarOpen)
  const activeSessionIdRef = useRef<number | null>(activeSessionId)
  const activeSessionNameRef = useRef(sessionName)

  const phase = sessionType === 'focus' ? 'focus' : 'break'
  const focusDurationSeconds = getFocusDurationSeconds(preferences.presetId)
  const breakDurationSeconds = getBreakDurationSeconds(preferences.presetId)
  const currentDurationSeconds = phase === 'focus' ? focusDurationSeconds : breakDurationSeconds
  const progress = currentDurationSeconds > 0 ? 1 - displayTime / currentDurationSeconds : 0
  const activeFocusSession = useMemo(
    () => sessions.find((session) => session.session_id === activeSessionId) ?? null,
    [activeSessionId, sessions]
  )
  const recentSessions = sessions.slice(0, HISTORY_LIMIT)
  const setupLocked = isRunning || Boolean(activeSessionId)

  useEffect(() => {
    setPreferences(getFocusPreferences())
  }, [])

  useEffect(() => {
    activeSessionIdRef.current = activeSessionId
  }, [activeSessionId])

  useEffect(() => {
    activeSessionNameRef.current = sessionName
  }, [sessionName])

  useEffect(() => {
    if (selectedTaskId === 'none' && activeTaskId) {
      setSelectedTaskId(activeTaskId)
    }
  }, [activeTaskId, selectedTaskId])

  useEffect(() => {
    if (!activeFocusSession) return

    const metadata = activeFocusSession.metadata
    const savedName =
      metadata && typeof metadata === 'object' && typeof metadata.name === 'string'
        ? metadata.name.trim()
        : ''

    if (savedName && !sessionName.trim()) {
      setSessionName(savedName)
    }

    if (activeFocusSession.task_id && selectedTaskId === 'none') {
      setSelectedTaskId(String(activeFocusSession.task_id))
    }
  }, [activeFocusSession, selectedTaskId, sessionName])

  const loadSessions = useCallback(async () => {
    setIsLoadingHistory(true)
    try {
      const result = await getFocusSessions(24)
      if (result.error) throw new Error(result.error)
      setSessions(result.data ?? [])
    } catch (error) {
      console.error('Failed to load focus sessions:', error)
      toast.error('Could not load recent focus sessions.')
    } finally {
      setIsLoadingHistory(false)
    }
  }, [])

  useEffect(() => {
    void loadSessions()
  }, [loadSessions])

  useEffect(() => {
    const supabase = createClient()
    let mounted = true
    let channel: ReturnType<typeof supabase.channel> | null = null

    void supabase.auth.getUser().then(({ data }) => {
      if (!mounted || !data.user) return

      channel = supabase
        .channel(`focus-sessions-${data.user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'focus_sessions',
            filter: `user_id=eq.${data.user.id}`,
          },
          () => {
            void loadSessions()
          }
        )
        .subscribe()
    })

    return () => {
      mounted = false
      if (channel) {
        void supabase.removeChannel(channel)
      }
    }
  }, [loadSessions])

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

  const playCompletionSound = useCallback(async () => {
    if (!preferences.soundEnabled) return
    try {
      const audio = new Audio('/sounds/bell.mp3')
      await audio.play()
    } catch {
      // Ignore autoplay errors.
    }
  }, [preferences.soundEnabled])

  const syncEndedFocusSession = useCallback(
    async (reason: 'completed' | 'reset' | 'skip', actualDuration: number) => {
      const sessionId = activeSessionIdRef.current
      if (!sessionId) return

      const metadata: Record<string, unknown> = {
        name: activeSessionNameRef.current.trim() || null,
        presetId: preferences.presetId,
        completed: reason === 'completed',
        endedReason: reason,
      }

      const result = await endFocusSession({
        sessionId,
        actualDuration,
        moodAfter: 3,
        metadata,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      clearActiveFocusSession()
      await loadSessions()
    },
    [clearActiveFocusSession, loadSessions, preferences.presetId]
  )

  const moveToNextPhase = useCallback(
    (completed: boolean) => {
      if (phase === 'focus') {
        if (completed) {
          completeSession()
        }
        switchSession('break', breakDurationSeconds)
        setSessionName('')
        return
      }

      switchSession('focus', focusDurationSeconds)
    },
    [breakDurationSeconds, completeSession, focusDurationSeconds, phase, switchSession]
  )

  const handleSessionCompletion = useCallback(async () => {
    if (completionHandledRef.current) return
    completionHandledRef.current = true

    markCompleted()

    try {
      if (phase === 'focus') {
        await syncEndedFocusSession('completed', focusDurationSeconds)
      }

      await playCompletionSound()
      moveToNextPhase(true)
      toast.success(phase === 'focus' ? 'Focus session completed.' : 'Break complete. Back to focus.')
    } catch (error) {
      console.error('Failed to finish session:', error)
      toast.error('We could not finish the session cleanly.')
    }
  }, [focusDurationSeconds, markCompleted, moveToNextPhase, phase, playCompletionSound, syncEndedFocusSession])

  useEffect(() => {
    if (!isRunning || displayTime > 0 || completionHandledRef.current) return
    void handleSessionCompletion()
  }, [displayTime, handleSessionCompletion, isRunning])

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement)
      setIsFullscreen(active)

      if (!active) {
        setSidebarOpen(previousSidebarOpenRef.current)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [setSidebarOpen])

  const beginFocusSession = useCallback(async () => {
    setIsSaving(true)

    try {
      const result = await startFocusSession({
        taskId: selectedTaskId === 'none' ? null : selectedTaskId,
        plannedDuration: focusDurationSeconds,
        metadata: {
          name: sessionName.trim() || null,
          presetId: preferences.presetId,
        },
      })

      if (result.error || !result.data) {
        throw new Error(result.error ?? 'Could not start focus session')
      }

      setActiveFocusSession(
        result.data.session_id,
        result.data.task_id !== null ? String(result.data.task_id) : null
      )
      start()
    } catch (error) {
      console.error('Failed to start focus session:', error)
      toast.error('We could not start the focus session.')
    } finally {
      setIsSaving(false)
    }
  }, [focusDurationSeconds, preferences.presetId, selectedTaskId, sessionName, setActiveFocusSession, start])

  const handlePlayPause = useCallback(async () => {
    if (isRunning) {
      pause()
      return
    }

    if (phase === 'focus' && !activeSessionId) {
      await beginFocusSession()
      return
    }

    start()
  }, [activeSessionId, beginFocusSession, isRunning, pause, phase, start])

  const handleReset = useCallback(async () => {
    const actualDuration = Math.max(0, currentDurationSeconds - displayTime)

    try {
      if (phase === 'focus' && activeSessionId) {
        await syncEndedFocusSession('reset', actualDuration)
        setSessionName('')
      }
    } catch (error) {
      console.error('Failed to reset focus session:', error)
      toast.error('Reset failed to save cleanly.')
      return
    }

    reset(currentDurationSeconds)
    completionHandledRef.current = false
  }, [activeSessionId, currentDurationSeconds, displayTime, phase, reset, syncEndedFocusSession])

  const handleSkip = useCallback(async () => {
    const actualDuration = Math.max(0, currentDurationSeconds - displayTime)

    try {
      if (phase === 'focus' && activeSessionId) {
        await syncEndedFocusSession('skip', actualDuration)
        setSessionName('')
      }
    } catch (error) {
      console.error('Failed to skip focus session:', error)
      toast.error('Skip failed to save cleanly.')
      return
    }

    moveToNextPhase(false)
    completionHandledRef.current = false
  }, [activeSessionId, currentDurationSeconds, displayTime, moveToNextPhase, phase, syncEndedFocusSession])

  const handleToggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return

    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }

    previousSidebarOpenRef.current = isSidebarOpen
    setSidebarOpen(false)

    try {
      await containerRef.current.requestFullscreen()
    } catch (error) {
      console.error('Failed to enter fullscreen:', error)
      setSidebarOpen(previousSidebarOpenRef.current)
      toast.error('Fullscreen is not available here.')
    }
  }, [isSidebarOpen, setSidebarOpen])

  const handlePresetChange = useCallback(
    (presetId: FocusPresetId) => {
      const nextPreferences = {
        ...preferences,
        presetId,
      }

      setPreferences(nextPreferences)
      saveFocusPreferences(nextPreferences)

      if (phase === 'focus') {
        switchSession('focus', getFocusDurationSeconds(presetId))
      } else {
        switchSession('break', getBreakDurationSeconds(presetId))
      }
    },
    [phase, preferences, switchSession]
  )

  const handleSoundToggle = useCallback(
    (checked: boolean) => {
      const nextPreferences = {
        ...preferences,
        soundEnabled: checked,
      }

      setPreferences(nextPreferences)
      saveFocusPreferences(nextPreferences)
    },
    [preferences]
  )

  const sessionHeading = phase === 'focus' ? 'Focus' : 'Break'

  if (isFullscreen) {
    return (
      <div
        ref={containerRef}
        className="flex h-screen w-full items-center justify-center overflow-hidden bg-background px-6 py-10"
      >
        <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-12 text-center">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-6 top-6 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => void handleToggleFullscreen()}
          >
            <Minimize2 className="mr-2 h-4 w-4" />
            Exit fullscreen
          </Button>

          <h1 className="text-4xl font-bold tracking-tight">DEEP FOCUS</h1>

          <TimerDial
            progress={progress}
            time={formatTime(displayTime)}
            label={sessionName.trim() || sessionHeading}
            fullscreen
          />

          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className="h-14 min-w-40 rounded-full text-base"
              disabled={isSaving}
              onClick={() => void handlePlayPause()}
            >
              {isRunning ? <><Pause className="mr-2 h-5 w-5" /> Pause</> : <><Play className="mr-2 h-5 w-5" /> Start</>}
            </Button>
            <ActionIconButton label="Reset" onClick={() => void handleReset()}>
              <RotateCcw className="h-5 w-5" />
            </ActionIconButton>
            <ActionIconButton label="Skip" onClick={() => void handleSkip()}>
              <SkipForward className="h-5 w-5" />
            </ActionIconButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        ref={containerRef}
        className="flex w-full flex-1 flex-col items-center justify-center px-4 py-6 md:py-12"
      >
        <div className="w-full max-w-md space-y-8 md:space-y-12">
          {/* Header with Actions */}
          <div className="flex w-full items-center justify-end gap-2 px-2">
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setShowHistory(true)}>
              <History className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setShowSettings(true)}>
              <Settings2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Main Timer Area */}
          <div className="flex flex-col items-center justify-center gap-8">
            <TimerDial
              progress={progress}
              time={formatTime(displayTime)}
              label={sessionHeading}
            />

            <div className="flex items-center justify-center gap-3">
              <Button
                size="lg"
                className="h-12 min-w-32 rounded-full font-medium"
                disabled={isSaving}
                onClick={() => void handlePlayPause()}
              >
                {isRunning ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </>
                )}
              </Button>

              <ActionIconButton label="Reset" onClick={() => void handleReset()}>
                <RotateCcw className="h-4 w-4" />
              </ActionIconButton>
              <ActionIconButton label="Skip" onClick={() => void handleSkip()}>
                <SkipForward className="h-4 w-4" />
              </ActionIconButton>
              <ActionIconButton label="Fullscreen" onClick={() => void handleToggleFullscreen()}>
                <Expand className="h-4 w-4" />
              </ActionIconButton>
            </div>
          </div>

          {/* Session Setup */}
          <div className="w-full space-y-4 pt-4">
            <div className="space-y-2">
              <Input
                disabled={setupLocked}
                value={sessionName}
                onChange={(event) => setSessionName(event.target.value)}
                placeholder="What are you focusing on? (Optional)"
                className="h-12 border-0 border-b border-border/40 bg-transparent px-2 text-center text-lg font-medium shadow-none focus-visible:ring-0 rounded-none md:text-xl"
                maxLength={80}
              />
            </div>
            
            <Select
              disabled={setupLocked || tasksLoading}
              value={selectedTaskId}
              onValueChange={setSelectedTaskId}
            >
              <SelectTrigger className="mx-auto w-auto max-w-full border-0 bg-transparent px-2 text-center text-sm font-medium text-muted-foreground shadow-none hover:text-foreground focus:ring-0 md:text-base">
                <SelectValue placeholder="Link a task (Optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No linked task</SelectItem>
                {tasks.map((task) => (
                  <SelectItem key={task.task_id} value={task.task_id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Focus settings</DialogTitle>
            <DialogDescription>
              Configure your focus mode rhythm and preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground">Timer preset</p>
                <p className="text-sm text-muted-foreground">
                  Choose the rhythm you want before the next session begins.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(FOCUS_PRESETS).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    disabled={setupLocked}
                    onClick={() => handlePresetChange(option.id)}
                    className={cn(
                      'flex flex-col items-start justify-center rounded-2xl border p-4 text-left transition',
                      preferences.presetId === option.id
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border bg-background text-foreground hover:border-primary/30 hover:bg-muted/30',
                      setupLocked && 'cursor-not-allowed opacity-60'
                    )}
                  >
                    <span className="font-medium">{option.label}</span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      {option.focusMinutes}m focus • {option.breakMinutes}m break
                    </span>
                  </button>
                ))}
              </div>
              {setupLocked ? (
                <p className="text-xs text-muted-foreground">
                  Finish or reset the current session before changing presets.
                </p>
              ) : null}
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Completion sound</p>
                <p className="text-sm text-muted-foreground">
                  Play a soft bell when a session ends.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {preferences.soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                )}
                <Switch checked={preferences.soundEnabled} onCheckedChange={handleSoundToggle} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recent sessions</DialogTitle>
            <DialogDescription>
              Your recent focus blocks.
            </DialogDescription>
          </DialogHeader>

          <HistoryList isLoading={isLoadingHistory} sessions={recentSessions} />
        </DialogContent>
      </Dialog>
    </>
  )
}

function TimerDial({
  progress,
  time,
  label,
  fullscreen = false,
}: {
  progress: number
  time: string
  label: string
  fullscreen?: boolean
}) {
  const size = 320
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(Math.max(progress, 0), 1))

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full aspect-square',
        fullscreen
          ? 'w-[min(75vh,480px)] max-w-[85vw]'
          : 'w-[min(75vw,320px)] max-w-full'
      )}
    >
      <svg className="-rotate-90 absolute inset-0 h-full w-full" viewBox={`0 0 ${size} ${size}`} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
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
        <span className={cn('font-bold tracking-tight text-foreground tabular-nums', fullscreen ? 'text-6xl sm:text-7xl md:text-9xl' : 'text-5xl sm:text-6xl md:text-7xl')}>
          {time}
        </span>
        {label ? <span className="mt-2 text-xs sm:text-sm font-medium tracking-wide text-muted-foreground uppercase">{label}</span> : null}
      </div>
    </div>
  )
}

function ActionIconButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-border/60 bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={label} onClick={onClick}>
      {children}
    </Button>
  )
}

function HistoryList({
  isLoading,
  sessions,
}: {
  isLoading: boolean
  sessions: FocusSession[]
}) {
  if (isLoading) {
    return (
      <div className="space-y-3 py-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-2xl bg-muted/40" />
        ))}
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No recent focus sessions found.
      </div>
    )
  }

  return (
    <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto pr-2">
      {sessions.map((session) => {
        const metadata = session.metadata
        const sessionName =
          metadata && typeof metadata === 'object' && typeof metadata.name === 'string'
            ? metadata.name
            : ''
        const actualDuration = session.actual_duration ?? session.planned_duration
        const completed = Boolean(session.ended_at) && actualDuration >= session.planned_duration

        return (
          <div
            key={session.session_id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-border/40 bg-muted/10 p-4 transition-colors hover:bg-muted/20"
          >
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-foreground">
                {sessionName.trim() || session.tasks?.title || 'Focused session'}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(session.started_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-medium text-foreground">
                {formatDuration(actualDuration)}
              </span>
              <span className={cn('h-2 w-2 rounded-full', completed ? 'bg-primary' : 'bg-muted-foreground/40')} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
