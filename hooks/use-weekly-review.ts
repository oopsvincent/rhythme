"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import {
  getWeeklyReview,
  upsertWeeklyReview,
} from "@/app/actions/weekly";
import type { WeeklyReviewContent } from "@/app/actions/weekly";
import { getWeekBounds } from "@/lib/week-helpers";

// ==================== QUERY KEYS ====================
export const weeklyReviewKeys = {
  all: ["weekly-review"] as const,
  week: (weekStart: string) => ["weekly-review", weekStart] as const,
};

// ==================== HOOKS ====================

/**
 * Fetch the current week's review with caching
 */
export function useWeeklyReview(weekStart?: string) {
  const { weekStart: defaultStart } = getWeekBounds();
  const targetWeek = weekStart || defaultStart;

  return useQuery({
    queryKey: weeklyReviewKeys.week(targetWeek),
    queryFn: async () => {
      const result = await getWeeklyReview(targetWeek);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Mutation to save the weekly review
 */
export function useSaveWeeklyReview() {
  const queryClient = useQueryClient();
  const { weekStart: defaultStart } = getWeekBounds();

  return useMutation({
    mutationFn: async ({
      content,
      weekStart,
    }: {
      content: WeeklyReviewContent;
      weekStart?: string;
    }) => {
      const result = await upsertWeeklyReview(content, weekStart);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (_, { weekStart }) => {
      const target = weekStart || defaultStart;
      queryClient.invalidateQueries({
        queryKey: weeklyReviewKeys.week(target),
      });
    },
  });
}

/**
 * Auto-save hook with debounce for the weekly review.
 */
export function useAutoSaveWeeklyReview(debounceMs = 600) {
  const saveMutation = useSaveWeeklyReview();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>("");

  const triggerSave = useCallback(
    (content: WeeklyReviewContent, weekStart?: string) => {
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
