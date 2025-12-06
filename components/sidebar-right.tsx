"use client"

import * as React from "react"
import { Plus, CalendarDays, Calendar1 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
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

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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

  // Close sheet when navigating
  const handleTaskClick = () => {
    setSheetOpen(false)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <Sidebar
        collapsible="none"
        className="sticky top-0 hidden h-svh border-l lg:flex w-[280px]"
        {...props}
      >
        <SidebarHeader className="border-sidebar-border h-16 border-b flex flex-row items-center justify-center">
            <Calendar1 className="h-8 w-8" />
            <span className="text-4xl font-semibold">Calendar</span>
        </SidebarHeader>
        <SidebarContent className="overflow-y-auto">
          <SidebarSeparator className="mx-0" />
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-pulse text-sm text-muted-foreground">Loading...</div>
            </div>
          ) : (
            <CalendarWithFilters tasks={tasks} />
          )}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Plus />
                <span>New Calendar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Mobile Calendar Floating Button & Drawer */}
      <div className="fixed bottom-2 right-2 lg:hidden z-50">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button 
              size="icon" 
              className="h-10 w-10 rounded-full shadow-lg"
            >
              <CalendarDays className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Calendar</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-pulse text-sm text-muted-foreground">Loading...</div>
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
