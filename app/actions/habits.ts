"use server";
import { createClient } from "@/lib/supabase/server";
import type {
  Habit,
  HabitLog,
  CreateHabitInput,
  UpdateHabitInput,
  ActionResponse,
  HabitWithStats,
} from "@/types/database";

// UTC-safe one day subtract
function subtractOneDayUTC(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().split("T")[0];
}

// Compute current streak from array of UTC date strings (unique + desc sorted)
function computeCurrentStreak(dateStrs: string[]): number {
  if (dateStrs.length === 0) return 0;

  const today = new Date().toISOString().split("T")[0];
  const yesterdayDate = new Date();
  yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
  const yesterday = yesterdayDate.toISOString().split("T")[0];

  const latest = dateStrs[0];
  if (latest !== today && latest !== yesterday) return 0; // broken & old

  let streak = 0;
  let expected = latest;

  for (const date of dateStrs) {
    if (date === expected) {
      streak++;
      expected = subtractOneDayUTC(expected);
    } else {
      break; // gap found
    }
  }

  return streak;
}

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
function isCompletedToday(logs: HabitLog[]): boolean {
  const today = new Date().toISOString().split("T")[0];
  return logs.some((log) => log.completed_at.split("T")[0] === today);
}

function daysSince(date: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

const MIN_DAYS_FOR_PREDICTION = 7;
const AT_RISK_THRESHOLD = 0.6; // Ties to PRD success metric (3x/week ~0.43 daily, but buffer for weekly/custom)

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

    // Fetch all logs for all habits (no limit for accurate streak)
    const { data: logs, error: logsError } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });

    if (logsError) {
      return { error: logsError.message };
    }

    // Map habits with their stats
    const habitsWithStats: HabitWithStats[] = habits.map((habit: Habit) => {
      const habitLogs = (logs || []).filter(
        (log: HabitLog) => log.habit_id === habit.habit_id,
      );
      const daysOld = daysSince(new Date(habit.created_at));
      const canPredict = daysOld >= MIN_DAYS_FOR_PREDICTION;
      const uniqueDatesDesc = [
        ...new Set(habitLogs.map((log) => log.completed_at.split("T")[0])),
      ].sort((a, b) => b.localeCompare(a));
      const currentStreak = computeCurrentStreak(uniqueDatesDesc);

      return {
        ...habit,
        completedToday: isCompletedToday(habitLogs),
        completionLogs: habitLogs,
        current_streak: currentStreak,
        prediction: null, // Placeholder; populated in stats if needed
        daysUntilPrediction: canPredict
          ? undefined
          : MIN_DAYS_FOR_PREDICTION - daysOld,
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

    // Fetch all logs for this habit (no 30d limit for streak)
    const { data: logs, error: logsError } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });

    if (logsError) {
      return { error: logsError.message };
    }

    const daysOld = daysSince(new Date(habit.created_at));
    const canPredict = daysOld >= MIN_DAYS_FOR_PREDICTION;
    const uniqueDatesDesc = [
      ...new Set((logs || []).map((log) => log.completed_at.split("T")[0])),
    ].sort((a, b) => b.localeCompare(a));
    const currentStreak = computeCurrentStreak(uniqueDatesDesc);

    return {
      data: {
        ...habit,
        completedToday: isCompletedToday(logs || []),
        completionLogs: logs || [],
        current_streak: currentStreak,
        prediction: null,
        daysUntilPrediction: canPredict
          ? undefined
          : MIN_DAYS_FOR_PREDICTION - daysOld,
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

    const { data, error } = await supabase
      .from("habits")
      .insert({
        user_id: user.id,
        name: input.name,
        description: input.description || null,
        frequency: input.frequency || "daily",
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

    const { data, error } = await supabase
      .from("habits")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
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

    // Check if already completed today
    const today = new Date().toISOString().split("T")[0];
    const { data: existingLog } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .gte("completed_at", `${today}T00:00:00`)
      .lt("completed_at", `${today}T23:59:59`)
      .maybeSingle();

    if (existingLog) {
      return { error: "Habit already completed today" };
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

    const uniqueDatesDesc = [
      ...new Set((allLogs || []).map((l) => l.completed_at.split("T")[0])),
    ].sort((a, b) => b.localeCompare(a));
    const newStreak = computeCurrentStreak(uniqueDatesDesc);

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

    // Recalculate streak after removal and update in database
    const { data: remainingLogs } = await supabase
      .from("habit_logs")
      .select("completed_at")
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });

    const uniqueDatesDesc = [
      ...new Set((remainingLogs || []).map((l) => l.completed_at.split("T")[0])),
    ].sort((a, b) => b.localeCompare(a));
    const newStreak = computeCurrentStreak(uniqueDatesDesc);

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
    prediction: string | null; // Rule-based 'at risk' (PRD)
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

    // Calculate expected completions based on frequency
    const getExpectedCompletions = (
      frequency: string,
      days: number,
    ): number => {
      switch (frequency) {
        case "daily":
          return days;
        case "weekly":
          return Math.ceil(days / 7);
        case "monthly":
          return Math.ceil(days / 30);
        default:
          return days;
      }
    };

    const expected7d = getExpectedCompletions(habit.frequency, 7);
    const expected30d = getExpectedCompletions(habit.frequency, 30);

    const completionRate30d = Math.min(
      logs30d.length / Math.max(expected30d, 1),
      1,
    );

    const uniqueDatesDesc = [
      ...new Set((logs || []).map((log) => log.completed_at.split("T")[0])),
    ].sort((a, b) => b.localeCompare(a));
    const currentStreak = computeCurrentStreak(uniqueDatesDesc);

    // Rule-based prediction (PRD: lightweight, rule-based risk)
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