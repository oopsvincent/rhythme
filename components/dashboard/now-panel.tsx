"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  Flame, 
  Play, 
  CheckCircle2, 
  Circle, 
  Loader2, 
  BrainCircuit,
  TrendingUp,
  BatteryMedium,
  Check,
  AlertCircle
} from "lucide-react";
import { useNowPanel } from "@/hooks/use-now-panel";
import { useUpdateTaskStatus } from "@/hooks/use-tasks";
import { useLogCompletion } from "@/hooks/use-habits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FocusStarter } from "@/components/focus/focus-starter";
import type { Task, HabitWithStats } from "@/types/database";
import { toast } from "sonner";

export function NowPanel() {
  const { recommendedTask, activeHabit, capacity, momentum, isLoading, isError } = useNowPanel();
  const updateTaskStatus = useUpdateTaskStatus();
  const logHabitCompletion = useLogCompletion();
  const [focusDialogOpen, setFocusDialogOpen] = useState(false);

  // Task Completion Handler
  const handleTaskComplete = async (task: Task) => {
    try {
      await updateTaskStatus.mutateAsync({
        taskId: task.task_id,
        status: "completed",
      });
      toast.success("Task marked complete!");
    } catch (err) {
      toast.error("Failed to complete task.");
    }
  };

  // Habit Completion Handler
  const handleHabitComplete = async (habit: HabitWithStats) => {
    try {
      await logHabitCompletion.mutateAsync({
        habitId: habit.habit_id,
      });
      toast.success("Habit logged!");
    } catch (err) {
      toast.error("Failed to log habit.");
    }
  };

  if (isLoading) {
    return <NowPanelSkeleton />;
  }

  if (isError) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-destructive/20 bg-destructive/5 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-destructive" />
        <p className="text-sm text-destructive font-medium">
          Failed to load Now Panel. Please refresh or try again later.
        </p>
      </div>
    );
  }

  const hasRecommendedTask = !!recommendedTask;
  const hasActiveHabit = !!activeHabit;

  // Determine capacity colors
  const moodColorTheme = (() => {
    switch (capacity.moodType) {
      case "happy":
      case "excited":
        return {
          bg: "from-yellow-500/5 via-transparent to-transparent",
          border: "border-yellow-500/10",
          icon: "text-yellow-500",
          progress: "bg-yellow-500",
        };
      case "calm":
        return {
          bg: "from-blue-500/5 via-transparent to-transparent",
          border: "border-blue-500/10",
          icon: "text-blue-500",
          progress: "bg-blue-500",
        };
      case "sad":
      case "frustrated":
      case "anxious":
        return {
          bg: "from-indigo-500/5 via-transparent to-transparent",
          border: "border-indigo-500/10",
          icon: "text-indigo-400",
          progress: "bg-indigo-400",
        };
      default:
        return {
          bg: "from-primary/5 via-transparent to-transparent",
          border: "border-border/30",
          icon: "text-primary",
          progress: "bg-gradient-to-r from-primary to-accent",
        };
    }
  })();

  const isStable = momentum?.state === "stable" || momentum?.state === "building";
  const momentumText = isStable ? "Stable" : "Drifting";
  const glowColor = isStable
    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
    : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "glass-card bg-gradient-to-br border shadow-md rounded-[28px] p-6 sm:p-8 md:p-10 min-h-[380px] md:min-h-[440px] flex flex-col justify-between space-y-8 relative overflow-hidden",
          moodColorTheme.bg,
          moodColorTheme.border
        )}
      >
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        {/* 1. CAPACITY HEADER */}
        <div className="flex flex-col gap-3.5 border-b border-border/15 pb-6">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <BatteryMedium className={cn("w-4 h-4", moodColorTheme.icon)} />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                  Today&apos;s Capacity
                </span>
              </div>
              
              {/* Capacity Status */}
              <div className="flex items-center gap-2.5 shrink-0 select-none">
                <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-muted border border-border/40 text-foreground/80">
                  {capacity.energyLevel}
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground font-primary leading-tight">
              {capacity.rangeText}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {capacity.explanation}
            </p>
          </div>
        </div>

        {/* 2. MAIN BODY SECTION: Stacked vertically for clean column fitting */}
        <div className="flex flex-col gap-6">
          
          {/* RECOMMENDED ACTION */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 select-none">
              <BrainCircuit className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                Recommended Action
              </span>
            </div>

            {hasRecommendedTask ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {/* Instant Action Checkbox */}
                  <button
                    onClick={() => handleTaskComplete(recommendedTask)}
                    disabled={updateTaskStatus.isPending}
                    className={cn(
                      "mt-1 shrink-0 w-6 h-6 rounded-lg flex items-center justify-center border transition-all duration-200",
                      "border-border hover:border-primary hover:bg-primary/5 active:scale-95 cursor-pointer"
                    )}
                  >
                    {updateTaskStatus.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>

                  <div className="space-y-1.5 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground leading-snug font-primary truncate">
                      {recommendedTask.title}
                    </h3>
                    {recommendedTask.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {recommendedTask.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Recommendation badge & actions */}
                <div className="pl-10 space-y-4">
                  <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[10px] px-2.5 py-0.5 select-none font-medium">
                    {recommendedTask.recommendationReason}
                  </Badge>
                  
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Button
                      onClick={() => setFocusDialogOpen(true)}
                      className="rounded-xl h-12 px-6 text-sm font-semibold tracking-wide gap-2 shadow-md shadow-primary/5 hover:shadow-primary/10 hover:scale-[1.01] transition-all duration-300 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Start Focus Session
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleTaskComplete(recommendedTask)}
                      disabled={updateTaskStatus.isPending}
                      className="rounded-2xl h-11 px-4 text-xs font-medium border-border/40 hover:bg-muted cursor-pointer"
                    >
                      {updateTaskStatus.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      ) : null}
                      Mark as Done
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/40 bg-card/10 p-6 flex flex-col items-center justify-center text-center space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  All caught up! No tasks left on your backlog today.
                </p>
                <Button variant="link" className="text-xs font-bold text-primary px-0 h-auto cursor-pointer" onClick={() => window.location.href = "/tasks"}>
                  Add a new task +
                </Button>
              </div>
            )}
          </div>

          {/* Separator line */}
          <div className="w-full h-px bg-border/10" />

          {/* ACTIVE HABIT */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 select-none">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-accent">
                Active Habit
              </span>
            </div>

            {hasActiveHabit ? (
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-muted/30 border border-border/20">
                <div className="min-w-0 space-y-1.5">
                  <p className="text-sm sm:text-base font-semibold text-foreground truncate font-primary leading-none">
                    {activeHabit.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {activeHabit.periodCompletions}/{activeHabit.periodTarget} today
                    </span>
                    {activeHabit.current_streak > 0 && (
                      <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-0 text-[10px] h-4.5 px-1.5 py-0 select-none font-medium">
                        <Flame className="w-3 h-3 mr-0.5 fill-current" />
                        {activeHabit.current_streak}d streak
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Habit quick log button */}
                  <button
                    onClick={() => handleHabitComplete(activeHabit)}
                    disabled={logHabitCompletion.isPending}
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 active:scale-95 cursor-pointer",
                      "border-border/60 hover:border-accent hover:bg-accent/5"
                    )}
                  >
                    {logHabitCompletion.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 text-muted-foreground hover:text-accent" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/40 bg-card/10 p-5 text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  All habits logged for today. Excellent job!
                </p>
              </div>
            )}
          </div>

        </div>
      </motion.div>

      {/* 3. START FOCUS SESSION DIALOG */}
      <AnimatePresence>
        {focusDialogOpen && recommendedTask && (
          <Dialog open={focusDialogOpen} onOpenChange={setFocusDialogOpen}>
            <DialogContent className="max-w-xl rounded-3xl border border-border/80 bg-background/95 backdrop-blur-2xl p-6 sm:p-8 overflow-hidden shadow-2xl">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight font-primary">
                  Start Focus Session
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Lock in and enter deep work mode. Your recommended task is pre-selected.
                </DialogDescription>
              </DialogHeader>

              <div className="pt-4">
                <FocusStarter
                  initialTaskId={recommendedTask.task_id}
                  initialTaskTitle={recommendedTask.title}
                  onSessionStarted={() => {
                    setFocusDialogOpen(false);
                    toast.success("Focus session started! The timer is running.");
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}

// SKELETON LOADING STATE
function NowPanelSkeleton() {
  return (
    <div className="glass-card bg-muted/20 border border-border/30 rounded-3xl p-6 sm:p-7 space-y-6 animate-pulse">
      {/* Capacity Header Skeleton */}
      <div className="flex flex-col gap-3.5 border-b border-border/20 pb-5">
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between gap-4">
            <div className="h-4 w-24 bg-muted/60 rounded" />
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 bg-muted/60 rounded-full" />
              <div className="h-1.5 w-12 bg-muted/40 rounded-full" />
            </div>
          </div>
          <div className="h-7 w-3/4 bg-muted/80 rounded" />
          <div className="h-3 w-1/2 bg-muted/40 rounded" />
        </div>
      </div>

      {/* Main Area Skeleton: Vertical stack */}
      <div className="flex flex-col gap-5">
        {/* Recommended Action Skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-32 bg-muted/60 rounded" />
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 bg-muted/60 rounded-lg mt-1" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-2/3 bg-muted/80 rounded" />
                <div className="h-3.5 w-5/6 bg-muted/40 rounded" />
              </div>
            </div>
            <div className="pl-9 space-y-3">
              <div className="h-5 w-24 bg-muted/40 rounded" />
              <div className="flex gap-2.5">
                <div className="h-10 w-32 bg-muted/80 rounded-xl" />
                <div className="h-10 w-24 bg-muted/40 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-border/10" />

        {/* Active Habit Skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-20 bg-muted/60 rounded" />
          <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-muted/20 border border-border/10">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-1/3 bg-muted/60 rounded" />
              <div className="h-3 w-1/4 bg-muted/40 rounded" />
            </div>
            <div className="h-8 w-8 bg-muted/60 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
