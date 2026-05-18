import { Spinner } from "@/components/ui/spinner";
import { FerrisWheel } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full text-primary flex justify-center items-center">
      {/* top wave (mirror of bottom) */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden">
        <div className="wave-wrap wave-top-wrap">
          <svg
            className="w-full h-40 md:h-64 wave flip-vertical"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              className="text-accent"
              d="M0,192L80,176C160,160,320,128,480,138.7C640,149,800,203,960,197.3C1120,192,1280,128,1360,96L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            />
          </svg>
        </div>
      </div>

      {/* CENTER TEXT (between waves when they meet) */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="shutter-text text-sm md:text-base font-medium opacity-0">
            Framing your rhythm… synchronizing data
          </div>
        </div>
      </div>

      {/* BOTTOM: original wave (unchanged path) */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
        <div className="wave-wrap wave-bottom-wrap">
          <svg
            className="w-full h-40 md:h-64 wave"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              className="text-primary"
              d="M0,192L80,176C160,160,320,128,480,138.7C640,149,800,203,960,197.3C1120,192,1280,128,1360,96L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
