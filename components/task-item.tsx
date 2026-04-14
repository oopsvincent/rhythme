"use client";

import { Status, Task, Priority } from "@/types/database";
import { useMotionValue, useTransform, animate, motion } from "framer-motion";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Check,
  Loader2,
  Circle,
  PlayCircle,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Trash2,
} from "lucide-react";

// ─── Due date logic ────────────────────────────────────────────────────────────

function getDueDateInfo(task: Task) {
  if (!task.due_date || task.status === "completed") return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.due_date);
  due.setHours(0, 0, 0, 0);

  const diff = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);

  if (diff < 0)
    return {
      label: diff === -1 ? "Yesterday" : `${Math.abs(diff)}d overdue`,
      type: "overdue" as const,
    };
  if (diff === 0) return { label: "Due today", type: "today" as const };
  if (diff === 1) return { label: "Tomorrow", type: "soon" as const };
  if (diff <= 3) return { label: `${diff} days`, type: "soon" as const };

  return {
    label: due.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    type: "normal" as const,
  };
}

// ─── Badge styles ──────────────────────────────────────────────────────────────

const PRIORITY_STYLES: Record<Priority, string> = {
  high: "bg-red-500/10 text-red-500 border border-red-500/20",
  medium: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  low: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
};

const STATUS_META: Record<
  string,
  { className: string; icon: React.ReactNode; label: string }
> = {
  pending: {
    className: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
    icon: <Circle className="h-2.5 w-2.5" />,
    label: "Pending",
  },
  in_progress: {
    className: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    icon: <PlayCircle className="h-2.5 w-2.5" />,
    label: "In Progress",
  },
  completed: {
    className:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    icon: <CheckCircle2 className="h-2.5 w-2.5" />,
    label: "Completed",
  },
};

const DUE_DATE_STYLES = {
  overdue: "bg-red-500/10 text-red-400 border border-red-500/20",
  today: "bg-primary/10 text-primary border border-primary/20",
  soon: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  normal: "bg-muted/50 text-muted-foreground border border-border/40",
};

// ─── Swipe thresholds ──────────────────────────────────────────────────────────

const SWIPE_COMPLETE = 72;
const SWIPE_DELETE = -72;

// ─── Component ─────────────────────────────────────────────────────────────────

export default function TaskItem({
  task,
  onStatusChange,
  onDelete,
  onNavigate,
  isPending,
}: {
  task: Task;
  onStatusChange: (id: string, status: Status) => void;
  onDelete: () => void;
  onNavigate: () => void;
  isPending: boolean;
}) {
  const isCompleted = task.status === "completed";
  const dueDateInfo = getDueDateInfo(task);
  const statusMeta = STATUS_META[task.status] ?? STATUS_META.pending;

  // ── swipe ──────────────────────────────────────────────────────────────────
  const x = useMotionValue(0);
  const [dismissed, setDismissed] = useState(false);

  const completeOpacity = useTransform(x, [0, SWIPE_COMPLETE], [0, 1]);
  const deleteOpacity = useTransform(x, [SWIPE_DELETE, 0], [1, 0]);

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const { offset, velocity } = info;

    if (offset.x > SWIPE_COMPLETE || velocity.x > 500) {
      animate(x, 300, { duration: 0.18 });
      setTimeout(() => {
        onStatusChange(task.task_id, isCompleted ? "pending" : "completed");
        animate(x, 0, { type: "spring", stiffness: 300, damping: 28 });
      }, 160);
    } else if (offset.x < SWIPE_DELETE || velocity.x < -500) {
      animate(x, -400, { duration: 0.18 });
      setDismissed(true);
      setTimeout(onDelete, 200);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 28 });
    }
  };

  if (dismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-md">
      {/* Swipe-right: complete */}
      <motion.div
        style={{ opacity: completeOpacity }}
        className="pointer-events-none absolute inset-0 flex items-center gap-2 px-4 bg-emerald-500/15 rounded-md"
      >
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        <span className="text-xs font-medium text-emerald-400">
          {isCompleted ? "Mark pending" : "Complete"}
        </span>
      </motion.div>

      {/* Swipe-left: delete */}
      <motion.div
        style={{ opacity: deleteOpacity }}
        className="pointer-events-none absolute inset-0 flex items-center justify-end gap-2 px-4 bg-red-500/15 rounded-md"
      >
        <span className="text-xs font-medium text-red-400">Delete</span>
        <Trash2 className="h-4 w-4 text-red-400" />
      </motion.div>

      {/* Row */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.12}
        onDragEnd={handleDragEnd as any}
        className="
          relative z-10 group flex items-start gap-3
          py-2.5 px-2 rounded-md
          cursor-pointer transition-colors hover:bg-muted/40
          touch-pan-y select-none
        "
      >
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(task.task_id, isCompleted ? "pending" : "completed");
          }}
          className={`
            mt-0.5 h-5 w-5 shrink-0 rounded border flex items-center justify-center
            transition-all
            ${
              isCompleted
                ? "bg-primary text-primary-foreground border-primary"
                : "border-muted-foreground/40 hover:border-primary"
            }
          `}
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : isCompleted ? (
            <Check className="h-3 w-3" />
          ) : null}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0" onClick={onNavigate}>
          {/* Title */}
          <span
            className={`block text-sm leading-snug ${
              isCompleted ? "line-through text-muted-foreground opacity-60" : ""
            }`}
          >
            {task.title}
          </span>

          {/* Description */}
          {task.description && (
            <span className="block text-xs text-muted-foreground mt-0.5 truncate">
              {task.description}
            </span>
          )}

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span
              className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                PRIORITY_STYLES[task.priority]
              }`}
            >
              {task.priority}
            </span>

            <span
              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium leading-none ${statusMeta.className}`}
            >
              {statusMeta.icon}
              {statusMeta.label}
            </span>

            {task.due_date && dueDateInfo && (
              <span
                className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium leading-none ${
                  DUE_DATE_STYLES[dueDateInfo.type]
                }`}
              >
                {dueDateInfo.type === "overdue" ? (
                  <AlertTriangle className="h-2.5 w-2.5" />
                ) : (
                  <Calendar className="h-2.5 w-2.5" />
                )}
                {dueDateInfo.label}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="md:opacity-0 md:group-hover:opacity-100 transition-opacity mt-0.5"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={onNavigate}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onStatusChange(
                    task.task_id,
                    isCompleted ? "pending" : "completed"
                  )
                }
              >
                Toggle Complete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(task.task_id, "in_progress")}
                disabled={task.status === "in_progress"}
              >
                Set In Progress
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
      </motion.div>
    </div>
  );
}