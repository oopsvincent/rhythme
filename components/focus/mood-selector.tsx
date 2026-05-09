'use client'

import { cn } from '@/lib/utils'
import { Laugh, Smile, Meh, Frown, Angry } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const MOOD_LEVELS = [
  { value: 1, label: 'Mood Sad', icon: Angry, color: 'text-red-400' },
  { value: 2, label: 'Frown', icon: Frown, color: 'text-orange-400' },
  { value: 3, label: 'Meh', icon: Meh, color: 'text-amber-400' },
  { value: 4, label: 'Smile', icon: Smile, color: 'text-emerald-400' },
  { value: 5, label: 'Mood Happy', icon: Laugh, color: 'text-green-400' },
] as const

interface MoodSelectorProps {
  value: number | null
  onChange: (value: number | null) => void
  disabled?: boolean
  size?: 'sm' | 'md'
}

export function MoodSelector({ value, onChange, disabled, size = 'md' }: MoodSelectorProps) {
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  const btnSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1.5">
        {MOOD_LEVELS.map((level) => {
          const Icon = level.icon
          const isSelected = value === level.value
          return (
            <Tooltip key={level.value}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(isSelected ? null : level.value)}
                  className={cn(
                    'rounded-full flex items-center justify-center transition-all duration-200',
                    btnSize,
                    isSelected
                      ? 'bg-primary/10 ring-2 ring-primary scale-110'
                      : 'hover:bg-muted/60 hover:scale-105',
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <Icon className={cn(iconSize, isSelected ? level.color : 'text-muted-foreground/60')} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {level.label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}

export function MoodBadge({ value, size = 'sm' }: { value: number; size?: 'sm' | 'md' }) {
  const level = MOOD_LEVELS.find((l) => l.value === value)
  if (!level) return null

  const Icon = level.icon
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  return (
    <span className={cn('inline-flex items-center gap-1 text-xs', level.color)}>
      <Icon className={iconSize} />
      <span className="text-muted-foreground">{level.label}</span>
    </span>
  )
}

export function MoodDelta({ before, after }: { before: number; after: number }) {
  const delta = after - before
  const color = delta > 0 ? 'text-green-500 bg-green-500/10 border-green-500/20' :
                delta < 0 ? 'text-orange-500 bg-orange-500/10 border-orange-500/20' :
                'text-muted-foreground bg-muted border-border/50'
  
  const text = delta > 0 ? `Mood +${delta}` :
               delta < 0 ? `Mood ${delta}` :
               'Mood unchanged'

  return (
    <span className={cn('inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border', color)}>
      {text}
    </span>
  )
}

export { MOOD_LEVELS }
