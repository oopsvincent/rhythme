'use client'

import { useCallback, useEffect, useState } from 'react'
import { FocusHeatmapCalendar } from '@/components/focus/focus-heatmap-calendar'
import { SessionCard } from '@/components/focus/session-card'
import { fetchFocusSessionsPage } from '@/lib/focus/focus-session-client'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowLeft, CalendarDays, Brain } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { FocusSession } from '@/types/database'

const PAGE_SIZE = 10

export function FocusHistoryClient() {
  const router = useRouter()
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [isLoading, setIsLoading] = useState(true)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const loadSessions = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await fetchFocusSessionsPage(page, PAGE_SIZE, sortOrder)
      setSessions(result.sessions)
      setTotal(result.total)
    } catch {
      // handled
    } finally {
      setIsLoading(false)
    }
  }, [page, sortOrder])

  useEffect(() => {
    void loadSessions()
  }, [loadSessions])

  const handleSortToggle = useCallback(() => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
    setPage(0)
  }, [])

  const renderSessionsList = (showTitle = true) => {
    return (
      <div className="space-y-4 w-full">
        {showTitle && (
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Recorded Sessions
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={handleSortToggle}
            >
              <ArrowUpDown className="h-3 w-3" />
              {sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
            </Button>
          </div>
        )}

        {isLoading ? (
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

  return (
    <>
      {/* ========================================================================= */}
      {/* MOBILE ONLY LAYOUT (centered, narrow mockup layout)                       */}
      {/* ========================================================================= */}
      <div className="block md:hidden flex flex-col px-4 pb-8 w-full max-w-md mx-auto space-y-6">
        {/* Centered Mobile Header Bar */}
        <div className="w-full flex items-center justify-between py-4 select-none border-b border-border/10">
          <button
            onClick={() => router.push("/focus")}
            className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Back to Focus Hub"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <h1 className="text-base font-bold font-primary tracking-wide text-foreground">
              Focus History
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {total} sessions captured
            </p>
          </div>

          <div className="w-8 h-8" /> {/* Spacer to balance header */}
        </div>

        {/* Calendar Heatmap card */}
        <div className="rounded-2xl border border-border/60 bg-card/50 p-5 shadow-sm">
          <FocusHeatmapCalendar />
        </div>

        {/* Sessions list */}
        {renderSessionsList(true)}
      </div>

      {/* ========================================================================= */}
      {/* PC/DESKTOP ONLY LAYOUT (Spacious dashboard design with columns)            */}
      {/* ========================================================================= */}
      <div className="hidden md:flex flex-col px-6 pb-8 w-full max-w-5xl mx-auto py-8 gap-8">
        {/* Centered Desktop Header Bar */}
        <div className="w-full flex items-center justify-between mb-2 select-none border-b border-border/20 pb-5">
          <button
            onClick={() => router.push("/focus")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all cursor-pointer text-sm font-medium"
            title="Back to Focus Hub"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Focus Hub
          </button>
          
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold font-primary tracking-wide text-foreground">
              Focus Session History
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review and inspect your {total} recorded focus sessions
            </p>
          </div>

          <div className="w-[140px]" /> {/* Spacer to center title */}
        </div>

        {/* 2-Column Spacious Grid */}
        <div className="grid grid-cols-[1fr_320px] gap-8 items-start w-full">
          {/* Left Column - Sessions List */}
          {renderSessionsList(true)}

          {/* Right Column - Sticky calendar & summary metadata */}
          <div className="sticky top-6 space-y-6">
            {/* Heatmap Calendar */}
            <div className="rounded-2xl border border-border/60 bg-card/50 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 mb-1 border-b border-border/10 pb-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Focus Heatmap</h3>
              </div>
              <FocusHeatmapCalendar />
            </div>

            {/* Quick Analytics Tip Card */}
            <div className="rounded-2xl border border-border/45 bg-primary/5 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Brain className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Focus Tip</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Sustaining high completion rates requires minimizing phone or notification interruptions. Review your session reflections regularly to optimize focus environments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
