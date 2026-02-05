"use client";

import { useState, useEffect } from "react";
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
  TrendingUp,
  Brain,
  Sparkles,
  Loader2,
  Calendar,
  Clock,
  Target,
  MessageSquare,
  XCircle,
  Pencil,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import type {
  HabitWithStats,
  HabitLog,
  HabitPrediction,
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

export function HabitDetailClient({
  initialHabit,
  initialStats,
}: HabitDetailClientProps) {
  const router = useRouter();

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
  
  // Edit form state
  const [editName, setEditName] = useState(habit.name);
  const [editDescription, setEditDescription] = useState(habit.description || "");
  const [editFrequency, setEditFrequency] = useState<HabitFrequency>(habit.frequency);

  const today = new Date().toISOString().split("T")[0];
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
          // Optimistic update
          setHabit((prev) => ({
            ...prev,
            completedToday: true,
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
    // Optimistic update - apply immediately for instant UI feedback
    setHabit((prev) => ({
      ...prev,
      completedToday: false,
      current_streak: Math.max(0, prev.current_streak - 1), // Decrement streak
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
          // Revert on error - refetch the page to get correct state
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
        },
      },
      {
        onSuccess: (data) => {
          if (data) {
            // Optimistic update
            setHabit((prev) => ({
              ...prev,
              name: data.name,
              description: data.description,
              frequency: data.frequency,
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
              onClick={() => router.back()}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Habits
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
                            setEditFrequency(habit.frequency);
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
                        <Badge variant="secondary">{habit.frequency}</Badge>
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          <Flame className="mr-1 h-3 w-3" />
                          {habit.current_streak} day streak
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    {!habit.completedToday ? (
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
                        Mark Complete for Today
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
                        Remove Today's Completion
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
                    Add an optional note about today's completion
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
              <DialogContent className="glass border-border sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-primary">
                    Remove Completion
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to remove today's completion? This will reset your streak if it was active today.
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
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Frequency</Label>
                      <Select
                        value={editFrequency}
                        onValueChange={(value: HabitFrequency) => setEditFrequency(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
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
                      {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                    7-Day Rate
                  </CardDescription>
                  <CardTitle className="text-2xl font-primary">
                    {stats ? Math.round(stats.completion_rate_7d * 100) : 0}%
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-1">
                  <Progress
                    value={stats ? stats.completion_rate_7d * 100 : 0}
                    className="h-1"
                  />
                </CardContent>
              </Card>

              <Card className="glass border-border/30">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-medium">
                    30-Day Rate
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
                    Days Active
                  </CardDescription>
                  <CardTitle className="text-2xl font-primary flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    {stats?.days_since_start || 0}
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
                        AI service is currently unavailable. Please try again later.
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

            {/* Completion Logs */}
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
                  <CardDescription>Last 30 days of completions</CardDescription>
                </CardHeader>
                <CardContent>
                  {habit.completionLogs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>No completions yet. Start building your streak!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(groupedLogs).map(([date, logs]) => (
                        <div key={date}>
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">
                            {date}
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
                                    {new Date(log.completed_at).toLocaleTimeString(
                                      "en-US",
                                      {
                                        hour: "numeric",
                                        minute: "2-digit",
                                      }
                                    )}
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