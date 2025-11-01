"use client";
import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { CalendarRange } from "lucide-react";
import { CalendarWithFilters, FilterType } from "@/components/calendar-with-filters";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface CalendarDrawerProps {
  onDateSelect?: (date: Date | undefined) => void;
  onFiltersChange?: (filters: FilterType[]) => void;
}

const CalendarDrawer = ({ onDateSelect, onFiltersChange }: CalendarDrawerProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
                <TooltipProvider delayDuration={0}>
          {" "}
          <Tooltip>
            <TooltipTrigger asChild>
      <DrawerTrigger asChild>
        <Button 
          size="icon" 
          className="rounded-2xl shadow-lg"
          aria-label="Open calendar"
        >
          <CalendarRange />
        </Button>
      </DrawerTrigger>
            </TooltipTrigger>
            <TooltipContent side="top">
              {" "}
              <p>Open Calendar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-sm px-4 pb-6">
          <CalendarWithFilters 
            showTitle={true}
            onDateSelect={onDateSelect}
            onFiltersChange={onFiltersChange}
            compact={true}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CalendarDrawer;