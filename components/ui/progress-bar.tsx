"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showLabel?: boolean
  className?: string
  barClassName?: string
  ariaLabel?: string
  color?: "primary" | "accent" | "emerald"
  size?: "sm" | "md"
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showLabel = false,
  className,
  barClassName,
  ariaLabel,
  color = "primary",
  size = "md",
}: ProgressBarProps) {
  const shouldReduceMotion = useReducedMotion()
  const [isPulsing, setIsPulsing] = React.useState(false)

  // Track previous value to avoid pulsing on initial mount
  const prevValueRef = React.useRef(value)

  React.useEffect(() => {
    if (shouldReduceMotion) return

    if (prevValueRef.current !== value) {
      setIsPulsing(true)
      const timer = setTimeout(() => setIsPulsing(false), 800)
      prevValueRef.current = value
      return () => clearTimeout(timer)
    }
  }, [value, shouldReduceMotion])

  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {showLabel && (label || value !== undefined) && (
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>{label}</span>
          <span>
            {value} / {max} {label?.toLowerCase().includes("day") ? "" : "days"}
          </span>
        </div>
      )}
      <div
        className={cn(
          "bg-muted/60 dark:bg-muted/30 relative w-full rounded-full overflow-hidden",
          size === "sm" ? "h-1" : "h-1.5 sm:h-2"
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel || label || "Progress"}
      >
        <motion.div
          className={cn(
            "h-full rounded-full relative transition-shadow duration-500",
            color === "primary" && "bg-primary",
            color === "accent" && "bg-accent",
            color === "emerald" && "bg-emerald-500",
            isPulsing && color === "primary" && "shadow-[0_0_12px_rgba(224,122,95,0.65)]",
            isPulsing && color === "accent" && "shadow-[0_0_12px_rgba(138,168,161,0.65)]",
            isPulsing && color === "emerald" && "shadow-[0_0_12px_rgba(16,185,129,0.65)]",
            barClassName
          )}
          style={{ originX: 0 }}
          initial={{ width: 0 }}
          animate={{
            width: `${pct}%`,
            scale: isPulsing ? 1.015 : 1,
            scaleY: isPulsing ? 1.15 : 1,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  width: { type: "spring", stiffness: 85, damping: 15, mass: 0.8 },
                  scale: { duration: 0.3, ease: "easeOut" },
                  scaleY: { duration: 0.3, ease: "easeOut" },
                }
          }
        >
          {/* Constantly moving liquid wave overlays */}
          {!shouldReduceMotion && pct > 0 && (
            <>
              <div className="absolute inset-0 animate-liquid-1 rounded-full overflow-hidden" />
              <div className="absolute inset-0 animate-liquid-2 rounded-full overflow-hidden" />
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
