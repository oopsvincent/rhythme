"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Minus,
  CheckCircle2,
  Flame,
  Brain,
  Sparkles,
  Loader2,
  MoreVertical,
  Trash2,
  ChevronRight,
  Target,
  Calendar,
  TrendingUp,
  User,
  Pencil,
} from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { motion, AnimatePresence } from "framer-motion";
import type {
  HabitWithStats,
  HabitFrequency,
  CreateHabitInput,
} from "@/types/database";
import {
  useHabits,
  useHabitsRealtime,
  useCreateHabit,
  useDeleteHabit,
  useLogCompletion,
  useHabitPrediction,
} from "@/hooks/use-habits";
import {
  getTargetLabel,
  getStreakUnit,
} from "@/lib/habit-helpers";
import { canCreateHabit } from "@/app/actions/usage-limits";
import { PremiumGateModal } from "@/components/premium-gate-modal";
import { cn } from "@/lib/utils";

function generateHabitSlug(name: string, id: number): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 35);

  return `${slug}-${id}`;
}

const FREQUENCY_OPTIONS: { value: HabitFrequency; label: string }[] = [
  { value: 0, label: "Daily" },
  { value: 1, label: "Weekly" },
  { value: 2, label: "Monthly" },
  { value: 3, label: "Multiple times per week" },
];

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

export default function HabitsPage() {
  const router = useRouter();
  const isVisible = useScrollDirection();

  // React Query hooks for data fetching
  const { data: habits = [], isLoading, error } = useHabits();

  // Realtime subscription
  useHabitsRealtime();

  // Mutations
  const createMutation = useCreateHabit();
  const deleteMutation = useDeleteHabit();
  const logMutation = useLogCompletion();

  // Local UI state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [completeDialogHabit, setCompleteDialogHabit] =
    useState<HabitWithStats | null>(null);
  const [completionNote, setCompletionNote] = useState("");
  const [newHabit, setNewHabit] = useState<CreateHabitInput & { target_count: number }>({
    name: "",
    description: "",
    frequency: 0,
    target_count: 1,
  });
  const [showPremiumGate, setShowPremiumGate] = useState(false);
  
  // Mobile Tab State
  const [currentTab, setCurrentTab] = useState<'hub' | 'insights'>('hub');

  const isPending =
    createMutation.isPending || deleteMutation.isPending || logMutation.isPending;

  const openCompleteDialog = (habit: HabitWithStats) => {
    if (habit.isCompletedForPeriod) {
      return;
    }
    setCompleteDialogHabit(habit);
    setCompletionNote("");
  };

  const handleCompleteWithNote = () => {
    if (!completeDialogHabit) return;
    logMutation.mutate(
      {
        habitId: completeDialogHabit.habit_id,
        note: completionNote || undefined,
      },
      {
        onSuccess: () => {
          setCompleteDialogHabit(null);
          setCompletionNote("");
        },
      }
    );
  };

  const handleAddHabit = async () => {
    if (!newHabit.name.trim()) return;

    const { allowed } = await canCreateHabit();
    if (!allowed) {
      setIsAddDialogOpen(false);
      setShowPremiumGate(true);
      return;
    }

    createMutation.mutate(
      {
        name: newHabit.name,
        description: newHabit.description,
        frequency: newHabit.frequency,
        target_count: newHabit.target_count,
      },
      {
        onSuccess: () => {
          setNewHabit({ name: "", description: "", frequency: 0, target_count: 1 });
          setIsAddDialogOpen(false);
        },
      }
    );
  };

  const handleDeleteHabit = (habitId: number) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      deleteMutation.mutate(habitId);
    }
  };

  const navigateToHabit = (habit: HabitWithStats) => {
    const slug = generateHabitSlug(habit.name, habit.habit_id);
    router.push(`/habits/${slug}`);
  };

  // Group habits by frequency
  const dailyHabits = habits.filter((h: HabitWithStats) => h.frequency_num === 0);
  const weeklyHabits = habits.filter((h: HabitWithStats) => h.frequency_num === 1);
  const monthlyHabits = habits.filter((h: HabitWithStats) => h.frequency_num === 2);
  const multiplePerWeekHabits = habits.filter((h: HabitWithStats) => h.frequency_num === 3);

  // Overview stats
  const completedToday = dailyHabits.filter((h: HabitWithStats) => h.isCompletedForPeriod).length;
  const totalDaily = dailyHabits.length;
  const completionRate = totalDaily > 0 ? (completedToday / totalDaily) * 100 : 0;

  const totalStreak = habits.reduce((sum: number, h: HabitWithStats) => sum + h.current_streak, 0);
  const longestStreak = Math.max(...habits.map((h: HabitWithStats) => h.current_streak), 0);

  if (error) {
    return (
      <>
        <SiteHeader />
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md border-border bg-card/60 backdrop-blur-md rounded-2xl">
            <CardHeader>
              <CardTitle>Error Loading Habits</CardTitle>
              <CardDescription>
                {error instanceof Error ? error.message : "Failed to load habits"}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </>
    );
  }

  // Common Dialog Form Layout (Create Habit)
  const renderCreateHabitForm = () => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddHabit();
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-primary text-xl font-bold text-foreground">
            Create New Habit
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Start building a positive habit today
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/65 select-none">
              Habit Name
            </Label>
            <Input
              placeholder="e.g., Morning Exercise"
              value={newHabit.name}
              onChange={(e) =>
                setNewHabit({ ...newHabit, name: e.target.value })
              }
              className="bg-card/45 dark:bg-card/25 border border-border/30 rounded-xl px-3 h-11 text-sm font-semibold focus-visible:ring-primary/20"
              autoFocus
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/65 select-none">
              Description <span className="text-[9px] font-normal lowercase opacity-80">(optional)</span>
            </Label>
            <Input
              placeholder="Brief description"
              value={newHabit.description}
              onChange={(e) =>
                setNewHabit({ ...newHabit, description: e.target.value })
              }
              className="bg-card/45 dark:bg-card/25 border border-border/30 rounded-xl px-3 h-11 text-sm font-semibold focus-visible:ring-primary/20"
            />
          </div>
          {/* Frequency Option Grid */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/65 select-none">
              Frequency
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {FREQUENCY_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() =>
                    setNewHabit({
                      ...newHabit,
                      frequency: opt.value,
                      target_count: opt.value === 0 ? 1 : newHabit.target_count,
                    })
                  }
                  className={cn(
                    "flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 border cursor-pointer select-none",
                    newHabit.frequency === opt.value
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/30 text-foreground border-border/40 hover:bg-muted/50 hover:border-border/80"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {/* Dynamic Target Count selector */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/65 select-none">
              {getTargetLabel(newHabit.frequency ?? 0)}
            </Label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setNewHabit({
                    ...newHabit,
                    target_count: Math.max(1, newHabit.target_count - 1),
                  })
                }
                disabled={newHabit.target_count <= 1}
                className="shrink-0 h-10 w-10 rounded-xl border border-border/40 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <Input
                type="number"
                min={1}
                max={100}
                value={newHabit.target_count}
                onChange={(e) =>
                  setNewHabit({
                    ...newHabit,
                    target_count: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                className="text-center h-10 bg-card/45 dark:bg-card/25 border border-border/30 rounded-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-semibold text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setNewHabit({
                    ...newHabit,
                    target_count: Math.min(100, newHabit.target_count + 1),
                  })
                }
                disabled={newHabit.target_count >= 100}
                className="shrink-0 h-10 w-10 rounded-xl border border-border/40 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <button
            type="button"
            onClick={() => setIsAddDialogOpen(false)}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending || !newHabit.name.trim()}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer select-none"
          >
            {isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Habit
          </button>
        </DialogFooter>
      </form>
    );
  };

  // Render Stats Grid (Reusable)
  const renderStatsGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Progress */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 p-5 bg-gradient-to-br from-primary/10 via-primary/[0.03] to-transparent dark:bg-card/20 backdrop-blur-md shadow-xs flex flex-col justify-between min-h-[140px] hover:scale-[1.005] transition-all duration-300">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-widest text-primary/80">Today's Progress</span>
              <div className="inline-flex items-center justify-center w-7.5 h-7.5 rounded-lg bg-primary/10 text-primary">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold font-primary tracking-tight">
                {completedToday} / {totalDaily}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">daily habits</span>
            </div>
          </div>
          <ProgressBar value={completedToday} max={totalDaily} className="mt-4" color="primary" />
          <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-10 bg-primary" />
        </div>

        {/* Total Streak */}
        <div className="relative overflow-hidden rounded-3xl border border-accent/20 p-5 bg-gradient-to-br from-accent/10 via-accent/[0.03] to-transparent dark:bg-card/20 backdrop-blur-md shadow-xs flex flex-col justify-between min-h-[140px] hover:scale-[1.005] transition-all duration-300">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-widest text-accent/80">Total Streak</span>
              <div className="inline-flex items-center justify-center w-7.5 h-7.5 rounded-lg bg-accent/10 text-accent">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold font-primary tracking-tight">
                {totalStreak}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">days active</span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-4 font-semibold uppercase tracking-wider">Across all tracked habits</p>
          <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-10 bg-accent" />
        </div>

        {/* Longest Streak */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 p-5 bg-gradient-to-br from-emerald-500/10 via-emerald-500/[0.03] to-transparent dark:bg-card/20 backdrop-blur-md shadow-xs flex flex-col justify-between min-h-[140px] hover:scale-[1.005] transition-all duration-300">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500/80">Longest Streak</span>
              <div className="inline-flex items-center justify-center w-7.5 h-7.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold font-primary tracking-tight">
                {longestStreak}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">days streak</span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-4 font-semibold uppercase tracking-wider">Your personal best record</p>
          <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-10 bg-emerald-500" />
        </div>
      </div>
    );
  };

  const renderEmptyState = () => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 px-4 rounded-3xl border border-border/30 bg-card/20 text-center"
      >
        <Target className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <h3 className="text-lg font-primary font-bold mb-1.5">No habits added yet</h3>
        <p className="text-xs text-muted-foreground/80 max-w-sm mb-6">
          Start your journey by creating your first habit. Small consistency checks lead to identity-level shifts.
        </p>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-primary/25 cursor-pointer"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Create First Habit
        </button>
      </motion.div>
    );
  };

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col px-4 md:px-10 pb-8 select-none">
        <div className="@container/main flex flex-1 flex-col max-w-5xl mx-auto w-full">
          <div className="flex flex-col py-4 md:py-6">
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-[#E07A5F]" />
                <span className="text-xs font-semibold">Loading your habits...</span>
              </div>
            ) : habits.length === 0 ? (
              <div className="space-y-6 pt-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-[#E07A5F] bg-[#E07A5F]/10 px-2 py-0.5 rounded">
                      Habits Hub
                    </span>
                    <h1 className="text-2xl font-bold font-primary tracking-tight text-foreground/95 mt-1">
                      Habits Sanctuary
                    </h1>
                  </div>
                </div>
                {renderEmptyState()}
              </div>
            ) : (
              <>
                {/* ========================================================================= */}
                {/* MOBILE ONLY LAYOUT (centered, narrow mockup layout with Appbar)          */}
                {/* ========================================================================= */}
                <div className="block md:hidden w-full relative pb-28 space-y-5 animate-in fade-in duration-300">
                  {/* Tab Conditional Rendering */}
                  {currentTab === "hub" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-[#E07A5F] bg-[#E07A5F]/10 px-2 py-0.5 rounded">
                            Habits Hub
                          </span>
                          <h1 className="text-2xl font-bold font-primary tracking-tight text-foreground/95 mt-1">
                            Habits Sanctuary
                          </h1>
                          <p className="text-xs text-muted-foreground/85">
                            Track today's checklist and manage configured cycles.
                          </p>
                        </div>
                        <button
                          onClick={() => setIsAddDialogOpen(true)}
                          className="shrink-0 inline-flex items-center justify-center rounded-xl bg-primary px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-primary/20 cursor-pointer"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </button>
                      </div>

                      {/* Today's Daily Checklist */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">
                          Today's Checklist
                        </h3>
                        {dailyHabits.length > 0 ? (
                          <div className="space-y-3">
                            {dailyHabits.map((habit, index) => (
                              <HabitItem
                                key={habit.habit_id}
                                habit={habit}
                                onComplete={() => openCompleteDialog(habit)}
                                onDelete={() => handleDeleteHabit(habit.habit_id)}
                                onNavigate={() => navigateToHabit(habit)}
                                isPending={isPending}
                                index={index}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-border/30 bg-card/20 p-6 text-center">
                            <p className="text-xs text-muted-foreground italic">No daily habits scheduled for today.</p>
                          </div>
                        )}
                      </div>

                      {/* Other Cycles Section */}
                      <div className="space-y-5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">
                          All Cycles &amp; Habits
                        </h3>
                        
                        <div className="space-y-6">
                          {weeklyHabits.length > 0 && (
                            <HabitSection
                              title="Weekly Habits"
                              habits={weeklyHabits}
                              onComplete={openCompleteDialog}
                              onDelete={handleDeleteHabit}
                              onNavigate={navigateToHabit}
                              isPending={isPending}
                              delay={0.1}
                            />
                          )}

                          {monthlyHabits.length > 0 && (
                            <HabitSection
                              title="Monthly Habits"
                              habits={monthlyHabits}
                              onComplete={openCompleteDialog}
                              onDelete={handleDeleteHabit}
                              onNavigate={navigateToHabit}
                              isPending={isPending}
                              delay={0.2}
                            />
                          )}

                          {multiplePerWeekHabits.length > 0 && (
                            <HabitSection
                              title="Multiple Per Week"
                              habits={multiplePerWeekHabits}
                              onComplete={openCompleteDialog}
                              onDelete={handleDeleteHabit}
                              onNavigate={navigateToHabit}
                              isPending={isPending}
                              delay={0.3}
                            />
                          )}

                          {weeklyHabits.length === 0 && monthlyHabits.length === 0 && multiplePerWeekHabits.length === 0 && (
                            <div className="rounded-2xl border border-border/30 bg-card/20 p-6 text-center">
                              <p className="text-xs text-muted-foreground italic">No weekly, monthly, or periodic habits configured.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentTab === "insights" && (
                    <div className="space-y-5">
                      <div>
                        <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-[#E07A5F] bg-[#E07A5F]/10 px-2 py-0.5 rounded">
                          AI Insights
                        </span>
                        <h1 className="text-2xl font-bold font-primary tracking-tight text-foreground/95 mt-1">
                          Insights &amp; Analytics
                        </h1>
                        <p className="text-xs text-muted-foreground/80 leading-relaxed">
                          Streak progressions, combined stats, and AI projections.
                        </p>
                      </div>

                      {/* 1. Stats Grid */}
                      {renderStatsGrid()}

                      {/* 2. Consistency Predictions Card */}
                      <Card className="glass border-border/25 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">
                          Consistency Predictions
                        </h3>
                        {habits.length > 0 ? (
                          <div className="divide-y divide-border/10">
                            {habits.map((habit) => (
                              <HabitPredictionRow key={habit.habit_id} habit={habit} />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-xs text-muted-foreground italic">
                            No habits available to analyze.
                          </div>
                        )}
                      </Card>

                      {/* 3. Motivational Quote Card */}
                      <Card className="glass border-border/25 flex flex-col justify-center items-center py-8 px-6 text-center select-none min-h-[140px]">
                        <span className="text-4xl font-serif text-primary/60 leading-none mb-1">“</span>
                        <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed italic max-w-xs">
                          {MOTIVATIONAL_QUOTES[habits.length % MOTIVATIONAL_QUOTES.length].text}
                        </p>
                        {MOTIVATIONAL_QUOTES[habits.length % MOTIVATIONAL_QUOTES.length].author && (
                          <span className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-wider mt-3">
                            — {MOTIVATIONAL_QUOTES[habits.length % MOTIVATIONAL_QUOTES.length].author}
                          </span>
                        )}
                      </Card>
                    </div>
                  )}

                  {/* Fixed Bottom Appbar Navigation on Mobile */}
                  <div className={cn(
                    "fixed bottom-0 left-0 right-0 z-50 w-full flex items-center bg-background/80 dark:bg-[#12141A]/90 backdrop-blur-xl border-t border-border/30 dark:border-border/10 p-2 pb-safe-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.45)] rounded-t-2xl transition-all duration-300 ease-in-out",
                    isVisible ? "translate-y-0" : "translate-y-full opacity-0 pointer-events-none"
                  )}>
                    {(
                      [
                        { id: "hub", label: "Hub", icon: Target },
                        { id: "insights", label: "Insights", icon: TrendingUp },
                      ] as const
                    ).map((tab) => {
                      const Icon = tab.icon;
                      const isActive = currentTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setCurrentTab(tab.id)}
                          className={cn(
                            "flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 relative cursor-pointer select-none",
                            isActive ? "text-[#E07A5F]" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="habits-appbar-tab-mobile"
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
                <div className="hidden md:flex flex-col w-full pb-12 space-y-8 animate-in fade-in duration-300">
                  
                  {/* Desktop Title Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/10">
                    <div className="space-y-1">
                      <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-[#E07A5F] bg-[#E07A5F]/10 px-2.5 py-0.5 rounded">
                        Habits Hub
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-bold font-primary tracking-tight text-foreground/95 mt-0.5">
                        Habits Sanctuary
                      </h1>
                      <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed max-w-xl">
                        Build consistency, track progress, and shape your identity over time.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-primary/20 cursor-pointer"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Habit
                    </button>
                  </div>

                  {/* Desktop Stats Row */}
                  {renderStatsGrid()}

                  {/* Desktop 2-Column Grid */}
                  <div className="grid grid-cols-[1fr_320px] gap-8 items-start w-full">
                    {/* Left Column (Main Habit lists) */}
                    <div className="space-y-6">
                      {dailyHabits.length > 0 && (
                        <HabitSection
                          title="Daily Habits"
                          habits={dailyHabits}
                          onComplete={openCompleteDialog}
                          onDelete={handleDeleteHabit}
                          onNavigate={navigateToHabit}
                          isPending={isPending}
                          delay={0.1}
                        />
                      )}

                      {multiplePerWeekHabits.length > 0 && (
                        <HabitSection
                          title="Multiple Per Week"
                          habits={multiplePerWeekHabits}
                          onComplete={openCompleteDialog}
                          onDelete={handleDeleteHabit}
                          onNavigate={navigateToHabit}
                          isPending={isPending}
                          delay={0.2}
                        />
                      )}

                      {weeklyHabits.length > 0 && (
                        <HabitSection
                          title="Weekly Habits"
                          habits={weeklyHabits}
                          onComplete={openCompleteDialog}
                          onDelete={handleDeleteHabit}
                          onNavigate={navigateToHabit}
                          isPending={isPending}
                          delay={0.3}
                        />
                      )}

                      {monthlyHabits.length > 0 && (
                        <HabitSection
                          title="Monthly Habits"
                          habits={monthlyHabits}
                          onComplete={openCompleteDialog}
                          onDelete={handleDeleteHabit}
                          onNavigate={navigateToHabit}
                          isPending={isPending}
                          delay={0.4}
                        />
                      )}
                    </div>

                    {/* Right Column (Motivational quote and stats widgets) */}
                    <div className="sticky top-6 space-y-6">
                      <Card className="glass border-border/25 flex flex-col justify-center items-center py-10 px-6 text-center select-none min-h-[200px]">
                        <span className="text-4xl font-serif text-primary/60 leading-none mb-2">“</span>
                        <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed italic max-w-xs">
                          {MOTIVATIONAL_QUOTES[habits.length % MOTIVATIONAL_QUOTES.length].text}
                        </p>
                        {MOTIVATIONAL_QUOTES[habits.length % MOTIVATIONAL_QUOTES.length].author && (
                          <span className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-wider mt-3">
                            — {MOTIVATIONAL_QUOTES[habits.length % MOTIVATIONAL_QUOTES.length].author}
                          </span>
                        )}
                      </Card>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Create Dialog Wrapper */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogContent className="border-border/30 bg-card/95 backdrop-blur-xl sm:max-w-md rounded-2xl shadow-xl">
                {renderCreateHabitForm()}
              </DialogContent>
            </Dialog>

            {/* Premium Gate Modal */}
            <PremiumGateModal
              open={showPremiumGate}
              onOpenChange={setShowPremiumGate}
              reason="habit"
            />

            {/* Complete Dialog Note Modal */}
            <Dialog
              open={!!completeDialogHabit}
              onOpenChange={(open) => !open && setCompleteDialogHabit(null)}
            >
              <DialogContent className="border-border/30 bg-card/95 backdrop-blur-xl sm:max-w-md rounded-2xl shadow-xl">
                <DialogHeader>
                  <DialogTitle className="font-primary font-bold text-lg text-foreground">
                    Complete {completeDialogHabit?.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Add an optional note about this completion
                  </DialogDescription>
                </DialogHeader>
                <div className="py-2.5">
                  <Textarea
                    placeholder="How did it go? (optional)"
                    value={completionNote}
                    onChange={(e) => setCompletionNote(e.target.value)}
                    rows={3}
                    className="bg-card/45 dark:bg-card/25 border border-border/30 rounded-xl px-3 text-sm"
                  />
                </div>
                <DialogFooter className="gap-2">
                  <button
                    type="button"
                    onClick={() => setCompleteDialogHabit(null)}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCompleteWithNote}
                    disabled={isPending}
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer select-none"
                  >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Mark Complete
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}

// === Habit Section Component ===
function HabitSection({
  title,
  habits,
  onComplete,
  onDelete,
  onNavigate,
  isPending,
  delay,
}: {
  title: string;
  habits: HabitWithStats[];
  onComplete: (habit: HabitWithStats) => void;
  onDelete: (id: number) => void;
  onNavigate: (habit: HabitWithStats) => void;
  isPending: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2 select-none">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">{title}</h2>
        <Badge variant="secondary" className="text-xs bg-muted/40 font-semibold px-2 py-0.5 rounded-md border border-border/20">
          {habits.length}
        </Badge>
      </div>
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {habits.map((habit, index) => (
            <HabitItem
              key={habit.habit_id}
              habit={habit}
              onComplete={() => onComplete(habit)}
              onDelete={() => onDelete(habit.habit_id)}
              onNavigate={() => onNavigate(habit)}
              isPending={isPending}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// === Habit Item Component ===
function HabitPredictionRow({ habit }: { habit: HabitWithStats & { canPredict?: boolean } }) {
  const { data: prediction, isLoading } = useHabitPrediction(
    habit.canPredict ? habit : undefined
  );

  return (
    <div className="flex items-center justify-between py-3 gap-4">
      <div className="min-w-0">
        <span className="text-sm font-semibold text-foreground/90 truncate block">
          {habit.name}
        </span>
        {habit.description && (
          <span className="text-[11px] text-muted-foreground/75 truncate block mt-0.5">
            {habit.description}
          </span>
        )}
      </div>

      <div className="shrink-0">
        {habit.canPredict ? (
          isLoading ? (
            <Badge variant="outline" className="bg-accent/5 text-accent/60 border-accent/20 text-[10px] py-0.5 px-2.5 animate-pulse flex items-center">
              <Brain className="mr-1 h-3 w-3 animate-pulse" />
              <span>Analyzing...</span>
            </Badge>
          ) : prediction ? (
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-[10px] py-0.5 px-2.5 font-bold flex items-center gap-1 rounded-lg">
              <Brain className="h-3 w-3 text-accent" />
              <span>{prediction.probability_percent}</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-border/20 text-[10px] py-0.5 px-2.5">
              Calculating...
            </Badge>
          )
        ) : (
          <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-border/20 text-[10px] py-0.5 px-2.5">
            No Data
          </Badge>
        )}
      </div>
    </div>
  );
}

function HabitItem({
  habit,
  onComplete,
  onDelete,
  onNavigate,
  isPending,
  index,
}: {
  habit: HabitWithStats & { canPredict?: boolean };
  onComplete: () => void;
  onDelete: () => void;
  onNavigate: () => void;
  isPending: boolean;
  index: number;
}) {
  const { data: prediction, isLoading: isPredictionLoading } = useHabitPrediction(
    habit.canPredict ? habit : undefined
  );

  const streakUnit = getStreakUnit(habit.frequency_num);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
    >
      <div
        className={cn(
          "rounded-2xl border p-4 sm:p-5 transition-all duration-300 relative overflow-hidden group",
          habit.isCompletedForPeriod
            ? "border-primary/20 bg-gradient-to-r from-primary/[0.03] via-transparent to-transparent bg-card/65 shadow-xs"
            : "border-border/30 bg-card/45 dark:bg-card/25 hover:border-border/60 hover:bg-card/70 dark:hover:bg-card/35 backdrop-blur-md shadow-xs"
        )}
      >
        <div className="flex items-start gap-3.5 w-full">
          {/* Checkbox button on the left (top aligned on mobile/desktop) */}
          <button
            onClick={onComplete}
            disabled={isPending || habit.isCompletedForPeriod}
            className={cn(
              "shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-350 cursor-pointer select-none mt-0.5",
              habit.isCompletedForPeriod
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-100"
                : "border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 active:scale-95 text-muted-foreground/30 hover:text-primary/70"
            )}
          >
            {isPending ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
            ) : habit.isCompletedForPeriod ? (
              <CheckCircle2 className="h-4.5 w-4.5 fill-current" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </button>

          {/* Main Column */}
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            {/* Header row: Title + Dropdown Actions on right */}
            <div className="flex items-start justify-between gap-2 w-full">
              <div className="flex items-center gap-1.5 min-w-0 cursor-pointer" onClick={onNavigate}>
                <h3
                  className={cn(
                    "font-semibold text-sm sm:text-base transition-colors leading-tight truncate sm:whitespace-normal",
                    habit.isCompletedForPeriod ? "text-muted-foreground/70 line-through" : "text-foreground"
                  )}
                >
                  {habit.name}
                </h3>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block shrink-0" />
              </div>

              {/* Three-dots action menu (on right) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center transition-all hover:bg-muted/80 text-muted-foreground/70 hover:text-foreground cursor-pointer -mt-1">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 rounded-xl border-border/30 bg-card/95 backdrop-blur-xl">
                  <DropdownMenuItem onClick={onNavigate} className="cursor-pointer text-xs font-semibold">
                    <Calendar className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-destructive focus:text-destructive cursor-pointer text-xs font-semibold"
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Description (if exists) */}
            {habit.description && (
              <p className="text-xs text-muted-foreground/80 leading-normal" onClick={onNavigate}>
                {habit.description}
              </p>
            )}

            {/* Sub-row: Progress counter, Streak and AI Prediction Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-muted-foreground">
              <span className="text-[11px] font-medium shrink-0" onClick={onNavigate}>
                {habit.periodCompletions} / {habit.periodTarget} {habit.periodLabel}
              </span>
              
              {habit.periodTarget > 1 && (
                <div className="w-12 h-1 bg-muted/60 dark:bg-muted/30 rounded-full overflow-hidden shrink-0" onClick={onNavigate}>
                  <div
                    className="bg-primary h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (habit.periodCompletions / habit.periodTarget) * 100)}%`,
                    }}
                  />
                </div>
              )}

              {/* Dot separator if we have badges */}
              {(habit.current_streak > 0 || (habit.canPredict && (isPredictionLoading || prediction))) && (
                <span className="text-muted-foreground/30">•</span>
              )}

              {/* Badges container */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {habit.current_streak > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-0 text-[10px] py-0 px-1.5 font-bold select-none flex items-center gap-0.5"
                  >
                    <Flame className="h-3 w-3 fill-primary text-primary" />
                    {habit.current_streak}{streakUnit.charAt(0)}
                  </Badge>
                )}

                {habit.canPredict &&
                  (isPredictionLoading ? (
                    <Badge variant="outline" className="bg-accent/5 text-accent/60 border-accent/20 text-[10px] py-0 px-1.5 animate-pulse flex items-center">
                      <Brain className="mr-1 h-3 w-3" />
                      <span className="inline-block w-4 h-2 bg-accent/20 rounded"></span>
                    </Badge>
                  ) : prediction ? (
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-[10px] py-0 px-1.5 font-bold flex items-center">
                      <Brain className="mr-1 h-3 w-3 text-accent" />
                      {prediction.probability_percent}
                    </Badge>
                  ) : null)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
