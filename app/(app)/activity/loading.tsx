import { SiteHeader } from "@/components/site-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function ActivityLoading() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col gap-6 px-3 py-4 sm:px-4 md:py-6 lg:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-10 w-48 rounded-xl" />
              <Skeleton className="h-10 w-36 rounded-xl" />
              <Skeleton className="h-10 w-56 rounded-xl" />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
            <Skeleton className="hidden h-[420px] rounded-3xl xl:block" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-72 rounded-xl" />
              <Skeleton className="h-40 rounded-3xl" />
              <Skeleton className="h-40 rounded-3xl" />
              <Skeleton className="h-40 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
