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
