'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  getFocusData, 
  saveFocusData, 
  formatTime, 
  formatDuration,
  FocusSettings,
  FocusStats
} from '@/lib/focus-storage'
import { useFocusStore, SessionType } from '@/store/useFocusStore'
import { 
  getDeviceId, 
  getDeviceName, 
  setDeviceName, 
  clearAllSessions,
} from '@/lib/focus/focus-db'
import {
  clearFocusSessions,
  endFocusSession,
  getFocusSessions,
  startFocusSession,
  updateFocusSession,
} from '@/app/actions/focusSessions'
import { createClient } from '@/lib/supabase/client'
import { useTasks } from '@/hooks/use-tasks'
import type { FocusSession } from '@/types/database'
import { useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Settings, 
  Coffee, 
  Brain,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  History,
  BarChart3,
  Monitor,
  X,
  Clock,
  Calendar,
  Target,
  Zap,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from '@/components/ui/drawer'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/database'

const sessionConfig: Record<SessionType, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  focus: { 
    label: 'Focus', 
    color: 'text-orange-500', 
    bgColor: 'bg-orange-500/10',
    icon: <Brain className="w-5 h-5" /> 
  },
  short_break: { 
    label: 'Short Break', 
    color: 'text-green-500', 
    bgColor: 'bg-green-500/10',
    icon: <Coffee className="w-5 h-5" /> 
  },
  long_break: { 
    label: 'Long Break', 
    color: 'text-blue-500', 
    bgColor: 'bg-blue-500/10',
    icon: <Coffee className="w-5 h-5" /> 
  },
}

const moodOptions = [
  { label: 'Wiped', value: 0.01 },
  { label: 'Heavy', value: 0.12 },
  { label: 'Uneasy', value: 0.23 },
  { label: 'Flat', value: 0.34 },
  { label: 'Steady', value: 0.45 },
  { label: 'Calm', value: 0.56 },
  { label: 'Bright', value: 0.67 },
  { label: 'Focused', value: 0.78 },
  { label: 'Upbeat', value: 0.89 },
  { label: 'Electric', value: 1.0 },
] as const

export default function FocusTimer() {
  type SyncedFocusSession = FocusSession & {
    duration: number
    completedAt: string
  }

  // Settings & stats from localStorage
  const [settings, setSettings] = useState<FocusSettings | null>(null)
  const [stats, setStats] = useState<FocusStats | null>(null)
  
  // Timer state from Zustand (persisted)
  const {
    timeLeft,
    isRunning,
    sessionType,
    sessionsCompleted,
    start,
    pause,
    reset,
    switchSession,
    completeSession,
    getDisplayTime,
    markCompleted,
    activeSessionId,
    activeTaskId,
    interruptions,
    setActiveFocusSession,
    incrementInterruptions,
    clearActiveFocusSession,
  } = useFocusStore()
  const { data: tasks = [], isLoading: tasksLoading } = useTasks()
  
  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [deviceNameInput, setDeviceNameInput] = useState('')
  const [todaySessionCount, setTodaySessionCount] = useState(0)
  const [allSessions, setAllSessions] = useState<SyncedFocusSession[]>([])
  const [displayTime, setDisplayTime] = useState(25 * 60)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(activeTaskId)
  const [moodBefore, setMoodBefore] = useState<number | null>(null)
  const [moodAfter, setMoodAfter] = useState<number | null>(null)
  const [energyLevel, setEnergyLevel] = useState<number | null>(null)
  const [isSyncingSession, setIsSyncingSession] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'live' | 'saving' | 'error'>('idle')
  
  // Sidebar control for fullscreen
  const sidebarContext = useSidebar()
  const prevSidebarState = useRef<boolean>(true)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const completedRef = useRef(false)

  // Retired local-only notice.
  useEffect(() => {
    if (localStorage.getItem('focus-local-notice-shown') === 'legacy') {
      toast.info('Focus sessions are stored locally on this device only—no cross-device sync.', {
        duration: 5000,
      })
      localStorage.setItem('focus-local-notice-shown', 'true')
    }
  }, [])

  // Load timer preferences from localStorage and focus sessions from Supabase.
  useEffect(() => {
    const data = getFocusData()
    setSettings(data.settings)
    setStats(data.stats)
    
    // Load device name
    const storedName = getDeviceName()
    if (storedName) setDeviceNameInput(storedName)
    
    // Load sessions
    loadSessions()
  }, [])

  useEffect(() => {
    if (!selectedTaskId && activeTaskId) {
      setSelectedTaskId(activeTaskId)
    }
  }, [activeTaskId, selectedTaskId])

  useEffect(() => {
    let mounted = true
    const supabase = createClient()
    let channel: ReturnType<typeof supabase.channel> | null = null

    supabase.auth.getUser().then(({ data }) => {
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
            setSyncStatus('live')
            loadSessions()
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') setSyncStatus('live')
        })
    })

    return () => {
      mounted = false
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  const loadSessions = async () => {
    try {
      const result = await getFocusSessions(50)
      if (result.error) throw new Error(result.error)

      const sessions = (result.data || []).map((session) => ({
        ...session,
        duration: session.actual_duration ?? session.planned_duration,
        completedAt: session.ended_at || session.started_at,
      }))
      const today = new Date().toDateString()
      setTodaySessionCount(
        sessions.filter((session) =>
          session.ended_at &&
          new Date(session.ended_at).toDateString() === today
        ).length
      )
      setAllSessions(sessions)
    } catch (error) {
      console.error('Failed to load sessions:', error)
      setSyncStatus('error')
    }
  }

  // Display timer update - uses requestAnimationFrame for smooth updates without state churning
  useEffect(() => {
    let animationId: number
    
    const updateDisplay = () => {
      const current = getDisplayTime()
      setDisplayTime(current)
      
      // Check for completion
      if (isRunning && current <= 0 && !completedRef.current) {
        completedRef.current = true
        handleSessionComplete()
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

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false)
        sidebarContext.setOpen(prevSidebarState.current)
      }
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [sidebarContext])

  const handleSessionComplete = useCallback(async () => {
    // Guard: if the widget already completed this session, the store's isRunning is false
    const storeState = useFocusStore.getState()
    if (!storeState.isRunning && storeState.timeLeft === 0) return

    // Play sound
    if (settings?.soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
    
    markCompleted()
    
    const duration = getDuration(sessionType) * 60
    if (sessionType === 'focus' && activeSessionId) {
      setSyncStatus('saving')
      try {
        const result = await endFocusSession({
          sessionId: activeSessionId,
          actualDuration: duration,
          moodAfter,
          interruptions,
          metadata: {
            completed: true,
            sessionType,
            deviceId: getDeviceId(),
            moodAfterScore: moodAfter,
          },
        })

        if (result.error) throw new Error(result.error)

        clearActiveFocusSession()
        setMoodAfter(null)
        await loadSessions()
        setSyncStatus('live')
      } catch (error) {
        console.error('Failed to save focus session:', error)
        setSyncStatus('error')
        toast.error('Session finished locally, but database sync failed.')
      }
    }
    
    // Update localStorage stats
    const data = getFocusData()
    if (sessionType === 'focus') {
      data.stats.totalFocusTime += duration
      data.stats.totalSessions += 1
      data.stats.completedToday += 1
      data.stats.currentStreak += 1
      if (data.stats.currentStreak > data.stats.longestStreak) {
        data.stats.longestStreak = data.stats.currentStreak
      }
    }
    saveFocusData(data)
    setStats(data.stats)
    
    completeSession()
    
    // Determine next session
    if (sessionType === 'focus') {
      const newCount = sessionsCompleted + 1
      
      if (newCount % (settings?.sessionsUntilLongBreak || 4) === 0) {
        handleSwitchSession('long_break')
      } else {
        handleSwitchSession('short_break')
      }
      
      if (settings?.autoStartBreaks) {
        setTimeout(() => start(), 1000)
      }
    } else {
      handleSwitchSession('focus')
      if (settings?.autoStartFocus) {
        setTimeout(() => start(), 1000)
      }
    }
    
    toast.success(`${sessionConfig[sessionType].label} completed!`)
  }, [sessionType, settings, sessionsCompleted, completeSession, start, markCompleted, activeSessionId, moodAfter, interruptions, clearActiveFocusSession])

  const getDuration = (type: SessionType): number => {
    if (!settings) return type === 'focus' ? 25 : type === 'short_break' ? 5 : 15
    switch (type) {
      case 'focus': return settings.focusDuration
      case 'short_break': return settings.shortBreakDuration
      case 'long_break': return settings.longBreakDuration
    }
  }

  const handleSwitchSession = (type: SessionType) => {
    switchSession(type, getDuration(type) * 60)
  }

  const toggleTimer = async () => {
    if (isRunning) {
      if (sessionType === 'focus' && activeSessionId) {
        const nextInterruptions = incrementInterruptions()
        updateFocusSession(activeSessionId, { interruptions: nextInterruptions }).catch((error) => {
          console.error('Failed to update interruptions:', error)
        })
      }
      pause()
    } else {
      if (sessionType === 'focus' && !activeSessionId) {
        if (!selectedTaskId) {
          toast.error('Choose a task before starting focus.')
          return
        }

        setIsSyncingSession(true)
        setSyncStatus('saving')
        const result = await startFocusSession({
          taskId: selectedTaskId,
          plannedDuration: getDuration('focus') * 60,
          moodBefore: scoreToLegacyLevel(moodBefore),
          energyLevel: scoreToLegacyLevel(energyLevel),
          metadata: {
            sessionType,
            deviceId: getDeviceId(),
            moodBeforeScore: moodBefore,
            energyLevelScore: energyLevel,
          },
        })
        setIsSyncingSession(false)

        if (result.error || !result.data) {
          setSyncStatus('error')
          toast.error(result.error || 'Failed to start focus session.')
          return
        }

        setActiveFocusSession(result.data.session_id, selectedTaskId)
        setSyncStatus('live')
        await loadSessions()
      }
      start()
    }
  }

  const resetTimer = async () => {
    if (sessionType === 'focus' && activeSessionId) {
      const actualDuration = getDuration('focus') * 60 - getDisplayTime()
      setSyncStatus('saving')
      const result = await endFocusSession({
        sessionId: activeSessionId,
        actualDuration,
        moodAfter,
        interruptions: interruptions + 1,
        metadata: {
          completed: false,
          reset: true,
          sessionType,
          deviceId: getDeviceId(),
          moodAfterScore: moodAfter,
        },
      })

      if (result.error) {
        setSyncStatus('error')
        toast.error(result.error)
      } else {
        clearActiveFocusSession()
        setMoodAfter(null)
        setSyncStatus('live')
        await loadSessions()
      }
    }
    reset(getDuration(sessionType) * 60)
  }

  const skipSession = async () => {
    if (sessionType === 'focus' && activeSessionId) {
      const actualDuration = getDuration('focus') * 60 - getDisplayTime()
      const result = await endFocusSession({
        sessionId: activeSessionId,
        actualDuration,
        moodAfter,
        interruptions: interruptions + (isRunning ? 1 : 0),
        metadata: {
          completed: false,
          skipped: true,
          sessionType,
          deviceId: getDeviceId(),
          moodAfterScore: moodAfter,
        },
      })

      if (result.error) {
        setSyncStatus('error')
        toast.error(result.error)
      } else {
        clearActiveFocusSession()
        setMoodAfter(null)
        setSyncStatus('live')
        await loadSessions()
      }
    }
    pause()
    handleSwitchSession(sessionType === 'focus' ? 'short_break' : 'focus')
  }

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      prevSidebarState.current = sidebarContext.open
      sidebarContext.setOpen(false)
      
      try {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } catch (error) {
        sidebarContext.setOpen(prevSidebarState.current)
        console.error('Fullscreen failed:', error)
      }
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
      sidebarContext.setOpen(prevSidebarState.current)
    }
  }

  const updateSetting = <K extends keyof FocusSettings>(key: K, value: FocusSettings[K]) => {
    if (!settings) return
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    const data = getFocusData()
    data.settings = newSettings
    saveFocusData(data)
    
    if (
      !isRunning && (
        (key === 'focusDuration' && sessionType === 'focus') ||
        (key === 'shortBreakDuration' && sessionType === 'short_break') ||
        (key === 'longBreakDuration' && sessionType === 'long_break')
      )
    ) {
      reset((value as number) * 60)
    }
  }

  const handleSaveDeviceName = () => {
    if (deviceNameInput.trim()) {
      setDeviceName(deviceNameInput.trim())
      toast.success('Device name saved')
    }
  }

  // Calculate progress
  const totalTime = getDuration(sessionType) * 60
  const progress = ((totalTime - displayTime) / totalTime) * 100

  const config = sessionConfig[sessionType]

  // Format session date for history
  const formatSessionDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Group sessions by date
  const groupedSessions = allSessions.reduce((groups, session) => {
    const dateKey = new Date(session.ended_at || session.started_at).toDateString()
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(session)
    return groups
  }, {} as Record<string, SyncedFocusSession[]>)

  const selectedTask = tasks.find((task) => String(task.task_id) === selectedTaskId)
  const completedFocusSeconds = allSessions.reduce(
    (sum, session) => sum + (session.actual_duration ?? 0),
    0
  )

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className={cn(
      "relative flex min-h-[70vh] flex-col items-center justify-center transition-all",
      isFullscreen && "fixed inset-0 z-50 min-h-screen bg-background px-6"
    )}>
      {/* Audio element for notification */}
      <audio ref={audioRef} src="/sounds/bell.mp3" preload="auto" />

      {!isFullscreen && (
        <FocusSessionPanel
          activeSessionId={activeSessionId}
          energyLevel={energyLevel}
          isRunning={isRunning}
          moodAfter={moodAfter}
          moodBefore={moodBefore}
          selectedTask={selectedTask}
          selectedTaskId={selectedTaskId}
          setEnergyLevel={setEnergyLevel}
          setMoodAfter={setMoodAfter}
          setMoodBefore={setMoodBefore}
          setSelectedTaskId={setSelectedTaskId}
          syncStatus={syncStatus}
          tasks={tasks}
          tasksLoading={tasksLoading}
        />
      )}
      
      {/* Fullscreen exit button */}
      {isFullscreen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-50"
        >
          <X className="w-6 h-6" />
        </Button>
      )}
      
      <FocusModeTabs
        isFullscreen={isFullscreen}
        isRunning={isRunning}
        onSwitch={handleSwitchSession}
        sessionType={sessionType}
      />

      <FocusTimerDial
        config={config}
        displayTime={displayTime}
        isFullscreen={isFullscreen}
        progress={progress}
        selectedTask={selectedTask}
        sessionNumber={sessionsCompleted + 1}
      />

      <FocusControls
        isRunning={isRunning}
        isSyncingSession={isSyncingSession}
        onReset={resetTimer}
        onSkip={skipSession}
        onToggle={toggleTimer}
      />

      {/* Action Bar */}
      <div className={cn("flex items-center gap-3", isFullscreen && "hidden")}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
        >
          {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
        
        {/* History Dialog - Enhanced */}
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <History className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Focus History</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="stats" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/50">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{todaySessionCount}</div>
                      <div className="text-xs text-muted-foreground">Sessions Today</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/50">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <Clock className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{formatDuration(completedFocusSeconds)}</div>
                      <div className="text-xs text-muted-foreground">Focus Time</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/50">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <Zap className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats?.currentStreak || 0}</div>
                      <div className="text-xs text-muted-foreground">Current Streak</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/50">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Calendar className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{allSessions.length}</div>
                      <div className="text-xs text-muted-foreground">Total Sessions</div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Focus Time</span>
                    <span className="font-medium">{formatDuration(completedFocusSeconds)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Longest Streak</span>
                    <span className="font-medium">{stats?.longestStreak || 0} sessions</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Device</span>
                    <span className="font-medium truncate max-w-[150px]">{getDeviceName() || 'Not named'}</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="sessions" className="mt-4">
                <ScrollArea className="h-[300px] pr-4">
                  {Object.keys(groupedSessions).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Clock className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm">No sessions yet</p>
                      <p className="text-xs">Complete a focus session to see it here</p>
                    </div>
                  ) : (
                    Object.entries(groupedSessions).map(([date, sessions]) => (
                      <div key={date} className="mb-4">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                            {formatSessionDate(sessions[0].ended_at || sessions[0].started_at)}
                        </h4>
                        <div className="space-y-2">
                          {sessions.map((session) => {
                              const isInterrupted = (session.interruptions || 0) > 0 || !session.ended_at
                            return (
                                <div key={session.session_id} className={`flex items-center gap-3 p-3 rounded-lg ${sessionConfig.focus.bgColor}`}>
                                  <div className={sessionConfig.focus.color}>{sessionConfig.focus.icon}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                      <span className="truncate text-sm font-medium">{session.tasks?.title || 'Focus session'}</span>
                                      {isInterrupted && (
                                      <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-600">
                                        Interrupted
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatDuration(session.duration)} • {new Date(session.completedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
        
        {/* Settings Drawer - Bottom slide with full customization */}
        <Drawer open={showSettings} onOpenChange={setShowSettings}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader className="text-left">
              <DrawerTitle>Timer Settings</DrawerTitle>
              <DrawerDescription>
                Customize your focus timer experience
              </DrawerDescription>
            </DrawerHeader>
            
            <ScrollArea className="flex-1 px-4 pb-4">
              <Tabs defaultValue="durations" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="durations">Durations</TabsTrigger>
                  <TabsTrigger value="behavior">Behavior</TabsTrigger>
                  <TabsTrigger value="data">Data</TabsTrigger>
                </TabsList>
                
                {/* Durations Tab */}
                <TabsContent value="durations" className="space-y-6">
                  {/* Focus Duration */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-base font-medium">Focus Duration</Label>
                        <p className="text-xs text-muted-foreground">Time for concentrated work</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={settings.focusDuration}
                          onChange={(e) => updateSetting('focusDuration', Math.min(120, Math.max(1, parseInt(e.target.value) || 1)))}
                          className="w-16 h-8 text-center"
                          min={1}
                          max={120}
                        />
                        <span className="text-sm text-muted-foreground">min</span>
                      </div>
                    </div>
                    <Slider
                      value={[settings.focusDuration]}
                      onValueChange={([v]) => updateSetting('focusDuration', v)}
                      min={5}
                      max={90}
                      step={5}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5 min</span>
                      <span>90 min</span>
                    </div>
                  </div>
                  
                  {/* Short Break */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-base font-medium">Short Break</Label>
                        <p className="text-xs text-muted-foreground">Quick rest between sessions</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={settings.shortBreakDuration}
                          onChange={(e) => updateSetting('shortBreakDuration', Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
                          className="w-16 h-8 text-center"
                          min={1}
                          max={30}
                        />
                        <span className="text-sm text-muted-foreground">min</span>
                      </div>
                    </div>
                    <Slider
                      value={[settings.shortBreakDuration]}
                      onValueChange={([v]) => updateSetting('shortBreakDuration', v)}
                      min={1}
                      max={20}
                      step={1}
                    />
                  </div>
                  
                  {/* Long Break */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-base font-medium">Long Break</Label>
                        <p className="text-xs text-muted-foreground">Extended rest after multiple sessions</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={settings.longBreakDuration}
                          onChange={(e) => updateSetting('longBreakDuration', Math.min(60, Math.max(1, parseInt(e.target.value) || 1)))}
                          className="w-16 h-8 text-center"
                          min={1}
                          max={60}
                        />
                        <span className="text-sm text-muted-foreground">min</span>
                      </div>
                    </div>
                    <Slider
                      value={[settings.longBreakDuration]}
                      onValueChange={([v]) => updateSetting('longBreakDuration', v)}
                      min={5}
                      max={45}
                      step={5}
                    />
                  </div>
                  
                  {/* Sessions until long break */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-base font-medium">Sessions until Long Break</Label>
                        <p className="text-xs text-muted-foreground">Focus sessions before extended rest</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={settings.sessionsUntilLongBreak}
                          onChange={(e) => updateSetting('sessionsUntilLongBreak', Math.min(12, Math.max(1, parseInt(e.target.value) || 1)))}
                          className="w-16 h-8 text-center"
                          min={1}
                          max={12}
                        />
                        <span className="text-sm text-muted-foreground">sessions</span>
                      </div>
                    </div>
                    <Slider
                      value={[settings.sessionsUntilLongBreak]}
                      onValueChange={([v]) => updateSetting('sessionsUntilLongBreak', v)}
                      min={2}
                      max={10}
                      step={1}
                    />
                  </div>
                </TabsContent>
                
                {/* Behavior Tab */}
                <TabsContent value="behavior" className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto-start breaks</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically begin break after focus ends
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoStartBreaks}
                      onCheckedChange={(v) => updateSetting('autoStartBreaks', v)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto-start focus</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically begin focus after break ends
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoStartFocus}
                      onCheckedChange={(v) => updateSetting('autoStartFocus', v)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="space-y-0.5">
                      <Label className="text-base">Sound notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Play bell sound when session completes
                      </p>
                    </div>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(v) => updateSetting('soundEnabled', v)}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Device Settings */}
                  <div className="space-y-3">
                    <Label className="text-base">Device Name</Label>
                    <p className="text-xs text-muted-foreground">
                      Identify your sessions by device
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Work Laptop"
                        value={deviceNameInput}
                        onChange={(e) => setDeviceNameInput(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleSaveDeviceName} size="sm">
                        Save
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
                      <Monitor className="w-3.5 h-3.5" />
                      <span className="truncate">{getDeviceName() || getDeviceId()}</span>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Data Tab */}
                <TabsContent value="data" className="space-y-6">
                  {/* Storage Info */}
                  <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Monitor className="w-4 h-4" />
                      <span>Supabase Sync</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                      Focus sessions are saved to your account and updated live. Timer preferences stay on this device.
                      </p>
                  </div>
                  
                  {/* Stats Summary */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-accent/50 p-3 text-center">
                      <div className="text-xl font-bold">{allSessions.length}</div>
                      <div className="text-xs text-muted-foreground">Total Sessions</div>
                    </div>
                    <div className="rounded-lg bg-accent/50 p-3 text-center">
                      <div className="text-xl font-bold">{formatDuration(completedFocusSeconds)}</div>
                      <div className="text-xs text-muted-foreground">Total Focus Time</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Danger Zone */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Danger Zone</span>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete All Focus Data
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete all your focus session history, statistics, and settings from this device. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={async () => {
                              try {
                                const result = await clearFocusSessions()
                                if (result.error) throw new Error(result.error)
                                await clearAllSessions()
                                localStorage.removeItem('rhythme-focus-timer')
                                localStorage.removeItem('rhythme-focus-device-name')
                                localStorage.removeItem('rhythme-focus')
                                localStorage.removeItem('focus-local-notice-shown')
                                toast.success('All focus data deleted')
                                setShowSettings(false)
                                window.location.reload()
                              } catch {
                                toast.error('Failed to delete data')
                              }
                            }}
                          >
                            Delete Everything
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      This will clear all sessions, streaks, and reset settings to defaults.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
        
        
        <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className={cn("mt-8 flex items-center gap-6 text-sm text-muted-foreground", isFullscreen && "hidden")}>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          <span>{todaySessionCount} today</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🔥</span>
          <span>{stats?.currentStreak || 0} streak</span>
        </div>
      </div>
    </div>
  )
}

type SyncStatus = 'idle' | 'live' | 'saving' | 'error'

type SessionConfig = {
  label: string
  color: string
  bgColor: string
  icon: React.ReactNode
}

function FocusSessionPanel({
  activeSessionId,
  energyLevel,
  isRunning,
  moodAfter,
  moodBefore,
  selectedTask,
  selectedTaskId,
  setEnergyLevel,
  setMoodAfter,
  setMoodBefore,
  setSelectedTaskId,
  syncStatus,
  tasks,
  tasksLoading,
}: {
  activeSessionId: number | null
  energyLevel: number | null
  isRunning: boolean
  moodAfter: number | null
  moodBefore: number | null
  selectedTask: Task | undefined
  selectedTaskId: string | null
  setEnergyLevel: (value: number | null) => void
  setMoodAfter: (value: number | null) => void
  setMoodBefore: (value: number | null) => void
  setSelectedTaskId: (value: string | null) => void
  syncStatus: SyncStatus
  tasks: Task[]
  tasksLoading: boolean
}) {
  const locked = isRunning || Boolean(activeSessionId)

  return (
    <section className="mb-8 grid w-full max-w-4xl gap-4 rounded-lg border bg-background p-4 shadow-sm md:grid-cols-[1fr_auto]">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Label className="text-sm font-medium">Focus task</Label>
          <FocusStatusBadge status={syncStatus} />
        </div>

        <Select
          disabled={locked}
          onValueChange={(value) => setSelectedTaskId(value)}
          value={selectedTaskId || undefined}
        >
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder={tasksLoading ? 'Loading tasks...' : 'Choose a task'} />
          </SelectTrigger>
          <SelectContent>
            {tasks
              .filter((task) => task.status !== 'completed')
              .map((task) => (
                <SelectItem key={task.task_id} value={String(task.task_id)}>
                  {task.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <div className="min-h-5 text-xs text-muted-foreground">
          {selectedTask ? selectedTask.title : 'Pick one task. The session will be linked to it.'}
        </div>
      </div>

      <div className="grid gap-3 md:min-w-[340px]">
        <div className="grid grid-cols-2 gap-2">
          <FocusMoodSelect
            disabled={locked}
            label="Before"
            onChange={setMoodBefore}
            value={moodBefore}
          />
          <FocusMoodSelect
            label="After"
            onChange={setMoodAfter}
            value={moodAfter}
          />
        </div>
        <div className="space-y-2 rounded-md border bg-muted/20 p-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Energy</Label>
            <span className="text-xs font-medium text-foreground">
              {formatPercentLabel(energyLevel)}
            </span>
          </div>
          <Slider
            disabled={locked}
            max={100}
            min={1}
            onValueChange={([next]) => setEnergyLevel(Number((next / 100).toFixed(2)))}
            step={1}
            value={[Math.round((energyLevel ?? 0.5) * 100)]}
          />
        </div>
      </div>
    </section>
  )
}

function FocusMoodSelect({
  disabled,
  label,
  onChange,
  value,
}: {
  disabled?: boolean
  label: string
  onChange: (value: number | null) => void
  value: number | null
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select
        disabled={disabled}
        onValueChange={(next) => onChange(next === 'none' ? null : Number(next))}
        value={value !== null ? value.toFixed(2) : 'none'}
      >
        <SelectTrigger className="h-10 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">-</SelectItem>
          {moodOptions.map((mood) => (
            <SelectItem key={mood.label} value={mood.value.toFixed(2)}>
              {mood.label} ({mood.value.toFixed(2)})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function FocusStatusBadge({ status }: { status: SyncStatus }) {
  const label = status === 'live'
    ? 'Live'
    : status === 'saving'
      ? 'Saving'
      : status === 'error'
        ? 'Sync issue'
        : 'Ready'

  return (
    <Badge
      variant={status === 'error' ? 'destructive' : 'outline'}
      className={cn(status === 'live' && 'border-green-500/30 text-green-600')}
    >
      {label}
    </Badge>
  )
}

function FocusModeTabs({
  isFullscreen,
  isRunning,
  onSwitch,
  sessionType,
}: {
  isFullscreen: boolean
  isRunning: boolean
  onSwitch: (type: SessionType) => void
  sessionType: SessionType
}) {
  if (isFullscreen) return null

  return (
    <div className="mb-8 flex rounded-lg border bg-muted/30 p-1">
      {(['focus', 'short_break', 'long_break'] as SessionType[]).map((type) => (
        <Button
          key={type}
          disabled={isRunning}
          onClick={() => onSwitch(type)}
          size="sm"
          variant={sessionType === type ? 'default' : 'ghost'}
          className="h-8 rounded-md"
        >
          {sessionConfig[type].label}
        </Button>
      ))}
    </div>
  )
}

function FocusTimerDial({
  config,
  displayTime,
  isFullscreen,
  progress,
  selectedTask,
  sessionNumber,
}: {
  config: SessionConfig
  displayTime: number
  isFullscreen: boolean
  progress: number
  selectedTask: Task | undefined
  sessionNumber: number
}) {
  const sizeClass = isFullscreen
    ? 'h-[min(70vw,70vh,520px)] w-[min(70vw,70vh,520px)]'
    : 'h-64 w-64 sm:h-80 sm:w-80'

  return (
    <div className={cn("relative mb-8", isFullscreen && "mb-10")}>
      <svg className={cn("-rotate-90", sizeClass)} viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          fill="none"
          r="44"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted/30"
        />
        <circle
          cx="50"
          cy="50"
          fill="none"
          r="44"
          stroke="currentColor"
          strokeDasharray={`${2 * Math.PI * 44}`}
          strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
          strokeLinecap="round"
          strokeWidth="2"
          className={cn(config.color, "transition-all duration-300")}
        />
      </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        <div className={cn("mb-3 flex items-center gap-2", config.color)}>
          {config.icon}
          <span className="text-sm font-medium uppercase">{config.label}</span>
        </div>
        <span className={cn(
          "font-mono font-bold tabular-nums",
          isFullscreen ? "text-8xl sm:text-9xl" : "text-6xl sm:text-7xl"
        )}>
          {formatTime(displayTime)}
        </span>
          <span className={cn(
            "mt-3 max-w-[70%] text-center text-sm leading-tight text-muted-foreground",
            isFullscreen ? "max-w-[55%]" : "max-w-[62%] text-xs sm:text-sm"
          )}>
            {selectedTask?.title || `Session ${sessionNumber}`}
          </span>
        </div>
    </div>
  )
}

function FocusControls({
  isRunning,
  isSyncingSession,
  onReset,
  onSkip,
  onToggle,
}: {
  isRunning: boolean
  isSyncingSession: boolean
  onReset: () => void
  onSkip: () => void
  onToggle: () => void
}) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        className="h-12 w-12 rounded-full"
      >
        <RotateCcw className="h-5 w-5" />
      </Button>

      <Button
        onClick={onToggle}
        size="lg"
        disabled={isSyncingSession}
        className={cn(
          "h-20 w-20 rounded-full text-xl shadow-lg transition-transform hover:scale-105",
          isRunning ? "bg-orange-500 hover:bg-orange-600" : "bg-primary"
        )}
      >
        {isRunning ? <Pause className="h-8 w-8" /> : <Play className="ml-1 h-8 w-8" />}
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={onSkip}
        className="h-12 w-12 rounded-full"
      >
        <SkipForward className="h-5 w-5" />
      </Button>
    </div>
  )
}

function scoreToLegacyLevel(value: number | null) {
  if (value === null) return null
  return Math.min(5, Math.max(1, Math.ceil(value * 5)))
}

function formatPercentLabel(value: number | null) {
  if (value === null) return '50%'
  return `${Math.round(value * 100)}%`
}
