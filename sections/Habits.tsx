"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Plus, CheckCircle2, Circle, Flame, TrendingUp } from "lucide-react"
import { Progress } from "../components/ui/progress"
import { motion } from "framer-motion"

interface Habit {
  id: string
  name: string
  description: string
  frequency: 'daily' | 'weekly'
  category: string
  streak: number
  completedDates: string[]
  color: string
}

const initialHabits: Habit[] = [
  {
    id: '1',
    name: 'Morning Exercise',
    description: '30 minutes of cardio or strength training',
    frequency: 'daily',
    category: 'Health',
    streak: 12,
    completedDates: ['2025-10-10', '2025-10-09', '2025-10-08'],
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'Read for 20 minutes',
    description: 'Read books or articles',
    frequency: 'daily',
    category: 'Learning',
    streak: 8,
    completedDates: ['2025-10-10', '2025-10-09'],
    color: 'bg-green-500'
  },
  {
    id: '3',
    name: 'Meditation',
    description: '10 minutes of mindfulness meditation',
    frequency: 'daily',
    category: 'Wellness',
    streak: 15,
    completedDates: ['2025-10-10', '2025-10-09', '2025-10-08'],
    color: 'bg-purple-500'
  },
  {
    id: '4',
    name: 'Weekly Review',
    description: 'Review goals and plan for the week',
    frequency: 'weekly',
    category: 'Productivity',
    streak: 4,
    completedDates: ['2025-10-06'],
    color: 'bg-orange-500'
  },
]

export function Habits() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({
    name: '',
    description: '',
    frequency: 'daily',
    category: '',
    color: 'bg-blue-500'
  })

  const today = new Date().toISOString().split('T')[0]

  const toggleHabitCompletion = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompletedToday = habit.completedDates.includes(today)
        
        if (isCompletedToday) {
          return {
            ...habit,
            completedDates: habit.completedDates.filter(date => date !== today),
            streak: Math.max(0, habit.streak - 1)
          }
        } else {
          return {
            ...habit,
            completedDates: [...habit.completedDates, today],
            streak: habit.streak + 1
          }
        }
      }
      return habit
    }))
  }

  const addHabit = () => {
    if (!newHabit.name) return
    
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      description: newHabit.description || '',
      frequency: newHabit.frequency as 'daily' | 'weekly' || 'daily',
      category: newHabit.category || 'General',
      streak: 0,
      completedDates: [],
      color: newHabit.color || 'bg-blue-500'
    }
    
    setHabits([...habits, habit])
    setNewHabit({
      name: '',
      description: '',
      frequency: 'daily',
      category: '',
      color: 'bg-blue-500'
    })
    setIsAddDialogOpen(false)
  }

  const dailyHabits = habits.filter(h => h.frequency === 'daily')
  const weeklyHabits = habits.filter(h => h.frequency === 'weekly')
  
  const completedToday = habits.filter(h => h.completedDates.includes(today)).length
  const totalDaily = dailyHabits.length
  const completionRate = totalDaily > 0 ? (completedToday / totalDaily) * 100 : 0

  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0)
  const longestStreak = Math.max(...habits.map(h => h.streak), 0)

  const colors = [
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-orange-500', label: 'Orange' },
    { value: 'bg-pink-500', label: 'Pink' },
    { value: 'bg-red-500', label: 'Red' },
  ]

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl">Habits</h1>
          <p className="text-muted-foreground text-sm md:text-base">Build and track your daily habits</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="mr-2 h-4 w-4" />
              Add Habit
            </button>
          </DialogTrigger> 
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Habit</DialogTitle>
              <DialogDescription>Add a new habit to track</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Habit Name</Label>
                <Input
                  placeholder="e.g., Morning Exercise"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Brief description"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select
                    value={newHabit.frequency}
                    onValueChange={(value) => setNewHabit({ ...newHabit, frequency: value as Habit['frequency'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    placeholder="e.g., Health"
                    value={newHabit.category}
                    onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Select
                  value={newHabit.color}
                  onValueChange={(value) => setNewHabit({ ...newHabit, color: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map(color => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className={`h-4 w-4 rounded ${color.value}`} />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <button 
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors"
                onClick={addHabit}
              >
                Add Habit
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs md:text-sm">Completed Today</CardDescription>
            <CardTitle className="text-xl md:text-3xl">{completedToday}/{totalDaily}</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <Progress value={completionRate} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs md:text-sm">Total Habits</CardDescription>
            <CardTitle className="text-2xl md:text-3xl">{habits.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs md:text-sm">Combined Streak</CardDescription>
            <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
              <Flame className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
              {totalStreak}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs md:text-sm">Longest Streak</CardDescription>
            <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
              {longestStreak}
            </CardTitle>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Daily Habits */}
      <div className="space-y-4">
        <h2 className="text-lg md:text-xl">Daily Habits</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          {dailyHabits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              isCompletedToday={habit.completedDates.includes(today)}
              onToggle={toggleHabitCompletion}
            />
          ))}
        </div>
      </div>

      {/* Weekly Habits */}
      {weeklyHabits.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl">Weekly Habits</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            {weeklyHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompletedToday={habit.completedDates.includes(today)}
                onToggle={toggleHabitCompletion}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function HabitCard({
  habit,
  isCompletedToday,
  onToggle
}: {
  habit: Habit
  isCompletedToday: boolean
  onToggle: (id: string) => void
}) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onToggle(habit.id)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`h-3 w-3 rounded-full ${habit.color}`} />
              <h3>{habit.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{habit.description}</p>
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="outline">{habit.category}</Badge>
              <Badge variant="secondary">
                <Flame className="mr-1 h-3 w-3" />
                {habit.streak} day streak
              </Badge>
              <Badge variant="outline" className="capitalize">
                {habit.frequency}
              </Badge>
            </div>
          </div>
          <button
            className={`shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-md transition-colors ${
              isCompletedToday 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              onToggle(habit.id)
            }}
          >
            {isCompletedToday ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
