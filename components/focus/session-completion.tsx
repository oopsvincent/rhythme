'use client'

import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MoodSelector } from '@/components/focus/mood-selector'
import { EnergySelector } from '@/components/focus/energy-selector'
import { useFocusSessionController } from '@/components/focus/focus-session-provider'
import { formatDuration } from '@/lib/focus-mode'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Check, Loader2 } from 'lucide-react'
import type { FocusSession, InterruptionDetail } from '@/types/database'

interface SessionCompletionProps {
  session: FocusSession
  actualDuration: number
  interruptions: InterruptionDetail[]
  onComplete: () => void
}

export function SessionCompletion({
  session,
  actualDuration,
  interruptions,
  onComplete,
}: SessionCompletionProps) {
  const { finalizeReflection } = useFocusSessionController()
  const [moodAfter, setMoodAfter] = useState<number | null>(session.mood_after ?? null)
  const [energyEnd, setEnergyEnd] = useState<number | null>(session.energy_end ?? session.energy_start)
  const [reflection, setReflection] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const taskLabel = session.custom_task_text || session.tasks?.title || 'Focus Session'
  const completed = actualDuration >= session.planned_duration

  const handleSave = useCallback(async () => {
    if (moodAfter === null) {
      toast.error('Please select your ending mood.')
      return
    }

    setIsSaving(true)
    try {
      const existingMetadata = (session.metadata as Record<string, unknown>) ?? {}

      await finalizeReflection(session.session_id, {
        moodAfter,
        energyEnd,
        interruptions: interruptions.length,
        interruptionDetails: interruptions,
        metadata: {
          ...existingMetadata,
          reflection: reflection.trim() || null,
          completed,
        },
      })

      toast.success('Session saved. Well done.')
      onComplete()
    } catch (error) {
      console.error('Failed to save session:', error)
      toast.error('We could not save the session.')
    } finally {
      setIsSaving(false)
    }
  }, [
    completed,
    energyEnd,
    interruptions,
    moodAfter,
    onComplete,
    reflection,
    finalizeReflection,
    session.metadata,
    session.session_id,
  ])

  return (
    <div className="w-full max-w-md mx-auto space-y-8 rounded-[28px] border border-border/60 bg-card/40 p-6 shadow-sm md:p-8">
      <div className="space-y-2 text-center">
        <div
          className={cn(
            'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full',
            completed ? 'bg-primary/10' : 'bg-muted/40'
          )}
        >
          <Check className={cn('h-8 w-8', completed ? 'text-primary' : 'text-muted-foreground')} />
        </div>
        <h2 className="text-xl font-bold tracking-tight">
          {completed ? 'Session Complete' : 'Session Ended'}
        </h2>
        <p className="truncate text-sm text-muted-foreground">{taskLabel}</p>
        <p className="text-2xl font-bold text-primary">{formatDuration(actualDuration)}</p>
        {interruptions.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {interruptions.length} interruption{interruptions.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          How are you feeling?
          <span className="ml-0.5 text-destructive">*</span>
        </label>
        <MoodSelector value={moodAfter} onChange={setMoodAfter} size="md" />
        
        {moodAfter !== null && session.mood_before !== null && (
          <div className={cn(
            'text-sm font-medium animate-in fade-in slide-in-from-top-1',
            moodAfter - session.mood_before > 0 ? 'text-green-500' :
            moodAfter - session.mood_before < 0 ? 'text-orange-500' :
            'text-muted-foreground'
          )}>
            {moodAfter - session.mood_before > 0 ? `Mood improved by +${moodAfter - session.mood_before} points` :
             moodAfter - session.mood_before < 0 ? `Mood decreased by ${moodAfter - session.mood_before} points` :
             'Mood stayed the same'}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">
          Ending Energy
          <span className="ml-1 text-xs">(optional)</span>
        </label>
        <EnergySelector value={energyEnd} onChange={setEnergyEnd} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          What helped or distracted you?
          <span className="ml-1 text-xs">(optional)</span>
        </label>
        <Textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Brief reflection…"
          className="min-h-[60px] resize-none text-sm"
          maxLength={500}
        />
      </div>

      <Button
        size="lg"
        className="h-12 w-full rounded-xl text-base font-semibold"
        disabled={isSaving || moodAfter === null}
        onClick={handleSave}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Saving…
          </>
        ) : (
          'Save Session'
        )}
      </Button>
    </div>
  )
}
