"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Circle,
  Loader2,
  Calendar,
  Clock,
  Target,
  Trash2,
  Save,
  PlayCircle,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Task, Priority, Status, UpdateTaskInput } from "@/types/database";
import {
  useTask,
  useUpdateTask,
  useDeleteTask,
  useUpdateTaskStatus,
  getPriorityColor,
  getStatusColor,
  getStatusLabel,
} from "@/hooks/use-tasks";
import { useState, useEffect } from "react";

interface TaskDetailClientProps {
  taskId: string;
}

export function TaskDetailClient({ taskId }: TaskDetailClientProps) {
  const router = useRouter();
  const { data: task, isLoading, error } = useTask(taskId);
  
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();
  const statusMutation = useUpdateTaskStatus();

  // Local form state
  const [formData, setFormData] = useState<UpdateTaskInput>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Sync form with task data
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        due_date: task.due_date,
      });
    }
  }, [task]);

  const handleFieldChange = (field: keyof UpdateTaskInput, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!task) return;
    updateMutation.mutate(
      { taskId: task.task_id, updates: formData },
      {
        onSuccess: () => {
          setHasChanges(false);
        },
      }
    );
  };

  const handleStatusChange = (status: Status) => {
    if (!task) return;
    statusMutation.mutate({ taskId: task.task_id, status });
  };

  const handleDelete = () => {
    if (!task) return;
    deleteMutation.mutate(task.task_id, {
      onSuccess: () => {
        router.push("/dashboard/tasks");
      },
    });
  };

  const isPending = updateMutation.isPending || deleteMutation.isPending || statusMutation.isPending;

  if (isLoading) {
    return (
      <>
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (error || !task) {
    return (
      <>
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
            <p className="text-destructive">Task not found</p>
            <button
              onClick={() => router.push("/dashboard/tasks")}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to Tasks
            </button>
          </div>
        </div>
      </>
    );
  }

  const isCompleted = task.status === "completed";
  const isOverdue =
    task.due_date &&
    new Date(task.due_date) < new Date() &&
    task.status !== "completed";

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col px-4 md:px-10 pb-8">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-6 py-6 max-w-3xl mx-auto w-full">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.push("/dashboard/tasks")}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </motion.button>

            {/* Header Card */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass border-border/30">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() =>
                            handleStatusChange(isCompleted ? "pending" : "completed")
                          }
                          disabled={isPending}
                          className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                            isCompleted
                              ? "bg-accent text-accent-foreground"
                              : "border-2 border-dashed border-border hover:border-primary"
                          }`}
                        >
                          {statusMutation.isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : isCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </button>
                        <div>
                          <CardTitle className="text-xl md:text-2xl font-primary">
                            {task.title}
                          </CardTitle>
                          <CardDescription>
                            Created {new Date(task.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <Badge variant="outline" className={getStatusColor(task.status)}>
                          {getStatusLabel(task.status)}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority} priority
                        </Badge>
                        {isOverdue && (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {hasChanges && (
                        <button
                          onClick={handleSave}
                          disabled={updateMutation.isPending}
                          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          {updateMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          Save
                        </button>
                      )}
                      <button
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="inline-flex items-center justify-center rounded-xl border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent className="sm:max-w-md border-border/10">
                <DialogHeader>
                  <DialogTitle className="font-primary text-xl text-destructive">
                    Delete Task
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <button
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-lg bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete Task
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg font-primary">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Title</Label>
                    <Input
                      value={formData.title || ""}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      placeholder="Task title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Description</Label>
                    <Textarea
                      value={formData.description || ""}
                      onChange={(e) => handleFieldChange("description", e.target.value)}
                      placeholder="Add details about this task..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleFieldChange("status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => handleFieldChange("priority", value)}
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
                      <Label className="text-sm font-medium">Due Date</Label>
                      <Input
                        type="date"
                        value={formData.due_date?.split("T")[0] || ""}
                        onChange={(e) =>
                          handleFieldChange("due_date", e.target.value || null)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Timestamps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg font-primary flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span>{new Date(task.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span>{new Date(task.updated_at).toLocaleString()}</span>
                    </div>
                    {task.completed_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completed</span>
                        <span className="text-accent">
                          {new Date(task.completed_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
