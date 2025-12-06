// lib/focus-storage.ts
// LocalStorage utility for Pomodoro Focus Timer

export interface FocusSession {
  id: string
  type: 'focus' | 'short_break' | 'long_break'
  duration: number // in seconds
  completedAt: string // ISO date
  interrupted: boolean
}

export interface FocusSettings {
  focusDuration: number // minutes
  shortBreakDuration: number // minutes
  longBreakDuration: number // minutes
  sessionsUntilLongBreak: number
  autoStartBreaks: boolean
  autoStartFocus: boolean
  soundEnabled: boolean
}

export interface FocusStats {
  totalFocusTime: number // seconds
  totalSessions: number
  completedToday: number
  currentStreak: number
  longestStreak: number
}

export interface FocusState {
  settings: FocusSettings
  sessions: FocusSession[]
  stats: FocusStats
  lastUpdated: string
}

const STORAGE_KEY = 'rhythme_focus_data'

const defaultSettings: FocusSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
}

const defaultStats: FocusStats = {
  totalFocusTime: 0,
  totalSessions: 0,
  completedToday: 0,
  currentStreak: 0,
  longestStreak: 0,
}

const defaultState: FocusState = {
  settings: defaultSettings,
  sessions: [],
  stats: defaultStats,
  lastUpdated: new Date().toISOString(),
}

// Get focus data from localStorage
export function getFocusData(): FocusState {
  if (typeof window === 'undefined') return defaultState
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return defaultState
    
    const parsed = JSON.parse(data) as FocusState
    
    // Reset today's count if it's a new day
    const lastUpdate = new Date(parsed.lastUpdated)
    const today = new Date()
    if (lastUpdate.toDateString() !== today.toDateString()) {
      parsed.stats.completedToday = 0
      parsed.lastUpdated = today.toISOString()
      saveFocusData(parsed)
    }
    
    return parsed
  } catch {
    return defaultState
  }
}

// Save focus data to localStorage
export function saveFocusData(data: FocusState): void {
  if (typeof window === 'undefined') return
  
  try {
    data.lastUpdated = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save focus data:', error)
  }
}

// Update settings
export function updateSettings(settings: Partial<FocusSettings>): FocusState {
  const data = getFocusData()
  data.settings = { ...data.settings, ...settings }
  saveFocusData(data)
  return data
}

// Add completed session
export function addSession(session: Omit<FocusSession, 'id' | 'completedAt'>): FocusState {
  const data = getFocusData()
  
  const newSession: FocusSession = {
    ...session,
    id: Date.now().toString(),
    completedAt: new Date().toISOString(),
  }
  
  data.sessions.unshift(newSession)
  
  // Keep only last 100 sessions
  if (data.sessions.length > 100) {
    data.sessions = data.sessions.slice(0, 100)
  }
  
  // Update stats
  if (session.type === 'focus' && !session.interrupted) {
    data.stats.totalFocusTime += session.duration
    data.stats.totalSessions += 1
    data.stats.completedToday += 1
    data.stats.currentStreak += 1
    
    if (data.stats.currentStreak > data.stats.longestStreak) {
      data.stats.longestStreak = data.stats.currentStreak
    }
  } else if (session.interrupted) {
    data.stats.currentStreak = 0
  }
  
  saveFocusData(data)
  return data
}

// Get today's sessions
export function getTodaySessions(): FocusSession[] {
  const data = getFocusData()
  const today = new Date().toDateString()
  
  return data.sessions.filter(s => 
    new Date(s.completedAt).toDateString() === today
  )
}

// Format time display
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Format duration for display
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}
