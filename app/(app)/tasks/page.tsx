"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { SiteHeader } from "@/components/site-header";
import { TaskDetailOverlay } from "@/components/task-detail-overlay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  AlertCircle,
  Plus,
  Calendar,
  ListTodo,
  PlayCircle,
  Target,
  Check,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Task, CreateTaskInput, Status, Priority } from "@/types/database";
import { DateNTimePicker } from "@/components/date-n-time-picker";
import { Kbd } from "@/components/ui/kbd";
import {
  useTasks,
  useTaskStats,
  useTasksRealtime,
  useCreateTask,
  useDeleteTask,
  useUpdateTaskStatus,
} from "@/hooks/use-tasks";
import TaskItem from "@/components/task-item";
import { useMediaQuery } from "@/hooks/use-media-query";

// ─── Types ────────────────────────────────────────────────────────────────────

type TimeFrame =
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"
  | "last_3_months"
  | "this_year"
  | "all";

const TIME_FRAME_OPTIONS: { value: TimeFrame; label: string }[] = [
  { value: "this_week", label: "This Week" },
  { value: "last_week", label: "Last Week" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "last_3_months", label: "Last 3 Months" },
  { value: "this_year", label: "This Year" },
  { value: "all", label: "All Time" },
];

// ─── Date filtering ───────────────────────────────────────────────────────────

function getTimeFrameDateRange(timeFrame: TimeFrame) {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  let start: Date;

  switch (timeFrame) {
    case "this_week": {
      start = new Date(now);
      const d = start.getDay();
      start.setDate(start.getDate() - (d === 0 ? 6 : d - 1));
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "last_week": {
      const ws = new Date(now);
      const d = ws.getDay();
      ws.setDate(ws.getDate() - (d === 0 ? 6 : d - 1));
      end.setTime(ws.getTime() - 1);
      start = new Date(ws);
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "this_month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "last_month":
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end.setTime(new Date(now.getFullYear(), now.getMonth(), 0).getTime());
      break;
    case "last_3_months":
      start = new Date(now);
      start.setMonth(start.getMonth() - 3);
      start.setHours(0, 0, 0, 0);
      break;
    case "this_year":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(2000, 0, 1);
  }

  return { start, end };
}

// ─── Date label helpers ───────────────────────────────────────────────────────

function getDateKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateGroupLabel(dateKey: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const d = new Date(dateKey + "T00:00:00");
  d.setHours(0, 0, 0, 0);

  const diff = Math.round((today.getTime() - d.getTime()) / 86_400_000);

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";

  // Older — show a readable date
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function isTaskOverdue(task: Task) {
  if (!task.due_date || task.status === "completed") return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(task.due_date);
  due.setHours(0, 0, 0, 0);

  return due < today;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: tasks = [], isLoading, error } = useTasks();
  const { data: stats } = useTaskStats();
  useTasksRealtime();

  const createMutation = useCreateTask();
  const deleteMutation = useDeleteTask();
  const statusMutation = useUpdateTaskStatus();

  // ── state ──────────────────────────────────────────────────────────────────
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(() => {
    if (typeof window === "undefined") return "this_week";
    return (sessionStorage.getItem("task_timeframe") as TimeFrame) || "this_week";
  });

  const [newTask, setNewTask] = useState<CreateTaskInput>({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    due_date: undefined,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    sessionStorage.setItem("task_timeframe", timeFrame);
  }, [timeFrame]);

  // ── filter + group ─────────────────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    if (timeFrame === "all") return tasks;
    const { start, end } = getTimeFrameDateRange(timeFrame);
    return tasks.filter((t) => {
      const d = new Date(t.created_at);
      return d >= start && d <= end;
    });
  }, [tasks, timeFrame]);

  const overdueTasks = useMemo(
    () =>
      tasks
        .filter(isTaskOverdue)
        .sort((a, b) => {
          const dueDiff =
            new Date(a.due_date ?? 0).getTime() -
            new Date(b.due_date ?? 0).getTime();

          if (dueDiff !== 0) return dueDiff;

          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }),
    [tasks]
  );

  const regularFilteredTasks = useMemo(() => {
    const overdueTaskIds = new Set(overdueTasks.map((task) => task.task_id));
    return filteredTasks.filter((task) => !overdueTaskIds.has(task.task_id));
  }, [filteredTasks, overdueTasks]);

  const tasksByDate = useMemo(() => {
    return regularFilteredTasks.reduce<Record<string, Task[]>>((acc, task) => {
      const key = getDateKey(task.created_at);
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {});
  }, [regularFilteredTasks]);

  const sortedDateKeys = useMemo(
    () =>
      Object.keys(tasksByDate).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      ),
    [tasksByDate]
  );

  // ── stats ──────────────────────────────────────────────────────────────────
  const filteredTotal = filteredTasks.length;
  const filteredCompleted = filteredTasks.filter((t) => t.status === "completed").length;
  const filteredInProgress = filteredTasks.filter((t) => t.status === "in_progress").length;
  const completionRate = filteredTotal > 0 ? (filteredCompleted / filteredTotal) * 100 : 0;

  const currentTimeFrameLabel =
    TIME_FRAME_OPTIONS.find((o) => o.value === timeFrame)?.label ?? "This Week";

  const isPending =
    createMutation.isPending || deleteMutation.isPending || statusMutation.isPending;

  // ── actions ────────────────────────────────────────────────────────────────
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    createMutation.mutate(newTask, {
      onSuccess: () => {
        setNewTask({ title: "", description: "", priority: "medium", status: "pending", due_date: undefined });
        setIsAddDialogOpen(false);
        setShowAdvanced(false);
      },
    });
  };

  const handleAddInline = () => {
    if (!newTask.title.trim()) return;
    createMutation.mutate(newTask, {
      onSuccess: () =>
        setNewTask({ title: "", description: "", priority: "medium", status: "pending", due_date: undefined }),
    });
  };

  const handleStatusChange = (taskId: string, status: Status) =>
    statusMutation.mutate({ taskId, status });

  const handleDeleteTask = (taskId: string) => deleteMutation.mutate(taskId);

  const navigateToTask = (taskId: string) =>
    setSelectedTask(tasks.find((t) => t.task_id === taskId) ?? null);

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <SiteHeader />

      <div className="px-4 md:px-10 pb-28 md:pb-10">

        {/* ── Header ── */}
        <motion.div
          className="flex items-center justify-between py-4"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Tasks</h1>
            <p className="text-xs text-muted-foreground">
              Manage and organize your work
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Time frame picker */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {currentTimeFrameLabel}
                  <span className="text-xs opacity-50">▾</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {TIME_FRAME_OPTIONS.map((o) => (
                  <DropdownMenuItem
                    key={o.value}
                    onClick={() => setTimeFrame(o.value)}
                    className="flex items-center justify-between gap-4"
                  >
                    {o.label}
                    {timeFrame === o.value && <Check className="h-3.5 w-3.5 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add task (desktop dialog) */}
            {isDesktop && (
              <Dialog
                open={isAddDialogOpen}
                onOpenChange={(open) => {
                  setIsAddDialogOpen(open);
                  if (!open) {
                    setNewTask({ title: "", description: "", priority: "medium", status: "pending", due_date: undefined });
                    setShowAdvanced(false);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    <Plus className="h-4 w-4" />
                    Add Task
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                  <form onSubmit={(e) => { e.preventDefault(); handleAddTask(); }}>
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold">
                        New Task
                      </DialogTitle>
                      <DialogDescription className="sr-only">
                        Create a new task
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <Input
                        placeholder="What needs to be done?"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="text-base h-11 shadow-none"
                        autoFocus
                      />

                      {showAdvanced ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                          <Textarea
                            placeholder="Add details..."
                            value={newTask.description ?? ""}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            rows={3}
                            className="resize-none"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground">Priority</Label>
                              <Select
                                value={newTask.priority}
                                onValueChange={(v) => setNewTask({ ...newTask, priority: v as Priority })}
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
                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground">Status</Label>
                              <Select
                                value={newTask.status}
                                onValueChange={(v) => setNewTask({ ...newTask, status: v as Status })}
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
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Due Date</Label>
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
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          + Advanced options
                        </button>
                      )}
                    </div>

                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
                      <div className="hidden sm:flex items-center text-xs text-muted-foreground">
                        <Kbd>Enter</Kbd>
                        <span className="ml-1.5">to save</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddDialogOpen(false)}
                          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={createMutation.isPending || !newTask.title}
                          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          {createMutation.isPending && (
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                          )}
                          Create
                        </button>
                      </div>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </motion.div>

        {/* ── Stats strip ── */}
        {!isLoading && !error && (
          <motion.div
            className="grid grid-cols-4 gap-3 mb-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            {/* Total */}
            <div className="col-span-2 md:col-span-1 rounded-xl border border-border/40 bg-card/50 p-3">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <ListTodo className="h-3 w-3" /> Total
              </p>
              <p className="text-2xl font-semibold">{filteredTotal}</p>
            </div>

            {/* Completion */}
            <div className="col-span-2 md:col-span-1 rounded-xl border border-border/40 bg-card/50 p-3">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Done
              </p>
              <p className="text-2xl font-semibold">{Math.round(completionRate)}%</p>
              <Progress value={completionRate} className="h-1 mt-1.5" />
            </div>

            {/* In progress */}
            <div className="col-span-2 md:col-span-1 rounded-xl border border-border/40 bg-card/50 p-3">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <PlayCircle className="h-3 w-3" /> Active
              </p>
              <p className="text-2xl font-semibold">{filteredInProgress}</p>
            </div>

            {/* Due today */}
            <div className="col-span-2 md:col-span-1 rounded-xl border border-border/40 bg-card/50 p-3">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Due today
              </p>
              <p className="text-2xl font-semibold">{stats?.dueToday ?? 0}</p>
            </div>
          </motion.div>
        )}

        {/* ── Desktop inline input ── */}
        {isDesktop && (
          <div className="flex items-center gap-3 border-b border-border/40 pb-2 mb-4">
            <div className="h-5 w-5 shrink-0 rounded border border-muted-foreground/30" />
            <input
              ref={inputRef}
              placeholder="Add a task and press Enter..."
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddInline(); }}
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/50"
            />
          </div>
        )}

        {/* ── Loading ── */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-destructive gap-2">
            <AlertCircle className="h-6 w-6" />
            <p className="text-sm">Failed to load tasks</p>
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && !error && tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Target className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No tasks yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Start organizing your work by creating your first task
            </p>
            <button
              onClick={() =>
                isDesktop ? inputRef.current?.focus() : setIsAddDialogOpen(true)
              }
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create your first task
            </button>
          </motion.div>
        )}

        {!isLoading && !error && tasks.length > 0 && filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Target className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">
              No tasks in {currentTimeFrameLabel}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Nothing matches this filter right now. Overdue tasks still stay visible below so you can catch up.
            </p>
          </motion.div>
        )}

        {/* ── Task list ── */}
        {!isLoading && !error && tasks.length > 0 && (
          <div className="space-y-6">
            <AnimatePresence>
              {overdueTasks.length > 0 && (
                <motion.div
                  key="overdue"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-1 px-1">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-destructive/80">
                      Overdue
                    </h2>
                    <span className="text-xs text-muted-foreground/50">
                      {overdueTasks.length}
                    </span>
                  </div>

                  <div>
                    <AnimatePresence mode="popLayout">
                      {overdueTasks.map((task) => (
                        <TaskItem
                          key={task.task_id}
                          task={task}
                          onStatusChange={handleStatusChange}
                          onDelete={() => handleDeleteTask(task.task_id)}
                          onNavigate={() => navigateToTask(task.task_id)}
                          isPending={isPending}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {sortedDateKeys.map((dateKey, i) => {
                const dayTasks = tasksByDate[dateKey];
                const label = formatDateGroupLabel(dateKey);
                const dayCompleted = dayTasks.filter((t) => t.status === "completed").length;

                return (
                  <motion.div
                    key={dateKey}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    {/* Date group header */}
                    <div className="flex items-center justify-between mb-1 px-1">
                      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                        {label}
                      </h2>
                      <span className="text-xs text-muted-foreground/50">
                        {dayCompleted}/{dayTasks.length}
                      </span>
                    </div>

                    {/* Tasks */}
                    <div>
                      <AnimatePresence mode="popLayout">
                        {dayTasks.map((task) => (
                          <TaskItem
                            key={task.task_id}
                            task={task}
                            onStatusChange={handleStatusChange}
                            onDelete={() => handleDeleteTask(task.task_id)}
                            onNavigate={() => navigateToTask(task.task_id)}
                            isPending={isPending}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Mobile FAB + sticky input ── */}
      {!isDesktop && (
        <>
          {/* Sticky bottom input bar */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border/40 px-4 py-3 flex items-center gap-3">
            <div className="h-5 w-5 shrink-0 rounded border border-muted-foreground/30" />
            <input
              ref={inputRef}
              placeholder="Add a task..."
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddInline(); }}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/50"
            />
            <AnimatePresence>
              {newTask.title && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleAddInline}
                  className="text-sm font-medium text-primary"
                >
                  Add
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Task detail overlay */}
      <TaskDetailOverlay
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />
    </>
  );
}
