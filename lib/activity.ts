import { endOfDay, format, isAfter, parseISO, startOfDay, subDays } from "date-fns"

import type { FocusSession, Habit, HabitLog, Journal, MoodLog, Task } from "@/types/database"

export const ACTIVITY_TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "tasks", label: "Tasks" },
  { value: "habits", label: "Habits" },
  { value: "journal", label: "Journal" },
  { value: "focus", label: "Focus Sessions" },
  { value: "mood", label: "Mood" },
] as const

export type ActivityType = (typeof ACTIVITY_TYPE_OPTIONS)[number]["value"]

export interface ActivityRange {
  from: string
  to: string
  fromDate: Date
  toDate: Date
  dayCount: number
}

export interface ActivityHabitSummary {
  habitId: number
  name: string
  count: number
  targetCount: number
}

export interface ActivityJournalSummary {
  journalId: string
  title: string
  preview: string
  createdAt: string
  isEncrypted: boolean
}

export interface ActivityFocusSummary {
  sessionId: number
  minutes: number
  startedAt: string
  endedAt: string | null
  taskTitle: string | null
  customTaskText: string | null
}

export interface ActivityDaySummary {
  date: string
  moodLog: MoodLog | null
  completedTasks: Task[]
  habitsChecked: ActivityHabitSummary[]
  journalEntries: ActivityJournalSummary[]
  focusSessions: ActivityFocusSummary[]
  focusMinutes: number
  totalEvents: number
  searchableText: string
}

export interface ActivitySummaryStats {
  completionRate: number | null
  averageMood: number | null
  loggedDays: number
  currentStreak: number
}

function isValidDateOnly(value?: string) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value))
}

export function getDefaultActivityRange(): ActivityRange {
  const toDate = startOfDay(new Date())
  const fromDate = subDays(toDate, 29)

  return {
    from: format(fromDate, "yyyy-MM-dd"),
    to: format(toDate, "yyyy-MM-dd"),
    fromDate,
    toDate,
    dayCount: 30,
  }
}

export function parseActivityRange(params: {
  from?: string
  to?: string
}): ActivityRange {
  if (!isValidDateOnly(params.from) || !isValidDateOnly(params.to)) {
    return getDefaultActivityRange()
  }

  const fromDate = startOfDay(parseISO(`${params.from}T00:00:00`))
  const toDate = startOfDay(parseISO(`${params.to}T00:00:00`))

  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime()) || isAfter(fromDate, toDate)) {
    return getDefaultActivityRange()
  }

  const dayCount = Math.floor((toDate.getTime() - fromDate.getTime()) / 86_400_000) + 1

  return {
    from: format(fromDate, "yyyy-MM-dd"),
    to: format(toDate, "yyyy-MM-dd"),
    fromDate,
    toDate,
    dayCount,
  }
}

export function getActivityQueryBounds(range: ActivityRange) {
  return {
    fromIso: startOfDay(range.fromDate).toISOString(),
    toIso: endOfDay(range.toDate).toISOString(),
  }
}

export function getDateKey(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value
  return format(date, "yyyy-MM-dd")
}

export function getJournalPreview(journal: Journal) {
  if (journal.iv) {
    return journal.title?.trim() ? `${journal.title.trim()} · Private entry` : "Private encrypted journal entry"
  }

  const source = journal.content?.replace(/\s+/g, " ").trim() || journal.title?.trim() || "Journal entry"
  return source.length > 140 ? `${source.slice(0, 137)}...` : source
}

export function buildActivityDays(params: {
  range: ActivityRange
  tasks: Task[]
  habitLogs: HabitLog[]
  habits: Pick<Habit, "habit_id" | "name" | "target_count">[]
  journals: Journal[]
  moodLogs: MoodLog[]
  focusSessions: FocusSession[]
}): ActivityDaySummary[] {
  const { range, tasks, habitLogs, habits, journals, moodLogs, focusSessions } = params

  const days = new Map<string, ActivityDaySummary>()
  const cursor = new Date(range.toDate)

  while (cursor >= range.fromDate) {
    const key = getDateKey(cursor)
    days.set(key, {
      date: key,
      moodLog: null,
      completedTasks: [],
      habitsChecked: [],
      journalEntries: [],
      focusSessions: [],
      focusMinutes: 0,
      totalEvents: 0,
      searchableText: "",
    })
    cursor.setDate(cursor.getDate() - 1)
  }

  const habitMeta = new Map(
    habits.map((habit) => [
      habit.habit_id,
      { name: habit.name, targetCount: habit.target_count ?? 1 },
    ])
  )

  const habitCountByDay = new Map<string, Map<number, number>>()
  for (const log of habitLogs) {
    const dateKey = getDateKey(log.completed_at)
    const bucket = habitCountByDay.get(dateKey) ?? new Map<number, number>()
    bucket.set(log.habit_id, (bucket.get(log.habit_id) ?? 0) + 1)
    habitCountByDay.set(dateKey, bucket)
  }

  for (const task of tasks) {
    if (!task.completed_at) continue
    const dateKey = getDateKey(task.completed_at)
    const day = days.get(dateKey)
    if (day) {
      day.completedTasks.push(task)
    }
  }

  for (const [dateKey, counts] of habitCountByDay.entries()) {
    const day = days.get(dateKey)
    if (!day) continue

    day.habitsChecked = Array.from(counts.entries())
      .map(([habitId, count]) => {
        const meta = habitMeta.get(habitId)
        return {
          habitId,
          name: meta?.name ?? "Habit",
          count,
          targetCount: meta?.targetCount ?? 1,
        }
      })
      .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name))
  }

  for (const journal of journals) {
    const dateKey = getDateKey(journal.created_at)
    const day = days.get(dateKey)
    if (!day) continue

    day.journalEntries.push({
      journalId: journal.journal_id,
      title: journal.title,
      preview: getJournalPreview(journal),
      createdAt: journal.created_at,
      isEncrypted: Boolean(journal.iv),
    })
  }

  for (const moodLog of moodLogs) {
    const dateKey = moodLog.logged_at
    const day = days.get(dateKey)
    if (!day) continue

    if (!day.moodLog || new Date(moodLog.created_at).getTime() > new Date(day.moodLog.created_at).getTime()) {
      day.moodLog = moodLog
    }
  }

  for (const session of focusSessions) {
    const anchor = session.ended_at ?? session.started_at
    const dateKey = getDateKey(anchor)
    const day = days.get(dateKey)
    if (!day) continue

    const minutes = session.actual_duration ?? session.planned_duration
    day.focusMinutes += minutes
    day.focusSessions.push({
      sessionId: session.session_id,
      minutes,
      startedAt: session.started_at,
      endedAt: session.ended_at,
      taskTitle: session.tasks?.title ?? null,
      customTaskText: session.custom_task_text ?? null,
    })
  }

  return Array.from(days.values()).map((day) => {
    day.completedTasks.sort((left, right) => {
      return new Date(right.completed_at ?? right.updated_at).getTime() - new Date(left.completed_at ?? left.updated_at).getTime()
    })
    day.journalEntries.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    day.focusSessions.sort((left, right) => new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime())

    day.totalEvents =
      day.completedTasks.length +
      day.habitsChecked.reduce((sum, habit) => sum + habit.count, 0) +
      day.journalEntries.length +
      day.focusSessions.length +
      (day.moodLog ? 1 : 0)

    day.searchableText = [
      day.date,
      day.moodLog?.note ?? "",
      ...day.completedTasks.flatMap((task) => [task.title, task.description ?? ""]),
      ...day.habitsChecked.map((habit) => habit.name),
      ...day.journalEntries.flatMap((journal) => [journal.title, journal.preview]),
      ...day.focusSessions.flatMap((session) => [session.taskTitle ?? "", session.customTaskText ?? ""]),
    ]
      .join(" ")
      .toLowerCase()

    return day
  })
}

export function filterActivityDays(
  days: ActivityDaySummary[],
  filters: { type: ActivityType; search: string }
) {
  const search = filters.search.trim().toLowerCase()

  return days.filter((day) => {
    const matchesType =
      filters.type === "all" ||
      (filters.type === "tasks" && day.completedTasks.length > 0) ||
      (filters.type === "habits" && day.habitsChecked.length > 0) ||
      (filters.type === "journal" && day.journalEntries.length > 0) ||
      (filters.type === "focus" && day.focusSessions.length > 0) ||
      (filters.type === "mood" && Boolean(day.moodLog))

    if (!matchesType) return false
    if (!search) return day.totalEvents > 0

    return day.searchableText.includes(search)
  })
}

export function buildActivitySummary(params: {
  range: ActivityRange
  days: ActivityDaySummary[]
  tasksCreatedInRange: Task[]
  moodLogs: MoodLog[]
}) {
  const { range, days, tasksCreatedInRange, moodLogs } = params
  const completedTasksInRange = days.reduce((sum, day) => sum + day.completedTasks.length, 0)
  const completionRate = tasksCreatedInRange.length > 0
    ? Math.round((completedTasksInRange / tasksCreatedInRange.length) * 100)
    : completedTasksInRange > 0
      ? 100
      : null

  const averageMood = moodLogs.length > 0
    ? Number((moodLogs.reduce((sum, log) => sum + Number(log.mood_score), 0) / moodLogs.length).toFixed(1))
    : null

  const loggedDays = days.filter((day) => day.totalEvents > 0).length
  const activeDaySet = new Set(days.filter((day) => day.totalEvents > 0).map((day) => day.date))
  const today = startOfDay(new Date())
  const streakAnchor = range.toDate.getTime() > today.getTime() ? today : range.toDate
  const streakCursor = new Date(streakAnchor)
  let currentStreak = 0

  while (streakCursor >= range.fromDate) {
    const key = format(streakCursor, "yyyy-MM-dd")
    if (!activeDaySet.has(key)) break
    currentStreak += 1
    streakCursor.setDate(streakCursor.getDate() - 1)
  }

  return {
    completionRate,
    averageMood,
    loggedDays,
    currentStreak,
  } satisfies ActivitySummaryStats
}
