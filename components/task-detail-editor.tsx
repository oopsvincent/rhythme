"use client";

import { useState, useTransition, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Task, Priority, Status, UpdateTaskInput } from "@/types/database";
import { updateTask, deleteTask } from "@/app/actions/getTasks";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Save,
  X,
  Trash2,
  ArrowLeft,
  Loader2,
  Calendar,
  Flag,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DateNTimePicker } from "@/components/date-n-time-picker";
import { cn } from "@/lib/utils";

interface Props {
  task: Task;
  onClose?: () => void;
  mode?: "page" | "drawer";
}

const priorityOptions = [
  { value: "high", label: "High", color: "text-red-500" },
  { value: "medium", label: "Medium", color: "text-yellow-500" },
  { value: "low", label: "Low", color: "text-blue-500" },
] as const;

const statusOptions = [
  { value: "pending", label: "Pending", icon: <Clock className="w-4 h-4 text-muted-foreground" /> },
  { value: "in_progress", label: "In Progress", icon: <Loader2 className="w-4 h-4 text-purple-500" /> },
  { value: "completed", label: "Completed", icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
] as const;

export default function TaskDetailEditor({ task, onClose, mode = "page" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  // ================= STATE =================
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<Priority>(task.priority || "medium");
  const [status, setStatus] = useState<Status>(task.status || "pending");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.due_date ? new Date(task.due_date) : undefined
  );

  // ================= DIRTY CHECK =================
  const isDirty = useCallback(() => {
    return (
      title !== task.title ||
      description !== (task.description || "") ||
      priority !== (task.priority || "medium") ||
      status !== (task.status || "pending") ||
      (dueDate?.getTime() || null) !==
        (task.due_date ? new Date(task.due_date).getTime() : null)
    );
  }, [title, description, priority, status, dueDate, task]);

  const dirty = isDirty();

  // ================= SAVE =================
  const handleSave = () => {
    startTransition(async () => {
      const updates: UpdateTaskInput = {
        title,
        description: description || null,
        priority,
        status,
        due_date: dueDate?.toISOString() || null,
      };

      const res = await updateTask(task.task_id, updates);
      if (!res.error) {
        router.refresh();
        onClose?.();
    }
    });
  };

  // ================= DISCARD =================
  const handleDiscard = () => {
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority || "medium");
    setStatus(task.status || "pending");
    setDueDate(task.due_date ? new Date(task.due_date) : undefined);

    if (titleRef.current) titleRef.current.textContent = task.title;
    if (descriptionRef.current)
      descriptionRef.current.textContent = task.description || "";
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteTask(task.task_id);
    if (!res.error) {
      onClose?.();
      router.refresh();
    } else {
      setIsDeleting(false);
    }
  };

  // ================= BACK =================
  const handleBack = () => {
    if (dirty && !confirm("Discard changes?")) return;
    onClose?.();
  };

  const currentPriority =
    priorityOptions.find((p) => p.value === priority) || priorityOptions[1];

  const currentStatus =
    statusOptions.find((s) => s.value === status) || statusOptions[0];

  // ================= UI =================
  return (
    <div
      className={cn(
        "w-full",
        mode === "page" && "max-w-3xl mx-auto px-6 py-6",
        mode === "drawer" && "px-0 py-2"
      )}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between h-12 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-2 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2">
          {dirty && (
            <>
              <Button variant="ghost" size="sm" onClick={handleDiscard}>
                <X className="w-4 h-4 mr-1" />
                Discard
              </Button>
              <Button size="sm" onClick={handleSave}>
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                Save
              </Button>
            </>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 text-red-500" />
                )}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete task?</AlertDialogTitle>
                <AlertDialogDescription>
                  This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-4 space-y-6">
        {/* TITLE */}
        <h1
          ref={titleRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setTitle(e.currentTarget.textContent || "")}
          className={cn(
            "outline-none",
            mode === "page" && "text-3xl font-bold",
            mode === "drawer" && "text-2xl font-semibold px-4"
          )}
        >
          {task.title}
        </h1>

        {/* PROPERTIES */}
        <div className="space-y-2 px-4">
          {/* STATUS */}
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              {currentStatus.icon}
              Status
            </span>

            <Select value={status} onValueChange={(v: Status) => setStatus(v)}>
              <SelectTrigger className="border-none p-0 h-auto">
                {currentStatus.label}
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PRIORITY */}
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Flag className={`w-4 h-4 ${currentPriority.color}`} />
              Priority
            </span>

            <Select value={priority} onValueChange={(v: Priority) => setPriority(v)}>
              <SelectTrigger className="border-none p-0 h-auto">
                <span className={currentPriority.color}>
                  {currentPriority.label}
                </span>
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DATE */}
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Due Date
            </span>

            <div className="max-w-[220px]">
              <DateNTimePicker value={dueDate} onChange={setDueDate} />
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="px-4">
          <div
            ref={descriptionRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setDescription(e.currentTarget.textContent || "")}
            className="min-h-[120px] text-sm leading-relaxed outline-none whitespace-pre-wrap"
          >
            {task.description ? task.description : "Add a Description"}
          </div>
        </div>

        {/* META */}
        <div className="px-4 pt-4 border-t text-xs text-muted-foreground space-y-1">
          <p>Created {new Date(task.created_at).toLocaleString()}</p>
          <p>Updated {new Date(task.updated_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}