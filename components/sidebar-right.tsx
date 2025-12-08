"use client"

import * as React from "react"
import { CalendarDays, PanelRightClose, PanelRightOpen } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { CalendarWithFilters } from "./calendar-with-filters"
import { Task } from "@/types/database"
import { getTasks } from "@/app/actions/getTasks"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  // Fetch tasks on mount
  React.useEffect(() => {
    async function fetchTasks() {
      try {
        const result = await getTasks()
        if (result.data) {
          setTasks(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTasks()
  }, [])

  // Close sheet when navigating
  const handleTaskClick = () => {
    setSheetOpen(false)
  }

  return (
    <>
      {/* Desktop Sidebar - Collapsible */}
      <div
        className={cn(
          "sticky top-0 hidden h-svh transition-all duration-300 ease-in-out lg:block",
          isCollapsed ? "w-0" : "w-[300px]"
        )}
      >
        {/* Toggle Button - Always visible */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                  "absolute top-4 z-50 h-8 w-8 rounded-lg border border-border/50 bg-background/80 backdrop-blur-sm transition-all hover:bg-muted",
                  isCollapsed ? "-left-10" : "left-3"
                )}
              >
                {isCollapsed ? (
                  <PanelRightOpen className="h-4 w-4" />
                ) : (
                  <PanelRightClose className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {isCollapsed ? "Show calendar" : "Hide calendar"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Sidebar Content */}
        <Sidebar
          collapsible="none"
          className={cn(
            "h-full border-l border-border/50 bg-sidebar/80 backdrop-blur-xl transition-all duration-300",
            isCollapsed ? "opacity-0" : "opacity-100"
          )}
          {...props}
        >
          {/* Minimal Header */}
          <SidebarHeader className="flex flex-row items-center gap-2 px-4 py-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <CalendarDays className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Calendar</span>
          </SidebarHeader>

          {/* Subtle divider */}
          <div className="mx-4 h-px bg-border/50" />

          {/* Calendar Content */}
          <SidebarContent className="overflow-y-auto px-2 py-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-xs text-muted-foreground">Loading calendar...</span>
              </div>
            ) : (
              <CalendarWithFilters tasks={tasks} />
            )}
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Mobile Calendar Floating Button & Drawer */}
      <div className="fixed bottom-4 right-4 z-50 lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button 
              size="icon" 
              className="h-12 w-12 rounded-full bg-primary shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <CalendarDays className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="w-[320px] border-l border-border/50 bg-background/95 backdrop-blur-xl p-0 sm:w-[380px]"
          >
            <SheetHeader className="flex flex-row items-center gap-2 border-b border-border/50 px-4 py-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <CalendarDays className="h-4 w-4 text-primary" />
              </div>
              <SheetTitle className="text-sm font-semibold">Calendar</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto px-2 py-3" style={{ maxHeight: 'calc(100vh - 80px)' }}>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-xs text-muted-foreground">Loading calendar...</span>
                </div>
              ) : (
                <CalendarWithFilters tasks={tasks} showTitle={false} onTaskClick={handleTaskClick} />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
