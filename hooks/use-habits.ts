"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getHabits,
  getHabit,
  getHabitStats,
  createHabit,
  updateHabit,
  deleteHabit,
  logHabitCompletion,
  removeHabitCompletion,
} from "@/app/actions/habits";
import type { HabitWithStats, CreateHabitInput, UpdateHabitInput } from "@/types/database";
import {
  getCachedPrediction,
  canUsePrediction,
  getDaysUntilPrediction,
} from "@/lib/habit-prediction";

// ==================== QUERY KEYS ====================
// Centralized query keys for consistency
export const habitKeys = {
  all: ["habits"] as const,
  detail: (id: number) => ["habit", id] as const,
  stats: (id: number) => ["habit-stats", id] as const,
  prediction: (id: number) => ["habit-prediction", id] as const,
};

// ==================== HOOKS ====================

/**
 * Fetch all habits with caching
 * - Returns habits immediately WITHOUT waiting for ML predictions
 * - Predictions are loaded separately via useHabitPrediction hook
 */
export function useHabits() {
  return useQuery({
    queryKey: habitKeys.all,
    queryFn: async () => {
      const result = await getHabits();
      if (result.error) throw new Error(result.error);

      // Return habits immediately with prediction eligibility info
      // Actual predictions are loaded separately to avoid blocking
      return (result.data || []).map((habit) => ({
        ...habit,
        daysUntilPrediction: canUsePrediction(habit)
          ? 0
          : getDaysUntilPrediction(habit),
        canPredict: canUsePrediction(habit),
      }));
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Fetch ML prediction for a single habit
 * - Loads prediction independently to not block habit list rendering
 * - Cached separately and can be slow (Render cold start)
 * - Only enabled if habit is eligible for prediction
 */
export function useHabitPrediction(habit: HabitWithStats | undefined) {
  return useQuery({
    queryKey: habitKeys.prediction(habit?.habit_id ?? 0),
    queryFn: async () => {
      if (!habit) return null;
      
      try {
        const prediction = await getCachedPrediction(
          habit.habit_id,
          habit,
          habit.completionLogs
        );
        return prediction;
      } catch (error) {
        console.error("Failed to fetch prediction:", error);
        return null;
      }
    },
    enabled: !!habit && canUsePrediction(habit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: 1, // Only retry once for predictions
  });
}

/**
 * Fetch a single habit with caching
 */
export function useHabit(habitId: number) {
  return useQuery({
    queryKey: habitKeys.detail(habitId),
    queryFn: async () => {
      const result = await getHabit(habitId);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Fetch habit stats
 */
export function useHabitStats(habitId: number) {
  return useQuery({
    queryKey: habitKeys.stats(habitId),
    queryFn: async () => {
      const result = await getHabitStats(habitId);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Create habit mutation with cache invalidation
 */
export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateHabitInput) => {
      const result = await createHabit(input);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      // Invalidate habits list to refetch
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
}

/**
 * Delete habit mutation with cache invalidation
 */
export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (habitId: number) => {
      const result = await deleteHabit(habitId);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      // Invalidate habits list to refetch
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
}

/**
 * Update habit mutation with cache invalidation
 */
export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habitId, input }: { habitId: number; input: UpdateHabitInput }) => {
      const result = await updateHabit(habitId, input);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (_, { habitId }) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
      queryClient.invalidateQueries({ queryKey: habitKeys.detail(habitId) });
    },
  });
}

/**
 * Log habit completion mutation
 * Invalidates both the list and detail queries
 */
export function useLogCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habitId, note }: { habitId: number; note?: string }) => {
      const result = await logHabitCompletion(habitId, note);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (_, { habitId }) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
      queryClient.invalidateQueries({ queryKey: habitKeys.detail(habitId) });
      queryClient.invalidateQueries({ queryKey: habitKeys.stats(habitId) });
      // Also invalidate prediction as completion affects it
      queryClient.invalidateQueries({ queryKey: habitKeys.prediction(habitId) });
    },
  });
}

/**
 * Remove habit completion mutation
 * Invalidates both the list and detail queries
 */
export function useRemoveCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habitId, date }: { habitId: number; date: string }) => {
      const result = await removeHabitCompletion(habitId, date);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (_, { habitId }) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
      queryClient.invalidateQueries({ queryKey: habitKeys.detail(habitId) });
      queryClient.invalidateQueries({ queryKey: habitKeys.stats(habitId) });
      // Also invalidate prediction as removal affects it
      queryClient.invalidateQueries({ queryKey: habitKeys.prediction(habitId) });
    },
  });
}

// ==================== REALTIME SUBSCRIPTION ====================

/**
 * Subscribe to realtime changes on habits table
 * Invalidates cache when changes occur
 * 
 * Usage: Call this hook once at the top level of your habits page
 * to enable realtime updates across all habit-related queries
 */
export function useHabitsRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("habits-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "habits" },
        (payload) => {
          console.log("[Realtime] Habits table changed:", payload.eventType);
          
          // Invalidate cache to refetch fresh data
          queryClient.invalidateQueries({ queryKey: habitKeys.all });
          
          // If we know which habit changed, invalidate its detail query too
          if (payload.new && 'habit_id' in payload.new) {
            const habitId = (payload.new as any).habit_id;
            queryClient.invalidateQueries({ queryKey: habitKeys.detail(habitId) });
            queryClient.invalidateQueries({ queryKey: habitKeys.stats(habitId) });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "habit_logs" },
        (payload) => {
          console.log("[Realtime] Habit logs changed:", payload.eventType);
          
          // Invalidate all habits as logs affect stats
          queryClient.invalidateQueries({ queryKey: habitKeys.all });
          
          // If we know which habit's log changed, invalidate its queries
          if (payload.new && 'habit_id' in payload.new) {
            const habitId = (payload.new as any).habit_id;
            queryClient.invalidateQueries({ queryKey: habitKeys.detail(habitId) });
            queryClient.invalidateQueries({ queryKey: habitKeys.stats(habitId) });
            queryClient.invalidateQueries({ queryKey: habitKeys.prediction(habitId) });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}