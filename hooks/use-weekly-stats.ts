"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getWeeklyStats,
  getWeeklyHistory,
} from "@/app/actions/weekly";
import type { WeeklyStats, WeeklyHistoryItem } from "@/app/actions/weekly";
import { getWeekBounds } from "@/lib/week-helpers";

// ==================== QUERY KEYS ====================
export const weeklyStatsKeys = {
  all: ["weekly-stats"] as const,
  week: (weekStart: string) => ["weekly-stats", weekStart] as const,
  history: ["weekly-history"] as const,
};

// ==================== HOOKS ====================

/**
 * Fetch aggregated stats for a week (tasks, habits, mood).
 */
export function useWeeklyStats(weekStart?: string) {
  const { weekStart: defaultStart } = getWeekBounds();
  const targetWeek = weekStart || defaultStart;

  return useQuery<WeeklyStats | undefined>({
    queryKey: weeklyStatsKeys.week(targetWeek),
    queryFn: async () => {
      const result = await getWeeklyStats(targetWeek);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Fetch past weekly plans/reviews with lightweight stats.
 */
export function useWeeklyHistory(limit = 8) {
  return useQuery<WeeklyHistoryItem[]>({
    queryKey: weeklyStatsKeys.history,
    queryFn: async () => {
      const result = await getWeeklyHistory(limit);
      if (result.error) throw new Error(result.error);
      return result.data || [];
    },
    staleTime: 60 * 1000,
  });
}
