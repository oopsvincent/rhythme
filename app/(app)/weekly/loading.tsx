import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function WeeklyLoading() {
  return (
    <>
      <SiteHeader />
      <div className="flex-1 flex flex-col pt-4 px-4 md:px-10 pb-20 md:pb-10 max-w-5xl mx-auto w-full space-y-6">
        
        {/* Header with week switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-48 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-xl" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
        </div>

        {/* Plan / Review Tabs Selector */}
        <div className="flex gap-2 border-b border-border/30 pb-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>

        {/* Tab Content skeleton (Plan tab layout by default) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* Left Column: Weekly Intentions */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border/10 p-5 bg-card/10 space-y-4">
              <div className="space-y-1">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-3 w-48 rounded" />
              </div>
              <div className="space-y-3 pt-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-2">
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/10 p-5 bg-card/10 space-y-4">
              <div className="space-y-1">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-3.5 w-40 rounded" />
              </div>
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>

          {/* Right Column: Focus Habits */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border/10 p-5 bg-card/10 space-y-4">
              <div className="space-y-1">
                <Skeleton className="h-5 w-28 rounded" />
                <Skeleton className="h-3.5 w-48 rounded" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/5 bg-background/50">
                    <Skeleton className="h-4.5 w-4.5 rounded" />
                    <Skeleton className="h-4 w-20 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
