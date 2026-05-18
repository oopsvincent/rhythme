'use client'

import { useCallback, useEffect, useState } from 'react'
import { FocusHeatmapCalendar } from '@/components/focus/focus-heatmap-calendar'
import { SessionCard } from '@/components/focus/session-card'
import { fetchFocusSessionsPage } from '@/lib/focus/focus-session-client'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import type { FocusSession } from '@/types/database'

const PAGE_SIZE = 10

export function FocusHistoryClient() {
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

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/focus"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Focus History</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} session{total !== 1 ? 's' : ''} recorded
          </p>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-5 shadow-sm">
        <FocusHeatmapCalendar />
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            All Sessions
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1 text-muted-foreground"
            onClick={handleSortToggle}
          >
            <ArrowUpDown className="h-3 w-3" />
            {sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-xl border border-border/30 bg-card/20 p-8 text-center">
            <p className="text-sm text-muted-foreground">No focus sessions found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <SessionCard key={session.session_id} session={session} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="h-8"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="h-8"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
