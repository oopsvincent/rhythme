"use client";
import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Task } from "@/types/database";
import Link from "next/link";
import { generateSlug } from "@/lib/slug";

interface CalendarWithFiltersProps {
  showTitle?: boolean;
  onDateSelect?: (date: Date | undefined) => void;
  compact?: boolean;
  tasks?: Task[];
  onTaskClick?: () => void;
}

const priorityColors: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
};

export const CalendarWithFilters = ({ 
  showTitle = false, 
  onDateSelect,
  tasks = [],
  onTaskClick
}: CalendarWithFiltersProps) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Get dates that have tasks
  const taskDates = React.useMemo(() => {
    return tasks
      .filter(t => t.due_date)
      .map(t => {
        const d = new Date(t.due_date!);
        d.setHours(0, 0, 0, 0);
        return d;
      });
  }, [tasks]);

  // Get tasks for selected date
  const tasksForSelectedDate = React.useMemo(() => {
    if (!date) return [];
    const selectedDateStr = date.toDateString();
    return tasks.filter(t => {
      if (!t.due_date) return false;
      return new Date(t.due_date).toDateString() === selectedDateStr;
    });
  }, [date, tasks]);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    onDateSelect?.(newDate);
  };

  return (
    <div className="w-full px-2 py-3 space-y-3">
      {showTitle && (
        <div className="text-center px-2">
          <h3 className="text-sm font-semibold">Calendar</h3>
        </div>
      )}

      {/* Calendar with task indicators */}
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          className="rounded-md border w-full"
          modifiers={{
            hasTask: taskDates
          }}
          modifiersClassNames={{
            hasTask: "bg-blue-500/30 text-blue-700 dark:text-blue-300 font-bold"
          }}
        />
      </div>
      
      {/* Selected Date & Tasks */}
      <div className="px-1 space-y-2">
        {date && (
          <div className="p-2 bg-muted rounded-md text-center">
            <p className="font-medium text-sm">
              {date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        )}

        {/* Tasks for selected date */}
        {tasksForSelectedDate.length > 0 ? (
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground px-1">
              {tasksForSelectedDate.length} task{tasksForSelectedDate.length > 1 ? 's' : ''} on this day
            </p>
            {tasksForSelectedDate.slice(0, 5).map((task) => (
              <Link
                key={task.task_id}
                href={`/dashboard/tasks/${generateSlug(task.title)}-${task.task_id}`}
                onClick={onTaskClick}
                className="flex items-center gap-2 p-2 rounded-md bg-card border hover:bg-accent/50 transition-colors group"
              >
                <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority] || 'bg-gray-400'}`} />
                <span className="flex-1 text-xs truncate">{task.title}</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
            {tasksForSelectedDate.length > 5 && (
              <p className="text-xs text-muted-foreground text-center">
                +{tasksForSelectedDate.length - 5} more
              </p>
            )}
          </div>
        ) : date ? (
          <p className="text-xs text-muted-foreground text-center py-2">
            No tasks on this day
          </p>
        ) : null}
      </div>
    </div>
  );
};