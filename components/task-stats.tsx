"use client"

import { useState, useEffect } from "react"
import { 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  TrendingUp, 
  Target, 
  AlertCircle,
  Calendar,
  Flame,
  Settings2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { Button } from "./ui/button"

interface TaskStats {
  total: number
  pending: number
  in_progress: number
  completed: number
  overdue?: number
  dueToday?: number
  completedThisWeek?: number
  highPriority?: number
}

interface StatCardConfig {
  id: string
  label: string
  key: keyof TaskStats | 'completionRate' | 'streak'
  icon: React.ReactNode
  colorClass: string
  enabled: boolean
}

const defaultStatCards: StatCardConfig[] = [
  { 
    id: 'total', 
    label: 'Total Tasks', 
    key: 'total', 
    icon: <ListTodo className="w-5 h-5" />,
    colorClass: 'bg-primary/10 text-primary border-primary/20',
    enabled: true
  },
  { 
    id: 'pending', 
    label: 'Pending', 
    key: 'pending', 
    icon: <Clock className="w-5 h-5" />,
    colorClass: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    enabled: true
  },
  { 
    id: 'in_progress', 
    label: 'In Progress', 
    key: 'in_progress', 
    icon: <TrendingUp className="w-5 h-5" />,
    colorClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    enabled: true
  },
  { 
    id: 'completed', 
    label: 'Completed', 
    key: 'completed', 
    icon: <CheckCircle2 className="w-5 h-5" />,
    colorClass: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    enabled: true
  },
  { 
    id: 'completionRate', 
    label: 'Completion Rate', 
    key: 'completionRate', 
    icon: <Target className="w-5 h-5" />,
    colorClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    enabled: false
  },
  { 
    id: 'overdue', 
    label: 'Overdue', 
    key: 'overdue', 
    icon: <AlertCircle className="w-5 h-5" />,
    colorClass: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    enabled: false
  },
  { 
    id: 'dueToday', 
    label: 'Due Today', 
    key: 'dueToday', 
    icon: <Calendar className="w-5 h-5" />,
    colorClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    enabled: false
  },
  { 
    id: 'highPriority', 
    label: 'High Priority', 
    key: 'highPriority', 
    icon: <Flame className="w-5 h-5" />,
    colorClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    enabled: false
  },
]

const STORAGE_KEY = 'rhythme_stat_preferences'

interface TaskStatsProps {
  stats: TaskStats
}

export function TaskStatsGrid({ stats }: TaskStatsProps) {
  const [statCards, setStatCards] = useState<StatCardConfig[]>(defaultStatCards)
  const [showSettings, setShowSettings] = useState(false)

  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const savedOrder = JSON.parse(saved) as { id: string; enabled: boolean }[]
          const merged = defaultStatCards.map(card => {
            const found = savedOrder.find(s => s.id === card.id)
            return found ? { ...card, enabled: found.enabled } : card
          })
          setStatCards(merged)
        } catch {
          // Use defaults
        }
      }
    }
  }, [])

  // Save preferences to localStorage
  const savePreferences = (cards: StatCardConfig[]) => {
    if (typeof window !== 'undefined') {
      const toSave = cards.map(c => ({ id: c.id, enabled: c.enabled }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    }
  }

  const toggleCard = (id: string) => {
    const updated = statCards.map(card => 
      card.id === id ? { ...card, enabled: !card.enabled } : card
    )
    setStatCards(updated)
    savePreferences(updated)
  }

  const getValue = (key: keyof TaskStats | 'completionRate' | 'streak'): string | number => {
    if (key === 'completionRate') {
      const total = stats.total || 0
      const completed = stats.completed || 0
      if (total === 0) return '0%'
      return `${Math.round((completed / total) * 100)}%`
    }
    if (key === 'streak') return 0
    return stats[key] ?? 0
  }

  const enabledCards = statCards.filter(c => c.enabled)

  return (
    <div className="space-y-3">
      {/* Header with customize button */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Overview</h3>
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-foreground">
              <Settings2 className="w-4 h-4 mr-1" />
              <span className="text-xs">Customize</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Customize Stats</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Choose which stats to display on your dashboard
              </p>
              {statCards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={card.id}
                    checked={card.enabled}
                    onCheckedChange={() => toggleCard(card.id)}
                  />
                  <div className={`p-1.5 rounded-md ${card.colorClass}`}>
                    {card.icon}
                  </div>
                  <Label htmlFor={card.id} className="flex-1 cursor-pointer">
                    {card.label}
                  </Label>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {enabledCards.map((card) => (
          <div
            key={card.id}
            className={`p-4 rounded-xl border ${card.colorClass} transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-2">
              {card.icon}
            </div>
            <p className="text-2xl font-bold">{getValue(card.key)}</p>
            <p className="text-xs opacity-70">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
