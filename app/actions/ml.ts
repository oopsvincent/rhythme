"use server";

import type { HabitPredictionInput, HabitPrediction } from "@/types/database";
import type { SentimentRequest, SentimentResponse } from "@/lib/journal-sentiment";

const ML_ENDPOINT = process.env.ML_ENDPOINT;
const API_SECRET = process.env.API_SECRET || "";

export async function fetchPredictionAction(
  input: HabitPredictionInput
): Promise<HabitPrediction> {
  if (!ML_ENDPOINT) {
    throw new Error("Prediction service unavailable (missing URL)");
  }

  const response = await fetch(`${ML_ENDPOINT}/v1/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-secret": API_SECRET,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Prediction service unavailable");
  }

  return response.json();
}

export interface InsightResult {
  insights: Array<string | {
    sentence?: string
    insight?: string
    headline?: string
    title?: string
    explanation?: string
    detail?: string
    reasoning?: string
    description?: string
    strength?: string
    correlation_strength?: string
    score?: number
    strength_score?: number
  }>
  days_analyzed?: number
  message?: string | null
}

function convertToLocalYYYYMMDD(utcString: string, timeZone?: string): string {
  if (!timeZone || timeZone === "UTC") {
    return utcString.slice(0, 10);
  }
  try {
    const date = new Date(utcString);
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parts = formatter.formatToParts(date);
    const year = parts.find(p => p.type === "year")?.value;
    const month = parts.find(p => p.type === "month")?.value;
    const day = parts.find(p => p.type === "day")?.value;
    return `${year}-${month}-${day}`;
  } catch (e) {
    return utcString.slice(0, 10);
  }
}

export async function fetchInsightsAction(params: {
  from: string
  to: string
  user_timezone?: string
  localToday?: string
}): Promise<InsightResult> {
  if (!ML_ENDPOINT) {
    throw new Error("Insights service unavailable (missing endpoint)")
  }

  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const tz = params.user_timezone || "UTC";
  const todayStr = params.localToday || new Date().toISOString().split("T")[0];

  const toDate = new Date(`${todayStr}T23:59:59.999Z`);
  const fromDate = new Date(`${todayStr}T00:00:00.000Z`);
  fromDate.setUTCDate(fromDate.getUTCDate() - 90);

  // Buffer 24h to avoid timezone boundary issues when querying UTC timestamptz
  const queryFrom = new Date(fromDate.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const queryTo = new Date(toDate.getTime() + 24 * 60 * 60 * 1000).toISOString();

  const [tasksResult, habitLogsResult, journalsResult, moodResult, focusResult] =
    await Promise.all([
      supabase
        .from("tasks")
        .select("task_id, title, status, completed_at, created_at")
        .eq("user_id", user.id)
        .gte("created_at", queryFrom)
        .lte("created_at", queryTo),
      supabase
        .from("habit_logs")
        .select("habit_id, completed_at")
        .eq("user_id", user.id)
        .gte("completed_at", queryFrom)
        .lte("completed_at", queryTo),
      supabase
        .from("journals")
        .select("journal_id, title, content, sentiment_score, mood_tags, created_at, iv")
        .eq("user_id", user.id)
        .gte("created_at", queryFrom)
        .lte("created_at", queryTo),
      supabase
        .from("mood_logs")
        .select("mood_score, note, logged_at")
        .eq("user_id", user.id)
        .gte("logged_at", params.from)
        .lte("logged_at", params.to),
      supabase
        .from("focus_sessions")
        .select("session_id, planned_duration, actual_duration, mood_before, mood_after, energy_start, energy_end, started_at, ended_at")
        .eq("user_id", user.id)
        .eq("is_active", false)
        .gte("started_at", queryFrom)
        .lte("started_at", queryTo),
    ])

  // Build daily log entries grouped by date
  const dayMap = new Map<string, {
    date: string
    tasks_done: number
    tasks_created: number
    habits_completed: number
    journaled: boolean
    mood: number
    focus_mins: number
    focus_sessions: number
  }>()

  // Pre-fill every date in the range
  for (let d = new Date(fromDate); d <= toDate; d.setUTCDate(d.getUTCDate() + 1)) {
    const key = d.toISOString().slice(0, 10)
    dayMap.set(key, {
      date: key, tasks_done: 0, tasks_created: 0, habits_completed: 0,
      journaled: false, mood: 6, focus_mins: 0, focus_sessions: 0,
    })
  }

  const getDateKey = (value: string) => {
    if (value.length === 10) return value;
    return convertToLocalYYYYMMDD(value, tz);
  }

  for (const task of tasksResult.data ?? []) {
    const key = getDateKey(task.created_at)
    const entry = dayMap.get(key) ?? {
      date: key, tasks_done: 0, tasks_created: 0, habits_completed: 0,
      journaled: false, mood: 6, focus_mins: 0, focus_sessions: 0,
    }
    entry.tasks_created += 1
    if (task.status === "completed" || task.completed_at) entry.tasks_done += 1
    dayMap.set(key, entry)
  }

  for (const log of habitLogsResult.data ?? []) {
    const key = getDateKey(log.completed_at)
    const entry = dayMap.get(key) ?? {
      date: key, tasks_done: 0, tasks_created: 0, habits_completed: 0,
      journaled: false, mood: 6, focus_mins: 0, focus_sessions: 0,
    }
    entry.habits_completed += 1
    dayMap.set(key, entry)
  }

  for (const journal of journalsResult.data ?? []) {
    const key = getDateKey(journal.created_at)
    const entry = dayMap.get(key) ?? {
      date: key, tasks_done: 0, tasks_created: 0, habits_completed: 0,
      journaled: false, mood: 6, focus_mins: 0, focus_sessions: 0,
    }
    entry.journaled = true
    dayMap.set(key, entry)
  }

  for (const mood of moodResult.data ?? []) {
    const key = mood.logged_at
    const entry = dayMap.get(key) ?? {
      date: key, tasks_done: 0, tasks_created: 0, habits_completed: 0,
      journaled: false, mood: 6, focus_mins: 0, focus_sessions: 0,
    }
    entry.mood = Math.round(Number(mood.mood_score) * 2)
    dayMap.set(key, entry)
  }

  for (const session of focusResult.data ?? []) {
    const key = getDateKey(session.started_at)
    const entry = dayMap.get(key) ?? {
      date: key, tasks_done: 0, tasks_created: 0, habits_completed: 0,
      journaled: false, mood: 6, focus_mins: 0, focus_sessions: 0,
    }
    entry.focus_mins += session.actual_duration ?? session.planned_duration
    entry.focus_sessions += 1
    dayMap.set(key, entry)
  }

  const logs = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date))

  const totalDays = logs.length;
  const daysWithActivity = logs.filter(l => 
    l.tasks_done > 0 || l.habits_completed > 0 || l.journaled || l.focus_mins > 0 || l.mood !== 6
  ).length;

  if (daysWithActivity < 14) {
    return { 
      insights: [], 
      days_analyzed: totalDays,
      message: `Need at least 14 days of activity to generate insights. You currently have ${daysWithActivity} days with activity.` 
    };
  }

  try {
    const response = await fetch(`${ML_ENDPOINT}/v1/insights_weekly`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-secret": API_SECRET,
      },
      body: JSON.stringify({ logs }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Could not read error text")
      throw new Error(`Insights service returned ${response.status}: ${errorText}`)
    }

    const payload = await response.json()
    return payload as InsightResult
  } catch (error: any) {
    console.error("[Insights] Failed to fetch insights:", error)
    throw new Error(`The insights service is temporarily unavailable. Details: ${error?.message || error}`)
  }
}

export async function fetchSentimentAction(
  request: SentimentRequest
): Promise<SentimentResponse | null> {
  if (!ML_ENDPOINT) {
    console.error("[JournalSentiment] Missing ML_ENDPOINT");
    return null;
  }

  try {
    const response = await fetch(`${ML_ENDPOINT}/v1/journal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-secret": API_SECRET,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      console.error("[JournalSentiment] Service returned status:", response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("[JournalSentiment] Failed to fetch analysis:", error);
    return null;
  }
}
