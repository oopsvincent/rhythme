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
  BarChart3,
  LucideIcon,
} from "lucide-react";
import { Journal } from "@/types/database";

type MoodType =
  | "happy"
  | "calm"
  | "neutral"
  | "sad"
  | "frustrated"
  | "excited"
  | "anxious";

interface MoodConfig {
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
  value: number; // 1-7 scale for chart height
}

const moodConfig: Record<MoodType, MoodConfig> = {
  frustrated: {
    icon: Angry,
    label: "Frustrated",
    color: "text-red-500",
    bgColor: "bg-red-500",
    value: 1,
  },
  sad: {
    icon: Frown,
    label: "Sad",
    color: "text-indigo-400",
    bgColor: "bg-indigo-400",
    value: 2,
  },
  anxious: {
    icon: AlertCircle,
    label: "Anxious",
    color: "text-orange-400",
    bgColor: "bg-orange-400",
    value: 3,
  },
  neutral: {
    icon: Minus,
    label: "Neutral",
    color: "text-gray-400",
    bgColor: "bg-gray-400",
    value: 4,
  },
  calm: {
    icon: CloudSun,
    label: "Calm",
    color: "text-blue-400",
    bgColor: "bg-blue-400",
    value: 5,
  },
  happy: {
    icon: Smile,
    label: "Happy",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500",
    value: 6,
  },
  excited: {
    icon: Star,
    label: "Excited",
    color: "text-pink-500",
    bgColor: "bg-pink-500",
    value: 7,
  },
};

interface DayMood {
  day: string; // e.g. "Mon"
  date: string; // e.g. "Feb 17"
  mood: MoodType | null;
  journalCount: number;
}

function getLast7DaysMoods(journals: Journal[]): DayMood[] {
  const days: DayMood[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD

    // Find journals for this day
    const dayJournals = journals.filter((j) => {
      const journalDate = new Date(j.created_at).toISOString().split("T")[0];
      return journalDate === dateStr;
    });

    // Use the most recent journal's mood for that day
    let mood: MoodType | null = null;
    if (dayJournals.length > 0) {
      // Sort by created_at descending, take the latest
      const latest = dayJournals.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
      mood = (latest.mood_tags?.mood as MoodType) || null;
    }

    days.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      mood,
      journalCount: dayJournals.length,
    });
  }

  return days;
}

interface MoodChartProps {
  journals: Journal[];
}

export function MoodChart({ journals }: MoodChartProps) {
  const days = getLast7DaysMoods(journals);
  const maxValue = 7;
  const hasAnyMood = days.some((d) => d.mood !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold font-primary">Mood Timeline</h3>
        </div>
        <span className="text-xs text-muted-foreground">Last 7 days</span>
      </div>

      {!hasAnyMood ? (
        /* Empty state */
        <div className="flex flex-col items-center py-6 text-center">
          <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mb-2">
            <Smile className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            No mood data yet. Start journaling to see your mood trends!
          </p>
        </div>
      ) : (
        /* Chart */
        <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-36">
          {days.map((day, index) => {
            const config = day.mood ? moodConfig[day.mood] : null;
            const barHeight = config
              ? (config.value / maxValue) * 100
              : 0;
            const Icon = config?.icon;
            const isToday = index === days.length - 1;

            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center gap-1.5 group"
              >
                {/* Tooltip on hover */}
                {config && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center">
                    <p
                      className={cn(
                        "text-[10px] font-medium capitalize",
                        config.color
                      )}
                    >
                      {config.label}
                    </p>
                  </div>
                )}

                {/* Bar */}
                <div className="w-full flex flex-col items-center justify-end h-20 relative">
                  {config ? (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${barHeight}%` }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.08,
                        ease: "easeOut",
                      }}
                      className={cn(
                        "w-full max-w-[32px] rounded-t-lg relative overflow-hidden",
                        config.bgColor,
                        "opacity-80 group-hover:opacity-100 transition-opacity"
                      )}
                    >
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
                    </motion.div>
                  ) : (
                    <div className="w-full max-w-[32px] h-[4px] rounded-full bg-muted/40" />
                  )}
                </div>

                {/* Icon */}
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                    config
                      ? `${config.bgColor}/20`
                      : "bg-muted/30"
                  )}
                >
                  {Icon ? (
                    <Icon
                      className={cn("w-3 h-3", config?.color)}
                    />
                  ) : (
                    <Minus className="w-3 h-3 text-muted-foreground/50" />
                  )}
                </div>

                {/* Day label */}
                <span
                  className={cn(
                    "text-[10px] sm:text-xs",
                    isToday
                      ? "font-bold text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {isToday ? "Today" : day.day}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
