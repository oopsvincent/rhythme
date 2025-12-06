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