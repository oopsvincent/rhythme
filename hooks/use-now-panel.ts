"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTasks } from "@/hooks/use-tasks";
import { useHabits } from "@/hooks/use-habits";
import { useMoodLogs } from "@/hooks/use-mood-logs";
import { getLocalDateString } from "@/lib/timezone";
import { getFocusSessionsHistory } from "@/app/actions/focusSessions";
import { aggregateDailyLogs, calculateMomentumState } from "@/lib/rhythm-analysis";

// Custom hook to query focus sessions over the last 14 days using server action
export function useFocusSessionsHistory(days = 14) {
  return useQuery({
    queryKey: ["focus-sessions-history", days],
    queryFn: async () => {
      const result = await getFocusSessionsHistory(days);
      if (result.error) throw new Error(result.error);
      return result.data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export interface CapacityData {
  minTasks: number;
  maxTasks: number;
  minFocus: number;
  maxFocus: number;
  rangeText: string;
  explanation: string;
  energyLevel: string;
  moodType: "happy" | "calm" | "neutral" | "sad" | "frustrated" | "excited" | "anxious" | "none";
}

export function useNowPanel() {
  const { data: tasks = [], isLoading: tasksLoading, error: tasksError } = useTasks();
  const { data: habits = [], isLoading: habitsLoading, error: habitsError } = useHabits();
  const { data: moodLogs = [], isLoading: moodLoading, error: moodError } = useMoodLogs(14);
  const { data: focusSessions = [], isLoading: focusLoading, error: focusError } = useFocusSessionsHistory(14);

  const [localMood, setLocalMood] = useState<StoredMoodType>("none");

  // Debugging logs to verify error sources
  if (tasksError) console.error("[NowPanel Debug] tasksError:", tasksError);
  if (habitsError) console.error("[NowPanel Debug] habitsError:", habitsError);
  if (moodError) console.error("[NowPanel Debug] moodError:", moodError);
  if (focusError) console.error("[NowPanel Debug] focusError:", focusError);

  const todayStr = getLocalDateString();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("rhythme_daily_mood");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.date === todayStr) {
          setLocalMood(parsed.mood);
          return;
        }
      } catch {}
    }
    setLocalMood("none");
  }, [todayStr]);

  // ==========================================
  // 1. RECOMMENDED TASK PRIORITIZATION
  // ==========================================
  // Formula:
  // - Filter out completed tasks (only status !== 'completed')
  // - Score:
  //   - Priority: High = 3.0, Medium = 2.0, Low = 1.0
  //   - Due Date: Overdue or Due Today = +5.0 points
  //               Future Due Date = -2.0 points
  //               No Due Date = 0.0 points
  //   - Goal Linkage: Has goal_id = +1.5 points
  // - Sort descending. High scores represent immediate priority tasks.
  const recommendedTask = useMemo(() => {
    const pendingTasks = tasks.filter((t) => t.status !== "completed");
    if (pendingTasks.length === 0) return null;

    const scoredTasks = pendingTasks.map((task) => {
      let baseScore = 2.0; // Default Medium
      if (task.priority === "high") baseScore = 3.0;
      else if (task.priority === "low") baseScore = 1.0;

      let dueScore = 0.0;
      let isOverdueOrToday = false;

      if (task.due_date) {
        const dueDateStr = task.due_date.split("T")[0];
        if (dueDateStr === todayStr || dueDateStr < todayStr) {
          dueScore = 5.0; // Urgent boost
          isOverdueOrToday = true;
        } else {
          dueScore = -2.0; // Future task, de-prioritize for "Now"
        }
      }

      const goalScore = task.goal_id ? 1.5 : 0.0;
      const totalScore = baseScore + dueScore + goalScore;

      // Assign human-friendly reasons for transparency
      let recommendationReason = "Up next in your backlog";
      if (isOverdueOrToday) {
        recommendationReason = task.priority === "high" 
          ? "Urgent: High priority & due today/overdue"
          : "Due today or overdue";
      } else if (task.goal_id && task.priority === "high") {
        recommendationReason = "High priority task supporting your goal";
      } else if (task.goal_id) {
        recommendationReason = "Supports your active goal";
      } else if (task.priority === "high") {
        recommendationReason = "High priority backlog item";
      }

      return {
        ...task,
        smartScore: totalScore,
        recommendationReason,
      };
    });

    return scoredTasks.sort((a, b) => b.smartScore - a.smartScore)[0];
  }, [tasks, todayStr]);

  // ==========================================
  // 2. ACTIVE HABIT PRIORITIZATION
  // ==========================================
  // Logic:
  // - Filter out already completed active habits (is_active === true && isCompletedForPeriod === false)
  // - Prioritize Daily Habits (frequency_num = 0, weight 3.0) first,
  //   then Multiple Times/Week (frequency_num = 3, weight 2.0),
  //   Weekly (frequency_num = 1, weight 1.0), and Monthly (frequency_num = 2, weight 0.0).
  // - Add a streak weight modifier (current_streak * 0.1) to favor preserving high streaks (streak protection).
  const activeHabit = useMemo(() => {
    const pendingHabits = habits.filter(
      (h) => h.is_active && !h.isCompletedForPeriod
    );

    if (pendingHabits.length === 0) return null;

    const scoredHabits = pendingHabits.map((habit) => {
      let freqWeight = 0;
      if (habit.frequency_num === 0) freqWeight = 3;
      else if (habit.frequency_num === 3) freqWeight = 2;
      else if (habit.frequency_num === 1) freqWeight = 1;

      const streakWeight = habit.current_streak * 0.1;
      const totalScore = freqWeight + streakWeight;

      return {
        ...habit,
        smartScore: totalScore,
      };
    });

    return scoredHabits.sort((a, b) => b.smartScore - a.smartScore)[0];
  }, [habits]);

  // ==========================================
  // 3. REALISTIC CAPACITY HEURISTIC
  // ==========================================
  // Logic:
  // - Gather all user activity (mood check-ins, focus sessions, completed tasks) over the last 14 days.
  // - If logged days count < 7 (low data): return conservative fallback + friendly warning.
  // - Else: compute daily averages for completed tasks and focus minutes.
  // - Adjust by today's mood:
  //   - High mood (>= 4 or happy/excited in localStorage): multiplier = 1.2
  //   - Low mood (<= 2 or sad/frustrated/anxious in localStorage): multiplier = 0.8
  //   - Neutral (else): multiplier = 1.0
  const capacity: CapacityData = useMemo(() => {
    const fallbackCapacity: CapacityData = {
      minTasks: 2,
      maxTasks: 4,
      minFocus: 45,
      maxFocus: 90,
      rangeText: "A comfortable space today: 2-4 tasks / 45-90 mins",
      explanation: "Early days — we’ll reflect your patterns back as you log more.",
      energyLevel: "Steady Pace",
      moodType: "neutral",
    };

    // Calculate historical tasks done per day in the last 14 days
    const completedTasks = tasks.filter((t) => {
      if (!t.completed_at) return false;
      const compDate = new Date(t.completed_at);
      const diffTime = Math.abs(Date.now() - compDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 14;
    });

    // Group items by local date to count active days
    const activeDates = new Set<string>();

    const taskCountMap: Record<string, number> = {};
    completedTasks.forEach((t) => {
      if (t.completed_at) {
        const dateStr = t.completed_at.slice(0, 10);
        taskCountMap[dateStr] = (taskCountMap[dateStr] || 0) + 1;
        activeDates.add(dateStr);
      }
    });

    const focusMinsMap: Record<string, number> = {};
    focusSessions.forEach((s) => {
      const dateStr = s.started_at.slice(0, 10);
      const duration = s.actual_duration ?? s.planned_duration ?? 0;
      focusMinsMap[dateStr] = (focusMinsMap[dateStr] || 0) + Math.round(duration / 60);
      activeDates.add(dateStr);
    });

    moodLogs.forEach((m) => {
      activeDates.add(m.logged_at);
    });

    // If less than 7 days of activity, return conservative default
    if (activeDates.size < 7) {
      const todayMoodLog = moodLogs.find((m) => m.logged_at === todayStr);
      const moodScore = todayMoodLog ? todayMoodLog.mood_score : null;

      let energyLevel = "Steady Pace";
      let moodType: CapacityData["moodType"] = "neutral";

      if (moodScore !== null) {
        if (moodScore >= 4) {
          energyLevel = "High energy day";
          moodType = "happy";
        } else if (moodScore <= 2) {
          energyLevel = "Low energy day";
          moodType = "sad";
        }
      } else if (localMood !== "none") {
        if (["happy", "excited", "calm"].includes(localMood)) {
          energyLevel = "High energy day";
          moodType = localMood === "calm" ? "calm" : "happy";
        } else if (["sad", "frustrated", "anxious"].includes(localMood)) {
          energyLevel = "Low energy day";
          moodType = localMood === "anxious" ? "anxious" : "sad";
        }
      }

      return {
        ...fallbackCapacity,
        energyLevel,
        moodType,
      };
    }

    // Compute average tasks completed & focus minutes
    const totalDays = activeDates.size;
    const totalTasksCompleted = Object.values(taskCountMap).reduce((a, b) => a + b, 0);
    const totalFocusMins = Object.values(focusMinsMap).reduce((a, b) => a + b, 0);

    const avgTasks = totalTasksCompleted / totalDays;
    const avgFocus = totalFocusMins / totalDays;

    // Detect today's mood (Supabase DB first, then localStorage fallback)
    const todayMoodLog = moodLogs.find((m) => m.logged_at === todayStr);
    const dbMoodScore = todayMoodLog ? todayMoodLog.mood_score : null;

    let multiplier = 1.0;
    let energyLevel = "Steady Pace";
    let moodType: CapacityData["moodType"] = "neutral";
    let explanation = "Your rhythm feels steady today. A good day to protect your anchors and focus on what feels right.";

    if (dbMoodScore !== null) {
      if (dbMoodScore >= 4) {
        multiplier = 1.2;
        energyLevel = "Bright space";
        moodType = "happy";
        explanation = "You're in a bright space today. Similar to your stronger days last week, let's channel this energy gently.";
      } else if (dbMoodScore <= 2) {
        multiplier = 0.8;
        energyLevel = "Resting space";
        moodType = "sad";
        explanation = "Take it easy today. On days like this, starting with a short reflection has helped you anchor before.";
      }
    } else if (localMood !== "none") {
      if (["happy", "excited", "calm"].includes(localMood)) {
        multiplier = 1.2;
        energyLevel = "Bright space";
        moodType = localMood === "calm" ? "calm" : "happy";
        explanation = `Feeling ${localMood} today! Similar to your stronger days last week, let's support your focus sessions.`;
      } else if (["sad", "frustrated", "anxious"].includes(localMood)) {
        multiplier = 0.8;
        energyLevel = "Resting space";
        moodType = localMood === "anxious" ? "anxious" : "sad";
        explanation = `Feeling a bit ${localMood} today. On days like this, starting with a short reflection has helped you before.`;
      }
    }

    // Final target range calculation
    const baseMinTasks = Math.max(1, Math.round(avgTasks * multiplier * 0.8));
    const baseMaxTasks = Math.max(baseMinTasks + 1, Math.round(avgTasks * multiplier * 1.2));
    const baseMinFocus = Math.max(25, Math.round((avgFocus * multiplier * 0.8) / 5) * 5);
    const baseMaxFocus = Math.max(baseMinFocus + 15, Math.round((avgFocus * multiplier * 1.2) / 5) * 5);

    return {
      minTasks: baseMinTasks,
      maxTasks: baseMaxTasks,
      minFocus: baseMinFocus,
      maxFocus: baseMaxFocus,
      rangeText: `A comfortable space: ${baseMinTasks}-${baseMaxTasks} tasks / ${baseMinFocus}-${baseMaxFocus} mins`,
      explanation,
      energyLevel,
      moodType,
    };
  }, [tasks, focusSessions, moodLogs, todayStr, localMood]);

  const isLoading = tasksLoading || habitsLoading || moodLoading || focusLoading;
  const isError = Boolean(tasksError || habitsError || moodError || focusError);

  const logs = useMemo(() => {
    if (isLoading || isError) return [];
    return aggregateDailyLogs(tasks, habits, [], moodLogs, focusSessions);
  }, [tasks, habits, moodLogs, focusSessions, isLoading, isError]);

  const momentum = useMemo(() => {
    if (logs.length === 0) return { state: "stable", streak: 0, text: "Stable" };
    return calculateMomentumState(logs);
  }, [logs]);

  return {
    recommendedTask,
    activeHabit,
    capacity,
    momentum,
    isLoading,
    isError,
  };
}

type StoredMoodType = "happy" | "calm" | "neutral" | "sad" | "frustrated" | "excited" | "anxious" | "none";
