'use client'

import { cn } from '@/lib/utils'
import { Flame, Zap, Smile, CloudMoon, Moon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const ENERGY_LEVELS = [
  { value: 1, label: 'Very Low', icon: Moon, color: 'text-muted-foreground' },
  { value: 2, label: 'Low', icon: CloudMoon, color: 'text-blue-400' },
  { value: 3, label: 'Medium', icon: Smile, color: 'text-amber-400' },
  { value: 4, label: 'High', icon: Zap, color: 'text-orange-400' },
  { value: 5, label: 'Very High', icon: Flame, color: 'text-red-400' },
] as const

interface EnergySelectorProps {
  value: number | null
  onChange: (value: number | null) => void
  disabled?: boolean
  size?: 'sm' | 'md'
}

export function EnergySelector({ value, onChange, disabled, size = 'md' }: EnergySelectorProps) {
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  const btnSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1.5">
        {ENERGY_LEVELS.map((level) => {
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

export function EnergyBadge({ value, size = 'sm' }: { value: number; size?: 'sm' | 'md' }) {
  const level = ENERGY_LEVELS.find((l) => l.value === value)
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

export { ENERGY_LEVELS }
