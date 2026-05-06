// store/useFocusStore.ts
// Zustand store with persist middleware for Focus Timer state
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from 'sonner'

export type SessionType = 'focus' | 'break'

interface FocusTimerState {
  // Timer state
  timeLeft: number // Only used when paused
  isRunning: boolean
  sessionType: SessionType
  startedAt: number | null // timestamp when timer started
  targetDuration: number // duration in seconds for current session
  activeSessionId: number | null
  activeTaskId: string | null
  
  // Actions
  start: () => void
  pause: () => void
  reset: (duration?: number) => void
  setTimeLeft: (time: number) => void
  switchSession: (type: SessionType, duration: number) => void
  completeSession: () => void
  getDisplayTime: () => number // Calculate current display time
  markCompleted: () => void
  setActiveFocusSession: (sessionId: number | null, taskId: string | null) => void
  clearActiveFocusSession: () => void
}

export const useFocusStore = create<FocusTimerState>()(
  persist(
    (set, get) => ({
      // Initial state
      timeLeft: 25 * 60,
      isRunning: false,
      sessionType: 'focus',
      startedAt: null,
      targetDuration: 25 * 60,
      activeSessionId: null,
      activeTaskId: null,

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
          break: 5 * 60,
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
        // No-op for now, simplified
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

      setActiveFocusSession: (sessionId, taskId) => {
        set({
          activeSessionId: sessionId,
          activeTaskId: taskId,
        })
      },

      clearActiveFocusSession: () => {
        set({
          activeSessionId: null,
          activeTaskId: null,
        })
      },
    }),
    {
      name: 'rhythme-focus-timer-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        timeLeft: state.timeLeft,
        isRunning: state.isRunning,
        sessionType: state.sessionType,
        startedAt: state.startedAt,
        targetDuration: state.targetDuration,
        activeSessionId: state.activeSessionId,
        activeTaskId: state.activeTaskId,
      }),
      // On rehydration, recalculate time if timer was running
      onRehydrateStorage: () => (state) => {
        if (state && state.isRunning && state.startedAt) {
          const elapsed = Math.floor((Date.now() - state.startedAt) / 1000)
          const remaining = Math.max(0, state.targetDuration - elapsed)
          
          if (remaining <= 0) {
            // Timer completed while away — notify the user
            state.isRunning = false
            state.timeLeft = 0
            state.startedAt = null

            // Play bell and show toast on next tick (after React mounts)
            setTimeout(() => {
              try {
                const audio = new Audio('/sounds/bell.mp3')
                audio.play().catch(() => {})
              } catch {}
              toast.info('A focus session completed while you were away!')
            }, 500)
          } else {
            state.timeLeft = remaining
          }
        }
      },
    }
  )
)
