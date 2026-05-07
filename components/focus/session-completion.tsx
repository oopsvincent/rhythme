'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MoodSelector } from '@/components/focus/mood-selector'
import { EnergySelector } from '@/components/focus/energy-selector'
import { endFocusSession } from '@/app/actions/focusSessions'
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
  const [moodAfter, setMoodAfter] = useState<number | null>(null)
  const [energyEnd, setEnergyEnd] = useState<number | null>(session.energy_start)
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

      const result = await endFocusSession({
        sessionId: session.session_id,
        actualDuration,
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

      if (result.error) {
        throw new Error(result.error)
      }

      toast.success('Session saved. Well done.')
      onComplete()
    } catch (error) {
      console.error('Failed to save session:', error)
      toast.error('We could not save the session.')
    } finally {
      setIsSaving(false)
    }
  }, [moodAfter, energyEnd, reflection, session, actualDuration, interruptions, completed, onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center px-6 animate-in fade-in-0 duration-300">
      <div className="w-full max-w-md space-y-8">
        {/* Summary Header */}
        <div className="text-center space-y-2">
          <div className={cn(
            'mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4',
            completed ? 'bg-primary/10' : 'bg-muted/40'
          )}>
            <Check className={cn('h-8 w-8', completed ? 'text-primary' : 'text-muted-foreground')} />
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            {completed ? 'Session Complete' : 'Session Ended'}
          </h2>
          <p className="text-sm text-muted-foreground truncate">{taskLabel}</p>
          <p className="text-2xl font-bold text-primary">
            {formatDuration(actualDuration)}
          </p>
          {interruptions.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {interruptions.length} interruption{interruptions.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Ending Mood */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            How are you feeling?
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <MoodSelector value={moodAfter} onChange={setMoodAfter} size="md" required />
        </div>

        {/* Ending Energy */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">
            Ending Energy
            <span className="text-xs ml-1">(optional)</span>
          </label>
          <EnergySelector value={energyEnd} onChange={setEnergyEnd} />
        </div>

        {/* Reflection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            What helped or distracted you?
            <span className="text-xs ml-1">(optional)</span>
          </label>
          <Textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Brief reflection…"
            className="min-h-[60px] resize-none text-sm"
            maxLength={500}
          />
        </div>

        {/* Save Button */}
        <Button
          size="lg"
          className="w-full h-12 rounded-xl text-base font-semibold"
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
    </div>
  )
}
