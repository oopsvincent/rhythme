"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Check, HeartPulse, History } from "lucide-react"
import { canCreateMoodLog } from "@/app/actions/usage-limits"
import { PremiumGateModal } from "@/components/premium-gate-modal"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  useMoodLogs,
  useCreateMoodLog,
  useUpdateMoodLog,
} from "@/hooks/use-mood-logs"
import { MOOD_SCALE, formatMoodScore } from "@/lib/mood"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

function getTodayDate() {
  return new Date().toISOString().split("T")[0]
}

function formatTimeLabel(ts: string | null) {
  if (!ts) return null
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

/* ────────────────────────── Page ────────────────────────── */

export default function MoodPageClient() {
  const { data: logs = [], isLoading } = useMoodLogs()
  const createMut = useCreateMoodLog()
  const updateMut = useUpdateMoodLog()

  const today = getTodayDate()
  const todayLog = logs.find((l) => l.logged_at === today) ?? null

  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [note, setNote] = useState("")
  const [noteDirty, setNoteDirty] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  /* Sync UI from today's log whenever it changes */
  useEffect(() => {
    if (todayLog) {
      setSelectedScore(Number(todayLog.mood_score))
      setNote(todayLog.note ?? "")
      setNoteDirty(false)
    }
    // Only reset when no log AND we haven't interacted yet
    if (!todayLog && !createMut.isPending) {
      setSelectedScore(null)
      setNote("")
      setNoteDirty(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayLog?.id])

  const isSaving = createMut.isPending || updateMut.isPending

  /* ── One-tap mood save ────────────────────────────────── */
  async function handleMoodTap(score: number) {
    if (isSaving) return
    const prev = selectedScore
    setSelectedScore(score)

    try {
      if (todayLog) {
        await updateMut.mutateAsync({
          id: todayLog.id,
          input: { mood_score: score },
        })
      } else {
        const gate = await canCreateMoodLog(today)
        if (!gate.allowed) {
          setSelectedScore(prev)
          setShowGate(true)
          return
        }
        await createMut.mutateAsync({
          mood_score: score,
          logged_at: today,
        })
      }
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2200)
      toast.success(todayLog ? "Mood updated" : "Mood logged", {
        duration: 2000,
      })
    } catch (error) {
      setSelectedScore(prev)
      const msg =
        error instanceof Error ? error.message : "Failed to save mood"
      if (msg.includes("Upgrade to Premium")) {
        setShowGate(true)
      } else {
        toast.error(msg)
      }
    }
  }

  /* ── Save note ────────────────────────────────────────── */
  async function handleNoteSave() {
    if (!todayLog || !noteDirty) return
    try {
      await updateMut.mutateAsync({
        id: todayLog.id,
        input: { note },
      })
      setNoteDirty(false)
      toast.success("Note saved", { duration: 1500 })
    } catch {
      toast.error("Could not save note")
    }
  }

  /* ── Derived state ────────────────────────────────────── */
  const selected = MOOD_SCALE.find((o) => o.value === selectedScore) ?? null
  const loggedTime = formatTimeLabel(todayLog?.created_at ?? null)

  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col items-center px-4 pb-16 md:px-8">
        <div className="w-full max-w-2xl py-8 md:py-14">
          {/* ── Header ───────────────────────────────────── */}
          <div className="mb-10 space-y-3 text-center md:mb-14">
            <Badge
              variant="outline"
              className="mx-auto gap-1.5 rounded-full px-3.5 py-1"
            >
              <HeartPulse className="h-3.5 w-3.5" />
              Mood
            </Badge>

            <h1 className="text-2xl font-primary tracking-tight md:text-3xl">
              Today&apos;s Mood
            </h1>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              How are you feeling right now?
            </p>
            <Button variant="ghost" size="sm" className="mx-auto mt-1 gap-1.5 text-muted-foreground" asChild>
              <Link href="/mood/history">
                <History className="h-3.5 w-3.5" />
                View history
              </Link>
            </Button>
          </div>

          {/* ── Mood selector grid ───────────────────────── */}
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-9 lg:gap-3">
            {isSaving
              ? MOOD_SCALE.map((option) => {
                  const isActive = selectedScore === option.value
                  return (
                    <div
                      key={option.value}
                      className={cn(
                        "relative flex flex-col items-center justify-center rounded-2xl border-2 p-3 min-h-[96px] select-none animate-pulse pointer-events-none",
                        isActive
                          ? `${option.softAccent} ${option.border} opacity-85`
                          : "border-border/20 bg-muted/10 opacity-40"
                      )}
                    >
                      {/* Icon */}
                      <span
                        className={cn(
                          "opacity-45",
                          isActive ? option.text : "text-muted-foreground/60"
                        )}
                      >
                        <option.icon className="w-7 h-7" />
                      </span>

                      {/* Score Placeholder */}
                      <div className="mt-2.5 h-3.5 w-6 rounded bg-current opacity-20" />

                      {/* Label Placeholder */}
                      <div className="mt-1.5 h-2 w-10 rounded bg-current opacity-15" />
                    </div>
                  )
                })
              : MOOD_SCALE.map((option) => {
                  const isActive = selectedScore === option.value
                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => handleMoodTap(option.value)}
                      whileTap={{ scale: 0.93 }}
                      disabled={isSaving}
                      className={cn(
                        "relative flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all duration-200",
                        "min-h-[96px] select-none",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
                        isActive
                          ? `${option.softAccent} ${option.border} shadow-md`
                          : "border-border/40 bg-background hover:border-border hover:bg-muted/15",
                        isSaving && "pointer-events-none opacity-60"
                      )}
                    >
                      {/* Icon */}
                      <span
                        className={cn(
                          "transition-transform duration-200",
                          isActive && "scale-110",
                          isActive ? option.text : "text-muted-foreground/60"
                        )}
                      >
                        <option.icon className="w-7 h-7" />
                      </span>

                      {/* Score */}
                      <span
                        className={cn(
                          "mt-1.5 text-sm font-semibold tabular-nums leading-none",
                          isActive ? option.text : "text-foreground/80"
                        )}
                      >
                        {formatMoodScore(option.value)}
                      </span>

                      {/* Label */}
                      <span
                        className={cn(
                          "mt-1 text-[10px] font-medium leading-tight",
                          isActive ? option.text : "text-muted-foreground"
                        )}
                      >
                        {option.label}
                      </span>

                      {/* Saved check */}
                      <AnimatePresence>
                        {isActive && justSaved && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className={cn(
                              "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm",
                              option.accent
                            )}
                          >
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  )
                })}
          </div>

          {/* ── Loading skeleton ──────────────────────────── */}
          {isLoading && (
            <div className="mt-6 flex justify-center">
              <div className="h-4 w-32 animate-pulse rounded-full bg-muted/40" />
            </div>
          )}

          {/* ── Selected mood detail ─────────────────────── */}
          <AnimatePresence mode="wait">
            {selected && !isLoading && (
              <motion.div
                key={selected.value}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="mx-auto mt-8 max-w-md text-center"
              >
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {selected.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Note section (visible once logged) ────────── */}
          <AnimatePresence>
            {todayLog && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mx-auto mt-10 w-full max-w-md space-y-3 overflow-hidden"
              >
                <label className="block text-xs font-medium text-muted-foreground">
                  Note&ensp;
                  <span className="font-normal">(optional)</span>
                </label>
                <Textarea
                  placeholder="Anything you want to remember about today..."
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value)
                    setNoteDirty(true)
                  }}
                  rows={3}
                  className="resize-none bg-muted/10"
                />
                <AnimatePresence>
                  {noteDirty && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-end"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleNoteSave}
                        disabled={updateMut.isPending}
                      >
                        Save note
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Status line ──────────────────────────────── */}
          {todayLog && loggedTime && (
            <p className="mt-6 text-center text-xs text-muted-foreground/70">
              Logged at {loggedTime}
            </p>
          )}
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
