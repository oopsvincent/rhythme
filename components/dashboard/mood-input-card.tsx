"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  HeartPulse,
  Loader2,
  ChevronRight,
  Smile
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

export function MoodInputCard() {
  const { data: logs = [], isLoading } = useMoodLogs(14);
  const createMut = useCreateMoodLog();
  const updateMut = useUpdateMoodLog();
  
  const [showGate, setShowGate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50">
        <div className="h-20 animate-pulse bg-muted/50 rounded-lg" />
      </div>
    );
  }

  const showSelection = !todayLog || isEditing;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50 relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {showSelection ? (
            // Selection state
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  How are you feeling today?
                </p>
                {todayLog && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {MOOD_SCALE.map((option) => {
                  const Icon = option.icon;
                  const isSelected = currentMoodScore === option.value;
                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => handleMoodSelect(option.value)}
                      disabled={isSaving}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        "flex flex-col items-center justify-center py-2.5 px-2 rounded-xl transition-all duration-200 border text-center relative",
                        isSelected
                          ? `${option.softAccent} ${option.border} shadow-sm`
                          : "border-border/30 bg-background/50 hover:bg-muted/40",
                        isSaving && "pointer-events-none opacity-60"
                      )}
                    >
                      {isSaving && isSelected ? (
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      ) : (
                        <Icon className={cn("w-5 h-5 mb-1", isSelected ? option.text : "text-muted-foreground")} />
                      )}
                      <span className="text-[10px] font-bold tabular-nums leading-none mb-0.5">
                        {formatMoodScore(option.value)}
                      </span>
                      <span className="text-[9px] font-medium leading-none truncate w-full text-muted-foreground">
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
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center border",
                  selectedMoodOption?.softAccent || "bg-muted/30",
                  selectedMoodOption?.border || "border-border/30"
                )}>
                  {selectedMoodOption ? (
                    <selectedMoodOption.icon className={cn("w-5 h-5", selectedMoodOption.text)} />
                  ) : (
                    <Smile className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today you&apos;re feeling</p>
                  <p className="font-semibold font-primary capitalize flex items-center gap-1.5">
                    {selectedMoodOption?.label || "Steady"}
                    <span className="text-xs text-muted-foreground font-normal">
                      ({formatMoodScore(currentMoodScore || 3.0)})
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Change
                </button>
                <Link
                  href="/journal/new"
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-0.5"
                >
                  Reflect <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <PremiumGateModal
        open={showGate}
        onOpenChange={setShowGate}
        reason="mood"
      />
    </>
  );
}
