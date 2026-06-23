"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  BookOpen,
  Sparkles,
  TrendingUp,
  Brain
} from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { useHabits } from "@/hooks/use-habits";
import { useMoodLogs } from "@/hooks/use-mood-logs";
import { useFocusSessionsHistory } from "@/hooks/use-now-panel";
import { aggregateDailyLogs, calculateRhythmStory } from "@/lib/rhythm-analysis";

export function RhythmStoryCard() {
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: habits = [], isLoading: habitsLoading } = useHabits();
  const { data: moodLogs = [], isLoading: moodLoading } = useMoodLogs(14);
  const { data: focusSessions = [], isLoading: focusLoading } = useFocusSessionsHistory(14);

  const isLoading = tasksLoading || habitsLoading || moodLoading || focusLoading;

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-6 border border-border/40 animate-pulse space-y-4">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-6 w-48 bg-muted rounded" />
        <div className="h-16 w-full bg-muted rounded-xl" />
      </div>
    );
  }

  // Calculate rhythm story
  const logs = aggregateDailyLogs(tasks, habits, [], moodLogs, focusSessions);
  const { headline, story } = calculateRhythmStory(logs);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      className="glass-card bg-gradient-to-br from-violet-500/5 via-indigo-500/5 to-transparent border border-indigo-500/10 shadow-lg rounded-3xl p-6 sm:p-7 relative overflow-hidden"
    >
      {/* Decorative Glow */}
      <div className="absolute right-0 top-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Your Rhythm Story
          </span>
        </div>

        {/* Narrative Content */}
        <div className="space-y-2">
          <h4 className="text-lg font-bold tracking-tight text-foreground/90 font-primary">
            {headline}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed font-sans">
            {story}
          </p>
        </div>

        {/* Bottom indicator */}
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 pt-2 border-t border-border/10">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Reflected client-side from your recent logs</span>
        </div>
      </div>
    </motion.div>
  );
}
