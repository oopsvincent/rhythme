// store/useFocusStore.ts
// Zustand store with persist middleware for Focus Timer state
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type SessionType = 'focus' | 'short_break' | 'long_break'

interface FocusTimerState {
  // Timer state
  timeLeft: number // Only used when paused
  isRunning: boolean
  sessionType: SessionType
  sessionsCompleted: number
  startedAt: number | null // timestamp when timer started
  targetDuration: number // duration in seconds for current session
  
  // Actions
  start: () => void
  pause: () => void
  reset: (duration?: number) => void
  setTimeLeft: (time: number) => void
  switchSession: (type: SessionType, duration: number) => void
  completeSession: () => void
  getDisplayTime: () => number // Calculate current display time
  markCompleted: () => void
}

export const useFocusStore = create<FocusTimerState>()(
  persist(
    (set, get) => ({
      // Initial state
      timeLeft: 25 * 60,
      isRunning: false,
      sessionType: 'focus',
      sessionsCompleted: 0,
      startedAt: null,
      targetDuration: 25 * 60,

      start: () => {
        const state = get()
        set({
          isRunning: true,
          startedAt: Date.now(),
          targetDuration: state.timeLeft, // Store current timeLeft as target
        })
      },

      pause: () => {
        const state = get()
        const remaining = state.getDisplayTime()
        set({
          isRunning: false,
          timeLeft: remaining,
          startedAt: null,
        })
      },

      reset: (duration?: number) => {
        const state = get()
        const defaultDurations: Record<SessionType, number> = {
          focus: 25 * 60,
          short_break: 5 * 60,
          long_break: 15 * 60,
        }
        const time = duration ?? defaultDurations[state.sessionType]
        set({
          timeLeft: time,
          targetDuration: time,
          isRunning: false,
          startedAt: null,
        })
      },

      setTimeLeft: (time: number) => set({ timeLeft: time, targetDuration: time }),

      switchSession: (type: SessionType, duration: number) => {
        set({
          sessionType: type,
          timeLeft: duration,
          targetDuration: duration,
          isRunning: false,
          startedAt: null,
        })
      },

      completeSession: () => {
        set((state) => ({
          sessionsCompleted: state.sessionType === 'focus' 
            ? state.sessionsCompleted + 1 
            : state.sessionsCompleted,
        }))
      },

      getDisplayTime: () => {
        const state = get()
        if (!state.isRunning || state.startedAt === null) {
          return state.timeLeft
        }
        const elapsed = Math.floor((Date.now() - state.startedAt) / 1000)
        return Math.max(0, state.targetDuration - elapsed)
      },

      markCompleted: () => {
        set({
          isRunning: false,
          timeLeft: 0,
          startedAt: null,
        })
      },
    }),
    {
      name: 'rhythme-focus-timer',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        timeLeft: state.timeLeft,
        isRunning: state.isRunning,
        sessionType: state.sessionType,
        sessionsCompleted: state.sessionsCompleted,
        startedAt: state.startedAt,
        targetDuration: state.targetDuration,
      }),
      // On rehydration, recalculate time if timer was running
      onRehydrateStorage: () => (state) => {
        if (state && state.isRunning && state.startedAt) {
          const elapsed = Math.floor((Date.now() - state.startedAt) / 1000)
          const remaining = Math.max(0, state.targetDuration - elapsed)
          
          if (remaining <= 0) {
            // Timer would have completed while away
            state.isRunning = false
            state.timeLeft = 0
            state.startedAt = null
          } else {
            state.timeLeft = remaining
          }
        }
      },
    }
  )
)
