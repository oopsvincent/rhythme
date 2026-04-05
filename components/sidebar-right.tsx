"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { CalendarDays, PanelRightClose, PanelRightOpen, BookOpen, Brain, ChevronUp, ChevronDown, CheckSquare } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { CalendarWithFilters } from "./calendar-with-filters"
import { SidebarJournalContent } from "./journal/sidebar-journal-content"
import { FocusHeatmapCalendar } from "./focus/focus-heatmap-calendar"
import { DailyActivityInspector } from "./daily-activity-inspector"
import { Task, Journal } from "@/types/database"
import { getTasks } from "@/app/actions/getTasks"
import { getJournals } from "@/app/actions/journals"
import { Button } from "./ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useRightSidebarStore } from "@/store/useRightSidebarStore"
import { useDashboardCalendarStore, useTaskCalendarStore, useHabitCalendarStore } from "@/store/useCalendarStores"

type SidebarMode = 'tasks' | 'journal' | 'focus' | 'calendar'

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [journals, setJournals] = React.useState<Journal[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const { isCollapsed, toggleCollapsed, isMobileExpanded, toggleMobileExpanded } = useRightSidebarStore()

  const dashboardDate = useDashboardCalendarStore(s => s.selectedDate)
  const setDashboardDate = useDashboardCalendarStore(s => s.setSelectedDate)
  const taskDate = useTaskCalendarStore(s => s.selectedDate)
  const setTaskDate = useTaskCalendarStore(s => s.setSelectedDate)
  const habitDate = useHabitCalendarStore(s => s.selectedDate)
  const setHabitDate = useHabitCalendarStore(s => s.setSelectedDate)

  const activeCalendarState = (() => {
    if (pathname?.startsWith("/dashboard/habits")) {
       return { selectedDate: habitDate, setSelectedDate: setHabitDate }
    }
    if (pathname?.startsWith("/dashboard/tasks")) {
       return { selectedDate: taskDate, setSelectedDate: setTaskDate }
    }
    return { selectedDate: dashboardDate, setSelectedDate: setDashboardDate }
  })()

  // Determine sidebar mode based on route
  const getSidebarMode = (): SidebarMode => {
    if (pathname?.startsWith("/dashboard/journal")) return 'journal'
    if (pathname?.startsWith("/dashboard/focus")) return 'focus'
    if (pathname?.startsWith("/dashboard/tasks")) return 'tasks'
    return 'calendar' // Default for dashboard home and other pages
  }

  const sidebarMode = getSidebarMode()

  // Get header config based on mode
  const getHeaderConfig = () => {
    switch (sidebarMode) {
      case 'journal':
        return {
          icon: <BookOpen className="h-4 w-4 text-primary" />,
          iconBg: "bg-gradient-to-br from-primary/20 to-accent/20",
          title: "Journal",
          tooltip: { show: "Show journal panel", hide: "Hide journal panel" }
        }
      case 'focus':
        return {
          icon: <Brain className="h-4 w-4 text-orange-500" />,
          iconBg: "bg-orange-500/10",
          title: "Focus Activity",
          tooltip: { show: "Show focus activity", hide: "Hide focus activity" }
        }
      case 'tasks':
        return {
          icon: <CheckSquare className="h-4 w-4 text-primary" />,
          iconBg: "bg-primary/10",
          title: "Tasks",
          tooltip: { show: "Show task calendar", hide: "Hide task calendar" }
        }
      default:
        return {
          icon: <CalendarDays className="h-4 w-4 text-primary" />,
          iconBg: "bg-primary/10",
          title: "Calendar",
          tooltip: { show: "Show calendar", hide: "Hide calendar" }
        }
    }
  }

  const headerConfig = getHeaderConfig()

  // Fetch data based on current page - only fetch what's needed
  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        if (sidebarMode === 'journal') {
          const journalsData = await getJournals()
          setJournals(journalsData)
        } else if (sidebarMode === 'tasks' || sidebarMode === 'calendar') {
          const tasksResult = await getTasks()
          if (tasksResult.data) {
            setTasks(tasksResult.data)
          }
        }
        // Focus mode doesn't need server data - uses IndexedDB
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [sidebarMode])

  // Render content based on mode
  const renderContent = () => {
    switch (sidebarMode) {
      case 'journal':
        return <SidebarJournalContent journals={journals} />
      case 'focus':
        return <FocusHeatmapCalendar />
      case 'tasks':
        return isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-xs text-muted-foreground">Loading tasks...</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <CalendarWithFilters 
              tasks={tasks} 
              selectedDate={activeCalendarState.selectedDate} 
              onDateSelect={activeCalendarState.setSelectedDate} 
            />
            <DailyActivityInspector selectedDate={activeCalendarState.selectedDate} />
          </div>
        )
      default:
        return isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-xs text-muted-foreground">Loading calendar...</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <CalendarWithFilters 
              tasks={tasks} 
              selectedDate={activeCalendarState.selectedDate} 
              onDateSelect={activeCalendarState.setSelectedDate} 
            />
            <DailyActivityInspector selectedDate={activeCalendarState.selectedDate} />
          </div>
        )
    }
  }

  // Mobile header text
  const getMobileHeaderText = () => {
    switch (sidebarMode) {
      case 'journal': return "Journal Quick Actions"
      case 'focus': return "Focus Activity"
      case 'tasks': return "Task Calendar"
      default: return "Calendar"
    }
  }

  return (
    <>
      {/* Mobile Bottom Panel - Collapsible */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <motion.div
          initial={false}
          animate={{ height: isMobileExpanded ? "auto" : "auto" }}
          className="bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 border-t border-border/50 shadow-2xl"
        >
          {/* Mobile Toggle Header */}
          <button
            onClick={toggleMobileExpanded}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className={cn("flex h-6 w-6 items-center justify-center rounded-md", headerConfig.iconBg)}>
                {headerConfig.icon}
              </div>
              <span className="text-sm font-medium">{getMobileHeaderText()}</span>
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
                  {renderContent()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Desktop Sidebar - Toggle button lives outside the collapsible area */}
      <div className="sticky top-0 hidden h-svh lg:flex flex-row">
        {/* Toggle Button - Always visible, never clipped */}
        <div className="relative flex items-start pt-4 z-50">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleCollapsed}
                  className="h-8 w-8 rounded-lg border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-muted"
                >
                  {isCollapsed ? (
                    <PanelRightOpen className="h-4 w-4" />
                  ) : (
                    <PanelRightClose className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {isCollapsed ? headerConfig.tooltip.show : headerConfig.tooltip.hide}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Collapsible Sidebar Content */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            isCollapsed ? "w-0" : "w-[300px]"
          )}
        >
          <Sidebar
            collapsible="none"
            className={cn(
              "h-full w-[300px] border-l border-border/50 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 transition-opacity duration-300",
              isCollapsed ? "opacity-0" : "opacity-100"
            )}
            {...props}
          >
            {/* Header - Changes based on route */}
            <SidebarHeader className="flex flex-row items-center gap-2 px-4 py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={sidebarMode}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", headerConfig.iconBg)}>
                    {headerConfig.icon}
                  </div>
                  <span className="text-sm font-semibold tracking-tight">{headerConfig.title}</span>
                </motion.div>
              </AnimatePresence>
            </SidebarHeader>

            {/* Subtle divider */}
            <div className="mx-4 h-px bg-border/50" />

            {/* Content - Switches based on route */}
            <SidebarContent className="overflow-y-auto px-2 py-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={sidebarMode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </SidebarContent>
          </Sidebar>
        </div>
      </div>
    </>
  )
}
