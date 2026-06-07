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
  HeartPulse,
  BookOpen,
  LucideIcon
} from "lucide-react";
import { Journal } from "@/types/database";
import { useMoodLogs } from "@/hooks/use-mood-logs";
import { MOOD_SCALE, getMoodOption, formatMoodScore } from "@/lib/mood";

// local type definitions for journal reflection sentiment
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

// Configuration for journal emotion tags
interface DayJournalMood {
  day: string;
  date: string;
  mood: MoodType | null;
  journalCount: number;
}

function getLast7DaysJournalMoods(journals: Journal[]): DayJournalMood[] {
  const days: DayJournalMood[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayJournals = journals.filter((j) => {
      const journalDate = new Date(j.created_at).toISOString().split("T")[0];
      return journalDate === dateStr;
    });

    let mood: MoodType | null = null;
    if (dayJournals.length > 0) {
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

// Helper for Daily Check-In mood_logs
interface DayCheckInMood {
  day: string;
  date: string;
  score: number | null;
}

function getLast7DaysCheckIns(moodLogs: any[]): DayCheckInMood[] {
  const days: DayCheckInMood[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayLog = moodLogs.find((l) => l.logged_at === dateStr);

    days.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: dayLog ? Number(dayLog.mood_score) : null,
    });
  }

  return days;
}

interface MoodChartProps {
  journals: Journal[];
}

export function MoodChart({ journals }: MoodChartProps) {
  // Query 7 days of mood logs for Chart 1
  const { data: logs = [], isLoading: isLogsLoading } = useMoodLogs(7);
  
  const checkInDays = getLast7DaysCheckIns(logs);
  const journalDays = getLast7DaysJournalMoods(journals);

  const hasAnyCheckIn = checkInDays.some((d) => d.score !== null);
  const hasAnyJournalMood = journalDays.some((d) => d.mood !== null);

  return (
    <div className="space-y-6">
      {/* ──────────────────────────────────────────────────────── */}
      {/* CHART 1: DAILY CHECK-IN MOOD (mood_logs) */}
      {/* ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            <div>
              <h3 className="text-sm font-semibold font-primary">Daily Check-In Mood</h3>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Self-reported energy & mood check-ins (1.0 - 5.0)
              </p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground shrink-0 select-none">Last 7 days</span>
        </div>

        {isLogsLoading ? (
          <div className="h-32 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !hasAnyCheckIn ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mb-2">
              <Smile className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              No check-ins logged. Check in using the card above!
            </p>
          </div>
        ) : (
          <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-36">
            {checkInDays.map((day, index) => {
              const option = getMoodOption(day.score);
              const barHeight = option ? (option.value / 5) * 100 : 0;
              const Icon = option?.icon;
              const isToday = index === checkInDays.length - 1;

              return (
                <div
                  key={`checkin-${day.date}`}
                  className="flex-1 flex flex-col items-center gap-1.5 group"
                >
                  {/* Tooltip on hover */}
                  {option && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center">
                      <p className={cn("text-[9px] font-bold leading-none capitalize", option.text)}>
                        {option.label}
                      </p>
                    </div>
                  )}

                  {/* Bar */}
                  <div className="w-full flex flex-col items-center justify-end h-20 relative">
                    {option ? (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${barHeight}%` }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.06,
                          ease: "easeOut",
                        }}
                        className={cn(
                          "w-full max-w-[28px] rounded-t-md relative overflow-hidden",
                          option.accent,
                          "opacity-85 group-hover:opacity-100 transition-opacity"
                        )}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                      </motion.div>
                    ) : (
                      <div className="w-full max-w-[28px] h-[3px] rounded-full bg-muted/30" />
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-transparent",
                      option ? option.softAccent : "bg-muted/20"
                    )}
                  >
                    {Icon ? (
                      <Icon className={cn("w-3.5 h-3.5", option.text)} />
                    ) : (
                      <Minus className="w-3.5 h-3.5 text-muted-foreground/40" />
                    )}
                  </div>

                  {/* Day label */}
                  <span
                    className={cn(
                      "text-[9px] sm:text-xs",
                      isToday ? "font-bold text-primary" : "text-muted-foreground"
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

      {/* ──────────────────────────────────────────────────────── */}
      {/* CHART 2: JOURNAL REFLECTION SENTIMENT (journals) */}
      {/* ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-500" />
            <div>
              <h3 className="text-sm font-semibold font-primary">Journal Reflection Sentiment</h3>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Emotions detected from journal reflections (1 - 7 scale)
              </p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground shrink-0 select-none">Last 7 days</span>
        </div>

        {!hasAnyJournalMood ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mb-2">
              <Smile className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              No journal tags yet. Write a reflection to analyze sentiment!
            </p>
          </div>
        ) : (
          <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-36">
            {journalDays.map((day, index) => {
              const config = day.mood ? moodConfig[day.mood] : null;
              const barHeight = config ? (config.value / 7) * 100 : 0;
              const Icon = config?.icon;
              const isToday = index === journalDays.length - 1;

              return (
                <div
                  key={`journal-${day.date}`}
                  className="flex-1 flex flex-col items-center gap-1.5 group"
                >
                  {/* Tooltip on hover */}
                  {config && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center">
                      <p className={cn("text-[9px] font-bold leading-none capitalize", config.color)}>
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
                          delay: index * 0.06,
                          ease: "easeOut",
                        }}
                        className={cn(
                          "w-full max-w-[28px] rounded-t-md relative overflow-hidden",
                          config.bgColor,
                          "opacity-85 group-hover:opacity-100 transition-opacity"
                        )}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                      </motion.div>
                    ) : (
                      <div className="w-full max-w-[28px] h-[3px] rounded-full bg-muted/30" />
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-transparent",
                      config ? `${config.bgColor}/10` : "bg-muted/20"
                    )}
                  >
                    {Icon ? (
                      <Icon className={cn("w-3.5 h-3.5", config.color)} />
                    ) : (
                      <Minus className="w-3.5 h-3.5 text-muted-foreground/40" />
                    )}
                  </div>

                  {/* Day label */}
                  <span
                    className={cn(
                      "text-[9px] sm:text-xs",
                      isToday ? "font-bold text-primary" : "text-muted-foreground"
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
    </div>
  );
}

function Loader2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
