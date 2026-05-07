'use client'

import { formatDuration } from '@/lib/focus-mode'
import { cn } from '@/lib/utils'
import { Clock, AlertCircle } from 'lucide-react'
import { EnergyBadge } from '@/components/focus/energy-selector'
import type { FocusSession } from '@/types/database'
import Link from 'next/link'

interface SessionCardProps {
  session: FocusSession
  compact?: boolean
}

export function SessionCard({ session, compact = false }: SessionCardProps) {
  const taskLabel =
    session.custom_task_text?.trim() ||
    session.tasks?.title ||
    (session.metadata as Record<string, unknown>)?.name as string ||
    'Focus Session'
  const actualDuration = session.actual_duration ?? session.planned_duration
  const completed = Boolean(session.ended_at) && actualDuration >= session.planned_duration
  const interruptions = session.interruptions ?? 0
  const tags = session.tags ?? []

  return (
    <Link
      href={`/dashboard/focus/${session.session_id}`}
      className={cn(
        'block rounded-xl border border-border/40 bg-card/30 p-4 transition-all duration-200',
        'hover:bg-card/60 hover:border-border/60 hover:shadow-sm',
        compact && 'p-3'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-1">
          <p className={cn(
            'font-medium text-foreground truncate',
            compact ? 'text-sm' : 'text-base'
          )}>
            {taskLabel}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(session.started_at).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={cn(
            'flex items-center gap-1 text-sm font-medium',
            completed ? 'text-foreground' : 'text-muted-foreground'
          )}>
            <Clock className="h-3.5 w-3.5" />
            {formatDuration(actualDuration)}
          </span>
          <span
            className={cn(
              'h-2 w-2 rounded-full shrink-0',
              completed ? 'bg-primary' : 'bg-muted-foreground/40'
            )}
          />
        </div>
      </div>

      {!compact && (
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          {/* Mood delta */}
          {session.mood_before != null && session.mood_after != null && (
            <span className="text-xs text-muted-foreground">
              Mood: {getMoodEmoji(session.mood_before)} → {getMoodEmoji(session.mood_after)}
            </span>
          )}

          {/* Energy delta */}
          {session.energy_start != null && session.energy_end != null && (
            <span className="text-xs text-muted-foreground">
              Energy: {session.energy_start} → {session.energy_end}
            </span>
          )}
          {session.energy_start != null && session.energy_end == null && (
            <EnergyBadge value={session.energy_start} size="sm" />
          )}

          {/* Interruptions */}
          {interruptions > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              {interruptions}
            </span>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </Link>
  )
}

function getMoodEmoji(value: number): string {
  const map: Record<number, string> = {
    1: '😔',
    2: '😕',
    3: '😐',
    4: '🙂',
    5: '😊',
  }
  return map[value] ?? '😐'
}
