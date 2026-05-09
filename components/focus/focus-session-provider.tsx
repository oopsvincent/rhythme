'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import {
  createFocusSession,
  endFocusSessionRecord,
  fetchActiveFocusSession,
  updateFocusSessionRecord,
} from '@/lib/focus/focus-session-client'
import { playFocusSound } from '@/lib/focus/audio'
import type {
  FocusSession,
  InterruptionDetail,
  StartFocusSessionInput,
} from '@/types/database'

const ACTIVE_SYNC_INTERVAL_MS = 90_000

type EndReason = 'completed' | 'manual' | 'widget' | 'remote'

interface EndSessionOptions {
  actualDuration?: number
  moodAfter?: number | null
  energyEnd?: number | null
  interruptions?: number
  interruptionDetails?: InterruptionDetail[]
  metadata?: Record<string, unknown>
  reason?: EndReason
  showCompletion?: boolean
}

interface EndedSessionState {
  session: FocusSession
  actualDuration: number
  interruptions: InterruptionDetail[]
  completed: boolean
  source: EndReason
}

interface FocusSessionContextValue {
  activeSession: FocusSession | null
  isLoading: boolean
  isStarting: boolean
  isEnding: boolean
  remainingSeconds: number
  elapsedSeconds: number
  endedSession: EndedSessionState | null
  startSession: (input: StartFocusSessionInput) => Promise<FocusSession>
  endSession: (options?: EndSessionOptions) => Promise<FocusSession | null>
  syncActiveSession: () => Promise<FocusSession | null>
  addInterruption: (detail: InterruptionDetail) => Promise<void>
  saveSessionReflection: (
    sessionId: number,
    updates: {
      moodAfter?: number | null
      energyEnd?: number | null
      interruptions?: number
      interruptionDetails?: InterruptionDetail[]
      metadata?: Record<string, unknown>
    }
  ) => Promise<FocusSession>
  clearEndedSession: () => void
}

const FocusSessionContext = createContext<FocusSessionContextValue | null>(null)

function getSessionEndTimestamp(session: FocusSession) {
  return new Date(session.started_at).getTime() + session.planned_duration * 1000
}

function getElapsedSeconds(session: FocusSession) {
  const elapsed = Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000)
  return Math.max(0, elapsed)
}

function getRemainingSeconds(session: FocusSession) {
  const remaining = Math.floor((getSessionEndTimestamp(session) - Date.now()) / 1000)
  return Math.max(0, remaining)
}

export function FocusSessionProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStarting, setIsStarting] = useState(false)
  const [isEnding, setIsEnding] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [endedSession, setEndedSession] = useState<EndedSessionState | null>(null)

  const supabaseRef = useRef(createClient())
  const autoEndingSessionIdRef = useRef<number | null>(null)
  const syncPromiseRef = useRef<Promise<FocusSession | null> | null>(null)

  const invalidateFocusQueries = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['focus-sessions'] })
  }, [queryClient])

  const syncActiveSession = useCallback(async () => {
    if (syncPromiseRef.current) {
      return syncPromiseRef.current
    }

    const promise = (async () => {
      try {
        const session = await fetchActiveFocusSession()
        setActiveSession(session)
        setNow(Date.now())
        invalidateFocusQueries()
        return session
      } finally {
        // Small micro-throttle to prevent rapid consecutive calls
        setTimeout(() => {
          syncPromiseRef.current = null
        }, 1000)
      }
    })()

    syncPromiseRef.current = promise
    return promise
  }, [invalidateFocusQueries])

  useEffect(() => {
    let isMounted = true

    async function initialSync() {
      try {
        const session = await fetchActiveFocusSession()
        if (isMounted) {
          setActiveSession(session)
        }
      } catch (error) {
        console.error('Failed to sync active focus session:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void initialSync()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!activeSession) return

    const interval = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [activeSession])

  useEffect(() => {
    if (!activeSession) return

    const interval = window.setInterval(() => {
      void syncActiveSession().catch((error) => {
        console.error('Failed to poll active focus session:', error)
      })
    }, ACTIVE_SYNC_INTERVAL_MS)

    return () => {
      window.clearInterval(interval)
    }
  }, [activeSession, syncActiveSession])

  useEffect(() => {
    const handleVisibilitySync = () => {
      if (document.visibilityState === 'visible') {
        void syncActiveSession().catch((error) => {
          console.error('Failed to sync focus session on visibility change:', error)
        })
      }
    }

    const handleWindowFocus = () => {
      void syncActiveSession().catch((error) => {
        console.error('Failed to sync focus session on focus:', error)
      })
    }

    document.addEventListener('visibilitychange', handleVisibilitySync)
    window.addEventListener('focus', handleWindowFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilitySync)
      window.removeEventListener('focus', handleWindowFocus)
    }
  }, [syncActiveSession])

  useEffect(() => {
    let channel: ReturnType<typeof supabaseRef.current.channel> | null = null
    let cancelled = false

    async function subscribe() {
      const supabase = supabaseRef.current
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (cancelled || error || !user) return

      channel = supabase
        .channel(`focus-sessions-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'focus_sessions',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            void syncActiveSession().catch((syncError) => {
              console.error('Failed to sync after realtime focus update:', syncError)
            })
          }
        )
        .subscribe()
    }

    void subscribe()

    return () => {
      cancelled = true
      if (channel) {
        void supabaseRef.current.removeChannel(channel)
      }
    }
  }, [syncActiveSession])

  const startSession = useCallback(
    async (input: StartFocusSessionInput) => {
      setIsStarting(true)

      try {
        const current = await fetchActiveFocusSession()
        if (current) {
          setActiveSession(current)
          return current
        }

        const session = await createFocusSession(input)
        setActiveSession(session)
        setNow(Date.now())
        setEndedSession(null)
        invalidateFocusQueries()
        playFocusSound()
        return session
      } finally {
        setIsStarting(false)
      }
    },
    [invalidateFocusQueries]
  )

  const endSession = useCallback(
    async (options: EndSessionOptions = {}) => {
      if (!activeSession || isEnding) return null

      setIsEnding(true)

      try {
        const interruptionDetails =
          options.interruptionDetails ??
          ((activeSession.interruption_details as InterruptionDetail[] | null) ?? [])

        const actualDuration =
          options.actualDuration ?? Math.min(activeSession.planned_duration, getElapsedSeconds(activeSession))

        const endedAt =
          options.reason === 'completed'
            ? new Date(new Date(activeSession.started_at).getTime() + actualDuration * 1000).toISOString()
            : new Date().toISOString()

        const metadata = {
          ...((activeSession.metadata as Record<string, unknown>) ?? {}),
          ...(options.metadata ?? {}),
          endedReason: options.reason ?? 'manual',
        }

        const session = await endFocusSessionRecord({
          sessionId: activeSession.session_id,
          actualDuration,
          moodAfter: options.moodAfter ?? 3,
          energyEnd: options.energyEnd ?? activeSession.energy_start ?? null,
          interruptions: options.interruptions ?? interruptionDetails.length,
          interruptionDetails,
          endedAt,
          metadata,
        })

        setActiveSession(null)
        setNow(Date.now())
        invalidateFocusQueries()

        if (options.showCompletion) {
          setEndedSession({
            session,
            actualDuration,
            interruptions: interruptionDetails,
            completed: actualDuration >= activeSession.planned_duration,
            source: options.reason ?? 'manual',
          })
          playFocusSound()
        } else if ((options.reason ?? 'manual') === 'remote') {
          setEndedSession(null)
        }

        return session
      } finally {
        setIsEnding(false)
      }
    },
    [activeSession, invalidateFocusQueries, isEnding]
  )

  const addInterruption = useCallback(
    async (detail: InterruptionDetail) => {
      if (!activeSession) return

      const interruptionDetails = [
        ...(((activeSession.interruption_details as InterruptionDetail[] | null) ?? [])),
        detail,
      ]

      const updatedSession = await updateFocusSessionRecord(activeSession.session_id, {
        interruptions: interruptionDetails.length,
        interruptionDetails,
      })

      setActiveSession(updatedSession)
      invalidateFocusQueries()
    },
    [activeSession, invalidateFocusQueries]
  )

  const saveSessionReflection = useCallback(
    async (
      sessionId: number,
      updates: {
        moodAfter?: number | null
        energyEnd?: number | null
        interruptions?: number
        interruptionDetails?: InterruptionDetail[]
        metadata?: Record<string, unknown>
      }
    ) => {
      const session = await updateFocusSessionRecord(sessionId, {
        moodAfter: updates.moodAfter,
        energyEnd: updates.energyEnd,
        interruptions: updates.interruptions,
        interruptionDetails: updates.interruptionDetails,
        metadata: updates.metadata,
      })

      invalidateFocusQueries()
      setEndedSession((current) =>
        current && current.session.session_id === sessionId
          ? {
              ...current,
              session,
            }
          : current
      )
      return session
    },
    [invalidateFocusQueries]
  )

  useEffect(() => {
    if (!activeSession) {
      autoEndingSessionIdRef.current = null
      return
    }

    const remaining = Math.max(0, Math.floor((getSessionEndTimestamp(activeSession) - now) / 1000))
    if (remaining > 0) {
      autoEndingSessionIdRef.current = null
      return
    }

    if (autoEndingSessionIdRef.current === activeSession.session_id) {
      return
    }

    autoEndingSessionIdRef.current = activeSession.session_id

    void endSession({
      actualDuration: activeSession.planned_duration,
      reason: 'completed',
      showCompletion: true,
      metadata: {
        autoCompleted: true,
      },
    }).catch((error) => {
      autoEndingSessionIdRef.current = null
      console.error('Failed to auto-complete focus session:', error)
    })
  }, [activeSession, endSession, now])

  const remainingSeconds = useMemo(() => {
    if (!activeSession) return 0
    return Math.max(0, Math.floor((getSessionEndTimestamp(activeSession) - now) / 1000))
  }, [activeSession, now])

  const elapsedSeconds = useMemo(() => {
    if (!activeSession) return 0
    return Math.min(activeSession.planned_duration, getElapsedSeconds(activeSession))
  }, [activeSession, now])

  const value = useMemo<FocusSessionContextValue>(
    () => ({
      activeSession,
      isLoading,
      isStarting,
      isEnding,
      remainingSeconds,
      elapsedSeconds,
      endedSession,
      startSession,
      endSession,
      syncActiveSession,
      addInterruption,
      saveSessionReflection,
      clearEndedSession: () => setEndedSession(null),
    }),
    [
      activeSession,
      addInterruption,
      elapsedSeconds,
      endSession,
      endedSession,
      isEnding,
      isLoading,
      isStarting,
      remainingSeconds,
      saveSessionReflection,
      startSession,
      syncActiveSession,
    ]
  )

  return <FocusSessionContext.Provider value={value}>{children}</FocusSessionContext.Provider>
}

export function useFocusSessionController() {
  const context = useContext(FocusSessionContext)

  if (!context) {
    throw new Error('useFocusSessionController must be used within FocusSessionProvider')
  }

  return context
}
