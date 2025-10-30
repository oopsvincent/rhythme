import { Spinner } from "@/components/ui/spinner";
import { FerrisWheel } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full text-primary flex justify-center items-center">
        <Spinner className="animate-spin size-36" />
    </div>
  );
}