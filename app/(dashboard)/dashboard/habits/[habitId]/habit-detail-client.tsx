"use client";
import { useState, useTransition } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  Plus,
  MessageSquare,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import type { HabitWithStats, HabitLog, HabitPrediction } from "@/types/database";
import { logHabitCompletion, removeHabitCompletion } from "@/app/actions/habits";
import { getCachedPrediction, canUsePrediction, getDaysUntilPrediction } from "@/lib/habit-prediction";
import { useEffect } from "react";

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

export function HabitDetailClient({ initialHabit, initialStats }: HabitDetailClientProps) {
  const router = useRouter();
  const [habit, setHabit] = useState<HabitWithStats>(initialHabit);
  const [stats, setStats] = useState<HabitStats | null>(initialStats);
  const [prediction, setPrediction] = useState<HabitPrediction | null>(null);
  const [predictionLoaded, setPredictionLoaded] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [completionNote, setCompletionNote] = useState("");
  const [isPending, startTransition] = useTransition();

  const today = new Date().toISOString().split("T")[0];

  // Load prediction on mount
  useEffect(() => {
    async function loadPrediction() {
      if (canUsePrediction(habit)) {
        try {
          const pred = await getCachedPrediction(
            habit.habit_id,
            habit,
            habit.completionLogs
          );
          setPrediction(pred);
          if (!pred) {
            setPredictionError("AI service is currently unavailable. Please try again later.");
          }
        } catch (error) {
          console.error("Prediction error:", error);
          setPredictionError("Failed to connect to AI service.");
        }
      }
      setPredictionLoaded(true);
    }
    loadPrediction();
  }, [habit]);

  const handleComplete = async () => {
    startTransition(async () => {
      const result = await logHabitCompletion(habit.habit_id, completionNote || undefined);
      if (result.data) {
        setHabit((prev) => ({
          ...prev,
          completedToday: true,
          streak_count: prev.streak_count + 1,
          completionLogs: [result.data, ...prev.completionLogs],
        }));
        if (stats) {
          setStats((prev) => prev ? {
            ...prev,
            current_streak: prev.current_streak + 1,
            total_completions: prev.total_completions + 1,
          } : null);
        }
        setIsCompleteDialogOpen(false);
        setCompletionNote("");
      }
    });
  };

  const handleRemoveCompletion = async () => {
    startTransition(async () => {
      const result = await removeHabitCompletion(habit.habit_id, today);
      if (result.data) {
        setHabit((prev) => ({
          ...prev,
          completedToday: false,
          streak_count: 0,
          completionLogs: prev.completionLogs.filter(
            (log) => !log.completed_at.startsWith(today)
          ),
        }));
        if (stats) {
          setStats((prev) => prev ? {
            ...prev,
            current_streak: 0,
          } : null);
        }
      }
    });
  };

  const daysUntilPrediction = canUsePrediction(habit) ? 0 : getDaysUntilPrediction(habit);

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

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-primary tracking-tight">
                    {habit.name}
                  </h1>
                  {habit.completedToday && (
                    <Badge className="bg-primary/10 text-primary border-0">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Done Today
                    </Badge>
                  )}
                </div>
                {habit.description && (
                  <p className="text-muted-foreground">{habit.description}</p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="capitalize">
                    {habit.frequency}
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                    <Flame className="mr-1 h-3 w-3" />
                    {habit.streak_count} streak
                  </Badge>
                </div>
              </div>

              {/* Complete Button */}
              {habit.completedToday ? (
                <button
                  onClick={handleRemoveCompletion}
                  disabled={isPending}
                  className="inline-flex items-center justify-center rounded-xl bg-muted px-5 py-2.5 text-sm font-medium hover:bg-muted/80 transition-colors"
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                  )}
                  Completed
                </button>
              ) : (
                <button
                  onClick={() => setIsCompleteDialogOpen(true)}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Complete Today
                </button>
              )}
            </motion.div>

            {/* Completion Dialog */}
            <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
              <DialogContent className="glass border-border sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-primary text-xl flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Complete Habit
                  </DialogTitle>
                  <DialogDescription>{habit.name}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Notes <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Textarea
                      placeholder="How did it go? Any reflections..."
                      value={completionNote}
                      onChange={(e) => setCompletionNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <button
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                    onClick={() => setIsCompleteDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                    onClick={handleComplete}
                    disabled={isPending}
                  >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Mark Complete
                  </button>
                </DialogFooter>
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
                  <Progress value={stats ? stats.completion_rate_7d * 100 : 0} className="h-1" />
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
                  <Progress value={stats ? stats.completion_rate_30d * 100 : 0} className="h-1" />
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
                    <CardTitle className="text-lg font-primary">AI Prediction</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {daysUntilPrediction > 0 ? (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Sparkles className="h-5 w-5 text-accent" />
                      <span>
                        AI insights will be available in <strong className="text-foreground">{daysUntilPrediction} days</strong>.
                        Keep completing your habit to unlock predictions!
                      </span>
                    </div>
                  ) : prediction ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {prediction.prediction === "Complete" ? "Completion Likelihood" : "Skip Likelihood"}
                        </span>
                        <span className="text-2xl font-primary text-accent">
                          {prediction.probability_percent}
                        </span>
                      </div>
                      <Progress value={prediction.probability * 100} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {prediction.prediction === "Complete"
                          ? "🎯 You're likely to complete this habit today!"
                          : "💪 Push through! Every completion builds momentum."}
                      </p>
                      <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Predictions update every 24 hours
                        </span>
                      </div>
                    </div>
                  ) : predictionLoaded && predictionError ? (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Brain className="h-5 w-5 text-destructive" />
                      <span>{predictionError}</span>
                    </div>
                  ) : !predictionLoaded ? (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin text-accent" />
                      <span>Loading prediction...</span>
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
                    <CardTitle className="text-lg font-primary">Completion History</CardTitle>
                  </div>
                  <CardDescription>
                    Last 30 days of completions
                  </CardDescription>
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
                                    {new Date(log.completed_at).toLocaleTimeString("en-US", {
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
