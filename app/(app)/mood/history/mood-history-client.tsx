"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  PencilLine,
  X,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  useMoodLogs,
  useCreateMoodLog,
  useUpdateMoodLog,
} from "@/hooks/use-mood-logs"
import { canCreateMoodLog } from "@/app/actions/usage-limits"
import { PremiumGateModal } from "@/components/premium-gate-modal"
import { MOOD_SCALE, formatMoodScore, getMoodOption } from "@/lib/mood"
import { cn } from "@/lib/utils"
import type { MoodLog } from "@/types/database"
import { toast } from "sonner"

/* ── Helpers ──────────────────────────────────────────────── */

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function toDateKey(d: Date) {
  return d.toISOString().split("T")[0]
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

/** Monday = 0 … Sunday = 6 */
function startDayOfWeek(year: number, month: number) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

function formatMonthYear(year: number, month: number) {
  return new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
}

function formatFullDate(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function moodColor(score: number): string {
  const opt = getMoodOption(score)
  return opt?.accent ?? "bg-muted"
}

function moodSoftColor(score: number): string {
  const opt = getMoodOption(score)
  return opt?.softAccent ?? "bg-muted/30"
}

/* ── Calendar Heatmap ─────────────────────────────────────── */

function CalendarHeatmap({
  year,
  month,
  logMap,
  onDayClick,
  selectedDay,
}: {
  year: number
  month: number
  logMap: Map<string, MoodLog>
  onDayClick: (dateKey: string) => void
  selectedDay: string | null
}) {
  const totalDays = daysInMonth(year, month)
  const offset = startDayOfWeek(year, month)
  const todayKey = toDateKey(new Date())

  const cells: (number | null)[] = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(d)

  return (
    <div className="space-y-2">
      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="aspect-square" />
          }

          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
          const log = logMap.get(dateKey)
          const score = log ? Number(log.mood_score) : null
          const isToday = dateKey === todayKey
          const isSelected = dateKey === selectedDay
          const isFuture = dateKey > todayKey

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => !isFuture && onDayClick(dateKey)}
              disabled={isFuture}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-lg aspect-square text-xs transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                isFuture && "opacity-30 cursor-default",
                isSelected
                  ? "ring-2 ring-primary ring-offset-1 ring-offset-background shadow-sm"
                  : "hover:bg-muted/30",
                score !== null ? moodSoftColor(score) : "bg-transparent"
              )}
            >
              {/* Mood dot */}
              {score !== null && (
                <span
                  className={cn(
                    "absolute top-1 right-1 h-1.5 w-1.5 rounded-full",
                    moodColor(score)
                  )}
                />
              )}

              <span
                className={cn(
                  "tabular-nums font-medium",
                  isToday && "text-primary font-bold",
                  score !== null
                    ? "text-foreground"
                    : "text-muted-foreground/60"
                )}
              >
                {day}
              </span>

              {/* Icon for logged days */}
              {score !== null && (() => {
                const MoodIcon = getMoodOption(score)?.icon
                return MoodIcon ? (
                  <span className="mt-0.5">
                    <MoodIcon className="w-3.5 h-3.5 text-foreground/70" />
                  </span>
                ) : null
              })()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Day detail panel ─────────────────────────────────────── */

function DayDetail({
  dateKey,
  log,
  onClose,
  onSave,
  isSaving,
}: {
  dateKey: string
  log: MoodLog | null
  onClose: () => void
  onSave: (score: number, note: string) => void
  isSaving: boolean
}) {
  const [score, setScore] = useState<number | null>(
    log ? Number(log.mood_score) : null
  )
  const [note, setNote] = useState(log?.note ?? "")
  const mood = score !== null ? getMoodOption(score) : null

  function handleSave() {
    if (score === null) return
    onSave(score, note)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="rounded-2xl border border-border/50 bg-background p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{formatFullDate(dateKey)}</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Mood selector row */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {MOOD_SCALE.map((opt) => {
          const active = score === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setScore(opt.value)}
              className={cn(
                "flex flex-col items-center rounded-xl border-2 px-2 py-1.5 transition-all",
                "min-w-[48px]",
                active
                  ? `${opt.softAccent} ${opt.border} shadow-sm`
                  : "border-transparent hover:bg-muted/20"
              )}
            >
              <span className={cn("mb-1", active ? opt.text : "text-muted-foreground/60")}>
                <opt.icon className="w-5 h-5" />
              </span>
              <span
                className={cn(
                  "mt-0.5 text-[9px] font-medium",
                  active ? opt.text : "text-muted-foreground"
                )}
              >
                {formatMoodScore(opt.value)}
              </span>
            </button>
          )
        })}
      </div>

      {/* Selected mood label */}
      {mood && (
        <p className="mb-3 text-xs text-muted-foreground flex items-center gap-1.5">
          <mood.icon className={cn("w-3.5 h-3.5", mood.text)} />
          <span><strong className="font-medium">{mood.label}</strong> — {mood.description}</span>
        </p>
      )}

      {/* Note */}
      <Textarea
        placeholder="Add a note about this day..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        className="mb-3 resize-none bg-muted/10"
      />

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave} disabled={score === null || isSaving}>
          <PencilLine className="mr-1.5 h-3.5 w-3.5" />
          {log ? "Update" : "Save"}
        </Button>
      </div>
    </motion.div>
  )
}

/* ── Entry list ───────────────────────────────────────────── */

function EntryList({
  logs,
  onEntryClick,
}: {
  logs: MoodLog[]
  onEntryClick: (dateKey: string) => void
}) {
  if (logs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/50 bg-muted/5 px-6 py-10 text-center">
        <CalendarDays className="mx-auto mb-2 h-6 w-6 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          No mood entries this month yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => {
        const mood = getMoodOption(Number(log.mood_score))
        return (
          <button
            key={log.id}
            type="button"
            onClick={() => onEntryClick(log.logged_at)}
            className={cn(
              "flex w-full items-start gap-3 rounded-xl border border-border/40 bg-background p-3.5 text-left transition-colors",
              "hover:border-border hover:bg-muted/10"
            )}
          >
            {/* Icon */}
            <span className={cn("mt-0.5", mood?.text ?? "text-muted-foreground")}>
              {mood?.icon ? <mood.icon className="w-5 h-5" /> : "·"}
            </span>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">
                  {new Date(`${log.logged_at}T12:00:00`).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full text-[10px] px-2 py-0",
                    mood?.softAccent,
                    mood?.text,
                    mood?.border
                  )}
                >
                  {formatMoodScore(Number(log.mood_score))} · {mood?.label}
                </Badge>
              </div>
              {log.note && (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {log.note}
                </p>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

/* ── Main Page ────────────────────────────────────────────── */

export default function MoodHistoryClient() {
  const { data: logs = [], isLoading } = useMoodLogs(365)
  const createMut = useCreateMoodLog()
  const updateMut = useUpdateMoodLog()

  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [showGate, setShowGate] = useState(false)

  const isSaving = createMut.isPending || updateMut.isPending

  /* Build a lookup map from all logs */
  const logMap = useMemo(() => {
    const m = new Map<string, MoodLog>()
    for (const log of logs) m.set(log.logged_at, log)
    return m
  }, [logs])

  /* Logs for the viewed month, sorted newest-first */
  const monthLogs = useMemo(() => {
    const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`
    return logs
      .filter((l) => l.logged_at.startsWith(prefix))
      .sort((a, b) => b.logged_at.localeCompare(a.logged_at))
  }, [logs, viewYear, viewMonth])

  /* Month stats */
  const monthAvg = useMemo(() => {
    if (monthLogs.length === 0) return null
    const sum = monthLogs.reduce((s, l) => s + Number(l.mood_score), 0)
    return Number((sum / monthLogs.length).toFixed(1))
  }, [monthLogs])

  /* Navigation */
  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
    setSelectedDay(null)
  }

  function nextMonth() {
    const isCurrentMonth =
      viewYear === now.getFullYear() && viewMonth === now.getMonth()
    if (isCurrentMonth) return
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
    setSelectedDay(null)
  }

  const isCurrentMonth =
    viewYear === now.getFullYear() && viewMonth === now.getMonth()

  /* Day click → open detail panel */
  function handleDayClick(dateKey: string) {
    setSelectedDay((prev) => (prev === dateKey ? null : dateKey))
  }

  /* Save / update from detail panel */
  async function handleDaySave(score: number, note: string) {
    if (!selectedDay) return
    const existing = logMap.get(selectedDay)

    try {
      if (existing) {
        await updateMut.mutateAsync({
          id: existing.id,
          input: { mood_score: score, note },
        })
        toast.success("Mood updated")
      } else {
        const gate = await canCreateMoodLog(selectedDay)
        if (!gate.allowed) {
          setShowGate(true)
          return
        }
        await createMut.mutateAsync({
          mood_score: score,
          note,
          logged_at: selectedDay,
        })
        toast.success("Mood logged")
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to save"
      if (msg.includes("Upgrade to Premium")) {
        setShowGate(true)
      } else {
        toast.error(msg)
      }
    }
  }

  const selectedLog = selectedDay ? logMap.get(selectedDay) ?? null : null

  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col items-center px-4 pb-16 md:px-8">
        <div className="w-full max-w-2xl py-8 md:py-14">
          {/* ── Header ──────────────────────────────────── */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-12">
            <div className="space-y-2">
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full px-3.5 py-1"
              >
                <HeartPulse className="h-3.5 w-3.5" />
                History
              </Badge>
              <h1 className="text-2xl font-primary tracking-tight md:text-3xl">
                Mood History
              </h1>
              <p className="max-w-md text-sm text-muted-foreground">
                Look back at how you&apos;ve been feeling over time.
              </p>
            </div>

            <Button variant="outline" size="sm" asChild>
              <Link href="/mood">Log today&apos;s mood</Link>
            </Button>
          </div>

          {/* ── Month navigation ─────────────────────────── */}
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-center">
              <p className="text-sm font-semibold">
                {formatMonthYear(viewYear, viewMonth)}
              </p>
              {monthAvg !== null && (
                <p className="text-xs text-muted-foreground">
                  {monthLogs.length} {monthLogs.length === 1 ? "entry" : "entries"} · avg {formatMoodScore(monthAvg)}
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              disabled={isCurrentMonth}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* ── Calendar heatmap ─────────────────────────── */}
          {isLoading ? (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-lg bg-muted/30"
                />
              ))}
            </div>
          ) : (
            <CalendarHeatmap
              year={viewYear}
              month={viewMonth}
              logMap={logMap}
              onDayClick={handleDayClick}
              selectedDay={selectedDay}
            />
          )}

          {/* ── Day detail panel ─────────────────────────── */}
          <AnimatePresence mode="wait">
            {selectedDay && (
              <div className="mt-6" key={selectedDay}>
                <DayDetail
                  dateKey={selectedDay}
                  log={selectedLog}
                  onClose={() => setSelectedDay(null)}
                  onSave={handleDaySave}
                  isSaving={isSaving}
                />
              </div>
            )}
          </AnimatePresence>

          {/* ── Divider ──────────────────────────────────── */}
          <div className="my-10 border-t border-border/30" />

          {/* ── Entry list ───────────────────────────────── */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {formatMonthYear(viewYear, viewMonth)} Entries
            </h2>

            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-xl bg-muted/30"
                  />
                ))}
              </div>
            ) : (
              <EntryList logs={monthLogs} onEntryClick={handleDayClick} />
            )}
          </div>
        </div>
      </main>

      <PremiumGateModal
        open={showGate}
        onOpenChange={setShowGate}
        reason="mood"
      />
    </>
  )
}
