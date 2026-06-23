"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, HeartPulse, History, ChevronDown, ChevronUp } from "lucide-react";
import { canCreateMoodLog } from "@/app/actions/usage-limits";
import { PremiumGateModal } from "@/components/premium-gate-modal";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useMoodLogs,
  useCreateMoodLog,
  useUpdateMoodLog,
} from "@/hooks/use-mood-logs";
import { MOOD_SCALE, formatMoodScore } from "@/lib/mood";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getLocalDateString } from "@/lib/timezone";

function getTodayDate() {
  return getLocalDateString();
}

function formatTimeLabel(ts: string | null) {
  if (!ts) return null;
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MoodPageClient() {
  const { data: logs = [], isLoading } = useMoodLogs();
  const createMut = useCreateMoodLog();
  const updateMut = useUpdateMoodLog();

  const today = getTodayDate();
  const todayLog = logs.find((l) => l.logged_at === today) ?? null;

  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [noteDirty, setNoteDirty] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [hoveredMood, setHoveredMoodState] = useState<number | null>(null);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (value: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredMoodState(value);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMoodState(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  /* Sync UI from today's log whenever it changes */
  useEffect(() => {
    if (todayLog) {
      setSelectedScore(Number(todayLog.mood_score));
      setNote(todayLog.note ?? "");
      setNoteDirty(false);
    }
    if (!todayLog && !createMut.isPending) {
      setSelectedScore(null);
      setNote("");
      setNoteDirty(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayLog?.id]);

  const isSaving = createMut.isPending || updateMut.isPending;

  /* ── One-tap mood save ────────────────────────────────── */
  async function handleMoodTap(score: number) {
    if (isSaving) return;
    const prev = selectedScore;
    setSelectedScore(score);

    try {
      if (todayLog) {
        await updateMut.mutateAsync({
          id: todayLog.id,
          input: { mood_score: score },
        });
      } else {
        const gate = await canCreateMoodLog(today);
        if (!gate.allowed) {
          setSelectedScore(prev);
          setShowGate(true);
          return;
        }
        await createMut.mutateAsync({
          mood_score: score,
          logged_at: today,
        });
      }
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2200);
      toast.success(todayLog ? "Mood updated" : "Mood logged", {
        duration: 2000,
      });
    } catch (error) {
      setSelectedScore(prev);
      const msg =
        error instanceof Error ? error.message : "Failed to save mood";
      if (msg.includes("Upgrade to Premium")) {
        setShowGate(true);
      } else {
        toast.error(msg);
      }
    }
  }

  /* ── Save note ────────────────────────────────────────── */
  async function handleNoteSave() {
    if (!todayLog || !noteDirty) return;
    try {
      await updateMut.mutateAsync({
        id: todayLog.id,
        input: { note },
      });
      setNoteDirty(false);
      toast.success("Note saved", { duration: 1500 });
    } catch {
      toast.error("Could not save note");
    }
  }

  // Determine active mood value for ambient glow
  const activeMoodValue = hoveredMood ?? selectedScore;

  // Soft color mapping for radial gradient glows
  const getAmbientGlowColor = (value: number | null) => {
    if (value === null) return "transparent";
    switch (value) {
      case 1: return "rgba(244, 63, 94, 0.04)";     // rose (Drained)
      case 1.5: return "rgba(249, 115, 22, 0.04)";   // orange (Low)
      case 2: return "rgba(245, 158, 11, 0.04)";     // amber (Heavy)
      case 2.5: return "rgba(234, 179, 8, 0.04)";    // yellow (Uneasy)
      case 3: return "rgba(132, 204, 22, 0.04)";     // lime (Steady)
      case 3.5: return "rgba(16, 185, 129, 0.04)";   // emerald (Grounded)
      case 4: return "rgba(14, 165, 233, 0.04)";     // sky (Bright)
      case 4.5: return "rgba(59, 130, 246, 0.04)";    // blue (Lifted)
      case 5: return "rgba(139, 92, 246, 0.04)";     // violet (Excellent)
      default: return "transparent";
    }
  };

  const glowColor = getAmbientGlowColor(activeMoodValue);

  /* ── Derived state ────────────────────────────────────── */
  const selected = MOOD_SCALE.find((o) => o.value === selectedScore) ?? null;
  const loggedTime = formatTimeLabel(todayLog?.created_at ?? null);

  const displayMoodValue = hoveredMood ?? selectedScore;
  const displayMood = MOOD_SCALE.find(m => m.value === displayMoodValue) ?? null;
  const DisplayIcon = displayMood?.icon;
  const isPreviewActive = displayMood !== null;

  /* ── Full page loading skeleton state ──────────────────── */
  if (isLoading) {
    return (
      <>
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center px-4 pb-16 md:px-8 relative overflow-hidden">
          <div className="w-full max-w-2xl py-8 md:py-14 space-y-10 animate-pulse text-center">
            <div className="space-y-3 flex flex-col items-center">
              <div className="h-6 w-24 bg-muted/30 rounded-full" />
              <div className="h-8 w-48 bg-muted/50 rounded-lg" />
              <div className="h-4 w-64 bg-muted/30 rounded" />
            </div>
            
            <div className="h-[80px] w-full max-w-md mx-auto bg-muted/20 border border-border/10 rounded-2xl" />

            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-9 lg:gap-3">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center rounded-2xl border border-border/10 p-3 min-h-[96px] bg-muted/15"
                >
                  <div className="w-11 h-11 rounded-full bg-muted/30" />
                  <div className="mt-2.5 h-3.5 w-6 rounded bg-muted/25" />
                  <div className="mt-1.5 h-2 w-10 rounded bg-muted/20" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col items-center px-4 pb-16 md:px-8 relative overflow-hidden min-h-[calc(100vh-var(--header-height))] transition-colors duration-500 ease-out">
        {/* Soft Ambient Radial Glow Backdrop */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-500 ease-out z-0 opacity-40 dark:opacity-30"
          style={{
            background: glowColor !== "transparent"
              ? `radial-gradient(circle at 50% 30%, ${glowColor} 0%, transparent 65%)`
              : "none"
          }}
        />

        <div className="w-full max-w-2xl py-8 md:py-14 relative z-10">
          {/* ── Header ───────────────────────────────────── */}
          <div className="mb-10 space-y-3 text-center md:mb-12">
            <Badge
              variant="outline"
              className="mx-auto gap-1.5 rounded-full px-3.5 py-1 border-primary/20 bg-primary/5 text-primary"
            >
              <HeartPulse className="h-3.5 w-3.5" />
              Mood
            </Badge>

            <h1 className="text-2xl font-primary font-semibold tracking-tight md:text-3xl text-foreground/90">
              Today&apos;s Mood
            </h1>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              How are you feeling right now?
            </p>
            <Button variant="ghost" size="sm" className="mx-auto mt-1 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/30" asChild>
              <Link href="/mood/history">
                <History className="h-3.5 w-3.5" />
                View history
              </Link>
            </Button>
          </div>

          {/* ── Centerpiece Preview (Collapsible on Mobile, slides open on Desktop) ── */}
          <motion.div
            initial={false}
            animate={{ 
              height: isPreviewActive && (showPreviewMobile || typeof window !== "undefined" && window.innerWidth >= 640) ? 80 : 0, 
              opacity: isPreviewActive && (showPreviewMobile || typeof window !== "undefined" && window.innerWidth >= 640) ? 1 : 0,
              marginTop: isPreviewActive && (showPreviewMobile || typeof window !== "undefined" && window.innerWidth >= 640) ? 12 : 0,
              marginBottom: isPreviewActive && (showPreviewMobile || typeof window !== "undefined" && window.innerWidth >= 640) ? 20 : 0
            }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden hidden sm:block w-full max-w-md mx-auto"
            style={{ display: isPreviewActive ? undefined : "none" }}
          >
            {displayMood && DisplayIcon && (
              <div className={cn(
                "flex items-center gap-3.5 p-3.5 rounded-2xl bg-muted/20 border border-border/10 h-[80px] text-left"
              )}>
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-300",
                  displayMood.softAccent,
                  displayMood.border
                )}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`icon-page-${displayMood.value}`}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      <DisplayIcon className={cn("w-6 h-6", displayMood.text)} />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex-1 min-w-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`text-page-${displayMood.value}`}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="space-y-0.5"
                    >
                      <p className="text-sm font-semibold tracking-tight text-foreground/90 font-primary">
                        {displayMood.label} <span className="text-xs text-muted-foreground font-normal">({formatMoodScore(displayMood.value)})</span>
                      </p>
                      <p className="text-xs text-muted-foreground leading-normal line-clamp-2">
                        {displayMood.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </motion.div>

          {/* Mobile Preview Details Header */}
          {isPreviewActive && (
            <div className="flex sm:hidden justify-between items-center w-full max-w-md mx-auto px-1.5 mt-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
                Mood Details
              </span>
              <button
                onClick={() => setShowPreviewMobile(prev => !prev)}
                className="flex items-center gap-1 text-xs text-primary font-medium hover:text-primary/80 transition-colors focus:outline-none cursor-pointer"
              >
                {showPreviewMobile ? (
                  <>Hide description <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <>Show description <ChevronDown className="w-3.5 h-3.5" /></>
                )}
              </button>
            </div>
          )}

          {/* Mobile Collapsible Preview Container */}
          {isPreviewActive && showPreviewMobile && displayMood && DisplayIcon && (
            <div className="sm:hidden flex items-center gap-3.5 p-3.5 rounded-2xl bg-muted/20 border border-border/10 text-left mt-2 mb-4 w-full max-w-md mx-auto">
              <div className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center border shrink-0",
                displayMood.softAccent,
                displayMood.border
              )}>
                <DisplayIcon className={cn("w-6 h-6", displayMood.text)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold tracking-tight text-foreground/90 font-primary">
                  {displayMood.label} <span className="text-xs text-muted-foreground font-normal">({formatMoodScore(displayMood.value)})</span>
                </p>
                <p className="text-xs text-muted-foreground leading-normal">
                  {displayMood.description}
                </p>
              </div>
            </div>
          )}

          {/* ── Mood selector grid ───────────────────────── */}
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-9 lg:gap-3">
            {isSaving
              ? MOOD_SCALE.map((option) => {
                  const isActive = selectedScore === option.value;
                  return (
                    <div
                      key={option.value}
                      className={cn(
                        "relative flex flex-col items-center justify-center rounded-2xl border p-3 min-h-[96px] select-none animate-pulse pointer-events-none",
                        isActive
                          ? `${option.softAccent} ${option.border} opacity-85`
                          : "border-border/10 bg-muted/10 opacity-40"
                      )}
                    >
                      {/* Icon */}
                      <span
                        className={cn(
                          "opacity-45",
                          isActive ? option.text : "text-muted-foreground/60"
                        )}
                      >
                        <option.icon className="w-6 h-6" />
                      </span>

                      {/* Score Placeholder */}
                      <div className="mt-2.5 h-3.5 w-6 rounded bg-current opacity-20" />

                      {/* Label Placeholder */}
                      <div className="mt-1.5 h-2 w-10 rounded bg-current opacity-15" />
                    </div>
                  );
                })
              : MOOD_SCALE.map((option) => {
                  const isActive = selectedScore === option.value;
                  const isHovered = hoveredMood === option.value;
                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => handleMoodTap(option.value)}
                      onMouseEnter={() => handleMouseEnter(option.value)}
                      onMouseLeave={handleMouseLeave}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isSaving}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={cn(
                        "relative flex flex-col items-center justify-center rounded-2xl border transition-all duration-300",
                        "min-h-[96px] select-none focus:outline-none cursor-pointer",
                        isActive
                          ? `${option.softAccent} ${option.border} shadow-md ring-1 ring-primary/5`
                          : "border-border/10 bg-background/40 hover:border-border/30 hover:bg-muted/15",
                        isSaving && "pointer-events-none opacity-50"
                      )}
                    >
                      {/* Icon container */}
                      <div className={cn(
                        "w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 mb-1.5 pointer-events-none",
                        isActive || isHovered
                          ? `${option.softAccent} ${option.border}`
                          : "bg-muted/10 border-transparent"
                      )}>
                        <option.icon className={cn("w-5.5 h-5.5 transition-colors duration-300 pointer-events-none", 
                          isActive || isHovered ? option.text : "text-muted-foreground/80"
                        )} />
                      </div>

                      {/* Score */}
                      <span
                        className={cn(
                          "text-sm font-bold tabular-nums leading-none mb-0.5 pointer-events-none",
                          isActive ? option.text : "text-foreground/90"
                        )}
                      >
                        {formatMoodScore(option.value)}
                      </span>

                      {/* Label */}
                      <span
                        className={cn(
                          "text-[9px] font-medium leading-none truncate w-full text-muted-foreground/85 pointer-events-none",
                          isActive ? option.text : "text-muted-foreground"
                        )}
                      >
                        {option.label}
                      </span>

                      {/* Saved check checkmark */}
                      <AnimatePresence>
                        {isActive && justSaved && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className={cn(
                              "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm pointer-events-none",
                              option.accent
                            )}
                          >
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
          </div>

          {/* ── Note section (visible once logged) ────────── */}
          <AnimatePresence>
            {todayLog && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mx-auto mt-10 w-full max-w-md space-y-3 overflow-hidden text-left"
              >
                <label className="block text-xs font-semibold text-muted-foreground">
                  Reflection Note&ensp;
                  <span className="font-normal text-muted-foreground/60">(optional)</span>
                </label>
                <Textarea
                  placeholder="Capture thoughts, triggers, or anything you'd like to remember..."
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                    setNoteDirty(true);
                  }}
                  rows={3}
                  className="resize-none bg-muted/10 border-border/20 focus-visible:border-primary/50 rounded-xl"
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
                        className="rounded-xl px-4 font-medium border-primary/20 text-primary hover:bg-primary/5"
                      >
                        Save Note
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Status line ──────────────────────────────── */}
          {todayLog && loggedTime && (
            <p className="mt-6 text-center text-xs text-muted-foreground/60">
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
  );
}
