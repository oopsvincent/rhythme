'use client'

import { useCallback, useEffect, useState } from 'react'
import { FocusStarter } from '@/components/focus/focus-starter'
import { ActiveTimer } from '@/components/focus/active-timer'
import { SessionCompletion } from '@/components/focus/session-completion'
import { SessionCard } from '@/components/focus/session-card'
import { getFocusSessions } from '@/app/actions/focusSessions'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { History } from 'lucide-react'
import Link from 'next/link'
import type { FocusSession, InterruptionDetail } from '@/types/database'

type FocusPhase = 'idle' | 'active' | 'completion'

export function FocusHubClient() {
  const [phase, setPhase] = useState<FocusPhase>('idle')
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null)
  const [completionData, setCompletionData] = useState<{
    actualDuration: number
    interruptions: InterruptionDetail[]
  } | null>(null)
  const [recentSessions, setRecentSessions] = useState<FocusSession[]>([])
  const [isLoadingRecent, setIsLoadingRecent] = useState(true)

  const loadRecentSessions = useCallback(async () => {
    setIsLoadingRecent(true)
    try {
      const result = await getFocusSessions(4)
      if (result.data) {
        setRecentSessions(result.data)
      }
    } catch {
      // Non-critical
    } finally {
      setIsLoadingRecent(false)
    }
  }, [])

  useEffect(() => {
    void loadRecentSessions()
  }, [loadRecentSessions])

  const handleSessionStarted = useCallback((session: FocusSession) => {
    setActiveSession(session)
    setPhase('active')
  }, [])

  const handleSessionEnd = useCallback(
    (actualDuration: number, interruptions: InterruptionDetail[]) => {
      setCompletionData({ actualDuration, interruptions })
      setPhase('completion')
    },
    []
  )

  const handleCompletionDone = useCallback(() => {
    setPhase('idle')
    setActiveSession(null)
    setCompletionData(null)
    void loadRecentSessions()
  }, [loadRecentSessions])

  // Active Timer
  if (phase === 'active' && activeSession) {
    return <ActiveTimer session={activeSession} onSessionEnd={handleSessionEnd} />
  }

  // Session Completion
  if (phase === 'completion' && activeSession && completionData) {
    return (
      <SessionCompletion
        session={activeSession}
        actualDuration={completionData.actualDuration}
        interruptions={completionData.interruptions}
        onComplete={handleCompletionDone}
      />
    )
  }

  // Idle — Focus Hub
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Focus</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Calm, intentional deep work
          </p>
        </div>
        <Link
          href="/dashboard/focus/history"
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium',
            'text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors'
          )}
        >
          <History className="h-4 w-4" />
          History
        </Link>
      </div>

      {/* Focus Starter Form */}
      <FocusStarter onSessionStarted={handleSessionStarted} />

      {/* Recent Sessions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Recent Sessions
          </h2>
        </div>

        {isLoadingRecent ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : recentSessions.length === 0 ? (
          <div className="rounded-xl border border-border/30 bg-card/20 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No sessions yet. Start your first focus session above.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentSessions.map((session) => (
              <SessionCard key={session.session_id} session={session} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
