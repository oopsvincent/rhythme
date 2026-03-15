"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import {
  getWeeklyPlan,
  upsertWeeklyPlan,
} from "@/app/actions/weekly";
import type { WeeklyPlanContent } from "@/app/actions/weekly";
import { getWeekBounds } from "@/lib/week-helpers";

// ==================== QUERY KEYS ====================
export const weeklyPlanKeys = {
  all: ["weekly-plan"] as const,
  week: (weekStart: string) => ["weekly-plan", weekStart] as const,
};

// ==================== HOOKS ====================

/**
 * Fetch the current week's plan with caching
 */
export function useWeeklyPlan(weekStart?: string) {
  const { weekStart: defaultStart } = getWeekBounds();
  const targetWeek = weekStart || defaultStart;

  return useQuery({
    queryKey: weeklyPlanKeys.week(targetWeek),
    queryFn: async () => {
      const result = await getWeeklyPlan(targetWeek);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Mutation to save the weekly plan
 */
export function useSaveWeeklyPlan() {
  const queryClient = useQueryClient();
  const { weekStart: defaultStart } = getWeekBounds();

  return useMutation({
    mutationFn: async ({
      content,
      weekStart,
    }: {
      content: WeeklyPlanContent;
      weekStart?: string;
    }) => {
      const result = await upsertWeeklyPlan(content, weekStart);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (_, { weekStart }) => {
      const target = weekStart || defaultStart;
      queryClient.invalidateQueries({
        queryKey: weeklyPlanKeys.week(target),
      });
    },
  });
}

/**
 * Auto-save hook with debounce for the weekly plan.
 * Returns a trigger function and save status.
 */
export function useAutoSaveWeeklyPlan(debounceMs = 600) {
  const saveMutation = useSaveWeeklyPlan();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>("");

  const triggerSave = useCallback(
    (content: WeeklyPlanContent, weekStart?: string) => {
      const serialized = JSON.stringify(content);

      // Skip if content hasn't actually changed
      if (serialized === lastSavedRef.current) return;

      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Set new debounce timer
      timerRef.current = setTimeout(() => {
        lastSavedRef.current = serialized;
        saveMutation.mutate({ content, weekStart });
      }, debounceMs);
    },
    [saveMutation, debounceMs]
  );

  return {
    triggerSave,
    isSaving: saveMutation.isPending,
    isSaved: saveMutation.isSuccess && !saveMutation.isPending,
    isError: saveMutation.isError,
  };
}
