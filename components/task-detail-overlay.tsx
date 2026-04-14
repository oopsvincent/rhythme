"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TaskDetailEditor from "@/components/task-detail-editor";
import { Task } from "@/types/database";
import { DialogTitle } from "@radix-ui/react-dialog";

interface TaskDetailOverlayProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailOverlay({
  task,
  open,
  onOpenChange,
}: TaskDetailOverlayProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!task || !open) return null;

  // =========================
  // DESKTOP → Dialog (Notion style)
  // =========================
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="
            w-full max-w-3xl
            p-0
            overflow-hidden
            border-border/50
            shadow-2xl
          "
        >
            <div className="hidden"><DialogTitle></DialogTitle></div>
          <div className="h-[85vh] overflow-y-auto">
            <TaskDetailEditor
              task={task}
              onClose={() => onOpenChange(false)}
              mode="page"
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // =========================
  // MOBILE → Bottom Drawer
  // =========================
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="
          h-[92vh]
          flex flex-col
          p-0
          overflow-hidden
        "
      >
        {/* Clean drag handle spacing */}
        <div className="py-2" />
        <div className="hidden"><DrawerTitle></DrawerTitle></div>
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <TaskDetailEditor
            task={task}
            onClose={() => onOpenChange(false)}
            mode="drawer"
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}