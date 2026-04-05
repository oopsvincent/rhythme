"use client";

import { Target } from "lucide-react";

export function WorkspaceGoal({
  goal,
}: {
  goal?: {
    title: string;
    description?: string;
  } | null;
}) {
  if (!goal) return null;

  return (
    <div className="px-2 my-2">
      <div className="flex flex-col gap-1 px-3 py-3 rounded-xl bg-sidebar-accent/30 border border-sidebar-border shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Target className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Workspace Goal
          </span>
        </div>

        <h4 className="text-sm font-semibold leading-snug text-sidebar-foreground">
          {goal.title}
        </h4>

        {goal.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
            {goal.description}
          </p>
        )}
      </div>
    </div>
  );
}
