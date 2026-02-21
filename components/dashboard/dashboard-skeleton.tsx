// components/dashboard/dashboard-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="glass-card rounded-2xl p-5 space-y-3"
        >
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  )
}

export function QuickActionsSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-center gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-14 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function TodayOverviewSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <Skeleton className="h-5 w-32" />
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full max-w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ActivityFeedSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <Skeleton className="h-5 w-32" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full max-w-64" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <Skeleton className="h-[200px] w-full rounded-lg" />
    </div>
  )
}

export function MoodInputSkeleton() {
  return (
    <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50">
      <Skeleton className="h-4 w-40 mb-3" />
      <div className="flex flex-wrap gap-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>
    </div>
  )
}

export function HabitsWidgetSkeleton() {
  return (
    <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-1 w-full rounded-full mb-3" />
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 flex-1 max-w-32" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function QuickJournalSkeleton() {
  return (
    <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-3 w-48 mb-2" />
      <Skeleton className="h-20 w-full rounded-lg" />
    </div>
  )
}

export function ProductivitySummarySkeleton() {
  return (
    <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50">
      <Skeleton className="h-4 w-28 mb-3" />
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-3 rounded-lg bg-muted/30">
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReflectionPromptSkeleton() {
  return (
    <div className="rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
      <div className="flex items-start gap-3">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-4 w-full max-w-64 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  )
}

export function MoodChartSkeleton() {
  return (
    <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex items-end justify-between gap-2 h-36">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <Skeleton className="w-full max-w-[32px] rounded-t-lg" style={{ height: `${20 + Math.random() * 60}%` }} />
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-3 w-6" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SentimentChartSkeleton() {
  return (
    <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-7 w-20 rounded-lg" />
      </div>
      <Skeleton className="h-[140px] w-full rounded-lg" />
    </div>
  )
}

