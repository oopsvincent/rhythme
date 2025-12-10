// components/site-header.tsx
"use client"

import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { CalendarDays, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Fragment } from "react"
import { formatSlugToTitle } from "@/lib/slug"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CalendarWithFilters } from "./calendar-with-filters"
import { Task } from "@/types/database"
import { getTasks } from "@/app/actions/getTasks"

// Mapping sections to display titles
const sectionTitles: Record<string, string> = {
  dashboard: "Dashboard",
  analytics: "Analytics",
  "data-table": "Data Table",
  settings: "Settings",
  tasks: "Tasks",
  goals: "Goals",
  habits: "Habits",
  focus: "Focus",
  ai: "Rhythmé AI",
  account: "Account",
  notifications: "Notifications",
  appearance: "Appearance",
  language: "Language & Region",
  accessibility: "Accessibility",
  privacy: "Privacy",
  security: "Security",
}

// Generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string) {
  // Remove trailing slash and split
  const paths = pathname.replace(/\/$/, '').split('/').filter(Boolean)
  
  const breadcrumbs = paths.map((path, index) => {
    // Build the URL for this breadcrumb
    const href = '/' + paths.slice(0, index + 1).join('/')
    
    // Get display name (use title mapping or format the path)
    const label = sectionTitles[path] || formatSlugToTitle(path)
    
    return {
      label,
      href,
      isLast: index === paths.length - 1,
    }
  })
  
  return breadcrumbs
}

export function SiteHeader() {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname || '/dashboard')
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [sheetOpen, setSheetOpen] = React.useState(false)

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

  const handleTaskClick = () => {
    setSheetOpen(false)
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1 text-sm overflow-hidden">
          {breadcrumbs.map((crumb) => (
            <Fragment key={crumb.href}>
              {crumb.isLast ? (
                // Last item - not clickable, bold
                <span className="font-medium text-base truncate max-w-[200px] sm:max-w-[300px]">
                  {crumb.label}
                </span>
              ) : (
                // Intermediate items - clickable links
                <>
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground hover:text-foreground transition-colors truncate hidden sm:inline"
                  >
                    {crumb.label}
                  </Link>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
                </>
              )}
            </Fragment>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Calendar Button - visible on smaller screens */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden h-8 w-8"
              >
                <CalendarDays className="h-4 w-4" />
                <span className="sr-only">Open calendar</span>
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
      </div>
    </header>
  )
}