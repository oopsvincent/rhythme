"use client";

import { useMemo } from "react";
import { useHabits } from "@/hooks/use-habits";
import { CheckCircle2, Circle, Activity } from "lucide-react";
import { HabitWithStats, HabitLog } from "@/types/database";

interface DailyActivityInspectorProps {
  selectedDate: Date;
}

export function DailyActivityInspector({ selectedDate }: DailyActivityInspectorProps) {
  const { data: habits = [], isLoading } = useHabits();

  const selectedDateStr = selectedDate 
    ? selectedDate.toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const habitsActivity = useMemo(() => {
    return habits.map((habit) => {
      // Find completions for the selected date
      const completionsOnDate = habit.completionLogs.filter((log) => 
        log.completed_at.startsWith(selectedDateStr)
      );

      return {
        ...habit,
        completionsForDate: completionsOnDate.length,
      };
    });
  }, [habits, selectedDateStr]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (habitsActivity.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 px-2">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-sm font-semibold text-foreground">
          Daily Activity
        </h4>
      </div>
      
      <div className="space-y-1">
        {habitsActivity.map((habit) => {
          const isCompleted = habit.completionsForDate > 0;
          return (
            <div 
              key={habit.habit_id}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              {isCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/30 shrink-0" />
              )}
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm tracking-tight truncate ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {habit.name}
                </p>
                {isCompleted && habit.completionsForDate > 1 && (
                  <p className="text-xs text-muted-foreground">
                    Completed {habit.completionsForDate} times
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
