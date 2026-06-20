'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchFocusSessionById, updateFocusSessionRecord } from '@/lib/focus/focus-session-client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MoodBadge, MoodDelta, MOOD_LEVELS } from '@/components/focus/mood-selector'
import { EnergyBadge, ENERGY_LEVELS } from '@/components/focus/energy-selector'
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
  Heart,
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

function MoodIcon({ value, className }: { value: number; className?: string }) {
  const level = MOOD_LEVELS.find((l) => l.value === value)
  if (!level) return null
  const Icon = level.icon
  return <Icon className={cn(className, level.color)} />
}

function EnergyIcon({ value, className }: { value: number; className?: string }) {
  const level = ENERGY_LEVELS.find((l) => l.value === value)
  if (!level) return null
  const Icon = level.icon
  return <Icon className={cn(className, level.color)} />
}

const getMoodLabel = (value: number) => {
  const level = MOOD_LEVELS.find((l) => l.value === value)
  if (!level) return ''
  return level.label.replace('Mood ', '')
}

const getEnergyLabel = (value: number) => {
  const level = ENERGY_LEVELS.find((l) => l.value === value)
  return level ? level.label : ''
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
        <Link href="/focus?tab=history" className="text-sm text-primary hover:underline mt-2 inline-block">
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
      <div className="rounded-3xl border border-border/30 bg-card/45 dark:bg-card/25 backdrop-blur-md p-5 md:p-6 shadow-sm space-y-3 w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
      <div className="rounded-3xl border border-border/30 bg-card/45 dark:bg-card/25 backdrop-blur-md p-5 md:p-6 shadow-sm space-y-4.5 w-full relative overflow-hidden">
        {/* Subtle decorative calm background gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/[0.015] via-[#E07A5F]/[0.015] to-blue-500/[0.015] pointer-events-none" />

        <div className="flex items-center gap-2 relative z-10 select-none">
          <Heart className="h-4 w-4 text-[#E07A5F]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
            Mind & Energy Journey
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 relative z-10">
          {/* Mood Journey */}
          {(session.mood_before != null || session.mood_after != null) && (
            <div className="bg-background/25 dark:bg-muted/10 rounded-2xl p-4 border border-border/15 space-y-3.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground/80 font-medium">
                <span>Mood Journey</span>
                {session.mood_before != null && session.mood_after != null && (
                  <MoodDelta before={session.mood_before} after={session.mood_after} />
                )}
              </div>
              <div className="flex items-center justify-between gap-4 pt-1">
                {/* Starting Mood */}
                <div className="flex flex-col items-start space-y-1 flex-1">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50 font-bold">Before</span>
                  {session.mood_before != null ? (
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-card/85 dark:bg-card/40 border border-border/30 shadow-xs">
                        <MoodIcon value={session.mood_before} className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-semibold text-foreground/90">{getMoodLabel(session.mood_before)}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/40 italic">Not tracked</span>
                  )}
                </div>

                {/* Arrow / Line connector */}
                {session.mood_before != null && session.mood_after != null && (
                  <div className="flex-[1.5] flex items-center justify-center px-2">
                    <div className="relative w-full flex items-center justify-center">
                      <div className="w-full h-px border-t border-dashed border-border/40" />
                      <div className="absolute px-2.5 py-0.5 bg-background dark:bg-muted/30 rounded-full text-[9px] font-bold text-muted-foreground/70 border border-border/20 uppercase tracking-wider select-none scale-90">
                        {session.mood_after - session.mood_before > 0 ? "Calmer" : session.mood_after - session.mood_before < 0 ? "Lower" : "Steady"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Ending Mood */}
                <div className="flex flex-col items-end space-y-1 flex-1">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50 font-bold">After</span>
                  {session.mood_after != null ? (
                    <div className="flex items-center gap-2 flex-row-reverse text-right">
                      <div className="p-1.5 rounded-lg bg-card/85 dark:bg-card/40 border border-border/30 shadow-xs">
                        <MoodIcon value={session.mood_after} className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-semibold text-foreground/90">{getMoodLabel(session.mood_after)}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/40 italic">Not tracked</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Energy Journey */}
          {(session.energy_start != null || session.energy_end != null) && (
            <div className="bg-background/25 dark:bg-muted/10 rounded-2xl p-4 border border-border/15 space-y-3.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground/80 font-medium">
                <span>Energy Journey</span>
                {session.energy_start != null && session.energy_end != null && (
                  <span className={cn(
                    'inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase',
                    session.energy_end - session.energy_start > 0 ? 'text-green-500 bg-green-500/10 border-green-500/20' :
                    session.energy_end - session.energy_start < 0 ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' :
                    'text-muted-foreground bg-muted border-border/50'
                  )}>
                    {session.energy_end - session.energy_start > 0 ? `Charged +${session.energy_end - session.energy_start}` :
                     session.energy_end - session.energy_start < 0 ? `Drained ${session.energy_end - session.energy_start}` :
                     'Steady'}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-4 pt-1">
                {/* Starting Energy */}
                <div className="flex flex-col items-start space-y-1 flex-1">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50 font-bold">Start</span>
                  {session.energy_start != null ? (
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-card/85 dark:bg-card/40 border border-border/30 shadow-xs">
                        <EnergyIcon value={session.energy_start} className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-semibold text-foreground/90">{getEnergyLabel(session.energy_start)}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/40 italic">Not tracked</span>
                  )}
                </div>

                {/* Arrow / Line connector */}
                {session.energy_start != null && session.energy_end != null && (
                  <div className="flex-[1.5] flex items-center justify-center px-2">
                    <div className="relative w-full flex items-center justify-center">
                      <div className="w-full h-px border-t border-dashed border-border/40" />
                      <div className="absolute px-2.5 py-0.5 bg-background dark:bg-muted/30 rounded-full text-[9px] font-bold text-muted-foreground/70 border border-border/20 uppercase tracking-wider select-none scale-90">
                        {session.energy_end - session.energy_start > 0 ? "Charged" : session.energy_end - session.energy_start < 0 ? "Drained" : "Steady"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Ending Energy */}
                <div className="flex flex-col items-end space-y-1 flex-1">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50 font-bold">End</span>
                  {session.energy_end != null ? (
                    <div className="flex items-center gap-2 flex-row-reverse text-right">
                      <div className="p-1.5 rounded-lg bg-card/85 dark:bg-card/40 border border-border/30 shadow-xs">
                        <EnergyIcon value={session.energy_end} className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-semibold text-foreground/90">{getEnergyLabel(session.energy_end)}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/40 italic">Not tracked</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderInterruptionsList = () => {
    if (interruptions.length === 0) return null

    return (
      <div className="rounded-3xl border border-border/30 bg-card/45 dark:bg-card/25 backdrop-blur-md p-5 md:p-6 shadow-sm space-y-3 w-full">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
      <div className="rounded-3xl border border-border/30 bg-card/45 dark:bg-card/25 backdrop-blur-md p-5 md:p-6 shadow-sm space-y-3 w-full">
        <div className="flex items-center gap-2 mb-1">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tags</h3>
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
      <div className="flex md:hidden flex-col px-4 pb-8 w-full max-w-md mx-auto space-y-4">
        {/* Mobile Header Bar */}
        <div className="w-full flex items-center justify-between select-none pt-2">
          <button
            onClick={() => router.push("/focus?tab=history")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card/60 dark:bg-card/25 border border-border/30 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>History</span>
          </button>
          
          <div
            className={cn(
              'px-3 py-1 rounded-xl text-[9px] font-bold uppercase tracking-wider border shadow-xs',
              completed
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            )}
          >
            {completed ? 'Success' : 'Early'}
          </div>
        </div>

        {/* Title Block */}
        <div className="w-full select-none space-y-1 pb-1">
          <div className="flex flex-col items-start text-left">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E07A5F] bg-[#E07A5F]/10 px-2.5 py-1 rounded-md mb-1.5 select-none">
              Focus Summary
            </span>
            <h1 className="text-xl font-bold font-primary tracking-tight text-foreground leading-tight">
              {taskLabel}
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
              {new Date(session.started_at).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Mobile Session Focus Hero Card */}
        <div className="rounded-[28px] border border-border/30 bg-card/45 dark:bg-card/25 backdrop-blur-md p-6 relative overflow-hidden shadow-sm flex flex-col space-y-5">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
            <Clock className="w-24 h-24 text-primary" />
          </div>

          <div className="text-center space-y-1 relative z-10">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Focus Duration</span>
            <h2 className="text-4xl font-extrabold font-primary text-foreground tracking-tight">
              {formatDuration(actualDuration)}
            </h2>
            <p className="text-[10px] text-muted-foreground/80">
              Started {new Date(session.started_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} • {new Date(session.started_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </p>
          </div>

          <div className="space-y-2 relative z-10">
            <div className="h-2 overflow-hidden rounded-full bg-muted/30">
              <div
                className={cn("h-full rounded-full bg-primary")}
                style={{ width: `${Math.min(100, (actualDuration / session.planned_duration) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-0.5">
              <span>Planned: {formatDuration(session.planned_duration)}</span>
              <span>{Math.round(Math.min(100, (actualDuration / session.planned_duration) * 100))}% Completed</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border/10 pt-4 text-center relative z-10">
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Interruptions</span>
              <p className={cn("text-base font-bold", interruptions.length > 0 ? "text-destructive" : "text-emerald-500")}>
                {interruptions.length}
              </p>
            </div>
            <div className="space-y-1 border-l border-border/10">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Session ID</span>
              <p className="text-base font-bold text-foreground">
                #{session.session_id}
              </p>
            </div>
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
        {/* Overhauled Title Block */}
        <div className="w-full flex items-start justify-between pb-6 border-b border-border/15 relative z-10 select-none">
          <div className="space-y-1.5 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E07A5F] bg-[#E07A5F]/10 px-2.5 py-1 rounded-md">
              Focus Summary
            </span>
            <h1 className="text-3xl font-bold font-primary tracking-tight text-foreground/90 mt-1">
              {taskLabel}
            </h1>
            <p className="text-sm text-muted-foreground/85 flex items-center gap-1.5 mt-1">
              <CalendarDays className="h-4 w-4 text-[#E07A5F]" />
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

          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/focus/history"
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider',
                'bg-card/60 hover:bg-card border border-border/40 text-muted-foreground hover:text-foreground transition-all duration-300 shadow-sm'
              )}
            >
              <ArrowLeft className="h-4 w-4 text-[#E07A5F]" />
              Back to History
            </Link>
            
            <div
              className={cn(
                'px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider border shadow-sm shrink-0',
                completed
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              )}
            >
              {completed ? 'Success' : 'Early'}
            </div>
          </div>
        </div>

        {/* 2-Column Spacious Grid */}
        <div className="grid grid-cols-[1fr_320px] gap-8 items-start w-full">
          {/* Left Column (2/3 width) */}
          <div className="space-y-6">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="rounded-3xl border border-border/30 bg-card/45 dark:bg-card/25 backdrop-blur-md p-5 shadow-sm">
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

              <div className="rounded-3xl border border-border/30 bg-card/45 dark:bg-card/25 backdrop-blur-md p-5 shadow-sm">
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

              <div className="rounded-3xl border border-border/30 bg-card/45 dark:bg-card/25 backdrop-blur-md p-5 shadow-sm">
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
              <div className="rounded-3xl border border-border/30 bg-card/45 dark:bg-card/25 backdrop-blur-md p-5 shadow-sm text-center py-8">
                <p className="text-sm text-muted-foreground italic">No interruptions logged.</p>
              </div>
            )}

            {/* Tags Card */}
            {renderTagsCard()}

            {/* Session Info card */}
            <div className="rounded-3xl border border-border/30 bg-card/45 dark:bg-card/25 backdrop-blur-md p-5 shadow-sm space-y-3">
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
