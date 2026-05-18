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
  fetchActiveFocusSession,
  finalizeSessionReflection,
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
  pendingCompletionSession: EndedSessionState | null
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
  finalizeReflection: (
    sessionId: number,
    updates: {
      moodAfter: number
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

function getSessionInterruptions(session: FocusSession) {
  return ((session.interruption_details as InterruptionDetail[] | null) ?? [])
}

function buildEndedSessionState(
  session: FocusSession,
  interruptions: InterruptionDetail[],
  source: EndReason,
  actualDuration = session.actual_duration ?? session.planned_duration
): EndedSessionState {
  return {
    session: {
      ...session,
      actual_duration: actualDuration,
      interruption_details: interruptions,
    },
    actualDuration,
    interruptions,
    completed: actualDuration >= session.planned_duration,
    source,
  }
}

export function FocusSessionProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStarting, setIsStarting] = useState(false)
  const [isEnding, setIsEnding] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [endedSession, setEndedSession] = useState<EndedSessionState | null>(null)
  const [pendingCompletionSession, setPendingCompletionSession] = useState<EndedSessionState | null>(null)

  const supabaseRef = useRef(createClient())
  const autoEndingSessionIdRef = useRef<number | null>(null)
  const lastCompletionSoundSessionIdRef = useRef<number | null>(null)
  const syncPromiseRef = useRef<Promise<FocusSession | null> | null>(null)

  const invalidateFocusQueries = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['focus-sessions'] })
  }, [queryClient])

  const resolveSessionState = useCallback(async (session: FocusSession | null) => {
    if (!session) {
      setActiveSession(null)
      setPendingCompletionSession(null)
      return null
    }

    const endMs = getSessionEndTimestamp(session)
    if (Date.now() < endMs) {
      setPendingCompletionSession(null)
      setActiveSession(session)
      return session
    }

    const existingInterruptions = getSessionInterruptions(session)
    const alreadyHasLeftAppInterruption = existingInterruptions.some(
      (detail) => detail.type === 'other' && detail.label === 'User left the app'
    )

    let resolvedSession = session
    let finalInterruptions = existingInterruptions
    const endedAt = session.ended_at ?? new Date(endMs).toISOString()

    if (!alreadyHasLeftAppInterruption) {
      finalInterruptions = [
        ...existingInterruptions,
        {
          type: 'other',
          label: 'User left the app',
          timestamp: new Date(endMs).toISOString(),
        },
      ]

      try {
        resolvedSession = await updateFocusSessionRecord(session.session_id, {
          interruptionDetails: finalInterruptions,
          interruptions: finalInterruptions.length,
          actualDuration: session.planned_duration,
          endedAt,
        })
      } catch (updateError) {
        console.error('Failed to persist away interruption:', updateError)
      }
    }

    setActiveSession(null)
    setPendingCompletionSession(
      buildEndedSessionState(
        {
          ...resolvedSession,
          ended_at: endedAt,
          actual_duration: resolvedSession.actual_duration ?? session.planned_duration,
          interruption_details: finalInterruptions,
        },
        finalInterruptions,
        'completed',
        resolvedSession.actual_duration ?? session.planned_duration
      )
    )
    if (lastCompletionSoundSessionIdRef.current !== session.session_id) {
      lastCompletionSoundSessionIdRef.current = session.session_id
      playFocusSound()
    }

    return null
  }, [])

  const syncActiveSession = useCallback(async () => {
    if (syncPromiseRef.current) {
      return syncPromiseRef.current
    }

    const promise = (async () => {
      try {
        const session = await fetchActiveFocusSession()
        const resolvedSession = await resolveSessionState(session)
        setNow(Date.now())
        invalidateFocusQueries()
        return resolvedSession
      } finally {
        setTimeout(() => {
          syncPromiseRef.current = null
        }, 1000)
      }
    })()

    syncPromiseRef.current = promise
    return promise
  }, [invalidateFocusQueries, resolveSessionState])

  useEffect(() => {
    let isMounted = true

    async function initialSync() {
      try {
        const session = await fetchActiveFocusSession()
        if (!isMounted) return

        await resolveSessionState(session)
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
  }, [resolveSessionState])

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
          const resolvedCurrent = await resolveSessionState(current)
          return resolvedCurrent ?? current
        }

        const session = await createFocusSession(input)
        setActiveSession(session)
        setNow(Date.now())
        setEndedSession(null)
        setPendingCompletionSession(null)
        lastCompletionSoundSessionIdRef.current = null
        invalidateFocusQueries()
        playFocusSound()
        return session
      } finally {
        setIsStarting(false)
      }
    },
    [invalidateFocusQueries, resolveSessionState]
  )

  const endSession = useCallback(
    async (options: EndSessionOptions = {}) => {
      if (!activeSession || isEnding) return null

      setIsEnding(true)

      try {
        const interruptionDetails =
          options.interruptionDetails ?? getSessionInterruptions(activeSession)

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

        const session = await updateFocusSessionRecord(activeSession.session_id, {
          actualDuration,
          interruptions: options.interruptions ?? interruptionDetails.length,
          interruptionDetails,
          endedAt,
          metadata,
        })

        setActiveSession(null)
        setNow(Date.now())
        invalidateFocusQueries()
        setPendingCompletionSession(
          buildEndedSessionState(session, interruptionDetails, options.reason ?? 'manual', actualDuration)
        )
        playFocusSound()

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
        ...getSessionInterruptions(activeSession),
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

  const finalizeReflection = useCallback(
    async (
      sessionId: number,
      updates: {
        moodAfter: number
        energyEnd?: number | null
        interruptions?: number
        interruptionDetails?: InterruptionDetail[]
        metadata?: Record<string, unknown>
      }
    ) => {
      const session = await finalizeSessionReflection(sessionId, updates)

      invalidateFocusQueries()
      setEndedSession(null)
      setPendingCompletionSession(null)
      lastCompletionSoundSessionIdRef.current = null
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

    const endMs = getSessionEndTimestamp(activeSession)
    const existingInterruptions = getSessionInterruptions(activeSession)

    void (async () => {
      try {
        await updateFocusSessionRecord(activeSession.session_id, {
          actualDuration: activeSession.planned_duration,
          endedAt: new Date(endMs).toISOString(),
        })

        setActiveSession(null)
        setPendingCompletionSession(
          buildEndedSessionState(
            {
              ...activeSession,
              actual_duration: activeSession.planned_duration,
              ended_at: new Date(endMs).toISOString(),
            },
            existingInterruptions,
            'completed',
            activeSession.planned_duration
          )
        )
        lastCompletionSoundSessionIdRef.current = activeSession.session_id
        invalidateFocusQueries()
        playFocusSound()
      } catch (error) {
        autoEndingSessionIdRef.current = null
        console.error('Failed to auto-complete focus session:', error)
      }
    })()
  }, [activeSession, invalidateFocusQueries, now])

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
      pendingCompletionSession,
      startSession,
      endSession,
      syncActiveSession,
      addInterruption,
      saveSessionReflection,
      finalizeReflection,
      clearEndedSession: () => {
        setEndedSession(null)
        setPendingCompletionSession(null)
      },
    }),
    [
      activeSession,
      addInterruption,
      elapsedSeconds,
      endSession,
      endedSession,
      finalizeReflection,
      isEnding,
      isLoading,
      isStarting,
      pendingCompletionSession,
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
