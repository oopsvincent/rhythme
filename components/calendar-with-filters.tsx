"use client";
import * as React from "react";
import { 
  CheckSquare, 
  Target, 
  Repeat, 
  Focus, 
  ListFilter,
  X,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Task } from "@/types/database";
import Link from "next/link";
import { generateSlug } from "@/lib/slug";

type FilterType = "all" | "tasks" | "goals" | "habits" | "focus";

interface FilterOption {
  value: FilterType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const filterOptions: FilterOption[] = [
  { 
    value: "all", 
    label: "All", 
    icon: <ListFilter className="w-3 h-3" />, 
    color: "bg-primary/10 text-primary hover:bg-primary/20" 
  },
  { 
    value: "tasks", 
    label: "Tasks", 
    icon: <CheckSquare className="w-3 h-3" />, 
    color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20" 
  },
  { 
    value: "goals", 
    label: "Goals", 
    icon: <Target className="w-3 h-3" />, 
    color: "bg-green-500/10 text-green-600 hover:bg-green-500/20" 
  },
  { 
    value: "habits", 
    label: "Habits", 
    icon: <Repeat className="w-3 h-3" />, 
    color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20" 
  },
  { 
    value: "focus", 
    label: "Focus", 
    icon: <Focus className="w-3 h-3" />, 
    color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20" 
  },
];

interface CalendarWithFiltersProps {
  showTitle?: boolean;
  onDateSelect?: (date: Date | undefined) => void;
  onFiltersChange?: (filters: FilterType[]) => void;
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
  onFiltersChange,
  compact = true,
  tasks = [],
  onTaskClick
}: CalendarWithFiltersProps) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [activeFilters, setActiveFilters] = React.useState<FilterType[]>(["all"]);
  const [showFilterMenu, setShowFilterMenu] = React.useState(false);

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

  const toggleFilter = (filter: FilterType) => {
    let newFilters: FilterType[];
    
    if (filter === "all") {
      newFilters = ["all"];
      setShowFilterMenu(false);
    } else {
      const filtered = activeFilters.includes(filter)
        ? activeFilters.filter(f => f !== filter)
        : [...activeFilters.filter(f => f !== "all"), filter];
      newFilters = filtered.length === 0 ? ["all"] : filtered;
    }
    
    setActiveFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters(["all"]);
    setShowFilterMenu(false);
    onFiltersChange?.(["all"]);
  };

  const getActiveFilterOption = (value: FilterType) => 
    filterOptions.find(opt => opt.value === value);

  return (
    <div className="w-full px-2 py-3 space-y-3">
      {showTitle && (
        <div className="text-center px-2">
          <h3 className="text-sm font-semibold">Calendar</h3>
        </div>
      )}

      {/* Filter Section */}
      <div className="space-y-2 px-1">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            <ListFilter className="w-3 h-3 mr-1" />
            Filters
            {activeFilters.length > 1 || !activeFilters.includes("all") ? (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                {activeFilters.length}
              </Badge>
            ) : null}
          </Button>

          {/* Active Filter Badges */}
          <div className="flex-1 flex gap-1 overflow-x-auto scrollbar-hide">
            {activeFilters.filter(f => f !== "all").map((filter) => {
              const option = getActiveFilterOption(filter);
              return option ? (
                <Badge
                  key={filter}
                  variant="secondary"
                  className={`${option.color} whitespace-nowrap flex items-center gap-0.5 px-1.5 py-0.5 cursor-pointer text-[10px]`}
                  onClick={() => toggleFilter(filter)}
                >
                  {option.icon}
                  <span>{option.label}</span>
                  <X className="w-2 h-2 ml-0.5" />
                </Badge>
              ) : null;
            })}
          </div>
        </div>

        {/* Filter Menu */}
        {showFilterMenu && (
          <div className="p-2 border rounded-lg bg-card shadow-sm">
            <div className="grid grid-cols-2 gap-1.5">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={activeFilters.includes(option.value) ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full justify-start h-7 text-xs ${
                    activeFilters.includes(option.value) ? option.color : ""
                  }`}
                  onClick={() => toggleFilter(option.value)}
                >
                  {option.icon}
                  <span className="ml-1.5">{option.label}</span>
                </Button>
              ))}
            </div>
            {activeFilters.length > 1 || !activeFilters.includes("all") ? (
              <>
                <Separator className="my-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center text-muted-foreground h-7 text-xs"
                  onClick={clearFilters}
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear filters
                </Button>
              </>
            ) : null}
          </div>
        )}
      </div>

      <Separator />

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

// Export filter types and options for use in other components
export type { FilterType, FilterOption };
export { filterOptions };