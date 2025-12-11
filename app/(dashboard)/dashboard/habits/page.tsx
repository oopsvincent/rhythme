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
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  useRemoveCompletion,
} from "@/hooks/use-habits";

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
  const removeMutation = useRemoveCompletion();
  
  // Local UI state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [completeDialogHabit, setCompleteDialogHabit] = useState<HabitWithStats | null>(null);
  const [completionNote, setCompletionNote] = useState("");
  const [newHabit, setNewHabit] = useState<CreateHabitInput>({
    name: "",
    description: "",
    frequency: "daily",
  });

  const today = new Date().toISOString().split("T")[0];
  const isPending = createMutation.isPending || deleteMutation.isPending || 
                    logMutation.isPending || removeMutation.isPending;

  const openCompleteDialog = (habit: HabitWithStats) => {
    if (habit.completedToday) {
      // If already completed, just remove it
      removeMutation.mutate({ habitId: habit.habit_id, date: today });
    } else {
      setCompleteDialogHabit(habit);
      setCompletionNote("");
    }
  };

  const handleCompleteWithNote = () => {
    if (!completeDialogHabit) return;
    logMutation.mutate(
      { habitId: completeDialogHabit.habit_id, note: completionNote || undefined },
      {
        onSuccess: () => {
          setCompleteDialogHabit(null);
          setCompletionNote("");
        },
      }
    );
  };

  const handleAddHabit = () => {
    if (!newHabit.name) return;
    createMutation.mutate(newHabit, {
      onSuccess: () => {
        setNewHabit({ name: "", description: "", frequency: "daily" });
        setIsAddDialogOpen(false);
      },
    });
  };

  const handleDeleteHabit = (habitId: number) => {
    deleteMutation.mutate(habitId);
  };

  const navigateToHabit = (habitId: number) => {
    router.push(`/dashboard/habits/${habitId}`);
  };

  const dailyHabits = habits.filter((h) => h.frequency === "daily");
  const weeklyHabits = habits.filter((h) => h.frequency === "weekly");
  const monthlyHabits = habits.filter((h) => h.frequency === "monthly");

  const completedToday = dailyHabits.filter((h) => h.completedToday).length;
  const totalDaily = dailyHabits.length;
  const completionRate = totalDaily > 0 ? (completedToday / totalDaily) * 100 : 0;

  const totalStreak = habits.reduce((sum, h) => sum + h.streak_count, 0);
  const longestStreak = Math.max(...habits.map((h) => h.streak_count), 0);

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
                  Habits
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Build consistency, shape your identity
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Habit
                  </button>
                </DialogTrigger>
                <DialogContent className="glass border-border sm:max-w-md">
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
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Frequency</Label>
                      <Select
                        value={newHabit.frequency}
                        onValueChange={(value) =>
                          setNewHabit({
                            ...newHabit,
                            frequency: value as HabitFrequency,
                          })
                        }
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
                  <DialogFooter className="gap-2 sm:gap-0">
                    <button
                      className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                      onClick={handleAddHabit}
                      disabled={createMutation.isPending || !newHabit.name}
                    >
                      {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Habit
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </motion.div>

            {/* Completion Dialog */}
            <Dialog open={!!completeDialogHabit} onOpenChange={(open) => !open && setCompleteDialogHabit(null)}>
              <DialogContent className="glass border-border sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-primary text-xl flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Complete Habit
                  </DialogTitle>
                  <DialogDescription>
                    {completeDialogHabit?.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Notes{" "}
                      <span className="text-muted-foreground">(optional)</span>
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
                    onClick={() => setCompleteDialogHabit(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                    onClick={handleCompleteWithNote}
                    disabled={logMutation.isPending}
                  >
                    {logMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Mark Complete
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center min-h-[300px]">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading habits...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center min-h-[300px]">
                <div className="text-center text-destructive">
                  <p>Failed to load habits</p>
                  <p className="text-sm text-muted-foreground">{error.message}</p>
                </div>
              </div>
            )}

            {!isLoading && !error && (
              <>
                {/* Stats Grid */}
                <motion.div
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="glass border-border/30">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs md:text-sm font-medium">
                        Today&apos;s Progress
                      </CardDescription>
                      <CardTitle className="text-2xl md:text-3xl font-primary">
                        <span className="text-primary">{completedToday}</span>
                        <span className="text-muted-foreground">/{totalDaily}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <Progress value={completionRate} className="h-1.5" />
                    </CardContent>
                  </Card>

                  <Card className="glass border-border/30">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs md:text-sm font-medium">
                        Active Habits
                      </CardDescription>
                      <CardTitle className="text-2xl md:text-3xl font-primary flex items-center gap-2">
                        <Target className="h-5 w-5 text-accent" />
                        {habits.length}
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  <Card className="glass border-border/30">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs md:text-sm font-medium">
                        Combined Streak
                      </CardDescription>
                      <CardTitle className="text-2xl md:text-3xl font-primary flex items-center gap-2">
                        <Flame className="h-5 w-5 text-primary" />
                        {totalStreak}
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  <Card className="glass border-border/30">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs md:text-sm font-medium">
                        Best Streak
                      </CardDescription>
                      <CardTitle className="text-2xl md:text-3xl font-primary flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-accent" />
                        {longestStreak}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </motion.div>

                {/* Empty State */}
                {habits.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-12 text-center rounded-2xl"
                  >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-primary mb-2">No habits yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Start building positive habits to track your progress
                    </p>
                    <button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-lg"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Habit
                    </button>
                  </motion.div>
                )}

                {/* Habits List */}
                {habits.length > 0 && (
                  <div className="space-y-6">
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
                  </div>
                )}
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
  onNavigate: (id: number) => void;
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
              onNavigate={() => onNavigate(habit.habit_id)}
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
  habit: HabitWithStats;
  onComplete: () => void;
  onDelete: () => void;
  onNavigate: () => void;
  isPending: boolean;
  index: number;
}) {
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
            disabled={isPending}
            className={`shrink-0 h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
              habit.completedToday
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "border-2 border-dashed border-border hover:border-primary hover:bg-primary/5"
            }`}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : habit.completedToday ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </button>

          {/* Content - Clickable to navigate */}
          <div 
            className="flex-1 min-w-0 cursor-pointer"
            onClick={onNavigate}
          >
            <div className="flex items-center gap-2">
              <h3 className={`font-medium ${habit.completedToday ? "text-muted-foreground opacity-60" : ""}`}>
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

          {/* Stats & Badges */}
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
              <Flame className="mr-1 h-3 w-3" />
              {habit.streak_count}
            </Badge>

            {habit.prediction && (
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                <Brain className="mr-1 h-3 w-3" />
                {habit.prediction.probability_percent}
              </Badge>
            )}

            {habit.daysUntilPrediction && habit.daysUntilPrediction > 0 && (
              <Badge variant="outline" className="border-accent/30 text-muted-foreground">
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
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-xs">
            <Flame className="mr-1 h-3 w-3" />
            {habit.streak_count} streak
          </Badge>
          {habit.prediction && (
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-xs">
              <Brain className="mr-1 h-3 w-3" />
              {habit.prediction.probability_percent}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}