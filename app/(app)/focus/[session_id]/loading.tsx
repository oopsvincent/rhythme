import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function SessionDetailLoading() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col px-4 md:px-10">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-6 py-4 md:py-6 max-w-2xl mx-auto w-full">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        </div>
      </div>
    </>
  );
}
