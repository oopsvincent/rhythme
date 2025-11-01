"use client";
import * as React from "react";
import { 
  CheckSquare, 
  Target, 
  Repeat, 
  Focus, 
  ListFilter,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";

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
}

export const CalendarWithFilters = ({ 
  showTitle = true, 
  onDateSelect,
  onFiltersChange,
  compact = false 
}: CalendarWithFiltersProps) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [activeFilters, setActiveFilters] = React.useState<FilterType[]>(["all"]);
  const [showFilterMenu, setShowFilterMenu] = React.useState(false);

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
    <div className="w-full space-y-4">
      {showTitle && (
        <div className="text-center">
          <h3 className="text-lg font-semibold">Calendar</h3>
          <p className="text-sm text-muted-foreground">
            View and filter your entries
          </p>
        </div>
      )}

      {/* Filter Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 lg:ml-3"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            <ListFilter className="w-4 h-4 mr-2" />
            Filters
            {activeFilters.length > 1 || !activeFilters.includes("all") ? (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {activeFilters.length}
              </Badge>
            ) : null}
          </Button>

          {/* Active Filter Badges */}
          <div className="flex-1 flex gap-1.5 overflow-x-auto scrollbar-hide">
            {activeFilters.filter(f => f !== "all").map((filter) => {
              const option = getActiveFilterOption(filter);
              return option ? (
                <Badge
                  key={filter}
                  variant="secondary"
                  className={`${option.color} whitespace-nowrap flex items-center gap-1 px-2 py-1 cursor-pointer`}
                  onClick={() => toggleFilter(filter)}
                >
                  {option.icon}
                  <span className="text-xs">{option.label}</span>
                  <X className="w-2.5 h-2.5 ml-1" />
                </Badge>
              ) : null;
            })}
          </div>
        </div>

        {/* Filter Menu */}
        {showFilterMenu && (
          <div className="p-2 border rounded-lg bg-card shadow-sm">
            <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'} gap-2`}>
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={activeFilters.includes(option.value) ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full justify-start h-9 ${
                    activeFilters.includes(option.value) ? option.color : ""
                  }`}
                  onClick={() => toggleFilter(option.value)}
                >
                  {option.icon}
                  <span className="ml-2 text-xs">{option.label}</span>
                  {activeFilters.includes(option.value) && option.value !== "all" && (
                    <CheckSquare className="w-3 h-3 ml-auto" />
                  )}
                </Button>
              ))}
            </div>
            {activeFilters.length > 1 || !activeFilters.includes("all") ? (
              <>
                <Separator className="my-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center text-muted-foreground h-8"
                  onClick={clearFilters}
                >
                  <X className="w-3 h-3 mr-2" />
                  Clear all filters
                </Button>
              </>
            ) : null}
          </div>
        )}
      </div>

      <Separator />

      {/* Calendar */}
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          className="rounded-md border mx-auto"
          captionLayout="dropdown"
        />
        
        {/* Date Info */}
        {date && (
          <div className="mt-4 p-3 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Selected Date</p>
            <p className="font-medium text-sm">
              {date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            {activeFilters.length > 0 && !activeFilters.includes("all") && (
              <p className="text-xs text-muted-foreground mt-1">
                Filtered by: {activeFilters.join(", ")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Export filter types and options for use in other components
export type { FilterType, FilterOption };
export { filterOptions };