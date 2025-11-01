import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className="container p-2">
      <SiteHeader />

      <div className="max-w-3xl mx-auto mt-8">
        <div className=" rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="mb-6">
            <Skeleton className="text-3xl font-bold mb-2 w-[25%] h-10"></Skeleton>
            <div className="flex gap-2">
              <Skeleton className="w-[20%] h-8" />
              <Skeleton className="w-[20%] h-8" />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <Skeleton className="w-full h-10"></Skeleton>
          </div>

          {/* Details */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Due Date:</span>
              <Skeleton className="w-[20%] h-6"></Skeleton>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Created:</span>
              <Skeleton className="w-[20%] h-6"></Skeleton>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Updated:</span>
              <Skeleton className="w-[20%] h-6"></Skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default loading;
