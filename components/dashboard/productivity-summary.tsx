"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Flame, 
  Timer,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { useHabits } from "@/hooks/use-habits";

const FOCUS_STORAGE_KEY = "rhythme_focus_sessions";

interface FocusSession {
  id: string;
  duration: number;
  completedAt: string;
}

interface TaskData {
  completed: number;
  total: number;
}

export function ProductivitySummary() {
  const { data: habits = [], isLoading: habitsLoading } = useHabits();
  const [focusMinutes, setFocusMinutes] = useState(0);
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load focus sessions from localStorage
    const stored = localStorage.getItem(FOCUS_STORAGE_KEY);
    if (stored) {
      try {
        const sessions: FocusSession[] = JSON.parse(stored);
        const today = new Date().toISOString().split('T')[0];
        const todaySessions = sessions.filter(s => s.completedAt.startsWith(today));
        const totalMinutes = todaySessions.reduce((sum, s) => sum + Math.floor(s.duration / 60), 0);
        setFocusMinutes(totalMinutes);
      } catch (e) {
        console.error("Failed to parse focus sessions:", e);
      }
    }
    setIsLoading(false);
  }, []);

  // Calculate habit stats
  const dailyHabits = habits.filter(h => h.frequency === "daily");
  const completedHabits = dailyHabits.filter(h => h.completedToday).length;
  const totalHabits = dailyHabits.length;
  const bestStreak = Math.max(...habits.map(h => h.streak_count), 0);

  // Don't show if no data available
  const hasData = totalHabits > 0 || focusMinutes > 0;

  if (isLoading || habitsLoading) {
    return (
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!hasData) {
    return null;
  }

  const stats = [
    {
      label: "Habits Done",
      value: `${completedHabits}/${totalHabits}`,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      show: totalHabits > 0,
    },
    {
      label: "Best Streak",
      value: bestStreak.toString(),
      icon: Flame,
      color: "text-primary",
      bgColor: "bg-primary/10",
      show: bestStreak > 0,
    },
    {
      label: "Focus Time",
      value: `${focusMinutes}m`,
      icon: Timer,
      color: "text-accent",
      bgColor: "bg-accent/10",
      show: focusMinutes > 0,
    },
    {
      label: "Completion",
      value: totalHabits > 0 ? `${Math.round((completedHabits / totalHabits) * 100)}%` : "0%",
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      show: totalHabits > 0,
    },
  ].filter(s => s.show);

  if (stats.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-accent" />
        <h3 className="font-semibold font-primary text-sm">Today's Progress</h3>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + index * 0.05 }}
              className={`p-3 rounded-lg ${stat.bgColor}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-lg font-bold font-primary">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
