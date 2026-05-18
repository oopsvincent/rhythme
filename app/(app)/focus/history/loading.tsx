import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function FocusHistoryLoading() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col px-4 md:px-10">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 max-w-3xl mx-auto w-full">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 rounded-2xl" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
