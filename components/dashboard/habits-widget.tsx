"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  Circle, 
  CircleDashed,
  Flame, 
  Loader2,
  Sparkles,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useHabits, useLogCompletion } from "@/hooks/use-habits";
import type { HabitWithStats } from "@/types/database";

export function HabitsWidget() {
  const { data: habits = [], isLoading, error } = useHabits();
  const logMutation = useLogCompletion();
  
  // Get today's daily habits only (max 4)
  const dailyHabits = habits
    .filter(h => h.frequency === "daily")
    .slice(0, 4);

  // Get weekly habits (max 2)
  const weeklyHabits = habits
    .filter(h => h.frequency === "weekly")
    .slice(0, 2);

  const completedCount = dailyHabits.filter(h => h.completedToday).length;
  const totalCount = dailyHabits.length;

  const handleComplete = (habit: HabitWithStats) => {
    if (habit.completedToday || habit.completedThisWeek) return;
    logMutation.mutate({ habitId: habit.habit_id });
  };

  // Don't render if no habits exist and not loading
  if (!isLoading && habits.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50">
        <div className="space-y-3">
          <div className="h-5 w-32 bg-muted/50 rounded animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-muted/30 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50"
    >
      {/* Daily Habits Section */}
      {dailyHabits.length > 0 && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-semibold font-primary text-sm">Today&apos;s Habits</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {completedCount}/{totalCount}
              </span>
              <Link 
                href="/dashboard/habits"
                className="text-xs text-primary font-medium hover:underline"
              >
                View all
              </Link>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-muted rounded-full mb-3 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>

          {/* Habits list */}
          <div className="space-y-2">
            {dailyHabits.map((habit, index) => (
              <motion.div
                key={habit.habit_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200",
                  "bg-muted/30 hover:bg-muted/50 group"
                )}
              >
                {/* Completion button */}
                <button
                  onClick={() => handleComplete(habit)}
                  disabled={logMutation.isPending || habit.completedToday}
                  className={cn(
                    "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                    habit.completedToday
                      ? "bg-primary text-primary-foreground"
                      : "border border-dashed border-border hover:border-primary hover:bg-primary/5"
                  )}
                >
                  {logMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : habit.completedToday ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </button>

                {/* Habit name */}
                <Link 
                  href="/dashboard/habits"
                  className={cn(
                    "flex-1 text-sm font-medium truncate transition-colors",
                    habit.completedToday && "line-through text-muted-foreground"
                  )}
                >
                  {habit.name}
                </Link>

                {/* Streak badge */}
                {habit.current_streak > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="shrink-0 bg-primary/10 text-primary border-0 text-xs px-2"
                  >
                    <Flame className="w-3 h-3 mr-1" />
                    {habit.current_streak}
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Weekly Habits Section */}
      {weeklyHabits.length > 0 && (
        <div className={dailyHabits.length > 0 ? "mt-4 pt-4 border-t border-border/30" : ""}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-accent" />
              <h3 className="font-semibold font-primary text-sm">This Week</h3>
            </div>
            <Link 
              href="/dashboard/habits/weekly"
              className="text-xs text-primary font-medium hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-2">
            {weeklyHabits.map((habit, index) => (
              <motion.div
                key={habit.habit_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200",
                  "bg-muted/30 hover:bg-muted/50 group"
                )}
              >
                {/* Completion button */}
                <button
                  onClick={() => handleComplete(habit)}
                  disabled={logMutation.isPending || habit.completedThisWeek}
                  className={cn(
                    "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                    habit.completedThisWeek
                      ? "bg-primary text-primary-foreground"
                      : "border border-dashed border-border hover:border-primary hover:bg-primary/5"
                  )}
                >
                  {logMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : habit.completedThisWeek ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <CircleDashed className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </button>

                {/* Habit name */}
                <Link 
                  href="/dashboard/habits/weekly"
                  className={cn(
                    "flex-1 text-sm font-medium truncate transition-colors",
                    habit.completedThisWeek && "line-through text-muted-foreground"
                  )}
                >
                  {habit.name}
                </Link>

                {/* Streak badge */}
                {habit.current_streak > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="shrink-0 bg-accent/10 text-accent border-0 text-xs px-2"
                  >
                    <Flame className="w-3 h-3 mr-1" />
                    {habit.current_streak}w
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for daily habits */}
      {dailyHabits.length === 0 && weeklyHabits.length === 0 && habits.length > 0 && (
        <p className="text-sm text-muted-foreground text-center py-3">
          No daily or weekly habits set up
        </p>
      )}
    </motion.div>
  );
}

