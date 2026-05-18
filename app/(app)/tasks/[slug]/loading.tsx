import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function TaskDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <SiteHeader />
      
      <div className="max-w-3xl mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          <Skeleton className="w-20 h-8" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-md" />
          </div>
        </div>

        {/* Content */}
        <div className="py-8 space-y-6">
          {/* Title */}
          <Skeleton className="h-12 w-3/4" />

          {/* Properties */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 py-2">
              <Skeleton className="w-24 h-5" />
              <Skeleton className="w-24 h-5" />
            </div>
            <div className="flex items-center gap-4 py-2">
              <Skeleton className="w-24 h-5" />
              <Skeleton className="w-20 h-5" />
            </div>
            <div className="flex items-center gap-4 py-2">
              <Skeleton className="w-24 h-5" />
              <Skeleton className="w-32 h-8" />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/50" />

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-5 w-3/5" />
          </div>

          {/* Metadata */}
          <div className="pt-8 border-t border-border/50 space-y-2">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
