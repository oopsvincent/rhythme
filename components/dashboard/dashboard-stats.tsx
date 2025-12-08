// components/dashboard/dashboard-stats.tsx
// Server Component - fetches real task data

import { getTaskStats, getTasks } from "@/app/actions/getTasks"
import { 
  IconChecklist, 
  IconFlame, 
  IconClock, 
  IconTrendingUp,
  IconArrowUpRight,
  IconArrowDownRight
} from "@tabler/icons-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  accentColor?: "primary" | "accent" | "green" | "purple"
}

function StatCard({ title, value, subtitle, icon, trend, accentColor = "primary" }: StatCardProps) {
  const accentStyles = {
    primary: "from-primary/20 to-primary/5 border-primary/20",
    accent: "from-accent/20 to-accent/5 border-accent/20",
    green: "from-green-500/20 to-green-500/5 border-green-500/20",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20"
  }

  const iconBgStyles = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    green: "bg-green-500/10 text-green-500",
    purple: "bg-purple-500/10 text-purple-500"
  }

  return (
    <div className={`
      relative overflow-hidden rounded-xl sm:rounded-2xl border p-3 sm:p-5
      bg-gradient-to-br ${accentStyles[accentColor]}
      backdrop-blur-xl transition-all duration-300
      hover:scale-[1.02] hover:shadow-lg
      dark:bg-card/50
    `}>
      {/* Icon */}
      <div className={`
        inline-flex items-center justify-center
        w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl mb-2 sm:mb-3
        ${iconBgStyles[accentColor]}
      `}>
        {icon}
      </div>

      {/* Content */}
      <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">{title}</p>
      <div className="flex items-baseline gap-1 sm:gap-2 mt-1">
        <span className="text-xl sm:text-3xl font-bold font-primary tracking-tight">{value}</span>
        {trend && (
          <span className={`
            flex items-center text-[10px] sm:text-xs font-medium
            ${trend.isPositive ? "text-green-500" : "text-red-500"}
          `}>
            {trend.isPositive ? <IconArrowUpRight size={12} /> : <IconArrowDownRight size={12} />}
            {trend.value}%
          </span>
        )}
      </div>
      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">{subtitle}</p>

      {/* Decorative gradient orb */}
      <div className={`
        absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-30
        ${accentColor === "primary" ? "bg-primary" : 
          accentColor === "accent" ? "bg-accent" :
          accentColor === "green" ? "bg-green-500" : "bg-purple-500"}
      `} />
    </div>
  )
}

export async function DashboardStats() {
  // Fetch real task statistics
  const statsResult = await getTaskStats()
  const tasksResult = await getTasks()

  const stats = statsResult.data ?? {
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    overdue: 0,
    dueToday: 0,
    highPriority: 0
  }

  // Calculate completion rate
  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0

  // Calculate today's completed tasks (from recent tasks)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tasksCompletedToday = tasksResult.data?.filter(task => {
    if (!task.completed_at) return false
    const completedDate = new Date(task.completed_at)
    completedDate.setHours(0, 0, 0, 0)
    return completedDate.getTime() === today.getTime()
  }).length ?? 0

  // Placeholder data for habits and focus time
  // TODO: Replace with real data when habits table is ready
  const habitsCompletedToday = 3 // Placeholder
  const dailyHabitsTarget = 5 // Placeholder
  const focusMinutesToday = 127 // Placeholder - 2h 7m
  const currentStreak = 7 // Placeholder

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
      <StatCard
        title="Tasks Today"
        value={`${tasksCompletedToday}/${stats.dueToday + tasksCompletedToday}`}
        subtitle={`${stats.pending} pending • ${stats.overdue} overdue`}
        icon={<IconChecklist size={20} />}
        trend={{ value: 12, isPositive: true }}
        accentColor="primary"
      />
      <StatCard
        title="Focus Time"
        value={`${Math.floor(focusMinutesToday / 60)}h ${focusMinutesToday % 60}m`}
        subtitle="Deep work today"
        icon={<IconClock size={20} />}
        accentColor="accent"
      />
      <StatCard
        title="Current Streak"
        value={`${currentStreak} days`}
        subtitle="Keep it going! 🔥"
        icon={<IconFlame size={20} />}
        trend={{ value: 5, isPositive: true }}
        accentColor="green"
      />
      <StatCard
        title="Completion Rate"
        value={`${completionRate}%`}
        subtitle={`${stats.completed} of ${stats.total} tasks done`}
        icon={<IconTrendingUp size={20} />}
        trend={{ value: completionRate > 50 ? 8 : -3, isPositive: completionRate > 50 }}
        accentColor="purple"
      />
    </div>
  )
}
