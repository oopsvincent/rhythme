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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  CalendarDays,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
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

/**
 * Get motivational message based on prediction probability
 */
function getPredictionMessage(probability: number): string {
  const percent = probability * 100;
  if (percent <= 10)
    return "🌱 Every journey starts somewhere. One step at a time!";
  if (percent <= 20) return "🔥 Building momentum! Keep showing up.";
  if (percent <= 30) return "💪 You're forming a pattern. Stay consistent!";
  if (percent <= 40)
    return "⭐ Almost halfway there! Your effort is paying off.";
  if (percent <= 50) return "🎯 Solid foundation! You're becoming reliable.";
  if (percent <= 60) return "📈 Above average! This habit is sticking.";
  if (percent <= 70)
    return "🌟 Strong commitment! You're building real momentum.";
  if (percent <= 80)
    return "🏆 Excellent consistency! This is becoming second nature.";
  if (percent <= 90)
    return "💎 Outstanding! You've nearly mastered this habit.";
  return "🚀 Unstoppable! This habit is now part of your identity.";
}

/**
 * Get the current week date range (Mon – Sun)
 */
function getCurrentWeekRange(): string {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

/**
 * Get ISO week key for grouping logs
 */
function getISOWeekLabel(dateStr: string): string {
  const d = new Date(dateStr);
  // Find Monday of that week
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (dt: Date) =>
    dt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

interface HabitStats {
  completion_rate_7d: number;
  completion_rate_30d: number;
  current_streak: number;
  days_since_start: number;
  total_completions: number;
}

interface WeeklyHabitDetailClientProps {
  initialHabit: HabitWithStats;
  initialStats: HabitStats | null;
}

export function WeeklyHabitDetailClient({
  initialHabit,
  initialStats,
}: WeeklyHabitDetailClientProps) {
  const router = useRouter();

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

  // Edit form state
  const [editName, setEditName] = useState(habit.name);
  const [editDescription, setEditDescription] = useState(
    habit.description || ""
  );

  const daysUntilPrediction = canUsePrediction(habit)
    ? 0
    : getDaysUntilPrediction(habit);

  const handleComplete = () => {
    logMutation.mutate(
      {
        habitId: habit.habit_id,
        note: completionNote || undefined,
      },
      {
        onSuccess: (data) => {
          setHabit((prev) => ({
            ...prev,
            completedThisWeek: true,
            current_streak: prev.current_streak + 1,
            completionLogs: data
              ? [data, ...prev.completionLogs]
              : prev.completionLogs,
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
    // Find the log from this week to get its date
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const thisWeekLog = habit.completionLogs.find((log) => {
      const logDate = new Date(log.completed_at);
      return logDate >= monday && logDate <= sunday;
    });

    if (!thisWeekLog) return;

    const logDate = thisWeekLog.completed_at.split("T")[0];

    // Optimistic update
    setHabit((prev) => ({
      ...prev,
      completedThisWeek: false,
      current_streak: Math.max(0, prev.current_streak - 1),
      completionLogs: prev.completionLogs.filter(
        (log) => log.habit_log_id !== thisWeekLog.habit_log_id
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
        date: logDate,
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
        },
      },
      {
        onSuccess: (data) => {
          if (data) {
            setHabit((prev) => ({
              ...prev,
              name: data.name,
              description: data.description,
            }));
          }
          setIsEditDialogOpen(false);
        },
      }
    );
  };

  // Group logs by week
  const groupedLogs = habit.completionLogs.reduce(
    (acc, log) => {
      const weekLabel = getISOWeekLabel(log.completed_at);
      if (!acc[weekLabel]) acc[weekLabel] = [];
      acc[weekLabel].push(log);
      return acc;
    },
    {} as Record<string, HabitLog[]>
  );

  const isPending = logMutation.isPending || removeMutation.isPending;
  const weekLabel = getCurrentWeekRange();

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col px-4 md:px-10 pb-8">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-6 py-6 max-w-4xl mx-auto w-full">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.push("/dashboard/habits/weekly")}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Weekly Habits
            </motion.button>

            {/* Habit Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass border-border/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl font-primary">
                          {habit.name}
                        </CardTitle>
                        <button
                          onClick={() => {
                            setEditName(habit.name);
                            setEditDescription(habit.description || "");
                            setIsEditDialogOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                          title="Edit habit"
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                      {habit.description && (
                        <CardDescription className="text-base">
                          {habit.description}
                        </CardDescription>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-accent/10 text-accent border-0"
                        >
                          <CalendarDays className="mr-1 h-3 w-3" />
                          Weekly
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          <Flame className="mr-1 h-3 w-3" />
                          {habit.current_streak} week streak
                        </Badge>
                        <Badge
                          variant={
                            habit.completedThisWeek ? "default" : "outline"
                          }
                          className={
                            habit.completedThisWeek
                              ? "bg-primary/15 text-primary border-primary/20"
                              : "text-muted-foreground"
                          }
                        >
                          {habit.completedThisWeek
                            ? "✓ Done this week"
                            : "⏳ Pending"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Current week: {weekLabel}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    {!habit.completedThisWeek ? (
                      <button
                        onClick={() => setIsCompleteDialogOpen(true)}
                        disabled={isPending}
                        className="flex-1 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                      >
                        {isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                        )}
                        Complete This Week
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsRemoveDialogOpen(true)}
                        disabled={isPending}
                        className="flex-1 inline-flex items-center justify-center rounded-xl bg-muted px-6 py-3 text-sm font-medium hover:bg-muted/80 disabled:opacity-50 transition-colors"
                      >
                        {isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4" />
                        )}
                        Remove This Week&apos;s Completion
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Complete Dialog */}
            <Dialog
              open={isCompleteDialogOpen}
              onOpenChange={setIsCompleteDialogOpen}
            >
              <DialogContent className="glass border-border sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-primary">
                    Complete {habit.name}
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
                    onClick={() => setIsCompleteDialogOpen(false)}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleComplete}
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

            {/* Remove Completion Dialog */}
            <Dialog
              open={isRemoveDialogOpen}
              onOpenChange={setIsRemoveDialogOpen}
            >
              <DialogContent className="glass border-border sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-primary">
                    Remove Completion
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to remove this week&apos;s completion?
                    This will reset your streak if it was active this week.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <button
                    type="button"
                    onClick={() => setIsRemoveDialogOpen(false)}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRemoveCompletion}
                    disabled={isPending}
                    className="inline-flex items-center justify-center rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 transition-colors"
                  >
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
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
              <DialogContent className="glass border-border sm:max-w-md">
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
                      Update your weekly habit details
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Habit Name</Label>
                      <Input
                        placeholder="e.g., Deep clean kitchen"
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
                  </div>
                  <DialogFooter>
                    <button
                      type="button"
                      onClick={() => setIsEditDialogOpen(false)}
                      className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateMutation.isPending || !editName.trim()}
                      className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updateMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <Card className="glass border-border/30">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-medium">
                    4-Week Rate
                  </CardDescription>
                  <CardTitle className="text-2xl font-primary">
                    {stats ? Math.round(stats.completion_rate_30d * 100) : 0}%
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-1">
                  <Progress
                    value={stats ? stats.completion_rate_30d * 100 : 0}
                    className="h-1"
                  />
                </CardContent>
              </Card>

              <Card className="glass border-border/30">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-medium">
                    Week Streak
                  </CardDescription>
                  <CardTitle className="text-2xl font-primary flex items-center gap-2">
                    <Flame className="h-4 w-4 text-primary" />
                    {habit.current_streak}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="glass border-border/30">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-medium">
                    Weeks Active
                  </CardDescription>
                  <CardTitle className="text-2xl font-primary flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    {stats
                      ? Math.ceil(stats.days_since_start / 7)
                      : 0}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="glass border-border/30">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-medium">
                    Total Completions
                  </CardDescription>
                  <CardTitle className="text-2xl font-primary flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    {stats?.total_completions || 0}
                  </CardTitle>
                </CardHeader>
              </Card>
            </motion.div>

            {/* AI Prediction Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass border-border/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg font-primary">
                      AI Prediction
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {daysUntilPrediction > 0 ? (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Sparkles className="h-5 w-5 text-accent" />
                      <span>
                        AI insights will be available in{" "}
                        <strong className="text-foreground">
                          {daysUntilPrediction} days
                        </strong>
                        . Keep completing your habit to unlock predictions!
                      </span>
                    </div>
                  ) : isPredictionLoading ? (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin text-accent" />
                      <span>Loading prediction...</span>
                    </div>
                  ) : predictionError ? (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Brain className="h-5 w-5 text-destructive" />
                      <span>
                        AI service is currently unavailable. Please try again
                        later.
                      </span>
                    </div>
                  ) : prediction ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Completion Likelihood
                        </span>
                        <span className="text-2xl font-primary text-accent">
                          {prediction.probability_percent}
                        </span>
                      </div>
                      <Progress
                        value={prediction.probability * 100}
                        className="h-2"
                      />
                      <p className="text-sm text-muted-foreground">
                        {getPredictionMessage(prediction.probability)}
                      </p>
                      <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Predictions update every 24 hours
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Sparkles className="h-5 w-5 text-accent" />
                      <span>No prediction data available.</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Completion Logs - Grouped by week */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass border-border/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-primary">
                      Completion History
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Weekly completions grouped by week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {habit.completionLogs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>
                        No completions yet. Start building your weekly streak!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(groupedLogs).map(([weekLabel, logs]) => (
                        <div key={weekLabel}>
                          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {weekLabel}
                          </h4>
                          <div className="space-y-2">
                            {logs.map((log) => (
                              <div
                                key={log.habit_log_id}
                                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                              >
                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(
                                      log.completed_at
                                    ).toLocaleDateString("en-US", {
                                      weekday: "long",
                                      month: "short",
                                      day: "numeric",
                                    })}{" "}
                                    at{" "}
                                    {new Date(
                                      log.completed_at
                                    ).toLocaleTimeString("en-US", {
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                  {log.note && (
                                    <div className="flex items-start gap-2 mt-2">
                                      <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                      <p className="text-sm">{log.note}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
