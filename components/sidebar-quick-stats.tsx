"use client";

import * as React from "react";
import { 
  Flame, 
  Target, 
  Zap,
  TrendingUp,
  Plus,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarQuickStatsProps {
  stats?: {
    tasksCompleted: number;
    totalTasks: number;
    habitsCompleted: number;
    totalHabits: number;
    focusMinutes: number;
    streak: number;
  };
}

export function SidebarQuickStats({ 
  stats = {
    tasksCompleted: 3,
    totalTasks: 8,
    habitsCompleted: 2,
    totalHabits: 5,
    focusMinutes: 45,
    streak: 7
  }
}: SidebarQuickStatsProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const taskProgress = stats.totalTasks > 0 
    ? Math.round((stats.tasksCompleted / stats.totalTasks) * 100) 
    : 0;
  
  const habitProgress = stats.totalHabits > 0 
    ? Math.round((stats.habitsCompleted / stats.totalHabits) * 100) 
    : 0;

  // Don't render when collapsed
  if (isCollapsed) return null;

  return (
    <div className="flex flex-col gap-3 px-3">
      {/* Today's Progress Card */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 p-3 border border-primary/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground">Today&apos;s Progress</span>
          <div className="flex items-center gap-1 text-xs text-primary">
            <Flame className="h-3 w-3" />
            <span className="font-semibold">{stats.streak} day streak</span>
          </div>
        </div>
        
        {/* Progress Ring Visualization */}
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 flex-shrink-0">
            <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                className="stroke-muted/30"
                strokeWidth="3"
              />
              {/* Progress circle */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                className="stroke-primary"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${taskProgress * 0.88} 88`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold">{taskProgress}%</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Tasks</span>
              <span className="font-medium">{stats.tasksCompleted}/{stats.totalTasks}</span>
            </div>
            <Progress value={taskProgress} className="h-1.5" />
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Habits</span>
              <span className="font-medium">{stats.habitsCompleted}/{stats.totalHabits}</span>
            </div>
            <Progress value={habitProgress} className="h-1.5" />
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="h-3 w-3 text-amber-500" />
            <span className="text-[10px] text-muted-foreground">Focus Time</span>
          </div>
          <p className="text-sm font-semibold">{stats.focusMinutes}m</p>
        </div>
        
        <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <span className="text-[10px] text-muted-foreground">Completion</span>
          </div>
          <p className="text-sm font-semibold">{taskProgress}%</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-8 text-xs gap-1.5 bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
          asChild
        >
          <Link href="/dashboard/tasks?new=true">
            <Plus className="h-3 w-3" />
            Add Task
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-8 text-xs gap-1.5 bg-background/50 hover:bg-accent/10 hover:text-accent hover:border-accent/30"
          asChild
        >
          <Link href="/dashboard/focus">
            <Play className="h-3 w-3" />
            Focus
          </Link>
        </Button>
      </div>

      {/* Subtle divider */}
      <div className="h-px bg-border/30" />
    </div>
  );
}
