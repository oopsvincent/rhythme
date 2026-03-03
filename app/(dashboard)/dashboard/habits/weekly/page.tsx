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
  CheckCircle2,
  Flame,
  Loader2,
  MoreVertical,
  Trash2,
  ChevronRight,
  Target,
  Calendar,
  CalendarDays,
  CircleDashed,
  Sparkles,
  Brain,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { HabitWithStats, CreateHabitInput } from "@/types/database";
import {
  useWeeklyHabits,
  useHabitsRealtime,
  useCreateHabit,
  useDeleteHabit,
  useLogCompletion,
  useHabitPrediction,
} from "@/hooks/use-habits";

/**
 * Generate SEO-friendly slug from habit name + id
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

/**
 * Get the current week date range (Mon – Sun)
 */
function getCurrentWeekRange(): { start: Date; end: Date; label: string } {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return {
    start: monday,
    end: sunday,
    label: `${fmt(monday)} – ${fmt(sunday)}`,
  };
}

export default function WeeklyHabitsPage() {
  const router = useRouter();

  // React Query hooks
  const { data: weeklyHabits = [], isLoading, error } = useWeeklyHabits();
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
  const [newHabit, setNewHabit] = useState<CreateHabitInput>({
    name: "",
    description: "",
    frequency: "weekly",
  });

  const isPending =
    createMutation.isPending ||
    deleteMutation.isPending ||
    logMutation.isPending;

  const weekRange = getCurrentWeekRange();

  const completedCount = weeklyHabits.filter(
    (h) => h.completedThisWeek
  ).length;
  const totalCount = weeklyHabits.length;
  const progressPercent =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const openCompleteDialog = (habit: HabitWithStats) => {
    if (habit.completedThisWeek) return;
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

  const handleAddHabit = () => {
    if (!newHabit.name.trim()) return;
    createMutation.mutate(
      { ...newHabit, frequency: "weekly" },
      {
        onSuccess: () => {
          setNewHabit({ name: "", description: "", frequency: "weekly" });
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
    router.push(`/dashboard/habits/weekly/${slug}`);
  };

  if (error) {
    return (
      <>
        <SiteHeader />
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Error Loading Habits</CardTitle>
              <CardDescription>
                {error instanceof Error
                  ? error.message
                  : "Failed to load habits"}
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
      <div className="flex flex-1 flex-col px-4 md:px-10 pb-8">
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
                  Weekly Habits
                </h1>
                <p className="text-muted-foreground text-sm md:text-base flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {weekRange.label}
                </p>
              </div>
              <Dialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
              >
                <DialogTrigger asChild>
                  <button className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Weekly Habit
                  </button>
                </DialogTrigger>
                <DialogContent className="glass border-border sm:max-w-md">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddHabit();
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle className="font-primary text-xl">
                        Create Weekly Habit
                      </DialogTitle>
                      <DialogDescription>
                        Complete at least once per week to keep your streak
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Habit Name
                        </Label>
                        <Input
                          placeholder="e.g., Deep clean kitchen"
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
                          <span className="text-muted-foreground">
                            (optional)
                          </span>
                        </Label>
                        <Input
                          placeholder="Brief description"
                          value={newHabit.description}
                          onChange={(e) =>
                            setNewHabit({
                              ...newHabit,
                              description: e.target.value,
                            })
                          }
                        />
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
            </motion.div>

            {/* Complete Dialog */}
            <Dialog
              open={!!completeDialogHabit}
              onOpenChange={(open) => !open && setCompleteDialogHabit(null)}
            >
              <DialogContent className="glass border-border sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-primary">
                    Complete {completeDialogHabit?.name}
                  </DialogTitle>
                  <DialogDescription>
                    Add an optional note about this week&apos;s completion
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
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Mark Complete
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : weeklyHabits.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 px-4"
              >
                <CalendarDays className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-primary mb-2">
                  No weekly habits yet
                </h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Weekly habits only need one completion per week. Perfect for
                  tasks like meal prep, weekly reviews, or deep cleaning.
                </p>
                <button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Weekly Habit
                </button>
              </motion.div>
            ) : (
              <>
                {/* Progress Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="glass border-border/30 overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            This Week&apos;s Progress
                          </p>
                          <p className="text-2xl font-primary mt-1">
                            {completedCount}{" "}
                            <span className="text-muted-foreground text-base font-normal">
                              / {totalCount} completed
                            </span>
                          </p>
                        </div>
                        {/* Circular progress */}
                        <div className="relative h-16 w-16">
                          <svg
                            className="h-16 w-16 -rotate-90"
                            viewBox="0 0 64 64"
                          >
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              fill="none"
                              strokeWidth="4"
                              className="stroke-muted/30"
                            />
                            <motion.circle
                              cx="32"
                              cy="32"
                              r="28"
                              fill="none"
                              strokeWidth="4"
                              className="stroke-primary"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 28}`}
                              initial={{
                                strokeDashoffset: 2 * Math.PI * 28,
                              }}
                              animate={{
                                strokeDashoffset:
                                  2 * Math.PI * 28 * (1 - progressPercent / 100),
                              }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold font-primary">
                              {Math.round(progressPercent)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Weekly Habits List */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-primary">Your Weekly Habits</h2>
                    <Badge variant="secondary" className="text-xs">
                      {weeklyHabits.length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {weeklyHabits.map((habit, index) => (
                        <WeeklyHabitItem
                          key={habit.habit_id}
                          habit={habit}
                          onComplete={() => openCompleteDialog(habit)}
                          onDelete={() => handleDeleteHabit(habit.habit_id)}
                          onNavigate={() => navigateToHabit(habit)}
                          isPending={isPending}
                          index={index}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// === Weekly Habit Item Component ===
function WeeklyHabitItem({
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
  const { data: prediction, isLoading: isPredictionLoading } =
    useHabitPrediction(habit.canPredict ? habit : undefined);

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
            disabled={isPending || habit.completedThisWeek}
            className={`shrink-0 h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
              habit.completedThisWeek
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 cursor-default"
                : "border-2 border-dashed border-border hover:border-primary hover:bg-primary/5"
            }`}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : habit.completedThisWeek ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <CircleDashed className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0 cursor-pointer" onClick={onNavigate}>
            <div className="flex items-center gap-2">
              <h3
                className={`font-medium ${
                  habit.completedThisWeek
                    ? "text-muted-foreground line-through"
                    : ""
                }`}
              >
                {habit.name}
              </h3>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {habit.description && (
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {habit.description}
              </p>
            )}
          </div>

          {/* Status & Badges */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Status badge */}
            <Badge
              variant={habit.completedThisWeek ? "default" : "outline"}
              className={
                habit.completedThisWeek
                  ? "bg-primary/15 text-primary border-primary/20"
                  : "bg-muted/50 text-muted-foreground"
              }
            >
              {habit.completedThisWeek ? "✓ Done" : "⏳ Pending"}
            </Badge>

            {/* Streak */}
            {habit.current_streak > 0 && (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-0"
              >
                <Flame className="mr-1 h-3 w-3" />
                {habit.current_streak}w
              </Badge>
            )}

            {/* Prediction Badge */}
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

        {/* Mobile Badges */}
        <div className="flex sm:hidden items-center gap-2 mt-3 ml-15">
          <Badge
            variant={habit.completedThisWeek ? "default" : "outline"}
            className={`text-xs ${
              habit.completedThisWeek
                ? "bg-primary/15 text-primary border-primary/20"
                : "bg-muted/50 text-muted-foreground"
            }`}
          >
            {habit.completedThisWeek ? "✓ Done" : "⏳ Pending"}
          </Badge>

          {habit.current_streak > 0 && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-0 text-xs"
            >
              <Flame className="mr-1 h-3 w-3" />
              {habit.current_streak}w streak
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
