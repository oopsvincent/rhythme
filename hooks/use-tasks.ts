"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getTasks,
  getTask,
  getTaskStats,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "@/app/actions/getTasks";
import type { Task, CreateTaskInput, UpdateTaskInput, Status } from "@/types/database";

// ==================== QUERY KEYS ====================
export const taskKeys = {
  all: ["tasks"] as const,
  detail: (id: string) => ["task", id] as const,
  stats: ["task-stats"] as const,
};

// ==================== HOOKS ====================

/**
 * Fetch all tasks with caching
 */
export function useTasks() {
  return useQuery({
    queryKey: taskKeys.all,
    queryFn: async () => {
      const result = await getTasks();
      if (result.error) throw new Error(result.error);
      return result.data || [];
    },
  });
}

/**
 * Fetch a single task
 */
export function useTask(taskId: string) {
  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: async () => {
      const result = await getTask(taskId);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: !!taskId,
  });
}

/**
 * Fetch task stats
 */
export function useTaskStats() {
  return useQuery({
    queryKey: taskKeys.stats,
    queryFn: async () => {
      const result = await getTaskStats();
      if (result.error) throw new Error(result.error);
      return result.data;
    },
  });
}

/**
 * Create task mutation
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const result = await createTask(input);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats });
    },
  });
}

/**
 * Update task mutation
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: UpdateTaskInput }) => {
      const result = await updateTask(taskId, updates);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats });
    },
  });
}

/**
 * Update task status mutation
 */
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: Status }) => {
      const result = await updateTaskStatus(taskId, status);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats });
    },
  });
}

/**
 * Delete task mutation
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const result = await deleteTask(taskId);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats });
    },
  });
}

// ==================== REALTIME SUBSCRIPTION ====================

/**
 * Subscribe to realtime changes on tasks table
 */
export function useTasksRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("tasks-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          console.log("[Realtime] Tasks table changed:", payload.eventType);
          queryClient.invalidateQueries({ queryKey: taskKeys.all });
          queryClient.invalidateQueries({ queryKey: taskKeys.stats });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

// ==================== HELPERS ====================

export function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium":
      return "bg-primary/10 text-primary border-primary/20";
    case "low":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-accent/10 text-accent border-accent/20";
    case "in_progress":
      return "bg-primary/10 text-primary border-primary/20";
    case "pending":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getStatusLabel(status: string) {
  switch (status) {
    case "completed":
      return "Completed";
    case "in_progress":
      return "In Progress";
    case "pending":
      return "Pending";
    default:
      return status;
  }
}
