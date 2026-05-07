'use client'

import { useCallback, useEffect, useState } from 'react'
import { getFocusSession, updateFocusSessionNotes } from '@/app/actions/focusSessions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MoodBadge, MoodDelta } from '@/components/focus/mood-selector'
import { EnergyBadge, ENERGY_LEVELS } from '@/components/focus/energy-selector'
import { formatDuration, formatTime } from '@/lib/focus-mode'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  ChevronLeft,
  Clock,
  CalendarDays,
  AlertCircle,
  Tag,
  Edit3,
  Save,
  Loader2,
  Bell,
  Brain,
  Smartphone,
  Users,
  HelpCircle,
} from 'lucide-react'
import Link from 'next/link'
import type { FocusSession, InterruptionDetail } from '@/types/database'

const INTERRUPTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  notification: Bell,
  mind_wandering: Brain,
  phone: Smartphone,
  external: Users,
  other: HelpCircle,
}

interface SessionDetailClientProps {
  sessionId: number
}

export function SessionDetailClient({ sessionId }: SessionDetailClientProps) {
  const [session, setSession] = useState<FocusSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Notes editing
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notesText, setNotesText] = useState('')
  const [isSavingNotes, setIsSavingNotes] = useState(false)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const result = await getFocusSession(sessionId)
        if (result.error) throw new Error(result.error)
        setSession(result.data ?? null)

        // Initialize notes
        const metadata = result.data?.metadata as Record<string, unknown> | null
        const existingNotes = metadata?.notes as string | null
        const reflection = metadata?.reflection as string | null
        setNotesText(existingNotes || reflection || '')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load session')
      } finally {
        setIsLoading(false)
      }
    }
    void load()
  }, [sessionId])

  const handleSaveNotes = useCallback(async () => {
    if (!session) return
    setIsSavingNotes(true)
    try {
      const existingMetadata = (session.metadata as Record<string, unknown>) ?? {}
      const result = await updateFocusSessionNotes(session.session_id, {
        ...existingMetadata,
        notes: notesText.trim() || null,
        reflection: notesText.trim() || null,
      })

      if (result.error) throw new Error(result.error)
      setSession(result.data ?? session)
      setIsEditingNotes(false)
      toast.success('Notes updated.')
    } catch {
      toast.error('Could not save notes.')
    } finally {
      setIsSavingNotes(false)
    }
  }, [session, notesText])

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-16">
        <p className="text-destructive text-sm">{error ?? 'Session not found.'}</p>
        <Link href="/dashboard/focus/history" className="text-sm text-primary hover:underline mt-2 inline-block">
          Back to history
        </Link>
      </div>
    )
  }

  const taskLabel = session.custom_task_text?.trim() || session.tasks?.title || 'Focus Session'
  const actualDuration = session.actual_duration ?? session.planned_duration
  const completed = Boolean(session.ended_at) && actualDuration >= session.planned_duration
  const interruptions = (session.interruption_details as InterruptionDetail[]) ?? []
  const tags = session.tags ?? []
  const metadata = (session.metadata as Record<string, unknown>) ?? {}
  const reflection = (metadata.reflection as string) || (metadata.notes as string) || ''

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/focus/history"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold tracking-tight truncate">{taskLabel}</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(session.started_at).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium',
            completed
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {completed ? 'Completed' : 'Ended Early'}
        </div>
      </div>

      {/* Duration Card */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <DetailItem
            label="Actual Duration"
            value={formatDuration(actualDuration)}
            icon={<Clock className="h-4 w-4 text-primary" />}
            highlight
          />
          <DetailItem
            label="Planned Duration"
            value={formatDuration(session.planned_duration)}
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          />
          {session.ended_at && (
            <DetailItem
              label="Ended At"
              value={new Date(session.ended_at).toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
              })}
              icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
            />
          )}
        </div>
      </div>

      {/* Mood & Energy Card */}
      {(session.mood_before != null || session.mood_after != null || session.energy_start != null || session.energy_end != null) && (
        <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Well-being
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mood */}
            {session.mood_before != null && session.mood_after != null && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Mood</p>
                <MoodDelta before={session.mood_before} after={session.mood_after} />
              </div>
            )}
            {session.mood_before != null && session.mood_after == null && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Mood Before</p>
                <MoodBadge value={session.mood_before} />
              </div>
            )}
            {session.mood_before == null && session.mood_after != null && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Mood After</p>
                <MoodBadge value={session.mood_after} />
              </div>
            )}

            {/* Energy */}
            {session.energy_start != null && session.energy_end != null && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Energy</p>
                <div className="flex items-center gap-1.5">
                  <EnergyBadge value={session.energy_start} />
                  <span className="text-muted-foreground text-xs">→</span>
                  <EnergyBadge value={session.energy_end} />
                </div>
              </div>
            )}
            {session.energy_start != null && session.energy_end == null && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Starting Energy</p>
                <EnergyBadge value={session.energy_start} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interruptions Card */}
      {interruptions.length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Interruptions ({interruptions.length})
            </h3>
          </div>
          <div className="space-y-2">
            {interruptions.map((interruption, i) => {
              const IconComponent = INTERRUPTION_ICONS[interruption.type] ?? HelpCircle
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg bg-muted/20 px-3 py-2"
                >
                  <IconComponent className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm capitalize">
                    {interruption.label || interruption.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(interruption.timestamp).toLocaleTimeString(undefined, {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Notes / Reflection */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Notes & Reflection
          </h3>
          {!isEditingNotes && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1 text-muted-foreground"
              onClick={() => {
                setNotesText(reflection)
                setIsEditingNotes(true)
              }}
            >
              <Edit3 className="h-3 w-3" />
              Edit
            </Button>
          )}
        </div>

        {isEditingNotes ? (
          <div className="space-y-2">
            <Textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Add your notes or reflection…"
              className="min-h-[80px] resize-none text-sm"
              maxLength={1000}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingNotes(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isSavingNotes}
                onClick={handleSaveNotes}
                className="gap-1"
              >
                {isSavingNotes ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Save className="h-3 w-3" />
                )}
                Save
              </Button>
            </div>
          </div>
        ) : reflection ? (
          <p className="text-sm text-foreground whitespace-pre-wrap">{reflection}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No notes added.</p>
        )}
      </div>
    </div>
  )
}

function DetailItem({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string
  value: string
  icon: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className={cn('text-lg font-semibold', highlight ? 'text-primary' : 'text-foreground')}>
        {value}
      </p>
    </div>
  )
}
