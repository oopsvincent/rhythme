import { Skeleton } from "@/components/ui/skeleton";
import { FerrisWheel } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full bg-green-400 text-primary flex justify-center items-center">
        <Skeleton className="w-25 h-10" />
    </div>
  );
}