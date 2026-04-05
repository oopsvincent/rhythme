// components/dashboard/index.ts
// Re-export all dashboard components

export { DashboardStats } from "./dashboard-stats"
export { QuickActions } from "./quick-actions"
export { TodayOverview } from "./today-overview"
export { ActivityFeed } from "./activity-feed"
export { ProductivityCharts } from "./productivity-charts"

// New dashboard widgets
export { MoodInputCard } from "./mood-input-card"
export { HabitsWidget } from "./habits-widget"
export { QuickJournalCard } from "./quick-journal-card"
export { QuickActionsFab } from "./quick-actions-fab"
export { ReflectionPrompt } from "./reflection-prompt"
export { ProductivitySummary } from "./productivity-summary"
export { MoodChart } from "./mood-chart"
export { SentimentChart } from "./sentiment-chart"
export { WeeklyWidget } from "./weekly-widget"

export {
  DashboardStatsSkeleton,
  QuickActionsSkeleton,
  TodayOverviewSkeleton,
  ActivityFeedSkeleton,
  ChartSkeleton,
  MoodInputSkeleton,
  HabitsWidgetSkeleton,
  QuickJournalSkeleton,
  ProductivitySummarySkeleton,
  ReflectionPromptSkeleton,
  MoodChartSkeleton,
  SentimentChartSkeleton,
} from "./dashboard-skeleton"

