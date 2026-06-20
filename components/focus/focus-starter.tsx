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
  initialTaskId?: string | null
  initialTaskTitle?: string | null
}

export function FocusStarter({ 
  onSessionStarted, 
  initialTaskId = null, 
  initialTaskTitle = '' 
}: FocusStarterProps) {
  const { data: allTasks = [], isLoading: tasksLoading } = useTasks()
  const { activeSession, isStarting, startSession, syncActiveSession } = useFocusSessionController()

  // Form state
  const [taskInput, setTaskInput] = useState(initialTaskTitle || '')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(initialTaskId || null)
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
    <div className="w-full space-y-5">
      {/* Task Selector */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/65 select-none">
          What will you focus on?
        </label>

        <div className="relative">
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-muted-foreground/40 z-10 pointer-events-none">
              {selectedTaskId ? (
                <Play className="h-3.5 w-3.5 fill-[#E07A5F] text-[#E07A5F] animate-pulse" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </span>
            <Input
              value={taskInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setSuggestionsOpen(true)}
              placeholder="What are you working on?"
              className={cn(
                "w-full bg-card/45 dark:bg-card/25 hover:bg-card/75 dark:hover:bg-card/40 border border-border/30 focus:border-[#E07A5F]/50 focus:bg-card/85 dark:focus:bg-card/45 pl-10 pr-12 h-12 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E07A5F]/20 placeholder:text-muted-foreground/35 placeholder:text-xs placeholder:font-light",
                selectedTaskId && "text-[#E07A5F] font-bold bg-[#E07A5F]/5 border-[#E07A5F]/30 hover:bg-[#E07A5F]/5 pl-11 pr-32"
              )}
            />
            {/* Actions/Clear buttons on right */}
            <div className="absolute right-2 flex items-center gap-1.5">
              {selectedTaskId && (
                <Badge variant="outline" className="text-[9px] uppercase font-bold text-[#E07A5F] border-[#E07A5F]/35 bg-[#E07A5F]/5 py-0.5 px-2 select-none">
                  Linked Task
                </Badge>
              )}
              {(taskInput.length > 0 || selectedTaskId) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-muted text-muted-foreground/60 hover:text-foreground cursor-pointer"
                  onClick={() => {
                    setTaskInput('')
                    setSelectedTaskId(null)
                    setSuggestionsOpen(true)
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Suggestions Dropdown */}
          {suggestionsOpen && pendingTasks.length > 0 && (
            <>
              {/* Click-away backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setSuggestionsOpen(false)} />
              
              <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-border/30 bg-card/95 dark:bg-card/90 backdrop-blur-xl shadow-lg overflow-hidden p-1 max-h-60 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
                <div className="px-2.5 py-1.5 text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest border-b border-border/10 mb-1 select-none">
                  Link a pending task (optional)
                </div>
                <div className="space-y-0.5">
                  {filteredTasks.length === 0 ? (
                    <div className="px-3 py-4 text-center text-xs text-muted-foreground/80 select-none">
                      No matching tasks. Press Enter to focus on your custom topic.
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
                          'w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-semibold hover:bg-muted/80 transition-colors cursor-pointer',
                          selectedTaskId === task.task_id && 'bg-[#E07A5F]/10 text-[#E07A5F]'
                        )}
                      >
                        <span className="truncate">{task.title}</span>
                        {task.priority === 'high' && (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 shrink-0 text-destructive border-destructive/20 bg-destructive/5 select-none font-semibold">
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
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/65 select-none">Duration</label>
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
                'px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer',
                !isCustomDuration && duration === d
                  ? 'bg-primary text-primary-foreground shadow-sm hover:opacity-95'
                  : 'bg-muted/30 text-foreground hover:bg-muted/60 border border-border/20 hover:border-border/40'
              )}
            >
              {d} min
            </button>
          ))}

          {/* Custom duration chip + inline input */}
          {isCustomDuration ? (
            <div className="flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground shadow-sm pl-4 pr-2 py-1">
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
                className="h-7 w-12 border-0 bg-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-xs font-semibold text-center rounded-lg px-1.5 shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                autoFocus
              />
              <span className="text-xs font-semibold pr-1">min</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCustomDuration(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 bg-muted/30 text-foreground hover:bg-muted border border-dashed border-border/40 hover:border-border/80 cursor-pointer"
            >
              Custom
            </button>
          )}
        </div>
      </div>

      {/* Starting Energy & Mood */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/65 select-none">
            Starting Energy
            <span className="text-[9px] font-normal lowercase opacity-80 ml-1">(optional)</span>
          </label>
          <EnergySelector value={energyStart} onChange={setEnergyStart} />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/65 select-none">
            Starting Mood
            <span className="text-destructive/80 ml-0.5">*</span>
          </label>
          <MoodSelector value={moodStart} onChange={setMoodStart} />
        </div>
      </div>

      {/* Collapsible Advanced Options Toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", showAdvanced && "rotate-180")} />
          {showAdvanced ? "Hide options" : "Additional options (Tags, Notes)"}
        </button>
      </div>

      {showAdvanced && (
        <div className="space-y-4 pt-1 animate-in fade-in-50 slide-in-from-top-2 duration-300">
          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/65 select-none">
              Tags
              <span className="text-[9px] font-normal lowercase opacity-80 ml-1">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer',
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
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/65 select-none">
              Notes
              <span className="text-[9px] font-normal lowercase opacity-80 ml-1">(optional)</span>
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any intentions for this session study/work…"
              className="min-h-[80px] resize-none text-sm bg-background/30 rounded-xl"
              maxLength={500}
            />
          </div>
        </div>
      )}

      {/* Start Button */}
      <Button
        size="lg"
        className="w-full h-12 rounded-xl text-sm font-bold tracking-wide gap-2 shadow-md hover:shadow-lg hover:scale-[1.005] transition-all duration-300 cursor-pointer"
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
            <Play className="h-4 w-4 fill-current animate-none" />
            {activeSession ? 'Session Already Running' : 'Start Focus Session'}
          </>
        )}
      </Button>
    </div>
  )
}
