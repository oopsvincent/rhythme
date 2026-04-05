"use client";
import { useState, useMemo } from "react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  MoreVertical,
  Trash2,
  ChevronRight,
  Target,
  Calendar,
  AlertCircle,
  TrendingUp,
  ListTodo,
  PlayCircle,
  Filter,
  CalendarDays,
  Check,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Kbd } from "@/components/ui/kbd";
import { motion, AnimatePresence } from "framer-motion";
import type { Task, CreateTaskInput, Priority, Status } from "@/types/database";
import { DateNTimePicker } from "@/components/date-n-time-picker";
import {
  useTasks,
  useTaskStats,
  useTasksRealtime,
  useCreateTask,
  useDeleteTask,
  useUpdateTaskStatus,
  getPriorityColor,
  getStatusColor,
  getStatusLabel,
} from "@/hooks/use-tasks";

// Time frame filter options
type TimeFrame = "this_week" | "last_week" | "this_month" | "last_month" | "last_3_months" | "this_year" | "all";

const TIME_FRAME_OPTIONS: { value: TimeFrame; label: string; description: string }[] = [
  { value: "this_week", label: "This Week", description: "Tasks from the current week" },
  { value: "last_week", label: "Last Week", description: "Tasks from the previous week" },
  { value: "this_month", label: "This Month", description: "Tasks from the current month" },
  { value: "last_month", label: "Last Month", description: "Tasks from the previous month" },
  { value: "last_3_months", label: "Last 3 Months", description: "Tasks from the past quarter" },
  { value: "this_year", label: "This Year", description: "All tasks from this year" },
  { value: "all", label: "All Time", description: "Every task you've ever created" },
];

function getTimeFrameDateRange(timeFrame: TimeFrame): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  let start: Date;

  switch (timeFrame) {
    case "this_week": {
      start = new Date(now);
      const day = start.getDay();
      const diff = day === 0 ? 6 : day - 1; // Monday as start
      start.setDate(start.getDate() - diff);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "last_week": {
      const thisWeekStart = new Date(now);
      const day = thisWeekStart.getDay();
      const diff = day === 0 ? 6 : day - 1;
      thisWeekStart.setDate(thisWeekStart.getDate() - diff);
      end.setTime(thisWeekStart.getTime() - 1); // End of last week
      start = new Date(thisWeekStart);
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "this_month": {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "last_month": {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      monthEnd.setHours(23, 59, 59, 999);
      end.setTime(monthEnd.getTime());
      break;
    }
    case "last_3_months": {
      start = new Date(now);
      start.setMonth(start.getMonth() - 3);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "this_year": {
      start = new Date(now.getFullYear(), 0, 1);
      break;
    }
    case "all":
    default: {
      start = new Date(2000, 0, 1);
      break;
    }
  }

  return { start, end };
}

export default function TasksPage() {
  const router = useRouter();

  // React Query hooks
  const { data: tasks = [], isLoading, error } = useTasks();
  const { data: stats } = useTaskStats();

  // Realtime subscription
  useTasksRealtime();

  // Mutations
  const createMutation = useCreateTask();
  const deleteMutation = useDeleteTask();
  const statusMutation = useUpdateTaskStatus();

  // Local UI state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("this_week");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newTask, setNewTask] = useState<CreateTaskInput>({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    due_date: undefined,
  });

  // Filter tasks by time frame
  const filteredTasks = useMemo(() => {
    if (timeFrame === "all") return tasks;
    const { start, end } = getTimeFrameDateRange(timeFrame);
    return tasks.filter((task) => {
      const createdAt = new Date(task.created_at);
      return createdAt >= start && createdAt <= end;
    });
  }, [tasks, timeFrame]);

  const currentTimeFrameLabel = TIME_FRAME_OPTIONS.find((o) => o.value === timeFrame)?.label || "This Week";

  const isPending =
    createMutation.isPending ||
    deleteMutation.isPending ||
    statusMutation.isPending;

  const handleAddTask = () => {
    if (!newTask.title) return;
    createMutation.mutate(newTask, {
      onSuccess: () => {
        setNewTask({ title: "", description: "", priority: "medium", status: "pending", due_date: undefined });
        setIsAddDialogOpen(false);
        setShowAdvanced(false);
      },
    });
  };

  const handleStatusChange = (taskId: string, status: Status) => {
    statusMutation.mutate({ taskId, status });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteMutation.mutate(taskId);
  };

  const navigateToTask = (taskId: string) => {
    router.push(`/dashboard/tasks/${taskId}`);
  };

  // Group tasks by date (using created_at)
  const getDateKey = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = getDateKey(today.toISOString());

  // Group FILTERED tasks by their creation date
  const tasksByDate = filteredTasks.reduce<Record<string, typeof filteredTasks>>((acc, task) => {
    const key = getDateKey(task.created_at);
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  // Sort date keys: today first, then recent past, then future
  const sortedDateKeys = Object.keys(tasksByDate).sort((a, b) => {
    // Today always first
    if (a === todayKey) return -1;
    if (b === todayKey) return 1;
    // Then sort descending (most recent first)
    return b.localeCompare(a);
  });

  // Stats for the filtered view
  const filteredCompleted = filteredTasks.filter((t) => t.status === "completed").length;
  const filteredTotal = filteredTasks.length;
  const completionRate = filteredTotal > 0 ? (filteredCompleted / filteredTotal) * 100 : 0;
  const filteredInProgress = filteredTasks.filter((t) => t.status === "in_progress").length;

  // Due today count (from all tasks, not just filtered)
  const dueToday = stats?.dueToday || 0;

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
                  Tasks
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Manage and organize your tasks efficiently
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Time Frame Filter Trigger */}
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <DrawerTrigger asChild>
                    <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-all duration-200">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span className="hidden sm:inline">{currentTimeFrameLabel}</span>
                      <Filter className="h-3.5 w-3.5 text-muted-foreground sm:hidden" />
                    </button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle className="font-primary text-lg">Time Frame</DrawerTitle>
                      <DrawerDescription>Choose which tasks to display</DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-2">
                      <div className="space-y-1">
                        {TIME_FRAME_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setTimeFrame(option.value);
                              setIsDrawerOpen(false);
                            }}
                            className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                              timeFrame === option.value
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "hover:bg-muted/50 border border-transparent"
                            }`}
                          >
                            <div>
                              <p className="text-sm font-medium">{option.label}</p>
                              <p className="text-xs text-muted-foreground">{option.description}</p>
                            </div>
                            {timeFrame === option.value && (
                              <Check className="h-4 w-4 text-primary shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <button className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                          Close
                        </button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) {
                  setNewTask({ title: "", description: "", priority: "medium", status: "pending", due_date: undefined });
                  setShowAdvanced(false);
                }
              }}>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </button>
                </DialogTrigger>
                <DialogContent className="border-border sm:max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden">
                  <form onSubmit={(e) => { e.preventDefault(); handleAddTask(); }}>
                    <DialogHeader>
                      <DialogTitle className="font-primary text-xl">
                        Create New Task
                      </DialogTitle>
                      <DialogDescription className="sr-only">
                        Add a new task to your list
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label className="sr-only">Task Title</Label>
                        <Input
                          placeholder="What needs to be done?"
                          value={newTask.title}
                          onChange={(e) =>
                            setNewTask({ ...newTask, title: e.target.value })
                          }
                          className="w-full text-lg shadow-none font-medium h-12"
                          autoFocus
                        />
                      </div>

                      {showAdvanced ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                              Description{" "}
                              <span className="text-muted-foreground">(optional)</span>
                            </Label>
                            <Textarea
                              placeholder="Add details about this task..."
                              value={newTask.description || ""}
                              onChange={(e) =>
                                setNewTask({ ...newTask, description: e.target.value })
                              }
                              className="w-full min-h-[80px] resize-none"
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                              <Select
                                value={newTask.priority}
                                onValueChange={(value) =>
                                  setNewTask({ ...newTask, priority: value as Priority })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                              <Select
                                value={newTask.status}
                                onValueChange={(value) =>
                                  setNewTask({ ...newTask, status: value as Status })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Due Date</Label>
                            <DateNTimePicker 
                              value={newTask.due_date} 
                              onChange={(date) => setNewTask({ ...newTask, due_date: date })} 
                            />
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowAdvanced(true)}
                          className="text-xs text-muted-foreground hover:text-foreground h-8 px-2 inline-flex items-center"
                        >
                          + Advanced Options
                        </button>
                      )}
                    </div>
                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                      <div className="hidden sm:flex items-center text-xs text-muted-foreground">
                        <Kbd>Enter</Kbd>
                        <span className="ml-1.5">to save</span>
                      </div>
                      <div className="flex flex-col-reverse sm:flex-row gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                          onClick={() => setIsAddDialogOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                          disabled={createMutation.isPending || !newTask.title}
                        >
                          {createMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Create Task
                        </button>
                      </div>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              </div>
            </motion.div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center min-h-[300px]">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading tasks...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center min-h-[300px]">
                <div className="text-center text-destructive">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>Failed to load tasks</p>
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
                        Total Tasks
                      </CardDescription>
                      <CardTitle className="text-2xl md:text-3xl font-primary flex items-center gap-2">
                        <ListTodo className="h-5 w-5 text-accent" />
                        {filteredTotal}
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  <Card className="glass border-border/30">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs md:text-sm font-medium">
                        Completion Rate
                      </CardDescription>
                      <CardTitle className="text-2xl md:text-3xl font-primary">
                        {Math.round(completionRate)}%
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <Progress value={completionRate} className="h-1.5" />
                    </CardContent>
                  </Card>

                  <Card className="glass border-border/30">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs md:text-sm font-medium">
                        In Progress
                      </CardDescription>
                      <CardTitle className="text-2xl md:text-3xl font-primary flex items-center gap-2">
                        <PlayCircle className="h-5 w-5 text-primary" />
                        {filteredInProgress}
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  <Card className="glass border-border/30">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs md:text-sm font-medium">
                        Due Today
                      </CardDescription>
                      <CardTitle className="text-2xl md:text-3xl font-primary flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-destructive" />
                        {stats?.dueToday || 0}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </motion.div>

                {/* Empty State */}
                {tasks.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-12 text-center rounded-2xl"
                  >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center">
                      <Target className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-primary mb-2">No tasks yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Start organizing your work by creating your first task
                    </p>
                    <button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-lg"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Task
                    </button>
                  </motion.div>
                )}

                {/* Tasks by Date */}
                {tasks.length > 0 && (
                  <div className="space-y-8">
                    {sortedDateKeys.map((dateKey, groupIndex) => {
                      const dayTasks = tasksByDate[dateKey];
                      const isToday = dateKey === todayKey;
                      const dateObj = new Date(dateKey + "T00:00:00");
                      const yesterday = new Date(today);
                      yesterday.setDate(yesterday.getDate() - 1);
                      const isYesterday = getDateKey(yesterday.toISOString()) === dateKey;

                      const dayLabel = isToday
                        ? "Today"
                        : isYesterday
                        ? "Yesterday"
                        : dateObj.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          });

                      const dayCompleted = dayTasks.filter((t) => t.status === "completed").length;
                      const dayTotal = dayTasks.length;
                      const dayRate = dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : 0;

                      // Group within day by status
                      const dayInProgress = dayTasks.filter((t) => t.status === "in_progress");
                      const dayPending = dayTasks.filter((t) => t.status === "pending");
                      const dayDone = dayTasks.filter((t) => t.status === "completed");

                      return (
                        <motion.div
                          key={dateKey}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + groupIndex * 0.05 }}
                          className="space-y-4"
                        >
                          {/* Day Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                                isToday ? "bg-primary/10" : "bg-muted/50"
                              }`}>
                                <Calendar className={`h-4 w-4 ${
                                  isToday ? "text-primary" : "text-muted-foreground"
                                }`} />
                              </div>
                              <div>
                                <h2 className={`font-primary text-base ${
                                  isToday ? "text-foreground" : "text-muted-foreground"
                                }`}>
                                  {dayLabel}
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                  {dayCompleted}/{dayTotal} completed · {dayRate}%
                                </p>
                              </div>
                            </div>
                            <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                                style={{ width: `${dayRate}%` }}
                              />
                            </div>
                          </div>

                          {/* Day's tasks by status */}
                          <div className="space-y-3 pl-2 border-l-2 border-border/30 ml-4">
                            {dayInProgress.length > 0 && (
                              <TaskSection
                                title="In Progress"
                                icon={<PlayCircle className="h-4 w-4 text-primary" />}
                                tasks={dayInProgress}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDeleteTask}
                                onNavigate={navigateToTask}
                                isPending={isPending}
                                delay={0}
                              />
                            )}
                            {dayPending.length > 0 && (
                              <TaskSection
                                title="Pending"
                                icon={<Circle className="h-4 w-4 text-muted-foreground" />}
                                tasks={dayPending}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDeleteTask}
                                onNavigate={navigateToTask}
                                isPending={isPending}
                                delay={0}
                              />
                            )}
                            {dayDone.length > 0 && (
                              <TaskSection
                                title="Completed"
                                icon={<CheckCircle2 className="h-4 w-4 text-accent" />}
                                tasks={dayDone}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDeleteTask}
                                onNavigate={navigateToTask}
                                isPending={isPending}
                                delay={0}
                              />
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
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

// === Task Section Component ===
function TaskSection({
  title,
  icon,
  tasks,
  onStatusChange,
  onDelete,
  onNavigate,
  isPending,
  delay,
}: {
  title: string;
  icon: React.ReactNode;
  tasks: Task[];
  onStatusChange: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
  onNavigate: (id: string) => void;
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
        {icon}
        <h2 className="text-lg font-primary">{title}</h2>
        <Badge variant="secondary" className="text-xs">
          {tasks.length}
        </Badge>
      </div>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
            <TaskItem
              key={task.task_id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={() => onDelete(task.task_id)}
              onNavigate={() => onNavigate(task.task_id)}
              isPending={isPending}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// === Task Item Component ===
function TaskItem({
  task,
  onStatusChange,
  onDelete,
  onNavigate,
  isPending,
  index,
}: {
  task: Task;
  onStatusChange: (id: string, status: Status) => void;
  onDelete: () => void;
  onNavigate: () => void;
  isPending: boolean;
  index: number;
}) {
  const isCompleted = task.status === "completed";
  
  // Calculate due date info
  const getDueDateInfo = () => {
    if (!task.due_date || isCompleted) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { label: "Overdue", type: "overdue" as const, days: Math.abs(diffDays) };
    } else if (diffDays === 0) {
      return { label: "Due Today", type: "today" as const, days: 0 };
    } else if (diffDays <= 3) {
      return { label: `Due in ${diffDays}d`, type: "soon" as const, days: diffDays };
    }
    return { label: null, type: "normal" as const, days: diffDays };
  };
  
  const dueDateInfo = getDueDateInfo();
  const isOverdue = dueDateInfo?.type === "overdue";

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
          {/* Status Toggle Button */}
          <button
            onClick={() =>
              onStatusChange(
                task.task_id,
                isCompleted ? "pending" : "completed"
              )
            }
            disabled={isPending}
            className={`shrink-0 h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isCompleted
                ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                : "border-2 border-dashed border-border hover:border-primary hover:bg-primary/5"
            }`}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isCompleted ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0 cursor-pointer" onClick={onNavigate}>
            <div className="flex items-center gap-2">
              <h3
                className={`font-medium ${
                  isCompleted ? "text-muted-foreground opacity-60" : ""
                }`}
              >
                {task.title}
              </h3>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {task.description}
              </p>
            )}
          </div>

          {/* Badges */}
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>

            {task.due_date && (
              <Badge
                variant="outline"
                className={
                  dueDateInfo?.type === "overdue"
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : dueDateInfo?.type === "today"
                    ? "bg-primary/10 text-primary border-primary/20"
                    : dueDateInfo?.type === "soon"
                    ? "bg-accent/10 text-accent border-accent/20"
                    : "border-border/50"
                }
              >
                <Calendar className="mr-1 h-3 w-3" />
                {dueDateInfo?.label || new Date(task.due_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
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
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={onNavigate}>
                <Target className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onStatusChange(task.task_id, "pending")}
                disabled={task.status === "pending"}
              >
                <Circle className="mr-2 h-4 w-4" />
                Set Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(task.task_id, "in_progress")}
                disabled={task.status === "in_progress"}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Set In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(task.task_id, "completed")}
                disabled={task.status === "completed"}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Set Completed
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
          <Badge variant="outline" className={`${getPriorityColor(task.priority)} text-xs`}>
            {task.priority}
          </Badge>
          {task.due_date && (
            <Badge
              variant="outline"
              className={`text-xs ${
                dueDateInfo?.type === "overdue"
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : dueDateInfo?.type === "today"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : dueDateInfo?.type === "soon"
                  ? "bg-accent/10 text-accent border-accent/20"
                  : "border-border/50"
              }`}
            >
              <Calendar className="mr-1 h-3 w-3" />
              {dueDateInfo?.label || new Date(task.due_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
