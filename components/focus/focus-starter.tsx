'use client'

import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { EnergySelector } from '@/components/focus/energy-selector'
import { MoodSelector } from '@/components/focus/mood-selector'
import { useFocusSessionController } from '@/components/focus/focus-session-provider'
import { useTasks } from '@/hooks/use-tasks'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Search,
  Play,
  ChevronDown,
  X,
  Loader2,
} from 'lucide-react'
import type { Task, FocusSession } from '@/types/database'

const DURATION_CHIPS = [25, 35, 45, 60, 90] as const
const TAG_OPTIONS = ['Deep Work', 'Creative', 'Admin', 'Learning', 'Review', 'Other'] as const

interface FocusStarterProps {
  onSessionStarted: (session: FocusSession) => void
}

export function FocusStarter({ onSessionStarted }: FocusStarterProps) {
  const { data: allTasks = [], isLoading: tasksLoading } = useTasks()
  const { activeSession, isStarting, startSession, syncActiveSession } = useFocusSessionController()

  // Form state

  // Form state
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [customTaskText, setCustomTaskText] = useState('')
  const [isCustomTask, setIsCustomTask] = useState(false)
  const [duration, setDuration] = useState(35)
  const [isCustomDuration, setIsCustomDuration] = useState(false)
  const [customDurationInput, setCustomDurationInput] = useState('')
  const [energyStart, setEnergyStart] = useState<number | null>(null)
  const [moodStart, setMoodStart] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  // Task combobox state
  const [taskSearchOpen, setTaskSearchOpen] = useState(false)
  const [taskSearchQuery, setTaskSearchQuery] = useState('')

  // Filter today's pending tasks
  const pendingTasks = useMemo(() => {
    return allTasks.filter(
      (task: Task) => task.status === 'pending' || task.status === 'in_progress'
    )
  }, [allTasks])

  const filteredTasks = useMemo(() => {
    if (!taskSearchQuery.trim()) return pendingTasks
    const q = taskSearchQuery.toLowerCase()
    return pendingTasks.filter((task: Task) => task.title.toLowerCase().includes(q))
  }, [pendingTasks, taskSearchQuery])

  const selectedTask = useMemo(
    () => pendingTasks.find((t: Task) => t.task_id === selectedTaskId),
    [pendingTasks, selectedTaskId]
  )

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }, [])

  const handleSelectTask = useCallback((task: Task) => {
    setSelectedTaskId(task.task_id)
    setIsCustomTask(false)
    setCustomTaskText('')
    setTaskSearchOpen(false)
    setTaskSearchQuery('')
  }, [])

  const handleSelectCustom = useCallback(() => {
    setSelectedTaskId(null)
    setIsCustomTask(true)
    setTaskSearchOpen(false)
    setTaskSearchQuery('')
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedTaskId(null)
    setIsCustomTask(false)
    setCustomTaskText('')
  }, [])

  const handleStartSession = useCallback(async () => {
    try {
      const current = await syncActiveSession()
      if (current) {
        toast.info('You already have an active focus session running.')
        onSessionStarted(current)
        return
      }

      const session = await startSession({
        taskId: selectedTaskId,
        customTaskText: isCustomTask ? customTaskText.trim() || null : null,
        plannedDuration: duration * 60,
        energyStart,
        moodBefore: moodStart,
        tags: selectedTags.length > 0 ? selectedTags : null,
        metadata: {
          notes: notes.trim() || null,
        },
      })

      onSessionStarted(session)
    } catch (error) {
      console.error('Failed to start focus session:', error)
      toast.error('We could not start the focus session.')
    }
  }, [
    customTaskText,
    duration,
    energyStart,
    moodStart,
    isCustomTask,
    notes,
    onSessionStarted,
    selectedTags,
    selectedTaskId,
    startSession,
    syncActiveSession,
  ])

  return (
    <div className="w-full space-y-6">
      {/* Start Session Card */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-6 md:p-8 space-y-6 shadow-sm">
        {/* Task Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">What will you focus on?</label>

          {/* Selected task display */}
          {(selectedTask || isCustomTask) && (
            <div className="flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
              <div className="flex-1 min-w-0">
                {selectedTask ? (
                  <span className="text-sm font-medium truncate block">{selectedTask.title}</span>
                ) : (
                  <Input
                    value={customTaskText}
                    onChange={(e) => setCustomTaskText(e.target.value)}
                    placeholder="What are you working on?"
                    className="border-0 bg-transparent p-0 h-auto text-sm font-medium shadow-none focus-visible:ring-0"
                    maxLength={120}
                    autoFocus
                  />
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground shrink-0"
                onClick={clearSelection}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {/* Task search combobox */}
          {!selectedTask && !isCustomTask && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setTaskSearchOpen(!taskSearchOpen)}
                className={cn(
                  'w-full flex items-center gap-2 rounded-xl border border-border/60 bg-background px-4 py-3 text-left text-sm transition-colors',
                  'hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30',
                  taskSearchOpen && 'ring-2 ring-primary/30 border-primary/40'
                )}
              >
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Search tasks or enter custom…</span>
                <ChevronDown className={cn('h-4 w-4 text-muted-foreground ml-auto shrink-0 transition-transform', taskSearchOpen && 'rotate-180')} />
              </button>

              {taskSearchOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 duration-150">
                  <div className="p-2">
                    <Input
                      value={taskSearchQuery}
                      onChange={(e) => setTaskSearchQuery(e.target.value)}
                      placeholder="Search tasks…"
                      className="h-9 text-sm"
                      autoFocus
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto px-1 pb-1">
                    {/* Custom focus option */}
                    <button
                      type="button"
                      onClick={handleSelectCustom}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-muted/60 transition-colors"
                    >
                      <span className="text-primary font-medium">✦ Custom Focus Session</span>
                    </button>

                    {tasksLoading ? (
                      <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto mb-1" />
                        Loading tasks…
                      </div>
                    ) : filteredTasks.length === 0 ? (
                      <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                        No matching tasks
                      </div>
                    ) : (
                      filteredTasks.map((task: Task) => (
                        <button
                          key={task.task_id}
                          type="button"
                          onClick={() => handleSelectTask(task)}
                          className={cn(
                            'w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-muted/60 transition-colors',
                            selectedTaskId === task.task_id && 'bg-primary/5'
                          )}
                        >
                          <span className="truncate">{task.title}</span>
                          {task.priority === 'high' && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0 text-destructive border-destructive/30">
                              High
                            </Badge>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Duration Chips */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Duration</label>
          <div className="flex flex-wrap items-center gap-2">
            {DURATION_CHIPS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setDuration(d)
                  setIsCustomDuration(false)
                  setCustomDurationInput('')
                }}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  !isCustomDuration && duration === d
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/50 text-foreground hover:bg-muted border border-border/40'
                )}
              >
                {d}m
              </button>
            ))}

            {/* Custom duration chip + inline input */}
            {isCustomDuration ? (
              <div className="flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground shadow-sm pl-3 pr-1 py-1">
                <Input
                  type="number"
                  min={1}
                  max={180}
                  value={customDurationInput}
                  onChange={(e) => {
                    const val = e.target.value
                    setCustomDurationInput(val)
                    const num = parseInt(val, 10)
                    if (num >= 1 && num <= 180) setDuration(num)
                  }}
                  placeholder="min"
                  className="h-7 w-14 border-0 bg-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm text-center rounded-full px-2 shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  autoFocus
                />
                <span className="text-xs font-medium pr-1">min</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsCustomDuration(true)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-muted/50 text-foreground hover:bg-muted border border-dashed border-border/60"
              >
                Custom
              </button>
            )}
          </div>
        </div>

        {/* Starting Energy & Mood */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Starting Energy
              <span className="text-xs ml-1">(optional)</span>
            </label>
            <EnergySelector value={energyStart} onChange={setEnergyStart} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Starting Mood
              <span className="text-destructive ml-1">*</span>
            </label>
            <MoodSelector value={moodStart} onChange={setMoodStart} />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Tags
            <span className="text-xs ml-1">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                  selectedTags.includes(tag)
                    ? 'bg-accent/20 text-accent-foreground border border-accent/40'
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/60 border border-transparent'
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Notes
            <span className="text-xs ml-1">(optional)</span>
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any intentions for this session…"
            className="min-h-[60px] resize-none text-sm bg-background/50"
            maxLength={500}
          />
        </div>

        {/* Start Button */}
        <Button
          size="lg"
          className="w-full h-12 rounded-xl text-base font-semibold gap-2"
          disabled={isStarting || Boolean(activeSession) || moodStart === null}
          onClick={handleStartSession}
        >
          {isStarting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Starting…
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              {activeSession ? 'Session Already Running' : 'Start Focus Session'}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
