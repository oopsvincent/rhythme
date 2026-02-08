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
  saveSession, 
  getDeviceId, 
  getDeviceName, 
  setDeviceName, 
  getTodaySessions, 
  getSessions,
  clearAllSessions,
  FocusSessionRecord 
} from '@/lib/focus/focus-db'
import { useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
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
  DrawerFooter,
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

export default function FocusTimer() {
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
  } = useFocusStore()
  
  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [deviceNameInput, setDeviceNameInput] = useState('')
  const [todaySessionCount, setTodaySessionCount] = useState(0)
  const [allSessions, setAllSessions] = useState<FocusSessionRecord[]>([])
  const [displayTime, setDisplayTime] = useState(25 * 60)
  
  // Sidebar control for fullscreen
  const sidebarContext = useSidebar()
  const prevSidebarState = useRef<boolean>(true)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const completedRef = useRef(false)

  // One-time local notice
  useEffect(() => {
    if (!localStorage.getItem('focus-local-notice-shown')) {
      toast.info('Focus sessions are stored locally on this device only—no cross-device sync.', {
        duration: 5000,
      })
      localStorage.setItem('focus-local-notice-shown', 'true')
    }
  }, [])

  // Load data from localStorage and IndexedDB
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

  const loadSessions = async () => {
    try {
      const todaySessions = await getTodaySessions()
      setTodaySessionCount(todaySessions.filter(s => s.type === 'focus' && !s.interrupted).length)
      
      const all = await getSessions(50)
      setAllSessions(all)
    } catch (error) {
      console.error('Failed to load sessions:', error)
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
    // Play sound
    if (settings?.soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
    
    markCompleted()
    
    // Save session to IndexedDB
    const duration = getDuration(sessionType) * 60
    try {
      await saveSession({
        type: sessionType,
        duration,
        completedAt: new Date().toISOString(),
        interrupted: false,
        deviceId: getDeviceId(),
      })
      
      await loadSessions()
    } catch (error) {
      console.error('Failed to save session:', error)
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
  }, [sessionType, settings, sessionsCompleted, completeSession, start, markCompleted])

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

  const toggleTimer = () => {
    if (isRunning) {
      pause()
    } else {
      start()
    }
  }

  const resetTimer = () => {
    reset(getDuration(sessionType) * 60)
  }

  const skipSession = async () => {
    if (isRunning) {
      try {
        await saveSession({
          type: sessionType,
          duration: getDuration(sessionType) * 60 - getDisplayTime(),
          completedAt: new Date().toISOString(),
          interrupted: true,
          deviceId: getDeviceId(),
        })
      } catch (error) {
        console.error('Failed to save interrupted session:', error)
      }
      pause()
    }
    handleSessionComplete()
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
    const dateKey = new Date(session.completedAt).toDateString()
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(session)
    return groups
  }, {} as Record<string, FocusSessionRecord[]>)

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-[70vh] transition-all ${isFullscreen ? 'bg-background fixed inset-0 z-50' : ''}`}>
      {/* Audio element for notification */}
      <audio ref={audioRef} src="/sounds/bell.mp3" preload="auto" />
      
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
      
      {/* Session Type Tabs */}
      <div className="flex gap-2 mb-8">
        {(['focus', 'short_break', 'long_break'] as SessionType[]).map((type) => (
          <button
            key={type}
            onClick={() => { if (!isRunning) handleSwitchSession(type) }}
            disabled={isRunning}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              sessionType === type 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            } disabled:opacity-50`}
          >
            {sessionConfig[type].label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="relative mb-8">
        {/* Progress Ring */}
        <svg className="w-64 h-64 sm:w-80 sm:h-80 -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted/20"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className={`${config.color} transition-all duration-300`}
          />
        </svg>
        
        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`flex items-center gap-2 mb-2 ${config.color}`}>
            {config.icon}
            <span className="text-sm font-medium uppercase tracking-wide">{config.label}</span>
          </div>
          <span className="text-6xl sm:text-7xl font-mono font-bold tracking-tight tabular-nums">
            {formatTime(displayTime)}
          </span>
          <span className="text-sm text-muted-foreground mt-2">
            Session {sessionsCompleted + 1}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={resetTimer}
          className="w-12 h-12 rounded-full"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={toggleTimer}
          size="lg"
          className={`w-20 h-20 rounded-full text-xl shadow-lg transition-transform hover:scale-105 ${
            isRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-primary'
          }`}
        >
          {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={skipSession}
          className="w-12 h-12 rounded-full"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-3">
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
                      <div className="text-2xl font-bold">{formatDuration(todaySessionCount * settings.focusDuration * 60)}</div>
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
                      <div className="text-2xl font-bold">{stats?.totalSessions || 0}</div>
                      <div className="text-xs text-muted-foreground">Total Sessions</div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Focus Time</span>
                    <span className="font-medium">{formatDuration(stats?.totalFocusTime || 0)}</span>
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
                          {formatSessionDate(sessions[0].completedAt)}
                        </h4>
                        <div className="space-y-2">
                          {sessions.map((session) => {
                            const sConfig = sessionConfig[session.type]
                            return (
                              <div key={session.id} className={`flex items-center gap-3 p-3 rounded-lg ${sConfig.bgColor}`}>
                                <div className={sConfig.color}>{sConfig.icon}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{sConfig.label}</span>
                                    {session.interrupted && (
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
                  {/* Local Storage Info */}
                  <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Monitor className="w-4 h-4" />
                      <span>Local Storage Only</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All your focus data is stored locally on this device. It is not synced to the cloud and remains completely private.
                    </p>
                  </div>
                  
                  {/* Stats Summary */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-accent/50 p-3 text-center">
                      <div className="text-xl font-bold">{stats?.totalSessions || 0}</div>
                      <div className="text-xs text-muted-foreground">Total Sessions</div>
                    </div>
                    <div className="rounded-lg bg-accent/50 p-3 text-center">
                      <div className="text-xl font-bold">{formatDuration(stats?.totalFocusTime || 0)}</div>
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
                                await clearAllSessions()
                                localStorage.removeItem('rhythme-focus-timer')
                                localStorage.removeItem('rhythme-focus-device-name')
                                localStorage.removeItem('rhythme-focus')
                                localStorage.removeItem('focus-local-notice-shown')
                                toast.success('All focus data deleted')
                                setShowSettings(false)
                                window.location.reload()
                              } catch (error) {
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
      <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
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
