'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchFocusSessionById, updateFocusSessionRecord } from '@/lib/focus/focus-session-client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MoodBadge, MoodDelta } from '@/components/focus/mood-selector'
import { EnergyBadge } from '@/components/focus/energy-selector'
import { formatDuration } from '@/lib/focus-mode'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
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
  ArrowLeft,
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
  const router = useRouter()
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
        const result = await fetchFocusSessionById(sessionId)
        setSession(result)

        // Initialize notes
        const metadata = result?.metadata as Record<string, unknown> | null
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
      const result = await updateFocusSessionRecord(session.session_id, {
        metadata: {
          ...existingMetadata,
          notes: notesText.trim() || null,
          reflection: notesText.trim() || null,
        },
      })

      setSession(result)
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
      <div className="w-full max-w-2xl mx-auto space-y-6 py-8">
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
        <Link href="/focus/history" className="text-sm text-primary hover:underline mt-2 inline-block">
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

  const renderNotesCard = () => {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm space-y-3 w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Notes & Reflection
          </h3>
          {!isEditingNotes && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
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
              className="min-h-[100px] resize-none text-sm bg-background/50 rounded-xl"
              maxLength={1000}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={() => setIsEditingNotes(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isSavingNotes}
                onClick={handleSaveNotes}
                className="gap-1 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95"
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
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{reflection}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic select-none">No notes added.</p>
        )}
      </div>
    )
  }

  const renderWellBeingCard = () => {
    if (session.mood_before == null && session.mood_after == null && session.energy_start == null && session.energy_end == null) {
      return null
    }

    return (
      <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm space-y-4 w-full">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Well-being
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Mood */}
          {(session.mood_before != null || session.mood_after != null) && (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium">Mood Check</p>
              {session.mood_before != null && session.mood_after != null ? (
                <MoodDelta before={session.mood_before} after={session.mood_after} />
              ) : session.mood_before != null ? (
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground">Before:</span>
                  <MoodBadge value={session.mood_before} />
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground">After:</span>
                  <MoodBadge value={session.mood_after!} />
                </div>
              )}
            </div>
          )}

          {/* Energy */}
          {(session.energy_start != null || session.energy_end != null) && (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium">Energy Level</p>
              {session.energy_start != null && session.energy_end != null ? (
                <div className="flex items-center gap-2">
                  <EnergyBadge value={session.energy_start} />
                  <span className="text-muted-foreground text-xs font-bold">→</span>
                  <EnergyBadge value={session.energy_end!} />
                </div>
              ) : session.energy_start != null ? (
                <EnergyBadge value={session.energy_start} />
              ) : (
                <EnergyBadge value={session.energy_end!} />
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderInterruptionsList = () => {
    if (interruptions.length === 0) return null

    return (
      <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm space-y-3 w-full">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Interruptions ({interruptions.length})
          </h3>
        </div>
        <div className="space-y-2">
          {interruptions.map((interruption, i) => {
            const IconComponent = INTERRUPTION_ICONS[interruption.type] ?? HelpCircle
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-muted/20 px-3.5 py-2.5 border border-border/10"
              >
                <IconComponent className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium capitalize">
                  {interruption.label || interruption.type.replace('_', ' ')}
                </span>
                <span className="text-xs text-muted-foreground ml-auto font-medium">
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
    )
  }

  const renderTagsCard = () => {
    if (tags.length === 0) return null

    return (
      <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm space-y-3 w-full">
        <div className="flex items-center gap-2 mb-1">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs rounded-lg px-2.5 py-1 border border-border/40 font-medium">
              {tag}
            </Badge>
          ))}
        </div>
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
            onClick={() => router.push("/focus/history")}
            className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Back to History"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <div className="flex flex-col items-center text-center max-w-[200px]">
            <h1 className="text-base font-bold font-primary tracking-wide text-foreground truncate w-full">
              {taskLabel}
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {new Date(session.started_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div
            className={cn(
              'px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border',
              completed
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-muted text-muted-foreground border-border/30'
            )}
          >
            {completed ? 'Success' : 'Early'}
          </div>
        </div>

        {/* Mobile Duration Details */}
        <div className="rounded-2xl border border-border/60 bg-card/50 p-5 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              label="Actual Duration"
              value={formatDuration(actualDuration)}
              icon={<Clock className="h-3.5 w-3.5 text-primary" />}
              highlight
            />
            <DetailItem
              label="Planned Duration"
              value={formatDuration(session.planned_duration)}
              icon={<Clock className="h-3.5 w-3.5 text-muted-foreground" />}
            />
          </div>
        </div>

        {/* Well-being Card */}
        {renderWellBeingCard()}

        {/* Notes & Reflection */}
        {renderNotesCard()}

        {/* Interruptions list */}
        {renderInterruptionsList()}

        {/* Tags */}
        {renderTagsCard()}
      </div>

      {/* ========================================================================= */}
      {/* PC/DESKTOP ONLY LAYOUT (Spacious dashboard design with columns)            */}
      {/* ========================================================================= */}
      <div className="hidden md:flex flex-col px-6 pb-8 w-full max-w-5xl mx-auto py-8 gap-8">
        {/* Centered Desktop Header Bar */}
        <div className="w-full flex items-center justify-between mb-2 select-none border-b border-border/20 pb-5">
          <button
            onClick={() => router.push("/focus/history")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all cursor-pointer text-sm font-medium"
            title="Back to History"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </button>
          
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold font-primary tracking-wide text-foreground">
              {taskLabel}
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <CalendarDays className="h-4 w-4" />
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
              'px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border',
              completed
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-muted text-muted-foreground border-border/30'
            )}
          >
            {completed ? 'Completed' : 'Ended Early'}
          </div>
        </div>

        {/* 2-Column Spacious Grid */}
        <div className="grid grid-cols-[1fr_320px] gap-8 items-start w-full">
          {/* Left Column (2/3 width) */}
          <div className="space-y-6">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="rounded-2xl border border-border/40 bg-card/40 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Actual Duration
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2.5 text-2xl font-bold font-primary tracking-tight text-primary">
                  {formatDuration(actualDuration)}
                </div>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card/40 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Planned Duration
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2.5 text-2xl font-bold font-primary tracking-tight text-foreground">
                  {formatDuration(session.planned_duration)}
                </div>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card/40 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Interruptions
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2.5 text-2xl font-bold font-primary tracking-tight text-foreground">
                  {interruptions.length}
                </div>
              </div>
            </div>

            {/* Well-being Card */}
            {renderWellBeingCard()}

            {/* Notes Card */}
            {renderNotesCard()}
          </div>

          {/* Right Column (1/3 width) - Sticky info panel */}
          <div className="sticky top-6 space-y-6">
            {/* Interruptions List */}
            {renderInterruptionsList() || (
              <div className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm text-center py-8">
                <p className="text-sm text-muted-foreground italic">No interruptions logged.</p>
              </div>
            )}

            {/* Tags Card */}
            {renderTagsCard()}

            {/* Session Info card */}
            <div className="rounded-2xl border border-border/40 bg-card/40 p-5 shadow-sm space-y-3">
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold border-b border-border/10 pb-2">
                Session Metadata
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session ID</span>
                  <span className="font-mono text-foreground font-semibold">#{session.session_id}</span>
                </div>
                {session.ended_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed At</span>
                    <span className="text-foreground font-semibold">
                      {new Date(session.ended_at).toLocaleTimeString(undefined, {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mode type</span>
                  <span className="text-foreground font-semibold capitalize">Focus Session</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
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
