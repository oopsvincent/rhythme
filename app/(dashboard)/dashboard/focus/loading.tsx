import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function FocusLoading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <SiteHeader />
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        {/* Session tabs skeleton */}
        <div className="flex gap-2 mb-8">
          <Skeleton className="w-20 h-9 rounded-full" />
          <Skeleton className="w-24 h-9 rounded-full" />
          <Skeleton className="w-24 h-9 rounded-full" />
        </div>
        
        {/* Timer skeleton */}
        <Skeleton className="w-64 h-64 sm:w-80 sm:h-80 rounded-full mb-8" />
        
        {/* Controls skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-20 h-20 rounded-full" />
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
        
        {/* Action bar skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-md" />
          <Skeleton className="w-10 h-10 rounded-md" />
          <Skeleton className="w-10 h-10 rounded-md" />
          <Skeleton className="w-10 h-10 rounded-md" />
        </div>
      </div>
    </div>
  );
}
