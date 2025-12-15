// components/dashboard/today-overview.tsx
// Server Component - fetches today's tasks

import { getTasks } from "@/app/actions/getTasks"
import { 
  IconCircleCheck, 
  IconCircle,
  IconAlertCircle,
  IconClock,
  IconSparkles,
  IconFlame
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface OverviewItem {
  id: string
  title: string
  type: "task" | "habit" | "focus"
  status: "pending" | "completed" | "overdue"
  dueTime?: string
  priority?: string
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high": return "text-red-500 bg-red-500/10"
    case "medium": return "text-yellow-500 bg-yellow-500/10"
    default: return "text-green-500 bg-green-500/10"
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "completed": 
      return <IconCircleCheck className="text-green-500" size={18} />
    case "overdue": 
      return <IconAlertCircle className="text-red-500" size={18} />
    default: 
      return <IconCircle className="text-muted-foreground" size={18} />
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "habit": 
      return <IconSparkles className="text-green-500" size={16} />
    case "focus": 
      return <IconFlame className="text-accent" size={16} />
    default: 
      return <IconClock className="text-primary" size={16} />
  }
}

export async function TodayOverview() {
  const tasksResult = await getTasks()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayEnd = new Date(today)
  todayEnd.setHours(23, 59, 59, 999)

  // Get today's tasks
  const todayTasks = tasksResult.data?.filter(task => {
    if (!task.due_date) return false
    const dueDate = new Date(task.due_date)
    return dueDate >= today && dueDate <= todayEnd
  }) ?? []

  // Convert to overview items
  const taskItems: OverviewItem[] = todayTasks.slice(0, 3).map(task => ({
    id: task.task_id,
    title: task.title,
    type: "task" as const,
    status: task.status === "completed" ? "completed" : 
            new Date(task.due_date!) < today ? "overdue" : "pending",
    priority: task.priority,
    dueTime: task.due_date ? new Date(task.due_date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }) : undefined
  }))

  // DEV LOG: Placeholders removed - show only real data
  // TODO: Fetch real habits/focus data here when APIs are ready
  if (process.env.NODE_ENV === 'development') {
    console.log('[TodayOverview] Showing real task data only - placeholders removed');
  }

  const allItems = taskItems.slice(0, 5)

  const completedCount = allItems.filter(i => i.status === "completed").length
  const totalCount = allItems.length

  return (
    <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h3 className="font-semibold font-primary text-base sm:text-lg">Today&apos;s Overview</h3>
          <p className="text-xs text-muted-foreground">
            {completedCount} of {totalCount} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold font-primary text-primary">
            {Math.round((completedCount / Math.max(totalCount, 1)) * 100)}%
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 sm:h-1.5 bg-muted rounded-full mb-3 sm:mb-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / Math.max(totalCount, 1)) * 100}%` }}
        />
      </div>

      {/* Items list */}
      <div className="space-y-2">
        {allItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No items scheduled for today
          </p>
        ) : (
          allItems.map((item) => (
            <Link
              key={item.id}
              href={item.type === "task" ? `/dashboard/tasks` : `/dashboard/${item.type}s`}
              className={`
                flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl
                bg-muted/30 hover:bg-muted/50
                border border-transparent hover:border-border/50
                transition-all duration-200 group
              `}
            >
              {/* Status indicator */}
              {getStatusIcon(item.status)}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`
                  text-sm font-medium truncate
                  ${item.status === "completed" ? "line-through text-muted-foreground" : ""}
                `}>
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {getTypeIcon(item.type)}
                  <span className="text-xs text-muted-foreground capitalize">
                    {item.type}
                  </span>
                  {item.dueTime && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{item.dueTime}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Priority badge */}
              {item.priority && (
                <Badge 
                  variant="outline" 
                  className={`text-xs capitalize ${getPriorityColor(item.priority)}`}
                >
                  {item.priority}
                </Badge>
              )}
            </Link>
          ))
        )}
      </div>

      {/* View all link */}
      <Link 
        href="/dashboard/tasks"
        className="
          block text-center text-xs sm:text-sm text-primary font-medium 
          mt-3 sm:mt-4 py-2 rounded-lg
          hover:bg-primary/5 transition-colors
        "
      >
        View All Tasks →
      </Link>
    </div>
  )
}
