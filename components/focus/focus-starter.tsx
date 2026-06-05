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
  const [taskInput, setTaskInput] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [duration, setDuration] = useState(35)
  const [isCustomDuration, setIsCustomDuration] = useState(false)
  const [customDurationInput, setCustomDurationInput] = useState('')
  const [energyStart, setEnergyStart] = useState<number | null>(null)
  const [moodStart, setMoodStart] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Filter today's pending tasks
  const pendingTasks = useMemo(() => {
    return allTasks.filter(
      (task: Task) => task.status === 'pending' || task.status === 'in_progress'
    )
  }, [allTasks])

  const filteredTasks = useMemo(() => {
    if (!taskInput.trim() || selectedTaskId) return pendingTasks
    const q = taskInput.toLowerCase()
    return pendingTasks.filter((task: Task) => task.title.toLowerCase().includes(q))
  }, [pendingTasks, taskInput, selectedTaskId])

  const selectedTask = useMemo(
    () => pendingTasks.find((t: Task) => t.task_id === selectedTaskId),
    [pendingTasks, selectedTaskId]
  )

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }, [])

  const handleInputChange = useCallback((value: string) => {
    setTaskInput(value)
    if (selectedTaskId) {
      setSelectedTaskId(null)
    }
    setSuggestionsOpen(true)
  }, [selectedTaskId])

  const handleStartSession = useCallback(async () => {
    if (!taskInput.trim() && !selectedTaskId) {
      toast.error('Please enter what you want to focus on.')
      return
    }

    try {
      const current = await syncActiveSession()
      if (current) {
        toast.info('You already have an active focus session running.')
        onSessionStarted(current)
        return
      }

      const session = await startSession({
        taskId: selectedTaskId,
        customTaskText: selectedTaskId ? null : taskInput.trim() || null,
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
    taskInput,
    duration,
    energyStart,
    moodStart,
    notes,
    onSessionStarted,
    selectedTags,
    selectedTaskId,
    startSession,
    syncActiveSession,
  ])

  return (
    <div className="w-full space-y-8">
      {/* Start Session Section */}
      <div className="space-y-8">
        {/* Task Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">What will you focus on?</label>

          <div className="relative">
            <div className="relative flex items-center">
              <Input
                value={taskInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setSuggestionsOpen(true)}
                placeholder="What are you working on? (e.g. Design, Reading, Coding...)"
                className={cn(
                  "w-full bg-background/40 hover:bg-background/80 border border-border/40 focus:border-primary/50 focus:bg-background/80 px-5 py-4 h-14 rounded-2xl text-base font-semibold tracking-tight transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                  selectedTaskId && "pl-12 pr-32 text-primary font-bold bg-primary/5 border-primary/30 hover:bg-primary/5"
                )}
              />
              {/* Linked task indicator icon */}
              {selectedTaskId && (
                <span className="absolute left-4 text-primary">
                  <Play className="h-4 w-4 fill-current animate-pulse" />
                </span>
              )}
              {/* Actions/Clear buttons on right */}
              <div className="absolute right-3 flex items-center gap-1.5">
                {selectedTaskId && (
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/30 bg-primary/10 select-none">
                    Linked Task
                  </Badge>
                )}
                {(taskInput.length > 0 || selectedTaskId) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setTaskInput('')
                      setSelectedTaskId(null)
                      setSuggestionsOpen(true)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Suggestions Dropdown */}
            {suggestionsOpen && pendingTasks.length > 0 && (
              <>
                {/* Click-away backdrop */}
                <div className="fixed inset-0 z-40" onClick={() => setSuggestionsOpen(false)} />
                
                <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border bg-popover/95 backdrop-blur-xl shadow-xl overflow-hidden p-2 max-h-60 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/30 mb-1 select-none">
                    Link a pending task (optional)
                  </div>
                  <div className="space-y-1">
                    {filteredTasks.length === 0 ? (
                      <div className="px-3 py-4 text-center text-sm text-muted-foreground select-none">
                        No matching tasks. Press Enter or tab out to focus on your custom topic.
                      </div>
                    ) : (
                      filteredTasks.map((task: Task) => (
                        <button
                          key={task.task_id}
                          type="button"
                          onClick={() => {
                            setSelectedTaskId(task.task_id)
                            setTaskInput(task.title)
                            setSuggestionsOpen(false)
                          }}
                          className={cn(
                            'w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold hover:bg-muted/60 transition-colors',
                            selectedTaskId === task.task_id && 'bg-primary/10 text-primary'
                          )}
                        >
                          <span className="truncate">{task.title}</span>
                          {task.priority === 'high' && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0 text-destructive border-destructive/30 bg-destructive/5 select-none">
                              High
                            </Badge>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Duration chips */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Duration</label>
          <div className="flex flex-wrap items-center gap-2.5">
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
                  'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300',
                  !isCustomDuration && duration === d
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-95'
                    : 'bg-muted/30 text-foreground hover:bg-muted/60 border border-border/20 hover:border-border/40'
                )}
              >
                {d} min
              </button>
            ))}

            {/* Custom duration chip + inline input */}
            {isCustomDuration ? (
              <div className="flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 pl-4 pr-2 py-1.5">
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
                  className="h-8 w-16 border-0 bg-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm font-semibold text-center rounded-lg px-2 shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  autoFocus
                />
                <span className="text-xs font-semibold pr-1">min</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsCustomDuration(true)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 bg-muted/30 text-foreground hover:bg-muted border border-dashed border-border/40 hover:border-border/80"
              >
                Custom
              </button>
            )}
          </div>
        </div>

        {/* Starting Energy & Mood */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Starting Energy
              <span className="text-[10px] font-normal lowercase ml-1">(optional)</span>
            </label>
            <EnergySelector value={energyStart} onChange={setEnergyStart} />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-[0.15em] text-foreground">
              Starting Mood
              <span className="text-destructive ml-0.5">*</span>
            </label>
            <MoodSelector value={moodStart} onChange={setMoodStart} />
          </div>
        </div>

        {/* Collapsible Advanced Options Toggle */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", showAdvanced && "rotate-180")} />
            {showAdvanced ? "Hide options" : "Additional options (Tags, Notes)"}
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-6 pt-2 animate-in fade-in-50 slide-in-from-top-2 duration-300">
            {/* Tags */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                Tags
                <span className="text-[10px] font-normal lowercase ml-1">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300',
                      selectedTags.includes(tag)
                        ? 'bg-accent/25 text-accent-foreground border border-accent/40 shadow-sm'
                        : 'bg-muted/20 text-muted-foreground hover:bg-muted/50 border border-transparent'
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                Notes
                <span className="text-[10px] font-normal lowercase ml-1">(optional)</span>
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any intentions for this session…"
                className="min-h-[80px] resize-none text-sm bg-background/30 rounded-xl"
                maxLength={500}
              />
            </div>
          </div>
        )}

        {/* Start Button */}
        <Button
          size="lg"
          className="w-full h-14 rounded-2xl text-base font-bold tracking-tight gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:scale-[1.01] transition-all duration-300"
          disabled={isStarting || Boolean(activeSession) || moodStart === null || !taskInput.trim()}
          onClick={handleStartSession}
        >
          {isStarting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Starting…
            </>
          ) : (
            <>
              <Play className="h-5 w-5 fill-current" />
              {activeSession ? 'Session Already Running' : 'Start Focus Session'}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
