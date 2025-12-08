// components/dashboard/activity-feed.tsx
// Server Component - fetches recent activity

import { getTasks } from "@/app/actions/getTasks"
import { 
  IconCheck, 
  IconPlus, 
  IconEdit,
  IconFlame,
  IconSparkles,
  IconBook
} from "@tabler/icons-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  id: string
  action: "created" | "completed" | "updated" | "habit" | "focus" | "journal"
  title: string
  timestamp: Date
  icon: React.ReactNode
  iconBg: string
}

function getActionIcon(action: string) {
  switch (action) {
    case "completed":
      return { icon: <IconCheck size={14} />, bg: "bg-green-500" }
    case "created":
      return { icon: <IconPlus size={14} />, bg: "bg-primary" }
    case "updated":
      return { icon: <IconEdit size={14} />, bg: "bg-yellow-500" }
    case "habit":
      return { icon: <IconSparkles size={14} />, bg: "bg-purple-500" }
    case "focus":
      return { icon: <IconFlame size={14} />, bg: "bg-accent" }
    case "journal":
      return { icon: <IconBook size={14} />, bg: "bg-pink-500" }
    default:
      return { icon: <IconCheck size={14} />, bg: "bg-muted" }
  }
}

export async function ActivityFeed() {
  const tasksResult = await getTasks()
  
  // Build activity from real task data
  const taskActivities: ActivityItem[] = []
  
  tasksResult.data?.slice(0, 10).forEach(task => {
    // Add completed activity if completed
    if (task.completed_at) {
      const { icon, bg } = getActionIcon("completed")
      taskActivities.push({
        id: `${task.task_id}-completed`,
        action: "completed",
        title: `Completed "${task.title}"`,
        timestamp: new Date(task.completed_at),
        icon,
        iconBg: bg
      })
    }
    
    // Add created activity
    const { icon, bg } = getActionIcon("created")
    taskActivities.push({
      id: `${task.task_id}-created`,
      action: "created",
      title: `Created "${task.title}"`,
      timestamp: new Date(task.created_at),
      icon,
      iconBg: bg
    })
  })

  // Placeholder activities for habits, focus, journal
  // TODO: Replace with real data when tables are ready
  const placeholderActivities: ActivityItem[] = [
    {
      id: "habit-activity-1",
      action: "habit",
      title: 'Completed "Morning Meditation"',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: getActionIcon("habit").icon,
      iconBg: getActionIcon("habit").bg
    },
    {
      id: "focus-activity-1",
      action: "focus",
      title: "Focus session: 45 minutes",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      icon: getActionIcon("focus").icon,
      iconBg: getActionIcon("focus").bg
    },
    {
      id: "journal-activity-1",
      action: "journal",
      title: "Added journal entry",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      icon: getActionIcon("journal").icon,
      iconBg: getActionIcon("journal").bg
    }
  ]

  // Combine and sort by timestamp (most recent first)
  const allActivities = [...taskActivities, ...placeholderActivities]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 6)

  return (
    <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="font-semibold font-primary text-base sm:text-lg">Recent Activity</h3>
        <span className="text-[10px] sm:text-xs text-muted-foreground">Last 24 hours</span>
      </div>

      {/* Activity list */}
      <div className="space-y-1">
        {allActivities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </p>
        ) : (
          allActivities.map((activity, index) => (
            <div
              key={activity.id}
              className={`
                flex items-start gap-2 sm:gap-3 py-2 sm:py-3
                ${index !== allActivities.length - 1 ? "border-b border-border/30" : ""}
              `}
            >
              {/* Icon */}
              <div className={`
                flex items-center justify-center
                w-6 h-6 sm:w-7 sm:h-7 rounded-full text-white shrink-0
                ${activity.iconBg}
              `}>
                {activity.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
