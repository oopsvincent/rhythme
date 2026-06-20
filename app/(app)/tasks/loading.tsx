import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function TasksLoading() {
  return (
    <>
      <SiteHeader />
      <div className="px-4 md:px-10 pb-28 md:pb-10 max-w-5xl mx-auto w-full space-y-6 pt-4">
        {/* Page Title & Actions Header */}
        <div className="flex items-center justify-between py-4">
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-28 rounded-lg" />
            <Skeleton className="h-4 w-48 rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/20 p-5 bg-card/25 space-y-3">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-7 w-12 rounded" />
              {i === 0 && <Skeleton className="h-1.5 w-full rounded-full" />}
            </div>
          ))}
        </div>

        {/* Inline Add Task Input */}
        <div className="relative border border-border/30 bg-muted/10 rounded-2xl p-2.5 shadow-sm">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 shrink-0 rounded-lg" />
            <Skeleton className="h-5 flex-1 rounded" />
          </div>
        </div>

        {/* Tasks List Skeletons */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/20 bg-card/10">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Skeleton className="h-5 w-5 shrink-0 rounded" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-[60%] rounded" />
                  <Skeleton className="h-3 w-[30%] rounded" />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
