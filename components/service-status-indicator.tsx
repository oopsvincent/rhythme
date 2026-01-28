"use client";

import { useWarmServices } from "@/hooks/use-warm-services";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Minimal status indicator for ML services.
 * Shows a tiny dot that's almost invisible unless you look for it.
 * PRD-aligned: "Clarity > Features" - doesn't distract, just informs if noticed.
 */
export function ServiceStatusIndicator() {
  const { status, isReady, retry } = useWarmServices();

  // Don't show anything if ready - completely invisible success
  if (isReady) {
    return null;
  }

  const statusConfig = {
    idle: { color: "bg-muted-foreground/30", label: "Connecting..." },
    waking: { color: "bg-yellow-500/70 animate-pulse", label: "Waking AI services..." },
    ready: { color: "bg-green-500", label: "AI ready" },
    error: { color: "bg-red-500/50", label: "AI offline (click to retry)" },
  };

  const config = statusConfig[status];

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={status === "error" ? retry : undefined}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              config.color,
              status === "error" && "cursor-pointer hover:opacity-100"
            )}
            aria-label={config.label}
          />
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {config.label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
