'use client'

import { useCallback, useEffect, useState } from 'react'
import { useFocusSessionController } from '@/components/focus/focus-session-provider'
import { FocusStarter } from '@/components/focus/focus-starter'
import { ActiveTimer } from '@/components/focus/active-timer'
import { SessionCompletion } from '@/components/focus/session-completion'
import { SessionCard } from '@/components/focus/session-card'
import { 
  fetchRecentCompletedFocusSessions, 
  fetchFocusSessionsPage 
} from '@/lib/focus/focus-session-client'
import { FocusHeatmapCalendar } from '@/components/focus/focus-heatmap-calendar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Timer, History, CalendarDays, ArrowUpDown, ChevronLeft, ChevronRight, Brain } from 'lucide-react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import type { FocusSession } from '@/types/database'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useScrollDirection } from "@/hooks/use-scroll-direction"

export function FocusHubClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isVisible = useScrollDirection()
  const pathname = usePathname()
  
  const currentTab = searchParams?.get('tab') || 'session'

  const {
    activeSession,
    endedSession,
    pendingCompletionSession,
    isLoading: isLoadingActiveSession,
    clearEndedSession,
  } = useFocusSessionController()
  
  const [recentSessions, setRecentSessions] = useState<FocusSession[]>([])
  const [isLoadingRecent, setIsLoadingRecent] = useState(true)

  // History states
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  const PAGE_SIZE = 10
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const tabs = [
    { id: 'session', label: 'Session', icon: Timer },
    { id: 'history', label: 'History', icon: History },
    { id: 'heatmap', label: 'Heatmap', icon: CalendarDays },
  ]

  const setActiveTab = (tabId: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('tab', tabId)
    router.push(`${pathname}?${params.toString()}`)
  }

  const loadRecentSessions = useCallback(async () => {
    setIsLoadingRecent(true)
    try {
      const sessions = await fetchRecentCompletedFocusSessions(4)
      setRecentSessions(sessions)
    } catch {
      // Non-critical
    } finally {
      setIsLoadingRecent(false)
    }
  }, [])

  const loadHistorySessions = useCallback(async () => {
    if (currentTab !== 'history') return
    setIsLoadingHistory(true)
    try {
      const result = await fetchFocusSessionsPage(page, PAGE_SIZE, sortOrder)
      setSessions(result.sessions)
      setTotal(result.total)
    } catch {
      // Handle error
    } finally {
      setIsLoadingHistory(false)
    }
  }, [page, sortOrder, currentTab])

  useEffect(() => {
    if (currentTab === 'session') {
      void loadRecentSessions()
    } else if (currentTab === 'history') {
      void loadHistorySessions()
    }
  }, [currentTab, loadRecentSessions, loadHistorySessions, page, sortOrder])

  useEffect(() => {
    if (window.innerWidth >= 768 && (currentTab === 'history' || currentTab === 'heatmap')) {
      router.replace('/focus/history')
    }
  }, [currentTab, router])

  const handleSessionStarted = useCallback((session: FocusSession) => {
    setRecentSessions((current) => current.filter((item) => item.session_id !== session.session_id))
  }, [])

  const handleCompletionDone = useCallback(() => {
    clearEndedSession()
    if (currentTab === 'session') {
      void loadRecentSessions()
    }
  }, [clearEndedSession, loadRecentSessions, currentTab])

  const handleSortToggle = useCallback(() => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
    setPage(0)
  }, [])

  if (activeSession) {
    return <ActiveTimer session={activeSession} />
  }

  // Show completion screen for both ended sessions and pending completion
  const completionData = endedSession || pendingCompletionSession
  if (completionData) {
    return (
      <SessionCompletion
        session={completionData.session}
        actualDuration={completionData.actualDuration}
        interruptions={completionData.interruptions}
        onComplete={handleCompletionDone}
      />
    )
  }

  const renderSessionTab = () => {
    return (
      <div className="space-y-4 w-full max-w-2xl mx-auto animate-in fade-in duration-300">
        {/* Overhauled Title Block */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-border/10 relative z-10">
          <div className="space-y-1 flex-1">
            <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-[#E07A5F] bg-[#E07A5F]/10 px-2 py-0.5 rounded">
              DEEP WORK
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-primary tracking-tight text-foreground/95 mt-0.5">
              Focus Sanctuary
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed max-w-xl">
              Enter a calm, distraction-free space. Block out noise, set your intention, and step into flow.
            </p>
          </div>
          
          {/* PC/Desktop History Link */}
          <div className="hidden md:block shrink-0">
            <Link
              href="/focus/history"
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider',
                'bg-card/60 hover:bg-card border border-border/40 text-muted-foreground hover:text-foreground transition-all duration-300 shadow-sm'
              )}
            >
              <History className="h-4.5 w-4.5 text-[#E07A5F]" />
              Focus History
            </Link>
          </div>
        </div>

        {/* Focus Starter Form */}
        <FocusStarter onSessionStarted={handleSessionStarted} />
      </div>
    )
  }

  const renderHistoryTab = () => {
    return (
      <div className="space-y-5 w-full max-w-2xl mx-auto animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Focus History</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {total} sessions captured
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={handleSortToggle}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
          </Button>
        </div>

        {isLoadingHistory ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-2xl border border-border/30 bg-card/20 p-10 text-center">
            <p className="text-sm text-muted-foreground italic">No focus sessions found.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sessions.map((session) => (
              <SessionCard key={session.session_id} session={session} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="h-8 rounded-lg cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
            <span className="text-xs text-muted-foreground px-2 font-medium">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 rounded-lg cursor-pointer"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  const renderHeatmapTab = () => {
    return (
      <div className="space-y-5 w-full max-w-2xl mx-auto animate-in fade-in duration-300">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Focus Heatmap</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Visualize your focus rhythm over time
          </p>
        </div>

        {/* Calendar Heatmap card */}
        <div className="rounded-2xl border border-border/60 bg-card/50 p-5 shadow-sm">
          <FocusHeatmapCalendar />
        </div>

        {/* Quick Analytics Tip Card */}
        <div className="rounded-2xl border border-border/45 bg-primary/5 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Brain className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider font-semibold">Focus Tip</span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Sustaining high completion rates requires minimizing phone or notification interruptions. Review your session reflections regularly to optimize focus environments.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mobile-only Tab Layout with Appbar */}
      <div className="block md:hidden w-full relative pb-28">
        {currentTab === 'session' && renderSessionTab()}
        {currentTab === 'history' && renderHistoryTab()}
        {currentTab === 'heatmap' && renderHeatmapTab()}

        <div className={cn(
          "fixed bottom-0 left-0 right-0 z-50 w-full flex items-center bg-background/80 dark:bg-[#12141A]/90 backdrop-blur-xl border-t border-border/30 dark:border-border/10 p-2 pb-safe-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.45)] rounded-t-2xl transition-all duration-300 ease-in-out",
          isVisible ? "translate-y-0" : "translate-y-full opacity-0 pointer-events-none"
        )}>
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = currentTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 relative cursor-pointer select-none",
                  isActive ? "text-[#E07A5F]" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="focus-appbar-tab-mobile"
                    className="absolute inset-0 bg-neutral-100 dark:bg-[#1C202C] border border-black/5 dark:border-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] rounded-xl"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop-only Session Starter Layout (No Appbar / Tabs) */}
      <div className="hidden md:block w-full max-w-2xl mx-auto pb-12">
        {renderSessionTab()}
      </div>
    </div>
  )
}
