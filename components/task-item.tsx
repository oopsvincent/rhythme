"use client";

import { Status, Task, Priority } from "@/types/database";
import { useMotionValue, useTransform, animate, motion } from "framer-motion";
import { useState, useEffect, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
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
  Sparkles,
  Pencil,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // ── swipe ──────────────────────────────────────────────────────────────────
  const x = useMotionValue(0);
  const [dismissed, setDismissed] = useState(false);

  const completeOpacity = useTransform(x, [0, SWIPE_COMPLETE], [0, 1]);
  const deleteOpacity = useTransform(x, [SWIPE_DELETE, 0], [1, 0]);

  const handleDragEnd: NonNullable<ComponentProps<typeof motion.div>["onDragEnd"]> = (
    _,
    info
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
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border transition-all duration-200 shadow-sm",
        isCompleted
          ? "bg-muted/5 border-border/10 opacity-75"
          : "bg-card/45 border-border/20 dark:bg-card/10 hover:border-border/50 hover:bg-muted/10 hover:shadow"
      )}
    >
      {/* Swipe-right: complete */}
      <motion.div
        style={{ opacity: completeOpacity }}
        className="pointer-events-none absolute inset-0 flex items-center gap-2 px-4 bg-emerald-500/10 rounded-xl"
      >
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        <span className="text-xs font-medium text-emerald-400">
          {isCompleted ? "Mark pending" : "Complete"}
        </span>
      </motion.div>

      {/* Swipe-left: delete */}
      <motion.div
        style={{ opacity: deleteOpacity }}
        className="pointer-events-none absolute inset-0 flex items-center justify-end gap-2 px-4 bg-red-500/10 rounded-xl"
      >
        <span className="text-xs font-medium text-red-400">Delete</span>
        <Trash2 className="h-4 w-4 text-red-400" />
      </motion.div>

      {/* Row */}
      <motion.div
        style={{ x }}
        drag={isTouch ? "x" : false}
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.06}
        dragDirectionLock={true}
        onDragEnd={handleDragEnd}
        className="
          relative z-10 group flex items-start gap-3.5
          py-3 px-3.5 rounded-xl
          cursor-pointer transition-colors
          touch-pan-y select-none
        "
      >
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(task.task_id, isCompleted ? "pending" : "completed");
          }}
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0 rounded-lg border flex items-center justify-center transition-all",
            isCompleted
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "border-muted-foreground/35 hover:border-primary hover:bg-primary/5"
          )}
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin text-current" />
          ) : isCompleted ? (
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          ) : null}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0" onClick={onNavigate}>
          {/* Title */}
          <span
            className={cn(
              "block text-sm font-medium leading-snug text-foreground/90 transition-all",
              isCompleted && "line-through text-muted-foreground/60 opacity-60"
            )}
          >
            {task.title}
          </span>

          {/* Description */}
          {task.description && (
            <span className="block text-xs text-muted-foreground/75 mt-0.5 truncate">
              {task.description}
            </span>
          )}

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-semibold tracking-wide uppercase leading-none",
                PRIORITY_STYLES[task.priority]
              )}
            >
              {task.priority}
            </span>

            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-medium leading-none",
                statusMeta.className
              )}
            >
              {statusMeta.icon}
              {statusMeta.label}
            </span>

            {task.due_date && dueDateInfo && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-medium leading-none",
                  DUE_DATE_STYLES[dueDateInfo.type]
                )}
              >
                {dueDateInfo.type === "overdue" ? (
                  <AlertTriangle className="h-2.5 w-2.5" />
                ) : (
                  <Calendar className="h-2.5 w-2.5" />
                )}
                {dueDateInfo.label}
              </span>
            )}

            {renderSourceBadge(task.source)}
          </div>
        </div>

        {/* Actions */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity mt-0.5 shrink-0"
        >
          {/* Quick Edit */}
          <button
            onClick={onNavigate}
            title="Edit Details"
            className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors hidden md:flex"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>

          {/* Quick Delete */}
          <button
            onClick={onDelete}
            title="Delete Task"
            className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors hidden md:flex"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
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

// === Helper to Render Task Source Badge ===
function renderSourceBadge(source?: string) {
  const badgeBaseClass = "text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border flex items-center gap-1 w-fit select-none font-sans";
  
  if (source === "ai_generated") {
    return (
      <Badge
        variant="outline"
        className={`${badgeBaseClass} bg-primary/10 text-primary border-primary/20`}
      >
        <Sparkles className="h-2.5 w-2.5 text-primary" />
        Generated by Rhythmé
      </Badge>
    );
  }
  
  if (source === "user_edited") {
    return (
      <Badge
        variant="outline"
        className={`${badgeBaseClass} bg-primary/10 text-primary border-primary/20`}
      >
        <Sparkles className="h-2.5 w-2.5 text-primary" />
        Generated by Rhythmé
        <span className="inline-flex items-center text-[8px] text-muted-foreground/80 ml-0.5 gap-0.5">
          <Pencil className="h-2 w-2 text-muted-foreground/75" />
          (Edited)
        </span>
      </Badge>
    );
  }
  
  return (
    <Badge
      variant="outline"
      className={`${badgeBaseClass} bg-muted/30 text-muted-foreground border-border/50`}
    >
      <User className="h-2.5 w-2.5 text-muted-foreground" />
      Manual
    </Badge>
  );
}
