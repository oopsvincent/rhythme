"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MoodType } from "./mood-selector";

// Mood color mappings for the aura effect
const moodColors: Record<MoodType, { primary: string; secondary: string }> = {
  happy: { primary: "#FFD93D", secondary: "#F7B32B" },
  calm: { primary: "#6BCB77", secondary: "#4ECCA3" },
  neutral: { primary: "#9CA3AF", secondary: "#6B7280" },
  sad: { primary: "#6366F1", secondary: "#4F46E5" },
  frustrated: { primary: "#EF4444", secondary: "#DC2626" },
  excited: { primary: "#F472B6", secondary: "#EC4899" },
  anxious: { primary: "#FB923C", secondary: "#F97316" },
};

interface EmotionalAuraProps {
  mood: MoodType;
  intensity?: number; // 1-5
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-32 h-32",
};

export function EmotionalAura({
  mood,
  intensity = 3,
  size = "md",
  animated = true,
  className,
  children,
}: EmotionalAuraProps) {
  const colors = moodColors[mood] || moodColors.neutral;
  const blurAmount = 8 + intensity * 4; // 12-28px blur
  const opacityAmount = 0.3 + intensity * 0.1; // 0.4-0.8 opacity

  return (
    <div className={cn("relative inline-flex items-center justify-center", sizeClasses[size], className)}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          filter: `blur(${blurAmount}px)`,
          opacity: opacityAmount,
        }}
        animate={animated ? {
          scale: [1, 1.1, 1],
          opacity: [opacityAmount, opacityAmount * 0.8, opacityAmount],
        } : undefined}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Inner ring */}
      <motion.div
        className="absolute inset-1 rounded-full"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}40, ${colors.secondary}40)`,
          border: `2px solid ${colors.primary}60`,
        }}
        animate={animated ? {
          rotate: [0, 360],
        } : undefined}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Content container */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
}

// Export mood colors for use in other components
export { moodColors };
