import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function MoodLoading() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center px-4 pb-16 md:px-8 relative overflow-hidden min-h-[calc(100vh-var(--header-height))]">
        <div className="w-full max-w-2xl py-8 md:py-14 relative z-10 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col items-center space-y-3 text-center">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>

          {/* Centerpiece Preview Area */}
          <div className="hidden sm:block w-full max-w-md mx-auto h-[80px] rounded-2xl border border-border/10 bg-muted/10 p-4">
            <div className="flex items-center gap-3.5 h-full">
              <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-3.5 w-full rounded" />
              </div>
            </div>
          </div>

          {/* Interactive slider / selector skeleton */}
          <div className="max-w-md mx-auto space-y-8 pt-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center px-2">
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
              <Skeleton className="h-4 w-full rounded-full" />
            </div>

            {/* Sub-selectors (energy, note placeholder) */}
            <div className="space-y-4 pt-4">
              <Skeleton className="h-4 w-28 rounded" />
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-xl" />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>

            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </main>
    </>
  );
}
