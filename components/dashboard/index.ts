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
export { ReflectionPrompt } from "./reflection-prompt"
export { ProductivitySummary } from "./productivity-summary"

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
} from "./dashboard-skeleton"

