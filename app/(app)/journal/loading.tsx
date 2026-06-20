import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function JournalLoading() {
  return (
    <>
      <SiteHeader />
      <div className="flex-1 flex flex-col min-h-screen bg-background relative overflow-y-auto overflow-x-hidden pt-4">
        {/* Background paper texture & glow system placeholder */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.03] blur-[130px] bg-primary/20" />
          <div className="absolute bottom-1/4 left-1/10 w-[500px] h-[500px] rounded-full opacity-[0.02] blur-[110px] bg-accent/20" />
        </div>

        <div className="w-full max-w-5xl mx-auto px-4 md:px-10 pb-20 md:pb-10 relative z-10 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
            <div className="space-y-1">
              <Skeleton className="h-8 w-44 rounded-lg" />
              <Skeleton className="h-4 w-60 rounded-md" />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Skeleton className="h-9 w-28 rounded-xl" />
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-2xl">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/10 p-3 bg-muted/10">
                <Skeleton className="h-3 w-16 rounded mb-1" />
                <Skeleton className="h-6 w-10 rounded" />
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 rounded-xl" />
              <Skeleton className="h-10 w-28 rounded-xl" />
            </div>
          </div>

          {/* Journal Entries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border/15 p-5 bg-card/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-[90%] rounded" />
                  <Skeleton className="h-3.5 w-[40%] rounded" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
