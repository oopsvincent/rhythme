"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  CheckCircle2, 
  Circle, 
  Loader2,
  Activity,
  Brain,
  BookOpen
} from "lucide-react";
import { NowPanel } from "./now-panel";
import { MomentumMeter } from "./momentum-meter";
import { QuickJournalCard } from "./quick-journal-card";
import { ReflectionPrompt } from "./reflection-prompt";
import { CorrelationCard } from "./correlation-card";
import { useHabits, useLogCompletion } from "@/hooks/use-habits";
import { useTasks } from "@/hooks/use-tasks";
import { useFocusSessionsHistory } from "@/hooks/use-now-panel";
import { getLocalDateString } from "@/lib/timezone";
import { Journal } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DashboardClientProps {
  userName: string | null | undefined;
  journals: Journal[];
  isPremium: boolean;
}

interface AccordionSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionSection({ title, icon, children, isOpen, onToggle }: AccordionSectionProps) {
  return (
    <div className="border border-border/20 rounded-[22px] bg-card/35 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-border/30 shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold font-primary text-sm sm:text-base text-foreground/90 hover:bg-muted/5 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="p-4 sm:p-5 pt-0 border-t border-border/10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DashboardClient({ userName, journals, isPremium }: DashboardClientProps) {
  // Accordion states: Habits and Progress open by default on first load
  const [openSections, setOpenSections] = useState({
    habits: true,
    progress: true,
    reflection: false,
    insights: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Fetch client data for stats and compact lists
  const { data: habits = [], isLoading: habitsLoading } = useHabits();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: focusSessions = [], isLoading: focusLoading } = useFocusSessionsHistory(14);
  const logHabitCompletion = useLogCompletion();

  const todayStr = getLocalDateString();

  // 1. Compact Daily Habits List
  const dailyHabits = useMemo(() => {
    return habits.filter(h => h.frequency_num === 0 && h.is_active).slice(0, 5);
  }, [habits]);

  const handleHabitComplete = async (habitId: number) => {
    try {
      await logHabitCompletion.mutateAsync({ habitId });
      toast.success("Habit logged!");
    } catch {
      toast.error("Failed to log habit.");
    }
  };

  // 2. Stats Calculation for "Today's Progress"
  const stats = useMemo(() => {
    const dailyHabitsCount = dailyHabits.length;
    const completedDailyHabitsCount = dailyHabits.filter(h => h.isCompletedForPeriod).length;
    
    // Tasks completed today
    const completedTasksToday = tasks.filter(t => {
      if (t.status !== "completed" || !t.completed_at) return false;
      return t.completed_at.slice(0, 10) === todayStr;
    }).length;

    // Focus minutes today
    const focusMinsToday = focusSessions
      .filter(s => s.started_at.slice(0, 10) === todayStr)
      .reduce((acc, curr) => acc + Math.round((curr.actual_duration ?? curr.planned_duration ?? 0) / 60), 0);

    // Max streak across habits
    const maxHabitStreak = habits.reduce((max, h) => Math.max(max, h.current_streak || 0), 0);

    const habitProgressPercent = dailyHabitsCount > 0 
      ? Math.round((completedDailyHabitsCount / dailyHabitsCount) * 100) 
      : 0;

    return {
      habitProgress: habitProgressPercent,
      completedHabits: completedDailyHabitsCount,
      totalHabits: dailyHabitsCount,
      completedTasks: completedTasksToday,
      focusMins: focusMinsToday,
      streak: maxHabitStreak
    };
  }, [dailyHabits, tasks, focusSessions, habits, todayStr]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-12">
      {/* 1. Core Now Card centerpiece */}
      <NowPanel />

      {/* 1b. Dedicated Momentum Meter Card */}
      <MomentumMeter />

      {/* 2. Collapsible Accordion Sections */}
      <div className="flex flex-col gap-4">
        
        {/* SECTION A: Daily Habits */}
        <AccordionSection
          title="Daily Habits"
          icon={<Sparkles className="w-4 h-4 text-primary" />}
          isOpen={openSections.habits}
          onToggle={() => toggleSection("habits")}
        >
          {habitsLoading ? (
            <div className="py-6 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : dailyHabits.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">
              No daily habits configured for today.{" "}
              <a href="/habits" className="text-primary font-bold hover:underline">
                Create one
              </a>
            </p>
          ) : (
            <div className="space-y-2 pt-2">
              {dailyHabits.map((habit) => (
                <div
                  key={habit.habit_id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/10 hover:bg-muted/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => !habit.isCompletedForPeriod && handleHabitComplete(habit.habit_id)}
                      disabled={logHabitCompletion.isPending || habit.isCompletedForPeriod}
                      className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center border transition-all duration-200 shrink-0 cursor-pointer",
                        habit.isCompletedForPeriod
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/60 hover:border-primary hover:bg-primary/5"
                      )}
                    >
                      {habit.isCompletedForPeriod ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                    <span className={cn(
                      "text-xs sm:text-sm font-medium truncate",
                      habit.isCompletedForPeriod && "line-through text-muted-foreground"
                    )}>
                      {habit.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 select-none">
                    <span className="text-[10px] text-muted-foreground/80">
                      {habit.periodCompletions}/{habit.periodTarget} today
                    </span>
                    {habit.current_streak > 0 && (
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[9px] px-1.5 py-0">
                        <Flame className="w-2.5 h-2.5 mr-0.5 fill-current" />
                        {habit.current_streak}d
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </AccordionSection>

        {/* SECTION B: Today's Progress */}
        <AccordionSection
          title="Today's Progress"
          icon={<Activity className="w-4 h-4 text-emerald-500" />}
          isOpen={openSections.progress}
          onToggle={() => toggleSection("progress")}
        >
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-muted-foreground">
                <span>Habit Completion</span>
                <span className="text-foreground">{stats.habitProgress}%</span>
              </div>
              <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden border border-border/10">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.habitProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-muted/15 border border-border/10 flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Completed Habits</span>
                <span className="text-lg font-bold mt-1 text-foreground/95">{stats.completedHabits} / {stats.totalHabits}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/15 border border-border/10 flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Tasks Completed</span>
                <span className="text-lg font-bold mt-1 text-foreground/95">{stats.completedTasks}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/15 border border-border/10 flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Focus Duration</span>
                <span className="text-lg font-bold mt-1 text-foreground/95">{stats.focusMins}m</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/15 border border-border/10 flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Longest Streak</span>
                <span className="text-lg font-bold mt-1 text-foreground/95">{stats.streak}d</span>
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* SECTION C: Quick Reflection */}
        <AccordionSection
          title="Quick Reflection"
          icon={<BookOpen className="w-4 h-4 text-accent" />}
          isOpen={openSections.reflection}
          onToggle={() => toggleSection("reflection")}
        >
          <div className="space-y-4 pt-2">
            <ReflectionPrompt />
            <QuickJournalCard journals={journals} />
          </div>
        </AccordionSection>

        {/* SECTION D: Light Insights */}
        <AccordionSection
          title="Light Insights"
          icon={<Brain className="w-4 h-4 text-[#FFD066]" />}
          isOpen={openSections.insights}
          onToggle={() => toggleSection("insights")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <CorrelationCard
              headline="Peak Rhythm Anchor"
              detail="Your habits are most consistently completed in the mornings. Protecting this early anchor sets a steady cadence for the rest of your day."
              trend="up"
            />
            <CorrelationCard
              headline="Mindful Transitions"
              detail="Taking brief 5-minute breathing pauses between tasks cleanses cognitive residue and helps sustain higher focus capacities."
              trend="neutral"
            />
          </div>
        </AccordionSection>

      </div>
    </div>
  );
}
