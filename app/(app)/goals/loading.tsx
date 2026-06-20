import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function GoalsLoading() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col px-4 md:px-10 pt-4 max-w-5xl mx-auto w-full space-y-6">
        
        {/* Page Title Section */}
        <div className="flex items-center justify-between py-4">
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-20 rounded-lg" />
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/10 p-5 bg-card/10 space-y-2">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-6 w-10 rounded" />
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-border/20 pb-2 pt-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/10 p-5 bg-card/10 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-[80%] rounded" />
                <Skeleton className="h-3.5 w-[95%] rounded" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <Skeleton className="h-3 w-12 rounded" />
                  <Skeleton className="h-3 w-8 rounded" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
