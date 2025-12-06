// app/actions/tasks.ts
'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Task, CreateTaskInput, UpdateTaskInput, ActionResponse, Status, Priority } from "@/types/database"

// Helper function to get authenticated user
async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error('Not authenticated')
  }
  
  return { user, supabase }
}

// GET all tasks for current user
export async function getTasks(): Promise<ActionResponse<Task[]>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { data: data as Task[] }
  } catch (error) {
    console.error('getTasks error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to fetch tasks' }
  }
}

// GET single task
export async function getTask(taskId: string): Promise<ActionResponse<Task>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('task_id', taskId)
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    return { data: data as Task }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to fetch task' }
  }
}

// GET tasks by status
export async function getTasksByStatus(status: Status): Promise<ActionResponse<Task[]>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', status)
      .order('due_date', { ascending: true, nullsFirst: false })

    if (error) throw error

    return { data: data as Task[] }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to fetch tasks' }
  }
}

// GET single task by ID 
export async function getTaskById(id: string | undefined): Promise<ActionResponse<Task>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('task_id', id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    return { data: data as Task }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to fetch task' }
  }
}

// GET tasks with filters
export async function getFilteredTasks(filters: {
  status?: Status
  priority?: Priority
  searchTerm?: string
}): Promise<ActionResponse<Task[]>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.priority) {
      query = query.eq('priority', filters.priority)
    }

    if (filters.searchTerm) {
      query = query.ilike('title', `%${filters.searchTerm}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return { data: data as Task[] }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to fetch tasks' }
  }
}

// CREATE task
export async function createTask(input: CreateTaskInput): Promise<ActionResponse<Task>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: input.title,
        description: input.description || null,
        due_date: input.due_date || null,
        priority: input.priority || 'medium',
        status: input.status || 'pending'
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/dashboard/tasks')
    return { data: data as Task }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create task' }
  }
}

// UPDATE task
export async function updateTask(
  taskId: string, 
  updates: UpdateTaskInput
): Promise<ActionResponse<Task>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    // Auto-set completed_at when status changes to completed
    const updateData = { ...updates }
    if (updates.status === 'completed' && !updates.completed_at) {
      updateData.completed_at = new Date().toISOString()
    } else if (updates.status && updates.status !== 'completed') {
      updateData.completed_at = null
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('task_id', taskId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/dashboard/tasks')
    return { data: data as Task }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update task' }
  }
}

// UPDATE task status
export async function updateTaskStatus(
  taskId: string, 
  status: Status
): Promise<ActionResponse<Task>> {
  const updates: UpdateTaskInput = { status }
  if (status === 'completed') {
    updates.completed_at = new Date().toISOString()
  } else {
    updates.completed_at = null
  }
  return updateTask(taskId, updates)
}

// DELETE task
export async function deleteTask(taskId: string): Promise<ActionResponse<{ success: boolean }>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('task_id', taskId)
      .eq('user_id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/tasks')
    return { data: { success: true } }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete task' }
  }
}

// BULK DELETE tasks
export async function deleteTasks(taskIds: string[]): Promise<ActionResponse<{ count: number }>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { error, count } = await supabase
      .from('tasks')
      .delete({ count: 'exact' })
      .in('task_id', taskIds)
      .eq('user_id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/tasks')
    return { data: { count: count || 0 } }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete tasks' }
  }
}

// GET task statistics
export async function getTaskStats(): Promise<ActionResponse<{
  total: number
  pending: number
  in_progress: number
  completed: number
  overdue: number
  dueToday: number
  highPriority: number
}>> {
  try {
    const { user, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
      .from('tasks')
      .select('status, due_date, priority')
      .eq('user_id', user.id)

    if (error) throw error

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayEnd = new Date(today)
    todayEnd.setHours(23, 59, 59, 999)

    const stats = {
      total: data.length,
      pending: data.filter(t => t.status === 'pending').length,
      in_progress: data.filter(t => t.status === 'in_progress').length,
      completed: data.filter(t => t.status === 'completed').length,
      overdue: data.filter(t => {
        if (t.status === 'completed' || !t.due_date) return false
        return new Date(t.due_date) < today
      }).length,
      dueToday: data.filter(t => {
        if (t.status === 'completed' || !t.due_date) return false
        const dueDate = new Date(t.due_date)
        return dueDate >= today && dueDate <= todayEnd
      }).length,
      highPriority: data.filter(t => t.status !== 'completed' && t.priority === 'high').length,
    }

    return { data: stats }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to fetch stats' }
  }
}