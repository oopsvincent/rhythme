"use client";

import { useMemo } from "react";
import { HabitLog, HabitFrequency } from "@/types/database";
import { useRightSidebarStore } from "@/store/useRightSidebarStore";
import { useHabitCalendarStore } from "@/store/useCalendarStores";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HabitHeatmapProps {
  logs: HabitLog[];
  frequency: HabitFrequency;
  targetCount: number;
}

export function HabitHeatmap({ logs, frequency, targetCount }: HabitHeatmapProps) {
  const selectedDate = useHabitCalendarStore((state) => state.selectedDate);
  const setSelectedDate = useHabitCalendarStore((state) => state.setSelectedDate);

  // Constants
  const WEEKS_TO_SHOW = 13; // ~90 days covering 13 full weeks
  const DAYS_IN_WEEK = 7;

  // Generate the last 90 days grid
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate how many days we need to go back to start on a Sunday, 13 weeks ago
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const daysToSubtract = (WEEKS_TO_SHOW - 1) * DAYS_IN_WEEK + dayOfWeek;
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysToSubtract);

    // Aggregate logs by date string YYYY-MM-DD
    const logCounts = new Map<string, number>();
    logs.forEach(log => {
      const dateStr = log.completed_at.split('T')[0];
      logCounts.set(dateStr, (logCounts.get(dateStr) || 0) + 1);
    });

    const dates = [];
    for (let i = 0; i <= daysToSubtract; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      dates.push({
        date: d,
        dateStr,
        count: logCounts.get(dateStr) || 0,
        isFuture: d > today
      });
    }

    return dates;
  }, [logs]);

  // Determine intensity color based on count
  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-muted/30 border-border/50";
    if (count === 1) return "bg-primary/30 border-primary/20";
    if (count === 2) return "bg-primary/60 border-primary/40 text-primary-foreground";
    return "bg-primary border-primary text-primary-foreground"; // 3+ completions
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    // Open right sidebar if it's collapsed
    if (useRightSidebarStore.getState().isCollapsed) {
       useRightSidebarStore.getState().setCollapsed(false);
    }
  };

  return (
    <div className="w-full overflow-x-auto p-2 scrollbar-hide">
      <div className="w-full flex flex-col gap-1">
        {/* Month labels could go here in a future iteration */}
        
        {/* The Grid: 7 rows (Sun-Sat), ~13 columns (weeks) */}
        <div className="flex justify-between w-full gap-1">
          {Array.from({ length: WEEKS_TO_SHOW }).map((_, weekIndex) => (
            <div key={`week-${weekIndex}`} className="flex flex-col gap-1">
              {Array.from({ length: DAYS_IN_WEEK }).map((_, dayIndex) => {
                const dayOffset = (weekIndex * DAYS_IN_WEEK) + dayIndex;
                const dayData = days[dayOffset];

                // Some cells at the end might not exist if they are in the future
                if (!dayData || dayData.isFuture) {
                  return <div key={`empty-${dayOffset}`} className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-[2px]" />;
                }

                const isSelected = selectedDate 
                  ? selectedDate.toISOString().split('T')[0] === dayData.dateStr
                  : false;

                return (
                  <TooltipProvider key={dayData.dateStr} delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleDayClick(dayData.date)}
                          className={cn(
                            "w-3.5 h-3.5 md:w-4 md:h-4 rounded-[2px] transition-all duration-200 border",
                            getIntensityClass(dayData.count),
                            isSelected && "ring-2 ring-foreground ring-offset-1 ring-offset-background scale-110 z-10",
                            !isSelected && "hover:border-foreground/40 hover:scale-110 z-0"
                          )}
                          aria-label={`${dayData.count} completions on ${dayData.dateStr}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <p className="font-medium">
                          {dayData.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-muted-foreground">
                          {dayData.count} {dayData.count === 1 ? 'completion' : 'completions'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
