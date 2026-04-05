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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Kbd } from "@/components/ui/kbd";
import { motion, AnimatePresence } from "framer-motion";
import type { Task, CreateTaskInput, Priority, Status } from "@/types/database";
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
  const [newTask, setNewTask] = useState<CreateTaskInput>({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
  });

  const isPending =
    createMutation.isPending ||
    deleteMutation.isPending ||
    statusMutation.isPending;

  const handleAddTask = () => {
    if (!newTask.title) return;
    createMutation.mutate(newTask, {
      onSuccess: () => {
        setNewTask({ title: "", description: "", priority: "medium", status: "pending" });
        setIsAddDialogOpen(false);
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

  // Group tasks by status
  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  // Calculate stats
  const completionRate = stats?.total ? (stats.completed / stats.total) * 100 : 0;

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
                  Tasks
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Manage and organize your tasks efficiently
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </button>
                </DialogTrigger>
                <DialogContent className="border-border sm:max-w-md">
                  <form onSubmit={(e) => { e.preventDefault(); handleAddTask(); }}>
                    <DialogHeader>
                      <DialogTitle className="font-primary text-xl">
                        Create New Task
                      </DialogTitle>
                      <DialogDescription>
                        Add a new task to your list
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Task Title</Label>
                        <Input
                          placeholder="e.g., Complete project report"
                          value={newTask.title}
                          onChange={(e) =>
                            setNewTask({ ...newTask, title: e.target.value })
                          }
                          autoFocus
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Description{" "}
                          <span className="text-muted-foreground">(optional)</span>
                        </Label>
                        <Textarea
                          placeholder="Add details about this task..."
                          value={newTask.description}
                          onChange={(e) =>
                            setNewTask({ ...newTask, description: e.target.value })
                          }
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Priority</Label>
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
                          <Label className="text-sm font-medium">Status</Label>
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
                        {stats?.total || 0}
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
                        {stats?.in_progress || 0}
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

                {/* Tasks by Status */}
                {tasks.length > 0 && (
                  <div className="space-y-6">
                    {inProgressTasks.length > 0 && (
                      <TaskSection
                        title="In Progress"
                        icon={<PlayCircle className="h-4 w-4 text-primary" />}
                        tasks={inProgressTasks}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteTask}
                        onNavigate={navigateToTask}
                        isPending={isPending}
                        delay={0.2}
                      />
                    )}

                    {pendingTasks.length > 0 && (
                      <TaskSection
                        title="Pending"
                        icon={<Circle className="h-4 w-4 text-muted-foreground" />}
                        tasks={pendingTasks}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteTask}
                        onNavigate={navigateToTask}
                        isPending={isPending}
                        delay={0.3}
                      />
                    )}

                    {completedTasks.length > 0 && (
                      <TaskSection
                        title="Completed"
                        icon={<CheckCircle2 className="h-4 w-4 text-accent" />}
                        tasks={completedTasks}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteTask}
                        onNavigate={navigateToTask}
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
