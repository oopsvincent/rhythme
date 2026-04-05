"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
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
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
import { HabitHeatmap } from "@/components/dashboard/habit-heatmap";
import {
  FREQUENCY_LABELS,
  getTargetLabel,
  getFrequencyLabel,
  getStreakUnit,
} from "@/lib/habit-helpers";
import { canCreateHabit } from "@/app/actions/usage-limits";
import { PremiumGateModal } from "@/components/premium-gate-modal";

/**
 * Generate SEO-friendly slug from habit name + id
 * Example: "Morning Exercise" + 123 => "morning-exercise-123"
 */
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

export default function HabitsPage() {
  const router = useRouter();

  // React Query hooks for data fetching
  const { data: habits = [], isLoading, error } = useHabits();

  // Realtime subscription (invalidates cache when DB changes)
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

  const isPending =
    createMutation.isPending || deleteMutation.isPending || logMutation.isPending;

  const openCompleteDialog = (habit: HabitWithStats) => {
    if (habit.isCompletedForPeriod) {
      // Already completed - navigate to detail page to undo
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

    // Check usage limit before creating
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
    router.push(`/dashboard/habits/${slug}`);
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
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md">
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

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col px-4 md:px-10 pb-8 select-none">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-6 py-6">
            {/* Header */}
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-primary tracking-tight">
                  Habits
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Build consistency, shape your identity
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <button
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Habit
                  </button>
                </DialogTrigger>
                <DialogContent className="border-border sm:max-w-md">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddHabit();
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle className="font-primary text-xl">
                        Create New Habit
                      </DialogTitle>
                      <DialogDescription>
                        Start building a positive habit today
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Habit Name</Label>
                        <Input
                          placeholder="e.g., Morning Exercise"
                          value={newHabit.name}
                          onChange={(e) =>
                            setNewHabit({ ...newHabit, name: e.target.value })
                          }
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
                          value={newHabit.description}
                          onChange={(e) =>
                            setNewHabit({ ...newHabit, description: e.target.value })
                          }
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
                              onClick={() =>
                                setNewHabit({
                                  ...newHabit,
                                  frequency: opt.value,
                                  target_count: opt.value === 0 ? 1 : newHabit.target_count,
                                })
                              }
                              className={`flex items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 border ${
                                newHabit.frequency === opt.value
                                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                                  : "bg-muted/30 text-foreground border-border hover:bg-muted/50 hover:border-border/80"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Dynamic Target Count */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
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
                            className="shrink-0 h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
                            className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                            className="shrink-0 h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <button
                        type="button"
                        onClick={() => setIsAddDialogOpen(false)}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isPending || !newHabit.name.trim()}
                        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create Habit
                      </button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Premium Gate Modal */}
              <PremiumGateModal
                open={showPremiumGate}
                onOpenChange={setShowPremiumGate}
                reason="habit"
              />
            </motion.div>

            {/* Complete Dialog */}
            <Dialog
              open={!!completeDialogHabit}
              onOpenChange={(open) => !open && setCompleteDialogHabit(null)}
            >
              <DialogContent className="border-border sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-primary">
                    Complete {completeDialogHabit?.name}
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
                    onClick={() => setCompleteDialogHabit(null)}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCompleteWithNote}
                    disabled={isPending}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Mark Complete
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : habits.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 px-4"
              >
                <Target className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-primary mb-2">No habits yet</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Start your journey by creating your first habit. Small steps lead
                  to big changes.
                </p>
                <button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Habit
                </button>
              </motion.div>
            ) : (
              <>
                {/* Overview Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <Card className="glass border-border/30">
                    <CardHeader className="pb-3">
                      <CardDescription className="text-xs font-medium">
                        Today&apos;s Progress
                      </CardDescription>
                      <CardTitle className="text-2xl font-primary">
                        {completedToday} / {totalDaily}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={completionRate} className="h-2" />
                    </CardContent>
                  </Card>

                  <Card className="glass border-border/30">
                    <CardHeader className="pb-3">
                      <CardDescription className="text-xs font-medium">
                        Total Streak
                      </CardDescription>
                      <CardTitle className="text-2xl font-primary flex items-center gap-2">
                        <Flame className="h-5 w-5 text-primary" />
                        {totalStreak}
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  <Card className="glass border-border/30">
                    <CardHeader className="pb-3">
                      <CardDescription className="text-xs font-medium">
                        Longest Streak
                      </CardDescription>
                      <CardTitle className="text-2xl font-primary flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-accent" />
                        {longestStreak}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </motion.div>

                {/* Habit Lists by Frequency */}
                <div className="space-y-8">
                  {dailyHabits.length > 0 && (
                    <HabitSection
                      title="Daily Habits"
                      habits={dailyHabits}
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

                  {multiplePerWeekHabits.length > 0 && (
                    <HabitSection
                      title="Multiple Per Week"
                      habits={multiplePerWeekHabits}
                      onComplete={openCompleteDialog}
                      onDelete={handleDeleteHabit}
                      onNavigate={navigateToHabit}
                      isPending={isPending}
                      delay={0.5}
                    />
                  )}
                </div>
              </>
            )}
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-primary">{title}</h2>
        <Badge variant="secondary" className="text-xs">
          {habits.length}
        </Badge>
      </div>
      <div className="space-y-3">
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
  // Load prediction independently - doesn't block rendering
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
      <div className="glass border-border/30 rounded-xl p-4 hover:border-border/50 transition-all duration-200 group">
        <div className="flex items-center gap-4">
          {/* Complete Button */}
          <button
            onClick={onComplete}
            disabled={isPending || habit.isCompletedForPeriod}
            className={`shrink-0 h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
              habit.isCompletedForPeriod
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 cursor-default"
                : "border-2 border-dashed border-border hover:border-primary hover:bg-primary/5"
            }`}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : habit.isCompletedForPeriod ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </button>

          {/* Content - Clickable to navigate */}
          <div className="flex-1 min-w-0 cursor-pointer" onClick={onNavigate}>
            <div className="flex items-center gap-2">
              <h3
                className={`font-medium ${
                  habit.isCompletedForPeriod ? "text-muted-foreground line-through" : ""
                }`}
              >
                {habit.name}
              </h3>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {habit.description && (
                <p className="text-sm text-muted-foreground truncate">
                  {habit.description}
                </p>
              )}
              <span className="text-xs text-muted-foreground shrink-0">
                {habit.periodCompletions} / {habit.periodTarget} {habit.periodLabel}
              </span>
            </div>
          </div>

          {/* Stats & Badges */}
          <div className="hidden sm:flex items-center gap-2">
            {habit.current_streak > 0 && (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-0"
              >
                <Flame className="mr-1 h-3 w-3" />
                {habit.current_streak}{streakUnit.charAt(0)}
              </Badge>
            )}

            {/* Prediction Badge - Independent loading */}
            {habit.canPredict &&
              (isPredictionLoading ? (
                <Badge
                  variant="outline"
                  className="bg-accent/5 text-accent/60 border-accent/20 animate-pulse"
                >
                  <Brain className="mr-1 h-3 w-3" />
                  <span className="inline-block w-6 h-3 bg-accent/20 rounded"></span>
                </Badge>
              ) : prediction ? (
                <Badge
                  variant="outline"
                  className="bg-accent/10 text-accent border-accent/20"
                >
                  <Brain className="mr-1 h-3 w-3" />
                  {prediction.probability_percent}
                </Badge>
              ) : null)}

            {habit.daysUntilPrediction !== undefined &&
              habit.daysUntilPrediction > 0 && (
                <Badge
                  variant="outline"
                  className="border-accent/30 text-muted-foreground"
                >
                  <Sparkles className="mr-1 h-3 w-3 text-accent" />
                  AI in {habit.daysUntilPrediction}d
                </Badge>
              )}
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-muted">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={onNavigate}>
                <Calendar className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Heatmap Section */}
        <div className="mt-4 pt-4 border-t border-border/10">
          <HabitHeatmap
            logs={habit.completionLogs || []}
            frequency={habit.frequency_num}
            targetCount={habit.target_count}
          />
        </div>

        {/* Mobile Badges */}
        <div className="flex sm:hidden flex-wrap items-center gap-2 mt-3">
          <span className="text-xs text-muted-foreground">
            {habit.periodCompletions} / {habit.periodTarget} {habit.periodLabel}
          </span>
          {habit.current_streak > 0 && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-0 text-xs"
            >
              <Flame className="mr-1 h-3 w-3" />
              {habit.current_streak}{streakUnit.charAt(0)} streak
            </Badge>
          )}

          {/* Mobile Prediction Badge */}
          {habit.canPredict &&
            (isPredictionLoading ? (
              <Badge
                variant="outline"
                className="bg-accent/5 text-accent/60 border-accent/20 text-xs animate-pulse"
              >
                <Brain className="mr-1 h-3 w-3" />
                <span className="inline-block w-6 h-2 bg-accent/20 rounded"></span>
              </Badge>
            ) : prediction ? (
              <Badge
                variant="outline"
                className="bg-accent/10 text-accent border-accent/20 text-xs"
              >
                <Brain className="mr-1 h-3 w-3" />
                {prediction.probability_percent}
              </Badge>
            ) : null)}

          {habit.daysUntilPrediction !== undefined &&
            habit.daysUntilPrediction > 0 && (
              <Badge
                variant="outline"
                className="border-accent/30 text-muted-foreground text-xs"
              >
                <Sparkles className="mr-1 h-3 w-3 text-accent" />
                AI in {habit.daysUntilPrediction}d
              </Badge>
            )}
        </div>
      </div>
    </motion.div>
  );
}
