// app/types/database.ts
export type Priority = 'low' | 'medium' | 'high'
export type Status = 'pending' | 'in_progress' | 'completed'

export interface Task {
  task_id: string
  user_id: string
  title: string
  description: string | null
  due_date: string | null
  priority: Priority
  status: Status
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  due_date?: Date | undefined
  priority?: Priority
  status?: Status
}

export interface UpdateTaskInput {
  title?: string
  description?: string | null
  due_date?: string | null
  priority?: Priority
  status?: Status
  completed_at?: string | null
}

// Habits
export type HabitFrequency = 'daily' | 'weekly' | 'monthly'

// Matches the `habits` table
export interface Habit {
  habit_id: number
  user_id: string
  name: string
  description: string | null
  frequency: HabitFrequency
  streak_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Matches the `habit_logs` table
export interface HabitLog {
  habit_log_id: number
  habit_id: number
  user_id: string
  completed_at: string
  note: string | null
}

// Input types for habit CRUD operations
export interface CreateHabitInput {
  name: string
  description?: string
  frequency?: HabitFrequency
}

export interface UpdateHabitInput {
  name?: string
  description?: string | null
  frequency?: HabitFrequency
  is_active?: boolean
}

// ML Prediction types
export interface HabitPredictionInput {
  completion_rate_30d: number  // 0.0 - 1.0
  completion_rate_7d: number   // 0.0 - 1.0
  current_streak: number
  day_of_week: number          // 0-6 (Monday=0)
  days_since_start: number
  frequency_encoded: number    // 0=daily, 1=weekly, 2=monthly
  is_weekend: number           // 0 or 1
}

export interface HabitPrediction {
  prediction: "Complete" | "Skip"  // ML model's classification
  probability: number              // 0.0 - 1.0
  probability_percent: string      // e.g., "49.9%"
  message: string                  // Human-readable message
}

// Cached prediction with timestamp
export interface CachedHabitPrediction {
  prediction: HabitPrediction
  timestamp: number
}

// Extended habit with computed stats for UI
export interface HabitWithStats extends Habit {
  completedToday: boolean
  completionLogs: HabitLog[]
  prediction?: HabitPrediction | null
  daysUntilPrediction?: number // Days remaining until AI predictions are available
}

// Generic API response type
export type ActionResponse<T = object> = 
  | { data: T; error?: never }
  | { data?: never; error: string }

// Onboarding data stored in user_preferences.onboarding_data
export interface OnboardingData {
  role: "student" | "working_professional" | "freelancer" | "entrepreneur" | "other"
  daily_habits_target: number
  daily_tasks_target: number
}