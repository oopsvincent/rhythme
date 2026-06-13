"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Loader2,
  ChevronRight,
  Smile,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { getLocalDateString } from "@/lib/timezone";
import Link from "next/link";
import { 
  useMoodLogs, 
  useCreateMoodLog, 
  useUpdateMoodLog 
} from "@/hooks/use-mood-logs";
import { MOOD_SCALE, formatMoodScore } from "@/lib/mood";
import { toast } from "sonner";
import { canCreateMoodLog } from "@/app/actions/usage-limits";
import { PremiumGateModal } from "@/components/premium-gate-modal";
import { MoodInputSkeleton } from "./dashboard-skeleton";

export function MoodInputCard() {
  const { data: logs = [], isLoading } = useMoodLogs(14);
  const createMut = useCreateMoodLog();
  const updateMut = useUpdateMoodLog();
  
  const [showGate, setShowGate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hoveredMood, setHoveredMood] = useState<number | null>(null);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  const todayStr = getLocalDateString();
  const todayLog = logs.find((l) => l.logged_at === todayStr) ?? null;

  const handleMoodSelect = async (score: number) => {
    try {
      if (todayLog) {
        await updateMut.mutateAsync({
          id: todayLog.id,
          input: { mood_score: score },
        });
        toast.success("Mood updated!");
      } else {
        const gate = await canCreateMoodLog(todayStr);
        if (!gate.allowed) {
          setShowGate(true);
          return;
        }
        await createMut.mutateAsync({
          mood_score: score,
          logged_at: todayStr,
        });
        toast.success("Mood logged!");
      }
      setIsEditing(false);
    } catch (error: any) {
      const msg = error?.message || "Failed to save mood";
      if (msg.includes("Upgrade to Premium")) {
        setShowGate(true);
      } else {
        toast.error(msg);
      }
    }
  };

  const isSaving = createMut.isPending || updateMut.isPending;
  const currentMoodScore = todayLog ? Number(todayLog.mood_score) : null;
  const selectedMoodOption = MOOD_SCALE.find(m => m.value === currentMoodScore);

  // Determine active mood value for ambient glow (hover state takes priority)
  const activeMoodValue = hoveredMood ?? currentMoodScore ?? null;

  // Soft color mapping for radial gradient glows
  const getAmbientGlowColor = (value: number | null) => {
    if (value === null) return "transparent";
    switch (value) {
      case 1: return "rgba(244, 63, 94, 0.03)";     // rose (Drained)
      case 1.5: return "rgba(249, 115, 22, 0.03)";   // orange (Low)
      case 2: return "rgba(245, 158, 11, 0.03)";     // amber (Heavy)
      case 2.5: return "rgba(234, 179, 8, 0.03)";    // yellow (Uneasy)
      case 3: return "rgba(132, 204, 22, 0.03)";     // lime (Steady)
      case 3.5: return "rgba(16, 185, 129, 0.03)";   // emerald (Grounded)
      case 4: return "rgba(14, 165, 233, 0.03)";     // sky (Bright)
      case 4.5: return "rgba(59, 130, 246, 0.03)";    // blue (Lifted)
      case 5: return "rgba(139, 92, 246, 0.03)";     // violet (Excellent)
      default: return "transparent";
    }
  };

  const glowColor = getAmbientGlowColor(activeMoodValue);

  // If loading initially, show the standard slow-pulse skeleton
  if (isLoading) {
    return <MoodInputSkeleton />;
  }

  // If saving, render a slow-pulse skeleton style to block input and provide feedback
  if (isSaving) {
    return (
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50 space-y-4 animate-pulse pointer-events-none select-none">
        <div className="flex items-center justify-between">
          <div className="h-4 w-36 bg-muted/60 rounded-md" />
          <Loader2 className="w-4 h-4 animate-spin text-primary/70" />
        </div>
        <div className="h-14 bg-muted/30 rounded-xl flex items-center justify-center">
          <span className="text-xs text-muted-foreground/80 font-medium">Recording check-in...</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-14 bg-muted/20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const showSelection = !todayLog || isEditing;

  // Centerpiece preview helpers
  const displayMoodValue = hoveredMood ?? currentMoodScore;
  const displayMood = MOOD_SCALE.find(m => m.value === displayMoodValue) ?? null;
  const DisplayIcon = displayMood?.icon;

  // Widget preview visibility (always visible on desktop if active, collapsible on mobile)
  const isPreviewActive = displayMood !== null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50 relative overflow-hidden transition-colors duration-500 ease-out"
      >
        {/* Soft Ambient Radial Glow */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-500 ease-out z-0"
          style={{
            background: glowColor !== "transparent"
              ? `radial-gradient(circle at 50% 50%, ${glowColor} 0%, transparent 80%)`
              : "none"
          }}
        />

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {showSelection ? (
              // Selection state
              <motion.div
                key="selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-muted-foreground font-sans">
                    How are you feeling today?
                  </p>
                  {todayLog && (
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors focus:outline-none cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {/* Collapsible Mobile Preview Header */}
                {isPreviewActive && (
                  <div className="flex sm:hidden justify-between items-center">
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

                {/* Centerpiece Preview (Smooth fixed-height slide-drawer) */}
                <motion.div
                  initial={false}
                  animate={{ 
                    height: isPreviewActive && (showPreviewMobile || typeof window !== "undefined" && window.innerWidth >= 640) ? 72 : 0, 
                    opacity: isPreviewActive && (showPreviewMobile || typeof window !== "undefined" && window.innerWidth >= 640) ? 1 : 0,
                    marginBottom: isPreviewActive && (showPreviewMobile || typeof window !== "undefined" && window.innerWidth >= 640) ? 12 : 0
                  }}
                  transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                  className="overflow-hidden hidden sm:block md:block lg:block"
                  style={{ display: isPreviewActive ? undefined : "none" }}
                >
                  {displayMood && DisplayIcon && (
                    <div className={cn(
                      "flex items-center gap-3.5 p-3.5 rounded-2xl bg-muted/20 border border-border/10 h-[72px] text-left"
                    )}>
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-300",
                        displayMood.softAccent,
                        displayMood.border
                      )}>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`icon-${displayMood.value}`}
                            initial={{ y: 8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -8, opacity: 0 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                          >
                            <DisplayIcon className={cn("w-5 h-5", displayMood.text)} />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`text-${displayMood.value}`}
                            initial={{ y: 8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -8, opacity: 0 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="space-y-0.5"
                          >
                            <p className="text-sm font-semibold tracking-tight text-foreground/90 font-primary">
                              {displayMood.label} <span className="text-xs text-muted-foreground font-normal">({formatMoodScore(displayMood.value)})</span>
                            </p>
                            <p className="text-xs text-muted-foreground leading-none truncate">
                              {displayMood.description}
                            </p>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Mobile Collapsible Preview Container */}
                {isPreviewActive && showPreviewMobile && displayMood && DisplayIcon && (
                  <div className="sm:hidden flex items-center gap-3.5 p-3.5 rounded-2xl bg-muted/20 border border-border/10 text-left">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0",
                      displayMood.softAccent,
                      displayMood.border
                    )}>
                      <DisplayIcon className={cn("w-5 h-5", displayMood.text)} />
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

                {/* Tactile Selection Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {MOOD_SCALE.map((option) => {
                    const Icon = option.icon;
                    const isSelected = currentMoodScore === option.value;
                    const isHovered = hoveredMood === option.value;
                    return (
                      <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => handleMoodSelect(option.value)}
                        onMouseEnter={() => setHoveredMood(option.value)}
                        onMouseLeave={() => setHoveredMood(null)}
                        disabled={isSaving}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={cn(
                          "flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all duration-300 border text-center focus:outline-none cursor-pointer",
                          isSelected
                            ? `${option.softAccent} ${option.border} shadow-sm ring-1 ring-primary/5`
                            : "border-border/10 bg-background/30 hover:border-border/30 hover:bg-muted/15",
                          isSaving && "pointer-events-none opacity-50"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 mb-1",
                          isSelected || isHovered
                            ? `${option.softAccent} ${option.border}`
                            : "bg-muted/10 border-transparent"
                        )}>
                          <Icon className={cn("w-4.5 h-4.5 transition-colors duration-300", 
                            isSelected || isHovered ? option.text : "text-muted-foreground/80"
                          )} />
                        </div>
                        <span className="text-[10px] font-bold tabular-nums leading-none mb-0.5 text-foreground/90">
                          {formatMoodScore(option.value)}
                        </span>
                        <span className="text-[9px] font-medium leading-none truncate w-full text-muted-foreground/80">
                          {option.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              // Logged state
              <motion.div
                key="logged"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300",
                    selectedMoodOption?.softAccent || "bg-muted/30",
                    selectedMoodOption?.border || "border-border/30"
                  )}>
                    {selectedMoodOption ? (
                      <selectedMoodOption.icon className={cn("w-5.5 h-5.5", selectedMoodOption.text)} />
                    ) : (
                      <Smile className="w-5.5 h-5.5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Today you&apos;re feeling</p>
                    <p className="font-semibold font-primary capitalize flex items-center gap-1.5 text-base text-foreground/90">
                      {selectedMoodOption?.label || "Steady"}
                      <span className="text-xs text-muted-foreground font-normal">
                        ({formatMoodScore(currentMoodScore || 3.0)})
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors focus:outline-none cursor-pointer"
                  >
                    Change
                  </button>
                  <Link
                    href="/journal/new"
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5"
                  >
                    Reflect <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <PremiumGateModal
        open={showGate}
        onOpenChange={setShowGate}
        reason="mood"
      />
    </>
  );
}
