"use server";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/types/database";
import { getWeekBounds, fmtLocalDate } from "@/lib/week-helpers";

// === Types ===

export interface WeeklyPlanContent {
  wins: string[];
  challenges: string[];
  focus: string[];
  habits: string[];
  mood: string[];
}

export interface WeeklyReviewContent {
  winsText: string;
  challengeText: string;
  reflectionText: string;
  moodTakeaway: string;
}

export interface WeeklyPlanRow {
  weekly_plan_id: number;
  user_id: string;
  week_start_date: string;
  week_end_date: string;
  content: WeeklyPlanContent;
  is_completed: boolean;
  completion_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WeeklyReviewRow {
  weekly_review_id: number;
  user_id: string;
  week_start_date: string;
  week_end_date: string;
  content: WeeklyReviewContent;
  created_at: string;
  updated_at: string;
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

// === Weekly Plan CRUD ===

export async function getWeeklyPlan(
  weekStart?: string
): Promise<ActionResponse<WeeklyPlanRow | null>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const { weekStart: defaultStart } = getWeekBounds();
    const targetWeek = weekStart || defaultStart;

    const { data, error } = await supabase
      .from("weekly_plan")
      .select("*")
      .eq("user_id", user.id)
      .eq("week_start_date", targetWeek)
      .maybeSingle();

    if (error) {
      return { error: error.message };
    }

    return { data: data as WeeklyPlanRow | null };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to fetch weekly plan",
    };
  }
}

export async function upsertWeeklyPlan(
  content: WeeklyPlanContent,
  weekStart?: string
): Promise<ActionResponse<WeeklyPlanRow>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const { weekStart: defaultStart, weekEnd: defaultEnd } = getWeekBounds();
    const targetStart = weekStart || defaultStart;
    const targetEnd = weekStart
      ? (() => {
          const d = new Date(weekStart + "T00:00:00");
          d.setDate(d.getDate() + 6);
          return fmtLocalDate(d);
        })()
      : defaultEnd;

    // Check if plan exists
    const { data: existing } = await supabase
      .from("weekly_plan")
      .select("weekly_plan_id")
      .eq("user_id", user.id)
      .eq("week_start_date", targetStart)
      .maybeSingle();

    if (existing) {
      // Update
      const { data, error } = await supabase
        .from("weekly_plan")
        .update({
          content: content as unknown as Record<string, unknown>,
          updated_at: new Date().toISOString(),
        })
        .eq("weekly_plan_id", existing.weekly_plan_id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) return { error: error.message };
      return { data: data as WeeklyPlanRow };
    } else {
      // Insert
      const { data, error } = await supabase
        .from("weekly_plan")
        .insert({
          user_id: user.id,
          week_start_date: targetStart,
          week_end_date: targetEnd,
          content: content as unknown as Record<string, unknown>,
        })
        .select()
        .single();

      if (error) return { error: error.message };
      return { data: data as WeeklyPlanRow };
    }
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to save weekly plan",
    };
  }
}

// === Weekly Review CRUD ===

export async function getWeeklyReview(
  weekStart?: string
): Promise<ActionResponse<WeeklyReviewRow | null>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const { weekStart: defaultStart } = getWeekBounds();
    const targetWeek = weekStart || defaultStart;

    const { data, error } = await supabase
      .from("weekly_review")
      .select("*")
      .eq("user_id", user.id)
      .eq("week_start_date", targetWeek)
      .maybeSingle();

    if (error) {
      return { error: error.message };
    }

    return { data: data as WeeklyReviewRow | null };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch weekly review",
    };
  }
}

export async function upsertWeeklyReview(
  content: WeeklyReviewContent,
  weekStart?: string
): Promise<ActionResponse<WeeklyReviewRow>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const { weekStart: defaultStart, weekEnd: defaultEnd } = getWeekBounds();
    const targetStart = weekStart || defaultStart;
    const targetEnd = weekStart
      ? (() => {
          const d = new Date(weekStart + "T00:00:00");
          d.setDate(d.getDate() + 6);
          return fmtLocalDate(d);
        })()
      : defaultEnd;

    // Check if review exists
    const { data: existing } = await supabase
      .from("weekly_review")
      .select("weekly_review_id")
      .eq("user_id", user.id)
      .eq("week_start_date", targetStart)
      .maybeSingle();

    if (existing) {
      // Update
      const { data, error } = await supabase
        .from("weekly_review")
        .update({
          content: content as unknown as Record<string, unknown>,
          updated_at: new Date().toISOString(),
        })
        .eq("weekly_review_id", existing.weekly_review_id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) return { error: error.message };
      return { data: data as WeeklyReviewRow };
    } else {
      // Insert
      const { data, error } = await supabase
        .from("weekly_review")
        .insert({
          user_id: user.id,
          week_start_date: targetStart,
          week_end_date: targetEnd,
          content: content as unknown as Record<string, unknown>,
        })
        .select()
        .single();

      if (error) return { error: error.message };
      return { data: data as WeeklyReviewRow };
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to save weekly review",
    };
  }
}

// === Weekly Stats (Aggregated Data) ===

export interface WeeklyStats {
  // Tasks
  tasksTotal: number;
  tasksCompleted: number;
  tasksPending: number;
  tasksCompletionPct: number;

  // Habits
  habitsTotal: number;
  habitLogsThisWeek: number;
  habitCompletionPct: number;
  topHabits: { name: string; completions: number }[];

  // Mood (from journals)
  moodEntries: { day: string; value: number; mood: string }[];
  avgMood: number;
  journalCount: number;

  // Week range info
  weekStart: string;
  weekEnd: string;
  weekLabel: string;
}

const MOOD_TO_VALUE: Record<string, number> = {
  happy: 5,
  excited: 5,
  calm: 4,
  neutral: 3,
  anxious: 2,
  sad: 1,
  frustrated: 1,
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export async function getWeeklyStats(
  weekStart?: string
): Promise<ActionResponse<WeeklyStats>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const { weekStart: defaultStart, weekEnd: defaultEnd } = getWeekBounds();
    const targetStart = weekStart || defaultStart;
    const targetEnd = weekStart
      ? (() => {
          const d = new Date(weekStart + "T00:00:00");
          d.setDate(d.getDate() + 6);
          return fmtLocalDate(d);
        })()
      : defaultEnd;

    const startISO = `${targetStart}T00:00:00`;
    const endISO = `${targetEnd}T23:59:59`;

    // Fetch tasks for this week (created or due within range)
    const { data: tasks } = await supabase
      .from("tasks")
      .select("task_id, title, status, completed_at, due_date, created_at")
      .eq("user_id", user.id)
      .or(
        `due_date.gte.${targetStart},due_date.lte.${targetEnd},created_at.gte.${startISO},created_at.lte.${endISO}`
      );

    const allTasks = tasks || [];
    // Filter to tasks truly in this week (due or created)
    const weekTasks = allTasks.filter((t) => {
      const dueInWeek =
        t.due_date && t.due_date >= targetStart && t.due_date <= targetEnd;
      const createdInWeek =
        t.created_at >= startISO && t.created_at <= endISO;
      return dueInWeek || createdInWeek;
    });
    const tasksCompleted = weekTasks.filter(
      (t) => t.status === "completed"
    ).length;
    const tasksTotal = weekTasks.length;

    // Fetch habits and their logs for this week
    const { data: habits } = await supabase
      .from("habits")
      .select("habit_id, name")
      .eq("user_id", user.id)
      .eq("is_active", true);

    const { data: habitLogs } = await supabase
      .from("habit_logs")
      .select("habit_id, completed_at")
      .eq("user_id", user.id)
      .gte("completed_at", startISO)
      .lte("completed_at", endISO);

    const allHabits = habits || [];
    const allHabitLogs = habitLogs || [];
    const habitLogsThisWeek = allHabitLogs.length;

    // Expected: each habit should be done once per day for 7 days (simplified)
    const habitsTotal = allHabits.length;
    const maxExpected = habitsTotal * 7;
    const habitCompletionPct =
      maxExpected > 0
        ? Math.round((habitLogsThisWeek / maxExpected) * 100)
        : 0;

    // Top habits by completions this week
    const habitCompletionMap = new Map<number, number>();
    for (const log of allHabitLogs) {
      habitCompletionMap.set(
        log.habit_id,
        (habitCompletionMap.get(log.habit_id) || 0) + 1
      );
    }
    const topHabits = allHabits
      .map((h) => ({
        name: h.name,
        completions: habitCompletionMap.get(h.habit_id) || 0,
      }))
      .filter((h) => h.completions > 0)
      .sort((a, b) => b.completions - a.completions)
      .slice(0, 5);

    // Fetch journals for mood data this week
    const { data: journals } = await supabase
      .from("journals")
      .select("journal_id, mood_tags, created_at")
      .eq("user_id", user.id)
      .gte("created_at", startISO)
      .lte("created_at", endISO)
      .order("created_at", { ascending: true });

    const allJournals = journals || [];

    // Build mood entries by day
    const moodByDay = new Map<string, { values: number[]; moods: string[] }>();
    for (const j of allJournals) {
      const dayIdx = new Date(j.created_at).getDay();
      const dayName = DAY_NAMES[dayIdx];
      const moodTag =
        (j.mood_tags as Record<string, string> | null)?.mood || "neutral";
      const val = MOOD_TO_VALUE[moodTag] ?? 3;

      if (!moodByDay.has(dayName)) {
        moodByDay.set(dayName, { values: [], moods: [] });
      }
      const entry = moodByDay.get(dayName)!;
      entry.values.push(val);
      entry.moods.push(moodTag);
    }

    // Build ordered mood entries for Mon-Sun
    const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const moodEntries = orderedDays.map((day) => {
      const entry = moodByDay.get(day);
      if (!entry || entry.values.length === 0) {
        return { day, value: 0, mood: "none" };
      }
      const avg = Math.round(
        entry.values.reduce((a, b) => a + b, 0) / entry.values.length
      );
      return { day, value: avg, mood: entry.moods[0] };
    });

    const moodValues = moodEntries
      .filter((m) => m.value > 0)
      .map((m) => m.value);
    const avgMood =
      moodValues.length > 0
        ? Math.round(
            (moodValues.reduce((a, b) => a + b, 0) / moodValues.length) * 10
          ) / 10
        : 0;

    // Week label
    const fmtDate = (d: string) => {
      const [year, month, day] = d.split("-");
      const dt = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return dt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    };
    const year = parseInt(targetEnd.split("-")[0], 10);
    const weekLabel = `${fmtDate(targetStart)} – ${fmtDate(targetEnd)}, ${year}`;

    return {
      data: {
        tasksTotal,
        tasksCompleted,
        tasksPending: tasksTotal - tasksCompleted,
        tasksCompletionPct:
          tasksTotal > 0
            ? Math.round((tasksCompleted / tasksTotal) * 100)
            : 0,
        habitsTotal,
        habitLogsThisWeek,
        habitCompletionPct,
        topHabits,
        moodEntries,
        avgMood,
        journalCount: allJournals.length,
        weekStart: targetStart,
        weekEnd: targetEnd,
        weekLabel,
      },
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch weekly stats",
    };
  }
}

// === Weekly History ===

export interface WeeklyHistoryItem {
  weekStart: string;
  weekEnd: string;
  weekLabel: string;
  plan: WeeklyPlanRow | null;
  review: WeeklyReviewRow | null;
  stats: {
    tasksCompletionPct: number;
    habitCompletionPct: number;
    journalCount: number;
    avgMood: number;
  };
}

export async function getWeeklyHistory(
  limit = 8
): Promise<ActionResponse<WeeklyHistoryItem[]>> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Fetch all plans and reviews, ordered by week_start_date desc
    const { data: plans } = await supabase
      .from("weekly_plan")
      .select("*")
      .eq("user_id", user.id)
      .order("week_start_date", { ascending: false })
      .limit(limit);

    const { data: reviews } = await supabase
      .from("weekly_review")
      .select("*")
      .eq("user_id", user.id)
      .order("week_start_date", { ascending: false })
      .limit(limit);

    // Collect unique week starts from both plans and reviews
    const weekSet = new Set<string>();
    for (const p of plans || []) weekSet.add(p.week_start_date);
    for (const r of reviews || []) weekSet.add(r.week_start_date);

    // If no data, generate last few weeks
    if (weekSet.size === 0) {
      const weeks: string[] = [];
      for (let i = 1; i <= 4; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i * 7);
        const { weekStart } = getWeekBounds(d);
        weeks.push(weekStart);
      }
      weeks.forEach((w) => weekSet.add(w));
    }

    const sortedWeeks = Array.from(weekSet).sort().reverse().slice(0, limit);

    // Build plan/review maps
    const planMap = new Map<string, WeeklyPlanRow>();
    for (const p of plans || []) {
      planMap.set(p.week_start_date, p as WeeklyPlanRow);
    }
    const reviewMap = new Map<string, WeeklyReviewRow>();
    for (const r of reviews || []) {
      reviewMap.set(r.week_start_date, r as WeeklyReviewRow);
    }

    // For each week, compute lightweight stats
    const history: WeeklyHistoryItem[] = [];

    for (const ws of sortedWeeks) {
      const we = (() => {
        const d = new Date(ws + "T00:00:00");
        d.setDate(d.getDate() + 6);
        return fmtLocalDate(d);
      })();

      const startISO = `${ws}T00:00:00`;
      const endISO = `${we}T23:59:59`;

      // Lightweight task stats
      const { count: totalTasks } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", startISO)
        .lte("created_at", endISO);

      const { count: completedTasks } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "completed")
        .gte("created_at", startISO)
        .lte("created_at", endISO);

      // Lightweight habit stats
      const { count: habitLogs } = await supabase
        .from("habit_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("completed_at", startISO)
        .lte("completed_at", endISO);

      const { count: activeHabits } = await supabase
        .from("habits")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_active", true);

      // Journal count and avg mood
      const { data: weekJournals } = await supabase
        .from("journals")
        .select("mood_tags")
        .eq("user_id", user.id)
        .gte("created_at", startISO)
        .lte("created_at", endISO);

      const jCount = weekJournals?.length || 0;
      const moodVals = (weekJournals || [])
        .map((j) => {
          const m =
            (j.mood_tags as Record<string, string> | null)?.mood || "neutral";
          return MOOD_TO_VALUE[m] ?? 3;
        })
        .filter((v) => v > 0);
      const avgMood =
        moodVals.length > 0
          ? Math.round(
              (moodVals.reduce((a, b) => a + b, 0) / moodVals.length) * 10
            ) / 10
          : 0;

      const maxExpected = (activeHabits || 0) * 7;
      const habitPct =
        maxExpected > 0
          ? Math.round(((habitLogs || 0) / maxExpected) * 100)
          : 0;

      const fmtDate = (d: string) => {
        const [y, m, day] = d.split("-");
        const dt = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(day, 10));
        return dt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      };
      const year = parseInt(we.split("-")[0], 10);

      history.push({
        weekStart: ws,
        weekEnd: we,
        weekLabel: `${fmtDate(ws)} – ${fmtDate(we)}, ${year}`,
        plan: planMap.get(ws) || null,
        review: reviewMap.get(ws) || null,
        stats: {
          tasksCompletionPct:
            (totalTasks || 0) > 0
              ? Math.round(
                  ((completedTasks || 0) / (totalTasks || 1)) * 100
                )
              : 0,
          habitCompletionPct: habitPct,
          journalCount: jCount,
          avgMood,
        },
      });
    }

    return { data: history };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch weekly history",
    };
  }
}
