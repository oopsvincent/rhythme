"use server";
import { createClient } from "@/lib/supabase/server";
import type {
  Habit,
  HabitLog,
  HabitFrequency,
  CreateHabitInput,
  UpdateHabitInput,
  ActionResponse,
  HabitWithStats,
} from "@/types/database";
import {
  getPeriodBounds,
  getPeriodLabel,
  computeUnifiedStreak,
} from "@/lib/habit-helpers";
import { canCreateHabit } from "@/app/actions/usage-limits";

// === Authentication Helper ===
async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Not authenticated");
  }

  return { user, supabase };
}

// === Helper Functions ===

function daysSince(date: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Resolve the numeric frequency from a habit row.
 * Prefers frequency_num; falls back to the frequency field.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveFrequency(habit: any): HabitFrequency {
  if (habit.frequency_num !== null && habit.frequency_num !== undefined) {
    return habit.frequency_num as HabitFrequency;
  }
  // Fallback: parse old string frequency column
  const f = habit.frequency;
  if (typeof f === "number") return f as HabitFrequency;
  switch (f) {
    case "daily":
      return 0;
    case "weekly":
      return 1;
    case "monthly":
      return 2;
    default:
      return 0;
  }
}

/**
 * Count completions for a habit within a period range.
 */
async function countPeriodCompletions(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  habitId: number,
  userId: string,
  start: string,
  end: string,
): Promise<number> {
  const { count } = await supabase
    .from("habit_logs")
    .select("*", { count: "exact", head: true })
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .gte("completed_at", start)
    .lte("completed_at", end);

  return count ?? 0;
}

const MIN_DAYS_FOR_PREDICTION = 7;
const AT_RISK_THRESHOLD = 0.6;

// === CRUD Operations ===

export async function getHabits(): Promise<ActionResponse<HabitWithStats[]>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Fetch all active habits for the user
    const { data: habits, error: habitsError } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (habitsError) {
      return { error: habitsError.message };
    }

    if (!habits || habits.length === 0) {
      return { data: [] };
    }

    // Fetch all logs for all habits
    const { data: logs, error: logsError } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });

    if (logsError) {
      return { error: logsError.message };
    }

    const today = new Date().toISOString().split("T")[0];

    // Map habits with their stats
    const habitsWithStats: HabitWithStats[] = habits.map((habit: Habit) => {
      const freq = resolveFrequency(habit);
      const targetCount = (habit as any).target_count as number ?? 1;

      const habitLogs = (logs || []).filter(
        (log: HabitLog) => log.habit_id === habit.habit_id,
      );

      // Period-based progress
      const { start, end } = getPeriodBounds(freq);
      const periodLogs = habitLogs.filter(
        (log: HabitLog) => log.completed_at >= start && log.completed_at <= end,
      );
      const periodCompletions = periodLogs.length;
      const isCompletedForPeriod = periodCompletions >= targetCount;

      // Legacy compat fields
      const completedToday = habitLogs.some(
        (log: HabitLog) => log.completed_at.split("T")[0] === today,
      );
      const completedThisWeek = (() => {
        const weekBounds = getPeriodBounds(1);
        return habitLogs.some(
          (log: HabitLog) =>
            log.completed_at >= weekBounds.start && log.completed_at <= weekBounds.end,
        );
      })();

      // Streak
      const completionDates = habitLogs.map((log: HabitLog) => log.completed_at);
      const currentStreak = computeUnifiedStreak(freq, targetCount, completionDates);

      const daysOld = daysSince(new Date(habit.created_at));
      const canPredict = daysOld >= MIN_DAYS_FOR_PREDICTION;

      return {
        ...habit,
        frequency: freq,
        frequency_num: freq,
        target_count: targetCount,
        completedToday,
        completedThisWeek,
        isCompletedForPeriod,
        periodCompletions,
        periodTarget: targetCount,
        periodLabel: getPeriodLabel(freq),
        completionLogs: habitLogs,
        current_streak: currentStreak,
        prediction: null,
        daysUntilPrediction: canPredict ? undefined : MIN_DAYS_FOR_PREDICTION - daysOld,
      };
    });

    return { data: habitsWithStats };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to fetch habits",
    };
  }
}

export async function getHabit(
  habitId: number,
): Promise<ActionResponse<HabitWithStats>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    const { data: habit, error: habitError } = await supabase
      .from("habits")
      .select("*")
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .single();

    if (habitError) {
      return { error: habitError.message };
    }

    // Fetch all logs for this habit
    const { data: logs, error: logsError } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });

    if (logsError) {
      return { error: logsError.message };
    }

    const freq = resolveFrequency(habit as unknown as Record<string, unknown>);
    const targetCount = habit.target_count ?? 1;
    const today = new Date().toISOString().split("T")[0];

    // Period-based progress
    const { start, end } = getPeriodBounds(freq);
    const periodLogs = (logs || []).filter(
      (log: HabitLog) => log.completed_at >= start && log.completed_at <= end,
    );
    const periodCompletions = periodLogs.length;
    const isCompletedForPeriod = periodCompletions >= targetCount;

    // Legacy compat
    const completedToday = (logs || []).some(
      (log: HabitLog) => log.completed_at.split("T")[0] === today,
    );
    const weekBounds = getPeriodBounds(1);
    const completedThisWeek = (logs || []).some(
      (log: HabitLog) =>
        log.completed_at >= weekBounds.start && log.completed_at <= weekBounds.end,
    );

    // Streak
    const completionDates = (logs || []).map((log: HabitLog) => log.completed_at);
    const currentStreak = computeUnifiedStreak(freq, targetCount, completionDates);

    const daysOld = daysSince(new Date(habit.created_at));
    const canPredict = daysOld >= MIN_DAYS_FOR_PREDICTION;

    return {
      data: {
        ...habit,
        frequency: freq,
        frequency_num: freq,
        target_count: targetCount,
        completedToday,
        completedThisWeek,
        isCompletedForPeriod,
        periodCompletions,
        periodTarget: targetCount,
        periodLabel: getPeriodLabel(freq),
        completionLogs: logs || [],
        current_streak: currentStreak,
        prediction: null,
        daysUntilPrediction: canPredict ? undefined : MIN_DAYS_FOR_PREDICTION - daysOld,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to fetch habit",
    };
  }
}

export async function createHabit(
  input: CreateHabitInput,
): Promise<ActionResponse<Habit>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const limit = await canCreateHabit();

    if (!limit.allowed) {
      return {
        error: `Free accounts can track up to ${limit.limit} active habits. Upgrade to Premium for unlimited habits.`,
      };
    }

    const freq: HabitFrequency = input.frequency ?? 0;
    const targetCount = input.target_count ?? 1;

    const { data, error } = await supabase
      .from("habits")
      .insert({
        user_id: user.id,
        name: input.name,
        description: input.description || null,
        frequency: freq === 0 ? "daily" : freq === 1 ? "weekly" : freq === 2 ? "monthly" : "daily",
        frequency_num: freq,
        target_count: targetCount,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create habit",
    };
  }
}

export async function updateHabit(
  habitId: number,
  input: UpdateHabitInput,
): Promise<ActionResponse<Habit>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.name !== undefined) updatePayload.name = input.name;
    if (input.description !== undefined) updatePayload.description = input.description;
    if (input.is_active !== undefined) updatePayload.is_active = input.is_active;
    if (input.frequency !== undefined) {
      updatePayload.frequency_num = input.frequency;
      // Also update the string column for backward compat
      updatePayload.frequency = input.frequency === 0 ? "daily" : input.frequency === 1 ? "weekly" : input.frequency === 2 ? "monthly" : "daily";
    }
    if (input.target_count !== undefined) updatePayload.target_count = input.target_count;

    const { data, error } = await supabase
      .from("habits")
      .update(updatePayload)
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update habit",
    };
  }
}

export async function deleteHabit(
  habitId: number,
): Promise<ActionResponse<{ success: boolean }>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from("habits")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("habit_id", habitId)
      .eq("user_id", user.id);

    if (error) {
      return { error: error.message };
    }

    return { data: { success: true } };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete habit",
    };
  }
}

// === Completion Logging ===

export async function logHabitCompletion(
  habitId: number,
  note?: string,
): Promise<ActionResponse<HabitLog>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Fetch the habit to check frequency and target_count
    const { data: habit } = await supabase
      .from("habits")
      .select("*")
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .single();

    if (!habit) {
      return { error: "Habit not found" };
    }

    const freq = resolveFrequency(habit as unknown as Record<string, unknown>);
    const targetCount = habit.target_count ?? 1;

    // Count-based validation: check if limit is reached for the current period
    const { start, end } = getPeriodBounds(freq);
    const currentCount = await countPeriodCompletions(supabase, habitId, user.id, start, end);

    if (currentCount >= targetCount) {
      const periodLabel = getPeriodLabel(freq);
      return { error: `Habit already completed ${periodLabel} (${currentCount}/${targetCount})` };
    }

    // Insert the completion log
    const { data: log, error: logError } = await supabase
      .from("habit_logs")
      .insert({
        habit_id: habitId,
        user_id: user.id,
        completed_at: new Date().toISOString(),
        note: note || null,
      })
      .select()
      .single();

    if (logError) {
      return { error: logError.message };
    }

    // Recalculate streak and update in database
    const { data: allLogs } = await supabase
      .from("habit_logs")
      .select("completed_at")
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });

    const completionDates = (allLogs || []).map((l) => l.completed_at);
    const newStreak = computeUnifiedStreak(freq, targetCount, completionDates);

    // Update streak_count in habits table
    await supabase
      .from("habits")
      .update({ streak_count: newStreak, updated_at: new Date().toISOString() })
      .eq("habit_id", habitId)
      .eq("user_id", user.id);

    return { data: log };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to log habit completion",
    };
  }
}

export async function removeHabitCompletion(
  habitId: number,
  date: string,
): Promise<ActionResponse<{ success: boolean }>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Delete the log for the specific date
    const { error } = await supabase
      .from("habit_logs")
      .delete()
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .gte("completed_at", `${date}T00:00:00`)
      .lt("completed_at", `${date}T23:59:59`);

    if (error) {
      return { error: error.message };
    }

    // Recalculate streak after removal
    const { data: habit } = await supabase
      .from("habits")
      .select("*")
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .single();

    const freq = habit ? resolveFrequency(habit as unknown as Record<string, unknown>) : 0;
    const targetCount = habit?.target_count ?? 1;

    const { data: remainingLogs } = await supabase
      .from("habit_logs")
      .select("completed_at")
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });

    const completionDates = (remainingLogs || []).map((l) => l.completed_at);
    const newStreak = computeUnifiedStreak(freq as HabitFrequency, targetCount, completionDates);

    // Update streak_count in habits table
    await supabase
      .from("habits")
      .update({ streak_count: newStreak, updated_at: new Date().toISOString() })
      .eq("habit_id", habitId)
      .eq("user_id", user.id);

    return { data: { success: true } };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to remove habit completion",
    };
  }
}

// === Statistics ===

export async function getHabitStats(habitId: number): Promise<
  ActionResponse<{
    completion_rate_7d: number;
    completion_rate_30d: number;
    current_streak: number;
    days_since_start: number;
    total_completions: number;
    prediction: string | null;
  }>
> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Fetch the habit
    const { data: habit, error: habitError } = await supabase
      .from("habits")
      .select("*")
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .single();

    if (habitError) {
      return { error: habitError.message };
    }

    // Fetch all logs for this habit
    const { data: logs, error: logsError } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });

    if (logsError) {
      return { error: logsError.message };
    }

    const freq = resolveFrequency(habit as unknown as Record<string, unknown>);
    const targetCount = habit.target_count ?? 1;

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs7d = (logs || []).filter(
      (log: HabitLog) => new Date(log.completed_at) >= sevenDaysAgo,
    );
    const logs30d = (logs || []).filter(
      (log: HabitLog) => new Date(log.completed_at) >= thirtyDaysAgo,
    );

    // Calculate expected completions based on frequency and target_count
    const getExpectedCompletions = (f: HabitFrequency, days: number, tc: number): number => {
      switch (f) {
        case 0: // daily
          return days * tc;
        case 1: // weekly
          return Math.ceil(days / 7) * tc;
        case 2: // monthly
          return Math.ceil(days / 30) * tc;
        case 3: // multiple per week
          return Math.ceil(days / 7) * tc;
        default:
          return days;
      }
    };

    const expected7d = getExpectedCompletions(freq, 7, targetCount);
    const expected30d = getExpectedCompletions(freq, 30, targetCount);

    const completionRate30d = Math.min(
      logs30d.length / Math.max(expected30d, 1),
      1,
    );

    // Unified streak
    const completionDates = (logs || []).map((log: HabitLog) => log.completed_at);
    const currentStreak = computeUnifiedStreak(freq, targetCount, completionDates);

    // Rule-based prediction
    const prediction =
      completionRate30d >= AT_RISK_THRESHOLD ? "safe" : "at risk";

    return {
      data: {
        completion_rate_7d: Math.min(
          logs7d.length / Math.max(expected7d, 1),
          1,
        ),
        completion_rate_30d: completionRate30d,
        current_streak: currentStreak,
        days_since_start: daysSince(new Date(habit.created_at)),
        total_completions: logs?.length || 0,
        prediction,
      },
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to get habit stats",
    };
  }
}
