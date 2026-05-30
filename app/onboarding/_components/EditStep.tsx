// app/onboarding/_components/EditStep.tsx
'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, Plus, RefreshCw, Loader2, ArrowRight } from 'lucide-react'
import type { TaskItem, HabitItem } from '../_types/onboarding'
import {
  MAX_TASKS,
  MAX_HABITS,
  MAX_REGENERATIONS,
  frequencyToNumeric,
} from '../_types/onboarding'
import type { HabitSource } from '@/types/database'

interface AutoResizingTextareaProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  className?: string
}

function AutoResizingTextarea({
  value,
  onChange,
  placeholder,
  className,
}: AutoResizingTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      rows={1}
    />
  )
}

interface EditStepProps {
  tasks: TaskItem[]
  habits: HabitItem[]
  fallbackUsed: boolean
  regenerateCount: number
  isRegenerating: boolean
  regenerationError: string | null
  onUpdateTask: (id: string, updates: Partial<TaskItem>) => void
  onDeleteTask: (id: string) => void
  onAddTask: () => void
  onUpdateHabit: (id: string, updates: Partial<HabitItem>) => void
  onDeleteHabit: (id: string) => void
  onAddHabit: () => void
  onRegenerate: () => void
  onContinue: () => void
}

const freqOptions = [
  { value: 'daily', label: 'Daily' },
  { value: '2x per week', label: '2× week' },
  { value: '3x per week', label: '3× week' },
  { value: 'once per week', label: 'Weekly' },
] as const

const getTaskSource = (task: TaskItem): 'ai_generated' | 'user_edited' | 'manual' => {
  if (task.type === 'custom') return 'manual'
  return task.isEdited ? 'user_edited' : 'ai_generated'
}

const getHabitSource = (habit: HabitItem): 'ai_generated' | 'user_edited' | 'manual' => {
  if (habit.reason === '') return 'manual'
  return habit.isEdited ? 'user_edited' : 'ai_generated'
}

export function EditStep({
  tasks,
  habits,
  fallbackUsed,
  regenerateCount,
  isRegenerating,
  regenerationError,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
  onUpdateHabit,
  onDeleteHabit,
  onAddHabit,
  onRegenerate,
  onContinue,
}: EditStepProps) {
  const canRegenerate = regenerateCount < MAX_REGENERATIONS

  const renderBadge = (source: 'ai_generated' | 'user_edited' | 'manual') => {
    return (
      <span className="w-12 h-5 flex items-center justify-end select-none">
        <AnimatePresence mode="wait">
          {source === 'ai_generated' && (
            <motion.span
              key="ai"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              className="text-[9px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
            >
              AI
            </motion.span>
          )}
          {source === 'user_edited' && (
            <motion.span
              key="edited"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              className="text-[9px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-muted/10 text-muted-foreground border border-border whitespace-nowrap"
            >
              Edited
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    )
  }

  return (
    <div className="space-y-10 py-6 max-w-2xl mx-auto">
      {/* Heading */}
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-normal tracking-tight text-foreground font-serif-display sm:text-4xl leading-tight">
          {fallbackUsed ? "Here's a starting point — make it yours." : "Here's your plan"}
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          We structured your goal into actionable steps. Tweak anything below.
        </p>
      </div>

      {/* Tasks Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/30 pb-2">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Tasks</h2>
          <span className="text-xs text-muted-foreground/60 tabular-nums">
            {tasks.length}/{MAX_TASKS}
          </span>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="group relative rounded-xl border border-border bg-card p-4 transition-all hover:bg-muted/10"
            >
              {/* Delete button (hover only) */}
              <button
                onClick={() => onDeleteTask(task.id)}
                className="absolute right-2 top-2 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-[#ef4444] group-hover:opacity-100 focus:opacity-100"
                aria-label="Delete task"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <div className="space-y-2 pr-6">
                {/* Title input with badge */}
                <div className="flex items-start justify-between gap-3">
                  <AutoResizingTextarea
                    value={task.title}
                    onChange={(e) =>
                      onUpdateTask(task.id, { title: e.target.value })
                    }
                    placeholder="Task title"
                    className="w-full bg-transparent border border-transparent hover:border-border/40 focus:border-primary focus:bg-background/20 px-2 py-1 rounded text-foreground font-medium text-base transition-all focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-muted-foreground/50 shadow-none resize-none overflow-hidden outline-none"
                  />
                  {renderBadge(getTaskSource(task))}
                </div>

                {/* Description textarea */}
                <AutoResizingTextarea
                  value={task.description}
                  onChange={(e) =>
                    onUpdateTask(task.id, { description: e.target.value })
                  }
                  placeholder="Add description (optional)"
                  className="w-full bg-transparent border border-transparent hover:border-border/40 focus:border-primary focus:bg-background/20 px-2 py-1 rounded text-sm text-muted-foreground transition-all focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-muted-foreground/50 shadow-none resize-none min-h-[32px] h-auto overflow-hidden outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        {tasks.length < MAX_TASKS && (
          <button
            onClick={onAddTask}
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-primary hover:text-primary/80 transition-colors uppercase pt-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Add a task
          </button>
        )}
      </section>

      {/* Habits Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/30 pb-2">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Habits</h2>
          <span className="text-xs text-muted-foreground/60 tabular-nums">
            {habits.length}/{MAX_HABITS}
          </span>
        </div>

        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="group relative rounded-xl border border-border bg-card p-4 transition-all hover:bg-muted/10"
            >
              {/* Delete button (hover only) */}
              <button
                onClick={() => onDeleteHabit(habit.id)}
                className="absolute right-2 top-2 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-[#ef4444] group-hover:opacity-100 focus:opacity-100"
                aria-label="Delete habit"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <div className="space-y-3 pr-6">
                {/* Title input with badge */}
                <div className="flex items-start justify-between gap-3">
                  <AutoResizingTextarea
                    value={habit.title}
                    onChange={(e) =>
                      onUpdateHabit(habit.id, { title: e.target.value })
                    }
                    placeholder="Habit title"
                    className="w-full bg-transparent border border-transparent hover:border-border/40 focus:border-primary focus:bg-background/20 px-2 py-1 rounded text-foreground font-medium text-base transition-all focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-muted-foreground/50 shadow-none resize-none overflow-hidden outline-none"
                  />
                  {renderBadge(getHabitSource(habit))}
                </div>

                {/* Custom Segmented Control for Frequency */}
                <div className="flex border border-border bg-background/50 rounded-lg p-0.5 max-w-sm w-full select-none justify-between text-xs">
                  {freqOptions.map((opt) => {
                    const isSelected = habit.frequency === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => onUpdateHabit(habit.id, { frequency: opt.value })}
                        className={`flex-1 text-center py-1.5 rounded-md font-medium transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {habits.length < MAX_HABITS && (
          <button
            onClick={onAddHabit}
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-primary hover:text-primary/80 transition-colors uppercase pt-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Add a habit
          </button>
        )}
      </section>

      {/* Regenerate Section */}
      <div className="pt-2 space-y-3">
        <Button
          variant="outline"
          onClick={onRegenerate}
          disabled={!canRegenerate || isRegenerating}
          className="rounded-lg border-border hover:bg-muted hover:text-foreground text-sm text-muted-foreground transition-colors focus-visible:ring-offset-0 focus-visible:ring-primary"
        >
          {isRegenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
              Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate Plan
            </>
          )}
        </Button>
        {!canRegenerate && (
          <p className="text-xs text-muted-foreground">
            Your plan looks solid. You can adjust tasks anytime after setup.
          </p>
        )}
        {regenerationError && (
          <p className="text-xs text-destructive font-medium">{regenerationError}</p>
        )}
      </div>

      {/* CTA Button */}
      <div className="pt-4">
        <Button
          onClick={onContinue}
          className="h-14 w-full rounded-lg text-base font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary/95 focus-visible:ring-offset-0 focus-visible:ring-primary flex items-center justify-center gap-2"
          size="lg"
        >
          This Looks Right
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
