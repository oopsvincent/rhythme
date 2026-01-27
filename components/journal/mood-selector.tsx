"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Smile, 
  CloudSun, 
  Minus, 
  Frown, 
  Angry, 
  Star, 
  AlertCircle,
  LucideIcon
} from "lucide-react";

export type MoodType = 'happy' | 'calm' | 'neutral' | 'sad' | 'frustrated' | 'excited' | 'anxious';

interface MoodOption {
  type: MoodType;
  icon: LucideIcon;
  label: string;
  color: string;
}

const moods: MoodOption[] = [
  { type: 'happy', icon: Smile, label: 'Happy', color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-600 dark:text-yellow-400' },
  { type: 'calm', icon: CloudSun, label: 'Calm', color: 'bg-blue-400/20 border-blue-400/40 text-blue-600 dark:text-blue-400' },
  { type: 'neutral', icon: Minus, label: 'Neutral', color: 'bg-gray-400/20 border-gray-400/40 text-gray-600 dark:text-gray-400' },
  { type: 'sad', icon: Frown, label: 'Sad', color: 'bg-indigo-400/20 border-indigo-400/40 text-indigo-600 dark:text-indigo-400' },
  { type: 'frustrated', icon: Angry, label: 'Frustrated', color: 'bg-red-500/20 border-red-500/40 text-red-600 dark:text-red-400' },
  { type: 'excited', icon: Star, label: 'Excited', color: 'bg-pink-500/20 border-pink-500/40 text-pink-600 dark:text-pink-400' },
  { type: 'anxious', icon: AlertCircle, label: 'Anxious', color: 'bg-orange-400/20 border-orange-400/40 text-orange-600 dark:text-orange-400' },
];

// Export mood icons for use in other components
export const moodIcons: Record<MoodType, LucideIcon> = {
  happy: Smile,
  calm: CloudSun,
  neutral: Minus,
  sad: Frown,
  frustrated: Angry,
  excited: Star,
  anxious: AlertCircle,
};

interface MoodSelectorProps {
  value: MoodType | null;
  onChange: (mood: MoodType) => void;
  className?: string;
}

export function MoodSelector({ value, onChange, className }: MoodSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-sm font-medium text-muted-foreground">
        How are you feeling?
      </label>
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => {
          const isSelected = value === mood.type;
          const Icon = mood.icon;
          return (
            <motion.button
              key={mood.type}
              type="button"
              onClick={() => onChange(mood.type)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200",
                "hover:shadow-md",
                isSelected
                  ? cn(mood.color, "border-2 shadow-lg")
                  : "bg-muted/50 border-transparent text-muted-foreground hover:border-border"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{mood.label}</span>
              {isSelected && (
                <motion.div
                  layoutId="mood-indicator"
                  className="absolute inset-0 rounded-full ring-2 ring-primary/50"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
