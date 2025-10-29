// app/types/database.ts
export type Priority = 'low' | 'medium' | 'high'
export type Status = 'todo' | 'in_progress' | 'completed'

export interface Task {
  task_id: string
  user_id: string
  title: string
  description: string | null
  due_date: string | null
  priority: Priority
  status: Status
  created_at: string
  updated_at: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  due_date?: string
  priority?: Priority
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  due_date?: string
  priority?: Priority
  status?: Status
}

// Generic API response type
export type ActionResponse<T = object> = 
  | { data: T; error?: never }
  | { data?: never; error: string }