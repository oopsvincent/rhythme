import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function AiLoading() {
  return (
    <>
      <SiteHeader />
      <div className="flex-1 flex flex-col pt-8 px-4 md:px-10 pb-20 md:pb-10 max-w-5xl mx-auto w-full items-center space-y-8 relative z-10">
        
        {/* Header Badges and Titles */}
        <div className="text-center space-y-4 w-full flex flex-col items-center">
          <div className="flex gap-3 justify-center">
            <Skeleton className="h-7 w-32 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="h-5 w-96 rounded-md" />
        </div>

        {/* View Switcher Bar */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-border/10 bg-muted/10">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-36 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>

        {/* Roadmap content skeleton (default view) */}
        <div className="w-full space-y-6 pt-4">
          
          {/* Goal Progress Card */}
          <div className="rounded-2xl border border-border/10 p-6 bg-card/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-6 w-60 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-3 w-8 rounded" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>

          {/* Interactive Roadmap Timeline nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/5 p-4 bg-muted/5 flex flex-col items-center space-y-3 text-center">
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5 w-full flex flex-col items-center">
                  <Skeleton className="h-4.5 w-16 rounded" />
                  <Skeleton className="h-3 w-12 rounded" />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </>
  );
}
