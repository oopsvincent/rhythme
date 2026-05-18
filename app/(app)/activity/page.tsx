import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { ActivityPageClient } from "@/components/activity/activity-page-client"
import {
  buildActivityDays,
  buildActivitySummary,
  getActivityQueryBounds,
  parseActivityRange,
} from "@/lib/activity"
import { createClient } from "@/lib/supabase/server"
import type { FocusSession, Habit, HabitLog, Journal, MoodLog, Task } from "@/types/database"

type FocusSessionRow = Omit<FocusSession, "tasks"> & {
  tasks?: FocusSession["tasks"] | Array<NonNullable<FocusSession["tasks"]>>
}

const FOCUS_ACTIVITY_SELECT = `
  session_id,
  user_id,
  task_id,
  is_active,
  planned_duration,
  actual_duration,
  interruptions,
  mood_before,
  mood_after,
  energy_start,
  energy_end,
  started_at,
  ended_at,
  interruption_details,
  custom_task_text,
  tags,
  metadata,
  created_at,
  tasks:task_id (
    task_id,
    title,
    status,
    priority
  )
`

export const metadata: Metadata = {
  title: "Activity | Rhythme",
  description: "Explore your historical activity across tasks, habits, journal entries, mood logs, and focus sessions.",
}

export default async function ActivityPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = (await searchParams) ?? {}
  const range = parseActivityRange({
    from: typeof params.from === "string" ? params.from : undefined,
    to: typeof params.to === "string" ? params.to : undefined,
  })
  const { fromIso, toIso } = getActivityQueryBounds(range)

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("You need to be signed in to view activity.")
  }

  const [
    tasksCompletedResult,
    tasksCreatedResult,
    habitsResult,
    habitLogsResult,
    journalsResult,
    moodLogsResult,
    focusSessionsResult,
  ] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .not("completed_at", "is", null)
      .gte("completed_at", fromIso)
      .lte("completed_at", toIso)
      .order("completed_at", { ascending: false }),
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", fromIso)
      .lte("created_at", toIso),
    supabase
      .from("habits")
      .select("habit_id, name, target_count")
      .eq("user_id", user.id),
    supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("completed_at", fromIso)
      .lte("completed_at", toIso),
    supabase
      .from("journals")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", fromIso)
      .lte("created_at", toIso)
      .order("created_at", { ascending: false }),
    supabase
      .from("mood_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("logged_at", range.from)
      .lte("logged_at", range.to)
      .order("logged_at", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("focus_sessions")
      .select(FOCUS_ACTIVITY_SELECT)
      .eq("user_id", user.id)
      .eq("is_active", false)
      .gte("started_at", fromIso)
      .lte("started_at", toIso)
      .order("started_at", { ascending: false }),
  ])

  const queries = [
    tasksCompletedResult,
    tasksCreatedResult,
    habitsResult,
    habitLogsResult,
    journalsResult,
    moodLogsResult,
    focusSessionsResult,
  ]

  const failedQuery = queries.find((query) => query.error)
  if (failedQuery?.error) {
    throw new Error(failedQuery.error.message)
  }

  const tasksCompleted = (tasksCompletedResult.data ?? []) as Task[]
  const tasksCreatedInRange = (tasksCreatedResult.data ?? []) as Task[]
  const habits = (habitsResult.data ?? []) as Pick<Habit, "habit_id" | "name" | "target_count">[]
  const habitLogs = (habitLogsResult.data ?? []) as HabitLog[]
  const journals = (journalsResult.data ?? []) as Journal[]
  const moodLogs = (moodLogsResult.data ?? []) as MoodLog[]
  const focusSessions = ((focusSessionsResult.data ?? []) as FocusSessionRow[]).map((session) => ({
    ...session,
    tasks: Array.isArray(session.tasks) ? session.tasks[0] ?? null : session.tasks ?? null,
  })) as FocusSession[]

  const days = buildActivityDays({
    range,
    tasks: tasksCompleted,
    habits,
    habitLogs,
    journals,
    moodLogs,
    focusSessions,
  })

  const summary = buildActivitySummary({
    range,
    days,
    tasksCreatedInRange,
    moodLogs,
  })

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="@container/main flex flex-1 flex-col overflow-x-hidden">
          <ActivityPageClient days={days} range={range} summary={summary} />
        </div>
      </div>
    </>
  )
}
