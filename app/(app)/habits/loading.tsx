import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function HabitsLoading() {
  return (
    <>
      <SiteHeader />
      <div className="px-4 md:px-10 pb-28 md:pb-10 max-w-5xl mx-auto w-full space-y-6 pt-4">
        
        {/* Header Section */}
        <div className="flex items-center justify-between py-4">
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-24 rounded-lg" />
            <Skeleton className="h-4 w-52 rounded-md" />
          </div>
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>

        {/* Overview Stats (3 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="relative rounded-xl border border-border/15 p-5 bg-card/15 space-y-3">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-7 w-16 rounded" />
              {i === 0 && <Skeleton className="h-1.5 w-full rounded-full mt-2" />}
            </div>
          ))}
        </div>

        {/* Habit Sections List */}
        <div className="space-y-8 pt-4">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border/10 p-5 bg-card/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-32 rounded" />
                        <Skeleton className="h-3 w-16 rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                  <div className="flex justify-between items-center pt-1">
                    <Skeleton className="h-4.5 w-14 rounded" />
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
