"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { CalendarDays, PanelRightClose, PanelRightOpen, BookOpen, ChevronUp, ChevronDown } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { CalendarWithFilters } from "./calendar-with-filters"
import { SidebarJournalContent } from "./journal/sidebar-journal-content"
import { Task } from "@/types/database"
import { getTasks } from "@/app/actions/getTasks"
import { Button } from "./ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMobileExpanded, setIsMobileExpanded] = React.useState(false)

  // Check if we're on a journal page
  const isJournalPage = pathname?.startsWith("/dashboard/journal")

  // Fetch tasks on mount (for calendar view)
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

  return (
    <>
      {/* Mobile Bottom Panel - Collapsible */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <motion.div
          initial={false}
          animate={{ height: isMobileExpanded ? "auto" : "auto" }}
          className="bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-2xl"
        >
          {/* Mobile Toggle Header */}
          <button
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              {isJournalPage ? (
                <>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary/20 to-accent/20">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Journal Quick Actions</span>
                </>
              ) : (
                <>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                    <CalendarDays className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Calendar</span>
                </>
              )}
            </div>
            {isMobileExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {/* Mobile Expanded Content */}
          <AnimatePresence>
            {isMobileExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="max-h-[50vh] overflow-y-auto px-2 pb-4">
                  {isJournalPage ? (
                    <SidebarJournalContent />
                  ) : isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="text-xs text-muted-foreground">Loading...</span>
                    </div>
                  ) : (
                    <CalendarWithFilters tasks={tasks} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

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
              {isCollapsed 
                ? (isJournalPage ? "Show journal panel" : "Show calendar") 
                : (isJournalPage ? "Hide journal panel" : "Hide calendar")
              }
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
          {/* Header - Changes based on route */}
          <SidebarHeader className="flex flex-row items-center gap-2 px-4 py-4">
            <AnimatePresence mode="wait">
              {isJournalPage ? (
                <motion.div
                  key="journal-header"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">Journal</span>
                </motion.div>
              ) : (
                <motion.div
                  key="calendar-header"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                    <CalendarDays className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">Calendar</span>
                </motion.div>
              )}
            </AnimatePresence>
          </SidebarHeader>

          {/* Subtle divider */}
          <div className="mx-4 h-px bg-border/50" />

          {/* Content - Switches based on route */}
          <SidebarContent className="overflow-y-auto px-2 py-3">
            <AnimatePresence mode="wait">
              {isJournalPage ? (
                <motion.div
                  key="journal-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <SidebarJournalContent />
                </motion.div>
              ) : (
                <motion.div
                  key="calendar-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-12">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="text-xs text-muted-foreground">Loading calendar...</span>
                    </div>
                  ) : (
                    <CalendarWithFilters tasks={tasks} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </SidebarContent>
        </Sidebar>
      </div>
    </>
  )
}
