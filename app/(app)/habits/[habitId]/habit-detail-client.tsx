"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  CheckCircle2,
  Flame,
  Brain,
  Sparkles,
  Loader2,
  Calendar,
  Clock,
  Target,
  MessageSquare,
  XCircle,
  Pencil,
  User,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { motion } from "framer-motion";
import type {
  HabitWithStats,
  HabitLog,
  HabitFrequency,
} from "@/types/database";
import {
  useLogCompletion,
  useRemoveCompletion,
  useHabitPrediction,
  useUpdateHabit,
} from "@/hooks/use-habits";
import {
  canUsePrediction,
  getDaysUntilPrediction,
} from "@/lib/habit-prediction";
import {
  getFrequencyLabel,
  getTargetLabel,
  getStreakUnit,
} from "@/lib/habit-helpers";
import { HabitHeatmap } from "@/components/dashboard/habit-heatmap";
import { Calendar as UiCalendar } from "@/components/ui/calendar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Get motivational message based on prediction probability
 */
function getPredictionMessage(probability: number): string {
  const percent = probability * 100;

  if (percent <= 10) {
    return "🌱 Every journey starts somewhere. One step at a time!";
  } else if (percent <= 20) {
    return "🔥 Building momentum! Keep showing up.";
  } else if (percent <= 30) {
    return "💪 You're forming a pattern. Stay consistent!";
  } else if (percent <= 40) {
    return "⭐ Almost halfway there! Your effort is paying off.";
  } else if (percent <= 50) {
    return "🎯 Solid foundation! You're becoming reliable.";
  } else if (percent <= 60) {
    return "📈 Above average! This habit is sticking.";
  } else if (percent <= 70) {
    return "🌟 Strong commitment! You're building real momentum.";
  } else if (percent <= 80) {
    return "🏆 Excellent consistency! This is becoming second nature.";
  } else if (percent <= 90) {
    return "💎 Outstanding! You've nearly mastered this habit.";
  } else {
    return "🚀 Unstoppable! This habit is now part of your identity.";
  }
}

const MOTIVATIONAL_QUOTES = [
  { text: "Discipline is choosing between what you want now and what you want most." },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "It is easier to prevent bad habits than to break them.", author: "Benjamin Franklin" },
  { text: "Your habits will determine your future.", author: "Jack Canfield" },
  { text: "An ounce of prevention is worth a pound of cure.", author: "Benjamin Franklin" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Atomic habits yield massive results over time." },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent Van Gogh" }
];

function getWeeksForMonth(year: number, monthIndex: number) {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  const firstDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - startOffset);

  const lastDayOfWeek = lastDay.getDay();
  const endOffset = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + endOffset);

  const weeks = [];
  const curr = new Date(startDate);
  curr.setHours(0, 0, 0, 0);
  const endLimit = new Date(endDate);
  endLimit.setHours(23, 59, 59, 999);

  while (curr <= endLimit) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    weeks.push({
      label: days[0].toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      days,
    });
  }
  return weeks;
}

const FREQUENCY_OPTIONS: { value: HabitFrequency; label: string }[] = [
  { value: 0, label: "Daily" },
  { value: 1, label: "Weekly" },
  { value: 2, label: "Monthly" },
  { value: 3, label: "Multiple per week" },
];

interface HabitStats {
  completion_rate_7d: number;
  completion_rate_30d: number;
  current_streak: number;
  days_since_start: number;
  total_completions: number;
}

interface HabitDetailClientProps {
  initialHabit: HabitWithStats;
  initialStats: HabitStats | null;
}

function HabitDetailClientContent({
  initialHabit,
  initialStats,
}: HabitDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isVisible = useScrollDirection();

  // Local state for optimistic updates
  const [habit, setHabit] = useState<HabitWithStats>(initialHabit);
  const [stats, setStats] = useState<HabitStats | null>(initialStats);

  // Mutations
  const logMutation = useLogCompletion();
  const removeMutation = useRemoveCompletion();
  const updateMutation = useUpdateHabit();

  // Prediction hook
  const {
    data: prediction,
    isLoading: isPredictionLoading,
    error: predictionError,
  } = useHabitPrediction(habit);

  // Dialog state
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [completionNote, setCompletionNote] = useState("");

  // Tab and Calendar layout states
  const tabParam = searchParams.get("tab");
  const activeTab = (tabParam === "heatmap" || tabParam === "calendar" || tabParam === "stats") ? tabParam : "heatmap";

  const setActiveTab = (tab: "heatmap" | "calendar" | "stats") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [heatmapMonth, setHeatmapMonth] = useState<Date>(() => new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date>(() => new Date());
  
  // Edit form state
  const [editName, setEditName] = useState(habit.name);
  const [editDescription, setEditDescription] = useState(habit.description || "");
  const [editFrequency, setEditFrequency] = useState<HabitFrequency>(habit.frequency_num ?? habit.frequency);
  const [editTargetCount, setEditTargetCount] = useState(habit.target_count ?? 1);

  const today = new Date().toISOString().split("T")[0];
  const daysUntilPrediction = canUsePrediction(habit)
    ? 0
    : getDaysUntilPrediction(habit);
  const freq = habit.frequency_num ?? habit.frequency;
  const streakUnit = getStreakUnit(freq);

  const handleComplete = () => {
    logMutation.mutate(
      {
        habitId: habit.habit_id,
        note: completionNote || undefined,
      },
      {
        onSuccess: (data) => {
          // Optimistic update
          setHabit((prev) => ({
            ...prev,
            isCompletedForPeriod: (prev.periodCompletions + 1) >= prev.periodTarget,
            periodCompletions: prev.periodCompletions + 1,
            completedToday: true,
            completedThisWeek: true,
            current_streak: prev.current_streak + 1,
            completionLogs: data ? [data, ...prev.completionLogs] : prev.completionLogs,
          }));
          if (stats) {
            setStats((prev) =>
              prev
                ? {
                    ...prev,
                    current_streak: prev.current_streak + 1,
                    total_completions: prev.total_completions + 1,
                  }
                : null
            );
          }
          setIsCompleteDialogOpen(false);
          setCompletionNote("");
        },
      }
    );
  };

  const handleRemoveCompletion = () => {
    // Optimistic update
    setHabit((prev) => ({
      ...prev,
      isCompletedForPeriod: false,
      periodCompletions: Math.max(0, prev.periodCompletions - 1),
      completedToday: false,
      current_streak: Math.max(0, prev.current_streak - 1),
      completionLogs: prev.completionLogs.filter(
        (log) => !log.completed_at.startsWith(today)
      ),
    }));
    if (stats) {
      setStats((prev) =>
        prev
          ? {
              ...prev,
              current_streak: Math.max(0, prev.current_streak - 1),
              total_completions: Math.max(0, prev.total_completions - 1),
            }
          : null
      );
    }
    setIsRemoveDialogOpen(false);

    removeMutation.mutate(
      {
        habitId: habit.habit_id,
        date: today,
      },
      {
        onError: () => {
          router.refresh();
        },
      }
    );
  };

  const handleEdit = () => {
    if (!editName.trim()) return;
    
    updateMutation.mutate(
      {
        habitId: habit.habit_id,
        input: {
          name: editName.trim(),
          description: editDescription.trim() || null,
          frequency: editFrequency,
          target_count: editTargetCount,
        },
      },
      {
        onSuccess: (data) => {
          if (data) {
            setHabit((prev) => ({
              ...prev,
              name: data.name,
              description: data.description,
              frequency: data.frequency,
              frequency_num: data.frequency_num ?? data.frequency,
              target_count: data.target_count ?? prev.target_count,
            }));
          }
          setIsEditDialogOpen(false);
        },
      }
    );
  };

  // Group logs by date
  const groupedLogs = habit.completionLogs.reduce((acc, log) => {
    const date = new Date(log.completed_at).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {} as Record<string, HabitLog[]>);

  const isPending = logMutation.isPending || removeMutation.isPending;

  // component helpers for heatmap grid
  const getCompletionsForDate = (date: Date) => {
    const targetYear = date.getFullYear();
    const targetMonth = String(date.getMonth() + 1).padStart(2, "0");
    const targetDay = String(date.getDate()).padStart(2, "0");
    const targetStr = `${targetYear}-${targetMonth}-${targetDay}`;

    return habit.completionLogs.filter((log) => {
      const logDate = new Date(log.completed_at);
      const logYear = logDate.getFullYear();
      const logMonth = String(logDate.getMonth() + 1).padStart(2, "0");
      const logDay = String(logDate.getDate()).padStart(2, "0");
      const logStr = `${logYear}-${logMonth}-${logDay}`;
      return logStr === targetStr;
    }).length;
  };

  const isDayInFuture = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    return d > todayMidnight;
  };

  const getIntensityClass = (count: number) => {
    if (count === 0) {
      return "bg-muted/15 border-border/20 dark:bg-zinc-900/40 dark:border-zinc-850/60 text-transparent";
    }
    if (count === 1) return "bg-primary/25 border-primary/20 text-transparent";
    if (count === 2) return "bg-primary/45 border-primary/30 text-transparent";
    if (count === 3) return "bg-primary/65 border-primary/40 text-transparent";
    if (count === 4) return "bg-primary/85 border-primary/50 text-transparent";
    return "bg-primary border-primary glow-primary text-transparent";
  };

  // completedDates for interactive calendar
  const completedDates = habit.completionLogs.map(log => {
    const d = new Date(log.completed_at);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const selectedDateStr = selectedCalendarDate.toDateString();
  const logsForSelectedDate = habit.completionLogs.filter(log => {
    return new Date(log.completed_at).toDateString() === selectedDateStr;
  });

  return (
    <>
      <SiteHeader />

      {/* ========================================================================= */}
      {/* MOBILE ONLY LAYOUT (centered, narrow mockup layout)                       */}
      {/* ========================================================================= */}
      <div className="flex md:hidden flex-col px-4 pb-8 w-full max-w-md mx-auto space-y-4 relative pb-28">
        {/* Mobile Header Bar */}
        <div className="w-full flex items-center justify-between select-none pt-2 pb-1">
          <button
            onClick={() => router.push("/habits")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card/60 dark:bg-card/25 border border-border/30 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Habits</span>
          </button>
          
          <button
            onClick={() => {
              setEditName(habit.name);
              setEditDescription(habit.description || "");
              setEditFrequency(freq);
              setEditTargetCount(habit.target_count ?? 1);
              setIsEditDialogOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card/60 dark:bg-card/25 border border-border/30 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <span>Edit</span>
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Title Block */}
        <div className="w-full select-none space-y-1 pb-1 pt-1">
          <div className="flex flex-col items-start text-left">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E07A5F] bg-[#E07A5F]/10 px-2.5 py-1 rounded-md mb-1.5 select-none">
              Habit Summary
            </span>
            <h1 className="text-xl font-bold font-primary tracking-tight text-foreground leading-tight">
              {habit.name}
            </h1>
            {habit.description && (
              <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">
                {habit.description}
              </p>
            )}
            <div className="flex items-center gap-2 flex-wrap text-[10px] mt-2.5">
              <Badge variant="secondary" className="px-2 py-0.5 rounded-md font-semibold bg-muted/60 text-muted-foreground border-none">{getFrequencyLabel(freq)}</Badge>
              <Badge variant="outline" className="px-2 py-0.5 rounded-md bg-card/45 border-border/30 text-muted-foreground font-medium">
                <Target className="mr-1 h-3 w-3 text-muted-foreground/80 inline" />
                {habit.periodTarget}x {habit.periodLabel}
              </Badge>
              <Badge
                variant="outline"
                className="px-2 py-0.5 rounded-md bg-[#E07A5F]/10 text-[#E07A5F] border-[#E07A5F]/20 font-semibold"
              >
                <Flame className="mr-1 h-3 w-3 text-[#E07A5F] inline" />
                {habit.current_streak} {streakUnit} streak
              </Badge>
              {renderSourceBadge(habit.source)}
            </div>
          </div>
        </div>

        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="w-full max-w-md mx-auto flex flex-col pt-1">

            {/* TAB VIEWS */}
            {activeTab === "heatmap" && (
              <div className="flex flex-col animate-in fade-in-50 duration-200">
                {/* Month Navigation */}
                <div className="flex items-center justify-between w-full max-w-xs mx-auto mb-6 px-2">
                  <button
                    onClick={() => setHeatmapMonth(new Date(heatmapMonth.getFullYear(), heatmapMonth.getMonth() - 1, 1))}
                    className="p-1.5 rounded-full hover:bg-muted/50 transition-colors cursor-pointer"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                  <span className="text-xs font-bold select-none uppercase tracking-wider text-muted-foreground/90">
                    {heatmapMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                  <button
                    onClick={() => setHeatmapMonth(new Date(heatmapMonth.getFullYear(), heatmapMonth.getMonth() + 1, 1))}
                    className="p-1.5 rounded-full hover:bg-muted/50 transition-colors cursor-pointer"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>

                {/* Heatmap Calendar Grid */}
                <div className="grid grid-cols-[55px_1fr] gap-x-2 gap-y-3 w-full mb-4 items-center">
                  <div />
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                      <span key={idx} className="text-[10px] font-bold text-muted-foreground/60 select-none">
                        {day}
                      </span>
                    ))}
                  </div>

                  {getWeeksForMonth(heatmapMonth.getFullYear(), heatmapMonth.getMonth()).map((week, weekIdx) => (
                    <React.Fragment key={weekIdx}>
                      <span className="text-[9px] text-muted-foreground/50 font-bold select-none uppercase truncate text-right pr-1">
                        {week.label}
                      </span>
                      <div className="grid grid-cols-7 gap-1">
                        {week.days.map((day, dayIdx) => {
                          const count = getCompletionsForDate(day);
                          const isFuture = isDayInFuture(day);
                          const intensityClass = getIntensityClass(count);

                          return (
                            <TooltipProvider key={dayIdx} delayDuration={100}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    disabled={isFuture}
                                    className={cn(
                                      "aspect-square rounded-[6px] transition-all duration-200 border w-full relative",
                                      intensityClass,
                                      isFuture && "opacity-20 cursor-not-allowed border-muted/10 bg-transparent",
                                      !isFuture && "hover:scale-105 active:scale-95 cursor-pointer"
                                    )}
                                  />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
                                  <p className="font-semibold">
                                    {day.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                  </p>
                                  <p className="text-muted-foreground">
                                    {isFuture
                                      ? "Future date"
                                      : `${count} ${count === 1 ? "completion" : "completions"}`
                                    }
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        })}
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                {/* Intensity Legend */}
                <div className="flex items-center justify-center gap-1.5 text-[9px] text-muted-foreground/65 mb-8 select-none">
                  <span>Less</span>
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-muted/15 border border-border/20 dark:bg-zinc-900/40 dark:border-zinc-850/60" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-primary/25 border border-primary/20" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-primary/45 border border-primary/30" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-primary/65 border border-primary/40" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-primary/85 border border-primary/50" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-primary border border-primary glow-primary" />
                  <span>More</span>
                </div>

                {/* Mark Complete / Remove Completion Log Button */}
                <div className="w-full mb-8">
                  {!habit.isCompletedForPeriod ? (
                    <button
                      onClick={() => setIsCompleteDialogOpen(true)}
                      disabled={isPending}
                      className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground hover:bg-primary/95 disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-primary/20 cursor-pointer select-none"
                    >
                      {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      Mark Complete ({habit.periodCompletions + 1}/{habit.periodTarget})
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsRemoveDialogOpen(true)}
                      disabled={isPending}
                      className="w-full inline-flex items-center justify-center rounded-xl bg-muted/40 hover:bg-muted/60 border border-border/20 px-6 py-3 text-xs font-semibold hover:text-foreground disabled:opacity-50 transition-colors cursor-pointer select-none"
                    >
                      {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="mr-2 h-4 w-4" />
                      )}
                      Remove Today's Completion
                    </button>
                  )}
                </div>

                {/* 3-Column Stats Container */}
                <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-card/45 dark:bg-card/25 backdrop-blur-md p-5 w-full grid grid-cols-3 divide-x divide-border/20 dark:divide-zinc-800/40 mb-8 shadow-sm select-none">
                  {/* Ambient Glow Accent */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/8 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex flex-col items-center justify-center text-center relative z-10">
                    <span className="text-lg font-bold font-primary">{stats?.total_completions || 0}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">Days</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center relative z-10">
                    <span className="text-lg font-bold font-primary">
                      {stats ? Math.round(stats.completion_rate_30d * 100) : 0}%
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">Consistency</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center relative z-10">
                    <span className="text-lg font-bold font-primary">{habit.current_streak}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">Current Streak</span>
                  </div>
                </div>

                {/* Quotes Section */}
                <Card className="relative overflow-hidden rounded-3xl border border-border/30 bg-card/45 dark:bg-card/25 backdrop-blur-md p-6 text-center select-none shadow-sm w-full mb-4">
                  <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-primary/8 rounded-full blur-2xl pointer-events-none" />
                  <span className="text-3xl font-serif text-primary/60 leading-none mb-1 relative z-10">“</span>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed italic relative z-10">
                    {MOTIVATIONAL_QUOTES[habit.habit_id % MOTIVATIONAL_QUOTES.length].text}
                  </p>
                  {MOTIVATIONAL_QUOTES[habit.habit_id % MOTIVATIONAL_QUOTES.length].author && (
                    <span className="text-[9px] text-muted-foreground/50 font-semibold mt-2 block relative z-10">
                      — {MOTIVATIONAL_QUOTES[habit.habit_id % MOTIVATIONAL_QUOTES.length].author}
                    </span>
                  )}
                </Card>
              </div>
            )}

            {activeTab === "calendar" && (
              <div className="flex flex-col gap-6 animate-in fade-in-50 duration-200">
                {/* Full month picker */}
                <div className="relative overflow-hidden rounded-3xl border border-border/35 bg-card/45 dark:bg-card/25 backdrop-blur-md p-5 flex flex-col items-center shadow-sm">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/8 rounded-full blur-2xl pointer-events-none" />
                  <UiCalendar
                    mode="single"
                    selected={selectedCalendarDate}
                    onSelect={(date) => date && setSelectedCalendarDate(date)}
                    className="w-full max-w-xs mx-auto relative z-10"
                    modifiers={{
                      completed: completedDates,
                    }}
                    modifiersClassNames={{
                      completed: "bg-primary/20 text-primary font-bold hover:bg-primary/30",
                    }}
                  />
                </div>

                {/* Day Logs Detail */}
                <Card className="relative overflow-hidden rounded-3xl border border-border/35 bg-card/45 dark:bg-card/25 backdrop-blur-md shadow-sm">
                  <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/8 rounded-full blur-2xl pointer-events-none" />
                  <CardHeader className="pb-3 relative z-10">
                    <CardTitle className="text-sm font-bold font-primary">
                      Logs for {selectedCalendarDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {logsForSelectedDate.length} completion{logsForSelectedDate.length === 1 ? "" : "s"} logged
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {logsForSelectedDate.length === 0 ? (
                      <div className="text-center py-6 text-xs text-muted-foreground select-none">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-30 text-muted-foreground" />
                        <p>No completions logged for this day.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {logsForSelectedDate.map((log) => (
                          <div
                            key={log.habit_log_id}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/15 border border-border/10"
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground font-semibold">
                                {new Date(log.completed_at).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </p>
                              {log.note && (
                                <div className="flex items-start gap-1.5 mt-1.5">
                                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                                  <p className="text-xs text-foreground font-medium break-words leading-relaxed">
                                    {log.note}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* History list */}
                <Card className="relative overflow-hidden rounded-3xl border border-border/35 bg-card/45 dark:bg-card/25 backdrop-blur-md shadow-sm">
                  <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/8 rounded-full blur-2xl pointer-events-none" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-sm font-bold font-primary flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      Recent Completions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-60 overflow-y-auto pr-1 relative z-10">
                    {habit.completionLogs.length === 0 ? (
                      <div className="text-center py-6 text-xs text-muted-foreground select-none">
                        <p>No completions yet. Start building your streak!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(groupedLogs).slice(0, 8).map(([date, logs]) => (
                          <div key={date} className="space-y-1.5">
                            <h4 className="text-[9px] font-bold text-muted-foreground/60 select-none uppercase tracking-wider">
                              {date}
                            </h4>
                            <div className="space-y-1">
                              {logs.map((log) => (
                                <div
                                  key={log.habit_log_id}
                                  className="flex items-center justify-between p-2 rounded-lg bg-muted/10 border border-border/5 text-xs"
                                >
                                  <span className="font-medium text-muted-foreground">
                                    {new Date(log.completed_at).toLocaleTimeString("en-US", {
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                  {log.note && (
                                    <span className="text-muted-foreground truncate max-w-[150px] italic">
                                      {log.note}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "stats" && (
              <div className="flex flex-col gap-6 animate-in fade-in-50 duration-200">
                {/* Progress cards */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="relative overflow-hidden rounded-3xl border border-border/35 bg-card/45 dark:bg-card/25 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center shadow-sm">
                    <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-primary/6 rounded-full blur-2xl pointer-events-none" />
                    <TrendingUp className="w-5 h-5 text-primary mb-1.5 opacity-90 relative z-10" />
                    <div className="text-xl font-bold font-primary relative z-10">{stats ? Math.round(stats.completion_rate_7d * 100) : 0}%</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1 mb-2 relative z-10 font-bold">7-Day Rate</div>
                    <ProgressBar
                      value={stats ? Math.round(stats.completion_rate_7d * 100) : 0}
                      max={100}
                      color="primary"
                      size="sm"
                    />
                  </Card>

                  <Card className="relative overflow-hidden rounded-3xl border border-border/35 bg-card/45 dark:bg-card/25 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center shadow-sm">
                    <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-primary/6 rounded-full blur-2xl pointer-events-none" />
                    <Target className="w-5 h-5 text-primary mb-1.5 opacity-90 relative z-10" />
                    <div className="text-xl font-bold font-primary relative z-10">{stats ? Math.round(stats.completion_rate_30d * 100) : 0}%</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1 mb-2 relative z-10 font-bold">30-Day Rate</div>
                    <ProgressBar
                      value={stats ? Math.round(stats.completion_rate_30d * 100) : 0}
                      max={100}
                      color="primary"
                      size="sm"
                    />
                  </Card>

                  <Card className="relative overflow-hidden rounded-3xl border border-border/35 bg-card/45 dark:bg-card/25 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center shadow-sm">
                    <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-accent/6 rounded-full blur-2xl pointer-events-none" />
                    <Calendar className="w-5 h-5 text-accent mb-1.5 opacity-90 relative z-10" />
                    <div className="text-xl font-bold font-primary relative z-10">{stats?.days_since_start || 0}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1 relative z-10 font-bold">Days Active</div>
                  </Card>

                  <Card className="relative overflow-hidden rounded-3xl border border-border/35 bg-card/45 dark:bg-card/25 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center shadow-sm">
                    <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-primary/6 rounded-full blur-2xl pointer-events-none" />
                    <CheckCircle2 className="w-5 h-5 text-[#E07A5F] mb-1.5 opacity-90 relative z-10" />
                    <div className="text-xl font-bold font-primary relative z-10">{stats?.total_completions || 0}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1 relative z-10 font-bold">Total Logged</div>
                  </Card>
                </div>

                {/* AI Prediction */}
                <Card className="relative overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-accent/[0.02] to-transparent dark:bg-card/25 backdrop-blur-md shadow-sm">
                  {/* Ambient accent/terracotta glow */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-accent/15 rounded-full blur-2xl pointer-events-none" />
                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-accent" />
                      <CardTitle className="text-sm font-bold font-primary">
                        AI Prediction
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {daysUntilPrediction > 0 ? (
                      <div className="space-y-3 w-full">
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <span>
                            Insights will unlock in{" "}
                            <strong className="text-foreground">
                              {daysUntilPrediction} days
                            </strong>
                            . Keep checking off your habit to log predictions!
                          </span>
                        </div>
                        <ProgressBar
                          value={Math.max(0, 7 - daysUntilPrediction)}
                          max={7}
                          color="accent"
                          showLabel
                          label="Data collection progress"
                        />
                      </div>
                    ) : isPredictionLoading ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        <span>Predicting behavior...</span>
                      </div>
                    ) : predictionError ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Brain className="h-4 w-4 text-destructive" />
                        <span>AI intelligence engine currently unavailable.</span>
                      </div>
                    ) : prediction ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground font-medium">
                            Likelihood of Completion
                          </span>
                          <span className="text-base font-bold font-primary text-accent">
                            {prediction.probability_percent}
                          </span>
                        </div>
                        <ProgressBar
                          value={Math.round(prediction.probability * 100)}
                          max={100}
                          color="accent"
                        />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {getPredictionMessage(prediction.probability)}
                        </p>
                        <div className="flex items-center gap-1.5 pt-2 border-t border-border/10 text-[10px] text-muted-foreground/80">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Predictions update every 24 hours</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span>No predictions available yet.</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Appbar Navigation on Mobile */}
        <div className={cn(
          "fixed bottom-0 left-0 right-0 z-50 w-full flex items-center bg-background/80 dark:bg-[#12141A]/90 backdrop-blur-xl border-t border-border/30 dark:border-border/10 p-2 pb-safe-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.45)] rounded-t-2xl transition-all duration-300 ease-in-out",
          isVisible ? "translate-y-0" : "translate-y-full opacity-0 pointer-events-none"
        )}>
          {(
            [
              { id: "heatmap", label: "Heatmap", icon: Flame },
              { id: "calendar", label: "Calendar", icon: Calendar },
              { id: "stats", label: "Stats & AI", icon: Brain },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 relative cursor-pointer select-none",
                  isActive ? "text-[#E07A5F]" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="habit-detail-appbar-tab-mobile"
                    className="absolute inset-0 bg-neutral-100 dark:bg-[#1C202C] border border-black/5 dark:border-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] rounded-xl"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PC/DESKTOP ONLY LAYOUT (Spacious dashboard design with columns)            */}
      {/* ========================================================================= */}
      <div className="hidden md:flex flex-1 flex-col px-6 pb-8">
        <div className="@container/main flex flex-1 flex-col gap-4">
          <div className="w-full max-w-6xl mx-auto py-8 flex flex-col">
            
            {/* Centered Header Bar */}
            <div className="w-full flex items-center justify-between mb-8 select-none border-b border-border/20 pb-4">
              <button
                onClick={() => router.push("/habits")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all cursor-pointer text-sm font-medium"
                title="Back to Habits"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Habits
              </button>
              
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold font-primary tracking-wide text-foreground">
                  {habit.name}
                </h1>
                {habit.description && (
                  <p className="text-xs text-muted-foreground mt-1 max-w-lg">
                    {habit.description}
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap text-[10px] justify-center mt-2.5">
                  <Badge variant="secondary" className="px-2 py-0.5 rounded-md font-semibold bg-muted/60 text-muted-foreground border-none">{getFrequencyLabel(freq)}</Badge>
                  <Badge variant="outline" className="px-2 py-0.5 rounded-md bg-card/45 border-border/30 text-muted-foreground font-medium">
                    <Target className="mr-1 h-3 w-3 text-muted-foreground/80 inline" />
                    {habit.periodTarget}x {habit.periodLabel}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="px-2 py-0.5 rounded-md bg-[#E07A5F]/10 text-[#E07A5F] border-[#E07A5F]/20 font-semibold"
                  >
                    <Flame className="mr-1 h-3 w-3 text-[#E07A5F] inline" />
                    {habit.current_streak} {streakUnit} streak
                  </Badge>
                  {renderSourceBadge(habit.source)}
                </div>
              </div>

              <button
                onClick={() => {
                  setEditName(habit.name);
                  setEditDescription(habit.description || "");
                  setEditFrequency(freq);
                  setEditTargetCount(habit.target_count ?? 1);
                  setIsEditDialogOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-muted/55 text-muted-foreground hover:text-foreground transition-all cursor-pointer text-sm font-medium border border-border/40"
                title="Edit Habit"
              >
                <MoreHorizontal className="h-4 w-4" />
                Options
              </button>
            </div>

            {/* Premium Sliding Segmented Control */}
            <div className="flex bg-muted/40 dark:bg-zinc-900/60 p-1 rounded-full border border-border/40 dark:border-zinc-800/50 w-full max-w-md mx-auto mb-10 relative">
              {(
                [
                  { id: "heatmap", label: "Heatmap Consistency" },
                  { id: "calendar", label: "Interactive Calendar" },
                  { id: "stats", label: "Analytics & Stats" },
                ] as const
              ).map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-full relative transition-colors duration-200 select-none z-10 cursor-pointer ${
                      isActive
                        ? "text-foreground font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicatorPC"
                        className="absolute inset-0 bg-[#27272a]/80 dark:bg-zinc-850/80 rounded-full -z-10 shadow-xs border border-white/5 dark:border-zinc-700/30"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB VIEWS */}
            {activeTab === "heatmap" && (
              <div className="grid grid-cols-[1fr_380px] gap-8 items-start animate-in fade-in-50 duration-200">
                {/* Left Side: Month navigation and Calendar-style heatmap */}
                <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-card/45 dark:bg-card/25 backdrop-blur-md p-6 flex flex-col shadow-sm">
                  <div className="absolute -top-20 -right-20 w-44 h-44 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
                  <h2 className="text-base font-bold font-primary text-foreground mb-6 flex items-center gap-2 relative z-10">
                    <Flame className="h-4 w-4 text-primary" />
                    Month Consistency View
                  </h2>
                  
                  <div className="flex items-center justify-between w-full max-w-xs mx-auto mb-8 px-2 relative z-10">
                    <button
                      onClick={() => setHeatmapMonth(new Date(heatmapMonth.getFullYear(), heatmapMonth.getMonth() - 1, 1))}
                      className="p-1.5 rounded-full hover:bg-muted/50 transition-colors cursor-pointer"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                    <span className="text-sm font-bold select-none uppercase tracking-wider text-muted-foreground/90">
                      {heatmapMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </span>
                    <button
                      onClick={() => setHeatmapMonth(new Date(heatmapMonth.getFullYear(), heatmapMonth.getMonth() + 1, 1))}
                      className="p-1.5 rounded-full hover:bg-muted/50 transition-colors cursor-pointer"
                      aria-label="Next month"
                    >
                      <ChevronRight className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>

                  {/* Expanded Heatmap calendar grid */}
                  <div className="grid grid-cols-[70px_1fr] gap-x-3 gap-y-4 w-full mb-6 items-center relative z-10">
                    <div />
                    <div className="grid grid-cols-7 gap-1.5 text-center">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
                        <span key={idx} className="text-xs font-bold text-muted-foreground/60 select-none">
                          {day}
                        </span>
                      ))}
                    </div>

                    {getWeeksForMonth(heatmapMonth.getFullYear(), heatmapMonth.getMonth()).map((week, weekIdx) => (
                      <React.Fragment key={weekIdx}>
                        <span className="text-xs text-muted-foreground/50 font-bold select-none uppercase truncate text-right pr-2">
                          {week.label}
                        </span>
                        <div className="grid grid-cols-7 gap-1.5">
                          {week.days.map((day, dayIdx) => {
                            const count = getCompletionsForDate(day);
                            const isFuture = isDayInFuture(day);
                            const intensityClass = getIntensityClass(count);

                            return (
                              <TooltipProvider key={dayIdx} delayDuration={100}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      disabled={isFuture}
                                      className={cn(
                                        "aspect-square rounded-lg transition-all duration-200 border w-full relative",
                                        intensityClass,
                                        isFuture && "opacity-20 cursor-not-allowed border-muted/10 bg-transparent",
                                        !isFuture && "hover:scale-105 active:scale-95 cursor-pointer"
                                      )}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="text-xs">
                                    <p className="font-semibold">
                                      {day.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </p>
                                    <p className="text-muted-foreground">
                                      {isFuture
                                        ? "Future date"
                                        : `${count} ${count === 1 ? "completion" : "completions"}`
                                      }
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Intensity Legend */}
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/65 mb-8 select-none relative z-10">
                    <span>Less</span>
                    <div className="w-3.5 h-3.5 rounded-[3px] bg-muted/15 border border-border/20 dark:bg-zinc-900/40 dark:border-zinc-800/60" />
                    <div className="w-3.5 h-3.5 rounded-[3px] bg-primary/25 border border-primary/20" />
                    <div className="w-3.5 h-3.5 rounded-[3px] bg-primary/45 border border-primary/30" />
                    <div className="w-3.5 h-3.5 rounded-[3px] bg-primary/65 border border-primary/40" />
                    <div className="w-3.5 h-3.5 rounded-[3px] bg-primary/85 border border-primary/50" />
                    <div className="w-3.5 h-3.5 rounded-[3px] bg-primary border border-primary glow-primary" />
                    <span>More</span>
                  </div>

                  {/* Completion button below heatmap grid */}
                  <div className="w-full max-w-sm mx-auto relative z-10">
                    {!habit.isCompletedForPeriod ? (
                      <button
                        onClick={() => setIsCompleteDialogOpen(true)}
                        disabled={isPending}
                        className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-primary/20 cursor-pointer select-none"
                      >
                        {isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                        )}
                        Log Completion ({habit.periodCompletions + 1}/{habit.periodTarget})
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsRemoveDialogOpen(true)}
                        disabled={isPending}
                        className="w-full inline-flex items-center justify-center rounded-xl bg-muted/40 hover:bg-muted/65 border border-border/20 px-6 py-3.5 text-sm font-semibold hover:text-foreground disabled:opacity-50 transition-colors cursor-pointer select-none"
                      >
                        {isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4" />
                        )}
                        Remove Completion for Today
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Side: stats card and quotes */}
                <div className="flex flex-col gap-6">
                  <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-card/45 dark:bg-card/25 backdrop-blur-md p-6 w-full shadow-sm select-none flex flex-col gap-6">
                    <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider relative z-10">Metrics Overview</h3>
                    <div className="grid grid-cols-3 divide-x divide-border/20 dark:divide-zinc-800/40 relative z-10">
                      <div className="flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold font-primary">{stats?.total_completions || 0}</span>
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">Days</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold font-primary">
                          {stats ? Math.round(stats.completion_rate_30d * 100) : 0}%
                        </span>
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">Consistency</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold font-primary">{habit.current_streak}</span>
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">Streak</span>
                      </div>
                    </div>
                  </div>

                  <Card className="relative overflow-hidden rounded-3xl border border-border/30 bg-card/45 dark:bg-card/25 backdrop-blur-md flex flex-col justify-center items-center py-10 px-6 text-center select-none min-h-[200px] shadow-sm">
                    <div className="absolute -top-20 -right-20 w-44 h-44 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
                    <span className="text-4xl font-serif text-primary/60 leading-none mb-2 relative z-10">“</span>
                    <p className="text-sm text-foreground font-medium leading-relaxed italic max-w-xs relative z-10">
                      {MOTIVATIONAL_QUOTES[habit.habit_id % MOTIVATIONAL_QUOTES.length].text}
                    </p>
                    {MOTIVATIONAL_QUOTES[habit.habit_id % MOTIVATIONAL_QUOTES.length].author && (
                      <span className="text-xs text-muted-foreground/50 font-semibold mt-3 relative z-10">
                        — {MOTIVATIONAL_QUOTES[habit.habit_id % MOTIVATIONAL_QUOTES.length].author}
                      </span>
                    )}
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "calendar" && (
              <div className="grid grid-cols-[1fr_380px] gap-8 items-start animate-in fade-in-50 duration-200">
                {/* Left Column: Full Month Interactive Picker */}
                <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-card/45 dark:bg-card/25 backdrop-blur-md p-6 flex flex-col items-center shadow-sm">
                  <div className="absolute -top-20 -right-20 w-44 h-44 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
                  <h2 className="text-base font-bold font-primary text-foreground mb-6 self-start flex items-center gap-2 relative z-10">
                    <Calendar className="h-4 w-4 text-primary" />
                    Interactive Calendar Log
                  </h2>
                  <div className="relative z-10 scale-110 origin-center py-4">
                    <UiCalendar
                      mode="single"
                      selected={selectedCalendarDate}
                      onSelect={(date) => date && setSelectedCalendarDate(date)}
                      className="w-full"
                      modifiers={{
                        completed: completedDates,
                      }}
                      modifiersClassNames={{
                        completed: "bg-primary/20 text-primary font-bold hover:bg-primary/30",
                      }}
                    />
                  </div>
                </div>

                {/* Right Column: Logs for date and history */}
                <div className="flex flex-col gap-6">
                  <Card className="relative overflow-hidden rounded-3xl border border-border/35 bg-card/45 dark:bg-card/25 backdrop-blur-md shadow-sm">
                    <div className="absolute -top-20 -left-20 w-44 h-44 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-sm font-bold font-primary">
                        Logs for {selectedCalendarDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {logsForSelectedDate.length} completion{logsForSelectedDate.length === 1 ? "" : "s"} logged
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      {logsForSelectedDate.length === 0 ? (
                        <div className="text-center py-8 text-xs text-muted-foreground select-none">
                          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-30 text-muted-foreground" />
                          <p>No completions logged for this day.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {logsForSelectedDate.map((log) => (
                            <div
                              key={log.habit_log_id}
                              className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/15 border border-border/10"
                            >
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground font-semibold">
                                  {new Date(log.completed_at).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                  })}
                                </p>
                                {log.note && (
                                  <div className="flex items-start gap-1.5 mt-1.5">
                                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                                    <p className="text-xs text-foreground font-medium break-words leading-relaxed">
                                      {log.note}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden rounded-3xl border border-border/35 bg-card/45 dark:bg-card/25 backdrop-blur-md shadow-sm">
                    <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-sm font-bold font-primary flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-primary" />
                        Recent Completions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-[300px] overflow-y-auto pr-1 relative z-10">
                      {habit.completionLogs.length === 0 ? (
                        <div className="text-center py-6 text-xs text-muted-foreground select-none">
                          <p>No completions yet. Start building your streak!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {Object.entries(groupedLogs).slice(0, 10).map(([date, logs]) => (
                            <div key={date} className="space-y-1.5">
                              <h4 className="text-[9px] font-bold text-muted-foreground/60 select-none uppercase tracking-wider">
                                {date}
                              </h4>
                              <div className="space-y-1">
                                {logs.map((log) => (
                                  <div
                                    key={log.habit_log_id}
                                    className="flex items-center justify-between p-2 rounded-lg bg-muted/10 border border-border/5 text-xs"
                                  >
                                    <span className="font-medium text-muted-foreground">
                                      {new Date(log.completed_at).toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                    {log.note && (
                                      <span className="text-muted-foreground truncate max-w-[180px] italic">
                                        {log.note}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "stats" && (
              <div className="grid grid-cols-[1fr_380px] gap-8 items-start animate-in fade-in-50 duration-200">
                {/* Left Column: Stats Progress Cards */}
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Card className="relative overflow-hidden rounded-3xl border border-border/35 bg-card/45 dark:bg-card/25 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center shadow-sm">
                      <div className="absolute -bottom-20 -right-20 w-36 h-36 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
                      <TrendingUp className="w-5 h-5 text-primary mb-2 opacity-90 relative z-10" />
                      <div className="text-2xl font-bold font-primary relative z-10">{stats ? Math.round(stats.completion_rate_7d * 100) : 0}%</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 mb-3 relative z-10 font-bold">7-Day Rate</div>
                      <ProgressBar
                        value={stats ? Math.round(stats.completion_rate_7d * 100) : 0}
                        max={100}
                        color="primary"
                        size="sm"
                      />
                    </Card>

                    <Card className="relative overflow-hidden rounded-3xl border border-border/35 bg-card/45 dark:bg-card/25 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center shadow-sm">
                      <div className="absolute -bottom-20 -right-20 w-36 h-36 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
                      <Target className="w-5 h-5 text-primary mb-2 opacity-90 relative z-10" />
                      <div className="text-2xl font-bold font-primary relative z-10">{stats ? Math.round(stats.completion_rate_30d * 100) : 0}%</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 mb-3 relative z-10 font-bold">30-Day Rate</div>
                      <ProgressBar
                        value={stats ? Math.round(stats.completion_rate_30d * 100) : 0}
                        max={100}
                        color="primary"
                        size="sm"
                      />
                    </Card>

                    <Card className="relative overflow-hidden rounded-3xl border border-border/35 bg-card/45 dark:bg-card/25 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center shadow-sm">
                      <div className="absolute -bottom-20 -right-20 w-36 h-36 bg-accent/6 rounded-full blur-3xl pointer-events-none" />
                      <Calendar className="w-5 h-5 text-accent mb-2 opacity-90 relative z-10" />
                      <div className="text-2xl font-bold font-primary relative z-10">{stats?.days_since_start || 0}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 relative z-10 font-bold">Days Active</div>
                    </Card>

                    <Card className="relative overflow-hidden rounded-3xl border border-border/35 bg-card/45 dark:bg-card/25 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center shadow-sm">
                      <div className="absolute -bottom-20 -right-20 w-36 h-36 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
                      <CheckCircle2 className="w-5 h-5 text-[#E07A5F] mb-2 opacity-90 relative z-10" />
                      <div className="text-2xl font-bold font-primary relative z-10">{stats?.total_completions || 0}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 relative z-10 font-bold">Total Logged</div>
                    </Card>
                  </div>
                </div>

                {/* Right Column: AI Prediction */}
                <Card className="relative overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-accent/[0.02] to-transparent dark:bg-card/25 backdrop-blur-md shadow-sm">
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-accent" />
                      <CardTitle className="text-sm font-bold font-primary">
                        AI Intelligence Insights
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {daysUntilPrediction > 0 ? (
                      <div className="space-y-4 w-full">
                        <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                          <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <span>
                            Insights will unlock in{" "}
                            <strong className="text-foreground">
                              {daysUntilPrediction} days
                            </strong>
                            . Keep logging your habit completion to train the neural network model!
                          </span>
                        </div>
                        <ProgressBar
                          value={Math.max(0, 7 - daysUntilPrediction)}
                          max={7}
                          color="accent"
                          showLabel
                          label="Data collection progress"
                        />
                      </div>
                    ) : isPredictionLoading ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        <span>Predicting behavior...</span>
                      </div>
                    ) : predictionError ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Brain className="h-4 w-4 text-destructive" />
                        <span>AI intelligence engine currently offline.</span>
                      </div>
                    ) : prediction ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground font-medium">
                            Likelihood of Completion
                          </span>
                          <span className="text-lg font-bold font-primary text-accent">
                            {prediction.probability_percent}
                          </span>
                        </div>
                        <ProgressBar
                          value={Math.round(prediction.probability * 100)}
                          max={100}
                          color="accent"
                        />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {getPredictionMessage(prediction.probability)}
                        </p>
                        <div className="flex items-center gap-1.5 pt-3 border-t border-border/10 text-[10px] text-muted-foreground/80">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Predictions update every 24 hours</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span>No predictions available yet.</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Dialog */}
      <Dialog
        open={isCompleteDialogOpen}
        onOpenChange={setIsCompleteDialogOpen}
      >
        <DialogContent className="sm:max-w-md border-border/10">
          <DialogHeader>
            <DialogTitle className="font-primary">
              Complete {habit.name}
            </DialogTitle>
            <DialogDescription>
              Add an optional note about this completion
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="How did it go? (optional)"
              value={completionNote}
              onChange={(e) => setCompletionNote(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setIsCompleteDialogOpen(false)}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleComplete}
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mark Complete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Completion Dialog */}
      <Dialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
      >
        <DialogContent className="sm:max-w-md border-border/10">
          <DialogHeader>
            <DialogTitle className="font-primary">
              Remove Completion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove today&apos;s completion? This may affect your streak.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setIsRemoveDialogOpen(false)}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleRemoveCompletion}
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Habit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >
        <DialogContent className="sm:max-w-md border-border/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEdit();
            }}
          >
            <DialogHeader>
              <DialogTitle className="font-primary">
                Edit Habit
              </DialogTitle>
              <DialogDescription>
                Update your habit details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Habit Name</Label>
                <Input
                  placeholder="e.g., Morning Exercise"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Description{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  placeholder="Brief description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
              {/* Frequency Radio Buttons */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Frequency</Label>
                <div className="grid grid-cols-2 gap-2">
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setEditFrequency(opt.value)}
                      className={`flex items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 border cursor-pointer ${
                        editFrequency === opt.value
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-muted/30 text-foreground border-border hover:bg-muted/50 hover:border-border/80"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Target Count */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {getTargetLabel(editFrequency)}
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={editTargetCount}
                  onChange={(e) =>
                    setEditTargetCount(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsEditDialogOpen(false)}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending || !editName.trim()}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function HabitDetailClient(props: HabitDetailClientProps) {
  return (
    <React.Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground select-none">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-xs font-semibold">Loading habit details...</span>
        </div>
      </div>
    }>
      <HabitDetailClientContent {...props} />
    </React.Suspense>
  );
}

// === Helper to Render Habit Source Badge ===
function renderSourceBadge(source?: string) {
  const badgeBaseClass = "text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 w-fit select-none font-sans";
  
  if (source === "ai_generated") {
    return (
      <Badge
        variant="outline"
        className={`${badgeBaseClass} bg-primary/10 text-primary border-primary/20`}
      >
        <Sparkles className="h-2.5 w-2.5 text-primary" />
        Generated by Rhythmé
      </Badge>
    );
  }
  
  if (source === "user_edited") {
    return (
      <Badge
        variant="outline"
        className={`${badgeBaseClass} bg-primary/10 text-primary border-primary/20`}
      >
        <Sparkles className="h-2.5 w-2.5 text-primary" />
        Generated by Rhythmé
        <span className="inline-flex items-center text-[8px] text-muted-foreground/80 ml-0.5 gap-0.5">
          <Pencil className="h-2 w-2 text-muted-foreground/75" />
          (Edited)
        </span>
      </Badge>
    );
  }
  
  return (
    <Badge
      variant="outline"
      className={`${badgeBaseClass} bg-muted/30 text-muted-foreground border-border/50`}
    >
      <User className="h-2.5 w-2.5 text-muted-foreground" />
      Manual
    </Badge>
  );
}
