"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Flame, 
  Sparkles, 
  AlertCircle, 
  Compass, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Activity
} from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { useHabits } from "@/hooks/use-habits";
import { useMoodLogs } from "@/hooks/use-mood-logs";
import { useFocusSessionsHistory } from "@/hooks/use-now-panel";
import { aggregateDailyLogs, calculateMomentumState } from "@/lib/rhythm-analysis";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function MomentumMeter() {
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: habits = [], isLoading: habitsLoading } = useHabits();
  const { data: moodLogs = [], isLoading: moodLoading } = useMoodLogs(14);
  const { data: focusSessions = [], isLoading: focusLoading } = useFocusSessionsHistory(14);
  
  const [showWin, setShowWin] = useState(false);

  const isLoading = tasksLoading || habitsLoading || moodLoading || focusLoading;

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-6 border border-border/40 animate-pulse space-y-4">
        <div className="h-4 w-28 bg-muted rounded" />
        <div className="h-8 w-44 bg-muted rounded" />
        <div className="h-12 w-full bg-muted rounded-xl" />
      </div>
    );
  }

  // Calculate daily logs and state
  const logs = aggregateDailyLogs(tasks, habits, [], moodLogs, focusSessions);
  const { state, streak, text, pastWin } = calculateMomentumState(logs);

  // Styling based on state
  const stateConfig = {
    building: {
      icon: Flame,
      color: "text-amber-500",
      bg: "from-amber-500/10 to-orange-500/5",
      border: "border-amber-500/20",
      badgeBg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      title: "Building",
    },
    stable: {
      icon: Sparkles,
      color: "text-emerald-500",
      bg: "from-emerald-500/10 to-teal-500/5",
      border: "border-emerald-500/20",
      badgeBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      title: "Stable",
    },
    drift: {
      icon: Compass,
      color: "text-sky-500",
      bg: "from-sky-500/10 to-blue-500/5",
      border: "border-sky-500/20",
      badgeBg: "bg-sky-500/10 text-sky-500 border-sky-500/20",
      title: "Drifting",
    },
    risk: {
      icon: AlertCircle,
      color: "text-rose-500",
      bg: "from-rose-500/10 to-red-500/5",
      border: "border-rose-500/20",
      badgeBg: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      title: "At Risk",
    },
  };

  const config = stateConfig[state];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "glass-card bg-gradient-to-br border shadow-md rounded-3xl p-6 sm:p-7 relative overflow-hidden",
        config.bg,
        config.border
      )}
    >
      {/* Decorative Glow */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Momentum Meter
            </span>
          </div>

          <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-widest", config.badgeBg)}>
            {config.title} • {streak}d streak
          </Badge>
        </div>

        {/* Core State Display */}
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 bg-background/50",
            config.border
          )}>
            <Icon className={cn("w-5.5 h-5.5", config.color)} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground/90 leading-snug">
              {text}
            </h3>
          </div>
        </div>

        {/* Past Win CTA */}
        {pastWin && (
          <div className="pt-2 border-t border-border/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWin(prev => !prev)}
              className="text-xs text-primary font-semibold hover:bg-primary/5 hover:text-primary p-0 h-auto cursor-pointer"
            >
              {showWin ? "Hide details" : "See what helped last time"}
            </Button>

            <AnimatePresence>
              {showWin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden mt-3"
                >
                  <div className="p-3.5 rounded-2xl bg-background/40 border border-border/30 text-xs text-muted-foreground leading-relaxed">
                    <div className="flex items-center gap-1.5 mb-1.5 font-bold text-foreground/75">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Historical Peak Recovery Win</span>
                    </div>
                    {pastWin.summary}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
