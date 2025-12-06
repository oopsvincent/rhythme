'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  getFocusData, 
  saveFocusData, 
  addSession, 
  formatTime, 
  formatDuration,
  FocusSettings,
  FocusStats
} from '@/lib/focus-storage'
import { Button } from '@/components/ui/button'
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
  BarChart3
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

type SessionType = 'focus' | 'short_break' | 'long_break'

const sessionConfig: Record<SessionType, { label: string; color: string; icon: React.ReactNode }> = {
  focus: { label: 'Focus', color: 'text-orange-500', icon: <Brain className="w-6 h-6" /> },
  short_break: { label: 'Short Break', color: 'text-green-500', icon: <Coffee className="w-6 h-6" /> },
  long_break: { label: 'Long Break', color: 'text-blue-500', icon: <Coffee className="w-6 h-6" /> },
}

export default function FocusTimer() {
  const [settings, setSettings] = useState<FocusSettings | null>(null)
  const [stats, setStats] = useState<FocusStats | null>(null)
  const [sessionType, setSessionType] = useState<SessionType>('focus')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load data from localStorage
  useEffect(() => {
    const data = getFocusData()
    setSettings(data.settings)
    setStats(data.stats)
    setTimeLeft(data.settings.focusDuration * 60)
  }, [])

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      handleSessionComplete()
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, timeLeft])

  const handleSessionComplete = useCallback(() => {
    setIsRunning(false)
    
    // Play sound
    if (settings?.soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
    
    // Save session
    const duration = getDuration(sessionType) * 60
    const data = addSession({
      type: sessionType,
      duration,
      interrupted: false,
    })
    setStats(data.stats)
    
    // Determine next session
    if (sessionType === 'focus') {
      const newCount = sessionsCompleted + 1
      setSessionsCompleted(newCount)
      
      if (newCount % (settings?.sessionsUntilLongBreak || 4) === 0) {
        switchSession('long_break')
      } else {
        switchSession('short_break')
      }
      
      if (settings?.autoStartBreaks) {
        setTimeout(() => setIsRunning(true), 1000)
      }
    } else {
      switchSession('focus')
      if (settings?.autoStartFocus) {
        setTimeout(() => setIsRunning(true), 1000)
      }
    }
  }, [sessionType, settings, sessionsCompleted])

  const getDuration = (type: SessionType): number => {
    if (!settings) return 25
    switch (type) {
      case 'focus': return settings.focusDuration
      case 'short_break': return settings.shortBreakDuration
      case 'long_break': return settings.longBreakDuration
    }
  }

  const switchSession = (type: SessionType) => {
    setSessionType(type)
    setTimeLeft(getDuration(type) * 60)
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(getDuration(sessionType) * 60)
  }

  const skipSession = () => {
    if (isRunning) {
      // Save interrupted session
      addSession({
        type: sessionType,
        duration: getDuration(sessionType) * 60 - timeLeft,
        interrupted: true,
      })
    }
    handleSessionComplete()
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const updateSetting = <K extends keyof FocusSettings>(key: K, value: FocusSettings[K]) => {
    if (!settings) return
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    const data = getFocusData()
    data.settings = newSettings
    saveFocusData(data)
    
    // Update time if changing current session duration
    if (
      (key === 'focusDuration' && sessionType === 'focus') ||
      (key === 'shortBreakDuration' && sessionType === 'short_break') ||
      (key === 'longBreakDuration' && sessionType === 'long_break')
    ) {
      if (!isRunning) {
        setTimeLeft((value as number) * 60)
      }
    }
  }

  // Calculate progress
  const totalTime = getDuration(sessionType) * 60
  const progress = ((totalTime - timeLeft) / totalTime) * 100

  const config = sessionConfig[sessionType]

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-[70vh] transition-all ${isFullscreen ? 'bg-background' : ''}`}>
      {/* Audio element for notification */}
      <audio ref={audioRef} src="/sounds/bell.mp3" preload="auto" />
      
      {/* Session Type Tabs */}
      <div className="flex gap-2 mb-8">
        {(['focus', 'short_break', 'long_break'] as SessionType[]).map((type) => (
          <button
            key={type}
            onClick={() => { if (!isRunning) switchSession(type) }}
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
            className={`${config.color} transition-all duration-1000`}
          />
        </svg>
        
        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`flex items-center gap-2 mb-2 ${config.color}`}>
            {config.icon}
            <span className="text-sm font-medium uppercase tracking-wide">{config.label}</span>
          </div>
          <span className="text-6xl sm:text-7xl font-mono font-bold tracking-tight">
            {formatTime(timeLeft)}
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
        
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <History className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Today&apos;s Stats</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="text-center p-4 rounded-lg bg-accent/50">
                <div className="text-3xl font-bold">{stats?.completedToday || 0}</div>
                <div className="text-sm text-muted-foreground">Sessions Today</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-accent/50">
                <div className="text-3xl font-bold">{formatDuration((stats?.completedToday || 0) * settings.focusDuration * 60)}</div>
                <div className="text-sm text-muted-foreground">Focus Time</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-accent/50">
                <div className="text-3xl font-bold">{stats?.currentStreak || 0}</div>
                <div className="text-sm text-muted-foreground">Current Streak</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-accent/50">
                <div className="text-3xl font-bold">{stats?.totalSessions || 0}</div>
                <div className="text-sm text-muted-foreground">Total Sessions</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Timer Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Focus Duration */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Focus Duration</Label>
                  <span className="text-sm text-muted-foreground">{settings.focusDuration} min</span>
                </div>
                <Slider
                  value={[settings.focusDuration]}
                  onValueChange={([v]) => updateSetting('focusDuration', v)}
                  min={5}
                  max={60}
                  step={5}
                />
              </div>
              
              {/* Short Break */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Short Break</Label>
                  <span className="text-sm text-muted-foreground">{settings.shortBreakDuration} min</span>
                </div>
                <Slider
                  value={[settings.shortBreakDuration]}
                  onValueChange={([v]) => updateSetting('shortBreakDuration', v)}
                  min={1}
                  max={15}
                  step={1}
                />
              </div>
              
              {/* Long Break */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Long Break</Label>
                  <span className="text-sm text-muted-foreground">{settings.longBreakDuration} min</span>
                </div>
                <Slider
                  value={[settings.longBreakDuration]}
                  onValueChange={([v]) => updateSetting('longBreakDuration', v)}
                  min={5}
                  max={30}
                  step={5}
                />
              </div>
              
              {/* Sessions until long break */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Sessions until Long Break</Label>
                  <span className="text-sm text-muted-foreground">{settings.sessionsUntilLongBreak}</span>
                </div>
                <Slider
                  value={[settings.sessionsUntilLongBreak]}
                  onValueChange={([v]) => updateSetting('sessionsUntilLongBreak', v)}
                  min={2}
                  max={8}
                  step={1}
                />
              </div>
              
              {/* Auto-start toggles */}
              <div className="flex items-center justify-between">
                <Label>Auto-start breaks</Label>
                <Switch
                  checked={settings.autoStartBreaks}
                  onCheckedChange={(v) => updateSetting('autoStartBreaks', v)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Auto-start focus</Label>
                <Switch
                  checked={settings.autoStartFocus}
                  onCheckedChange={(v) => updateSetting('autoStartFocus', v)}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          <span>{stats?.completedToday || 0} today</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🔥</span>
          <span>{stats?.currentStreak || 0} streak</span>
        </div>
      </div>
    </div>
  )
}
