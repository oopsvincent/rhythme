// components/dashboard/productivity-charts.tsx
"use client"

import * as React from "react"
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
  RadialBar,
  RadialBarChart,
  CartesianGrid, 
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts"
import { 
  IconCalendarStats, 
  IconChartPie,
  IconChartDonut,
  IconChartBar
} from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Chart configs
const areaChartConfig = {
  tasks: {
    label: "Tasks",
    color: "var(--primary)",
  },
  habits: {
    label: "Habits",
    color: "var(--accent)",
  },
} satisfies ChartConfig

const barChartConfig = {
  completed: {
    label: "Completed",
    color: "var(--primary)",
  },
  pending: {
    label: "Pending",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig

// Generate placeholder data for last 7 days
function generateWeeklyData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const today = new Date().getDay()
  
  return days.map((day, index) => {
    const isPast = index <= today || today === 0
    return {
      day,
      tasks: isPast ? Math.floor(Math.random() * 8) + 2 : 0,
      habits: isPast ? Math.floor(Math.random() * 5) + 1 : 0,
      completed: isPast ? Math.floor(Math.random() * 6) + 1 : 0,
      pending: isPast ? Math.floor(Math.random() * 3) : 0,
      focus: isPast ? Math.floor(Math.random() * 120) + 30 : 0,
    }
  })
}

// Generate monthly overview data
function generateMonthlyData() {
  return [
    { week: "Week 1", tasks: 23, habits: 18, focus: 420 },
    { week: "Week 2", tasks: 31, habits: 22, focus: 540 },
    { week: "Week 3", tasks: 28, habits: 25, focus: 480 },
    { week: "Week 4", tasks: 35, habits: 28, focus: 600 },
  ]
}

// Category distribution data
const categoryData = [
  { name: "Work", value: 45, fill: "var(--primary)" },
  { name: "Personal", value: 25, fill: "var(--accent)" },
  { name: "Health", value: 15, fill: "#22c55e" },
  { name: "Learning", value: 15, fill: "#a855f7" },
]

// Focus time distribution
const focusDistribution = [
  { name: "Deep Work", value: 60, fill: "var(--primary)" },
  { name: "Meetings", value: 20, fill: "var(--accent)" },
  { name: "Planning", value: 20, fill: "#22c55e" },
]

// Productivity score for radial chart
const productivityScore = [
  { name: "Score", value: 78, fill: "var(--primary)" },
]

interface ProductivityChartsProps {
  taskStats?: {
    total: number
    completed: number
    pending: number
    in_progress: number
  }
}

export function ProductivityCharts({ taskStats }: ProductivityChartsProps) {
  const [timeRange, setTimeRange] = React.useState("7d")
  const weeklyData = React.useMemo(() => generateWeeklyData(), [])
  const monthlyData = React.useMemo(() => generateMonthlyData(), [])

  const displayData = timeRange === "7d" ? weeklyData : monthlyData

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {/* Main Activity Chart */}
      <Card className="glass-card col-span-1 sm:col-span-2 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 font-primary">
              <IconCalendarStats size={20} className="text-primary" />
              Activity Overview
            </CardTitle>
            <CardDescription>
              Tasks and habits completed over time
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-24 sm:w-32 text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pt-2 sm:pt-4">
          <ChartContainer config={areaChartConfig} className="h-[180px] sm:h-[250px] w-full">
            <AreaChart data={displayData}>
              <defs>
                <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-tasks)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-tasks)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillHabits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-habits)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-habits)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey={timeRange === "7d" ? "day" : "week"} 
                tickLine={false} 
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="tasks"
                stroke="var(--color-tasks)"
                fill="url(#fillTasks)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="habits"
                stroke="var(--color-habits)"
                fill="url(#fillHabits)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Productivity Score - Radial */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 font-primary text-base">
            <IconChartDonut size={18} className="text-accent" />
            Productivity Score
          </CardTitle>
          <CardDescription className="text-xs">This week&apos;s performance</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="relative h-[120px] sm:h-[160px] w-[120px] sm:w-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={12}
                data={productivityScore}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background={{ fill: "var(--muted)" }}
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl font-bold font-primary text-primary">78</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">out of 100</span>
            </div>
          </div>
          <p className="text-sm text-center text-muted-foreground mt-2">
            Great progress! Keep it up 🎯
          </p>
        </CardContent>
      </Card>

      {/* Task Status Bar Chart */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 font-primary text-base">
            <IconChartBar size={18} className="text-primary" />
            Task Status
          </CardTitle>
          <CardDescription className="text-xs">Completed vs pending this week</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barChartConfig} className="h-[140px] sm:h-[180px] w-full">
            <BarChart data={weeklyData.slice(0, 5)}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="day" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Category Distribution Pie Chart */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 font-primary text-base">
            <IconChartPie size={18} className="text-green-500" />
            Task Categories
          </CardTitle>
          <CardDescription className="text-xs">Distribution by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[140px] sm:h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2">
                          <p className="font-medium">{payload[0].name}</p>
                          <p className="text-sm text-muted-foreground">{payload[0].value}%</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Focus Time Distribution */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 font-primary text-base">
            <IconChartDonut size={18} className="text-purple-500" />
            Focus Distribution
          </CardTitle>
          <CardDescription className="text-xs">Time spent by activity type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[140px] sm:h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={focusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {focusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2">
                          <p className="font-medium">{payload[0].name}</p>
                          <p className="text-sm text-muted-foreground">{payload[0].value}%</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {focusDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
