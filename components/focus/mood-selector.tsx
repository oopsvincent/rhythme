'use client'

import { cn } from '@/lib/utils'

const MOOD_LEVELS = [
  { value: 1, emoji: '😔', label: 'Very Low' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Great' },
] as const

interface MoodSelectorProps {
  value: number | null
  onChange: (value: number) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  required?: boolean
}

export function MoodSelector({ value, onChange, disabled, size = 'md', required }: MoodSelectorProps) {
  const emojiSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size]

  const btnSize = {
    sm: 'h-9 w-9',
    md: 'h-12 w-12',
    lg: 'h-14 w-14',
  }[size]

  return (
    <div className="flex items-center gap-2">
      {MOOD_LEVELS.map((mood) => {
        const isSelected = value === mood.value
        return (
          <button
            key={mood.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(mood.value)}
            className={cn(
              'rounded-full flex items-center justify-center transition-all duration-200',
              btnSize,
              isSelected
                ? 'bg-primary/10 ring-2 ring-primary scale-110'
                : 'hover:bg-muted/60 hover:scale-105',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            aria-label={mood.label}
          >
            <span className={emojiSize}>{mood.emoji}</span>
          </button>
        )
      })}
      {required && !value && (
        <span className="text-xs text-destructive ml-1">Required</span>
      )}
    </div>
  )
}

export function MoodBadge({ value }: { value: number }) {
  const mood = MOOD_LEVELS.find((m) => m.value === value)
  if (!mood) return null

  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span>{mood.emoji}</span>
      <span className="text-xs text-muted-foreground">{mood.label}</span>
    </span>
  )
}

export function MoodDelta({ before, after }: { before: number; after: number }) {
  const delta = after - before
  const color = delta > 0 ? 'text-green-500' : delta < 0 ? 'text-red-400' : 'text-muted-foreground'

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm', color)}>
      <MoodBadge value={before} />
      <span className="text-muted-foreground">→</span>
      <MoodBadge value={after} />
      {delta !== 0 && (
        <span className="text-xs font-medium">
          ({delta > 0 ? '+' : ''}{delta})
        </span>
      )}
    </span>
  )
}

export { MOOD_LEVELS }
