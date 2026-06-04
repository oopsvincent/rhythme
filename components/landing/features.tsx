"use client";

import React, { useState } from "react";
import {
  Compass,
  Target,
  Sparkles,
  Heart,
  Brain,
  Timer,
  CheckCircle,
  Lock,
  Flame,
  Activity,
  Smile,
  Eye,
  Sliders,
  TrendingUp,
  Award,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RoadmapStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badge: string;
  mockup: React.ReactNode;
}

const FeaturesSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeStep, setActiveStep] = useState<number | null>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const steps: RoadmapStep[] = [
    {
      id: 1,
      title: "Goal Structuring Onboarding",
      subtitle: "Turn vague ambitions into clear, actionable paths",
      description: "Enter your long-term goal. Our 70B model analyzes your ambition and generates tailored first steps, milestones, and initial habit recommendations in seconds.",
      icon: Target,
      accentColor: "#E07A5F", // terracotta
      badge: "Step 01 • ONBOARDING",
      mockup: (
        <div className="space-y-3 font-sans">
          <div className="text-[10px] uppercase font-bold tracking-wider text-primary">Goal Processor</div>
          <div className="p-3 rounded-xl bg-card border border-border/40 text-[11px] font-medium italic select-text">
            &ldquo;My goal is to learn Japanese grammar and vocab to pass JLPT N4 in 6 months.&rdquo;
          </div>
          <div className="flex gap-2">
            <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold">70B AI Engine</span>
            <span className="text-[9px] bg-accent/15 text-accent-foreground px-2 py-0.5 rounded-full font-bold">Roadmap Formed</span>
          </div>
          <div className="border-t border-border/20 pt-2.5 space-y-1.5 text-[10px]">
            <div className="flex items-center gap-1.5 text-foreground/80"><CheckCircle className="w-3 h-3 text-emerald-500" /> Milestone 1: Master Hiragana & Katakana</div>
            <div className="flex items-center gap-1.5 text-foreground/80"><CheckCircle className="w-3 h-3 text-emerald-500" /> Daily Habit: Review 25 Anki cards</div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Now Panel",
      subtitle: "One calm screen that answers: 'What should I do right now?'",
      description: "No endless backlogs or overwhelming calendar blocks. The Now Panel isolates your single recommended task, active habit, and realistic energy capacity for today.",
      icon: Compass,
      accentColor: "#8AA8A1", // sage
      badge: "Step 02 • WORKSPACE",
      mockup: (
        <div className="space-y-4 font-sans select-text">
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-bold text-muted-foreground uppercase">Now Focus</span>
            <span className="font-bold text-amber-500 flex items-center gap-0.5"><Flame className="w-3 h-3 fill-amber-500" /> 12d Streak</span>
          </div>
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1">
            <div className="text-[9px] font-bold text-primary uppercase">Single Priority Action</div>
            <h5 className="text-xs font-bold text-foreground">Configure Supabase DB Schema & seed test profiles</h5>
          </div>
          <div className="p-3 rounded-xl border border-border/40 bg-card/60 flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Today&apos;s Capacity</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Stable Flow</span>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Daily Logging Loop",
      subtitle: "Frictionless unified input under 30 seconds",
      description: "Log your completed tasks, daily habits, mood ratings, focus sessions, and quick reflections through a single unified command bar. No heavy data-entry.",
      icon: CheckCircle,
      accentColor: "#E07A5F",
      badge: "Step 03 • ACTION LOOP",
      mockup: (
        <div className="space-y-3 font-sans">
          <div className="text-[10px] font-bold text-muted-foreground uppercase">Unified Entry Loop</div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-card/30 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-border/20">
              <span className="text-foreground/80 font-medium">Task: Complete DB setup</span>
              <div className="size-4 rounded-md border-2 border-primary bg-primary flex items-center justify-center text-white"><CheckCircle className="w-3.5 h-3.5 stroke-[3]" /></div>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-border/20">
              <span className="text-foreground/80 font-medium">Habit: Read 15 pages</span>
              <div className="size-4 rounded-md border border-border flex items-center justify-center" />
            </div>
            <div className="flex gap-1.5 justify-center pt-1">
              {['😔', '😐', '🙂', '🤩'].map((emoji, idx) => (
                <div key={idx} className={cn("size-7 rounded-lg border border-border/40 flex items-center justify-center text-xs", idx === 3 ? "bg-primary/10 border-primary" : "")}>
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Personal Behavioral Insights",
      subtitle: "Discover your real productivity correlations",
      description: "Identify hidden variables affecting your focus (e.g. how mood impacts task completion, or how journaling frequency reduces weekly anxiety) with calm, explainable statistical insights.",
      icon: Sparkles,
      accentColor: "#8AA8A1",
      badge: "Step 04 • ANALYTICS",
      mockup: (
        <div className="space-y-3 font-sans select-text">
          <div className="text-[10px] font-bold text-muted-foreground uppercase">Attentional Correlations</div>
          <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-accent-foreground">
              <Brain className="w-4 h-4 text-primary" />
              <span>Energy x Journaling Insight</span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              On days you log <span className="font-semibold text-foreground">mood checks before 10 AM</span>, your tasks completed increases by <span className="font-semibold text-foreground">+24%</span> and attentional fatigue remains low.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Focus Session Intelligence",
      subtitle: "Enhanced Pomodoro driven by energy levels",
      description: "An adaptive focus timer that prompts you to check your subjective energy baseline before and after sessions, updating your personal rhythm model over time.",
      icon: Timer,
      accentColor: "#E07A5F",
      badge: "Step 05 • DEEP WORK",
      mockup: (
        <div className="space-y-3 font-sans text-center">
          <div className="text-[10px] font-bold text-muted-foreground uppercase text-left">Focus Session</div>
          <div className="p-4 rounded-xl border border-border/50 bg-card/40 flex flex-col items-center">
            <div className="text-xl font-bold font-primary text-foreground mb-1 select-text">24:59</div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-widest mb-3">Pomodoro Interval</div>
            
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden mb-3">
              <div className="h-full bg-primary rounded-full" style={{ width: '75%' }} />
            </div>
            
            <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold select-none flex items-center gap-1">
              <Timer className="w-3 h-3" /> Soundscape: Rain
            </span>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Momentum Meter",
      subtitle: "Directional attention logs instead of stress-inducing streaks",
      description: "Traditional streaks punish you for taking necessary breaks. Our Momentum Meter gauges your status (Building, Stable, Drift, Risk) to reward consistency while permitting cognitive recovery.",
      icon: Activity,
      accentColor: "#8AA8A1",
      badge: "Step 06 • MOMENTUM",
      mockup: (
        <div className="space-y-4 font-sans select-text">
          <div className="text-[10px] font-bold text-muted-foreground uppercase">Cognitive Baseline</div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-foreground">Current State:</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              Stable Flow
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Attention consistency</span>
              <span>84%</span>
            </div>
            <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: '84%' }} />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Smart Weekly Reflection",
      subtitle: "Guided prompts to review your week and adjust alignment",
      description: "An automated summary reviewing your weekly wins, energy bottlenecks, and strongest behavioral correlations, prompting you to refine next week's milestones.",
      icon: Brain,
      accentColor: "#E07A5F",
      badge: "Step 07 • REFLECTION",
      mockup: (
        <div className="space-y-3 font-sans select-text">
          <div className="text-[10px] font-bold text-muted-foreground uppercase">Weekly Review Summary</div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-card/40 space-y-2">
            <h6 className="text-xs font-bold text-foreground">Wins & Blockers:</h6>
            <p className="text-[10px] leading-relaxed text-muted-foreground">
              - Completed 4 milestones in SaaS App.<br />
              - Attentional fatigue peaked on Thursday (sleep deficiency).<br />
              - Suggested correction: Keep tasks under 30m on Thursdays.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "Privacy-First Design",
      subtitle: "End-to-end encrypted journals & local computing",
      description: "Your journals and personal reflections are fully encrypted. Processing is conducted locally or anonymously to ensure your personal logs stay completely yours.",
      icon: Lock,
      accentColor: "#8AA8A1",
      badge: "Step 08 • PRIVACY",
      mockup: (
        <div className="space-y-3.5 font-sans select-text">
          <div className="text-[10px] font-bold text-muted-foreground uppercase">Data Security</div>
          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Zero-Telemetry Encryption</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Your data is secured using AES-GCM-256 local keys. No tracking cookies are stored and we never monetize your telemetry.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div 
      id="features" 
      className="relative min-h-screen py-24 px-6 sm:px-8 bg-background overflow-hidden z-10"
      onMouseMove={handleMouseMove}
    >
      {/* Mouse Follow Glow */}
      <div 
        className="pointer-events-none absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] transition-all duration-700 ease-out z-0"
        style={{ 
          background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
        }}
      />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8888880a_1px,transparent_1px),linear-gradient(to_bottom,#8888880a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_80%,transparent_100%)] pointer-events-none z-0" />

      {/* Section Title */}
      <section className="text-center mb-20 relative z-10">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/8 text-accent text-xs font-semibold border border-accent/20">
            Product Features Roadmap
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-primary leading-tight text-foreground text-balance">
            Find your rhythm, <span className="text-gradient-primary">step-by-step</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed font-sans">
            Explore the core journey of a focused day in Rhythmé. See how onboarding, executing, logging, and reflecting are unified into a single roadmap.
          </p>
        </div>
      </section>

      {/* Vertical Timeline Roadmap */}
      <section className="relative z-10 max-w-5xl mx-auto px-2 sm:px-4">
        {/* Central Vertical Timeline Path Line */}
        <div className="absolute left-6 md:left-1/2 top-10 bottom-10 w-[2px] bg-border/40 -translate-x-[1px] pointer-events-none">
          {/* Animated pulsing gradient path overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary via-accent to-primary animate-pulse duration-[3000ms]" />
        </div>

        <div className="space-y-16 md:space-y-24 relative select-text">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLeft = idx % 2 === 0;
            const active = activeStep === idx;

            return (
              <div 
                key={step.id} 
                className={cn(
                  "flex flex-col md:flex-row items-stretch md:items-center relative w-full",
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                )}
                onMouseEnter={() => setActiveStep(idx)}
              >
                {/* Node point marker */}
                <div 
                  className={cn(
                    "absolute left-6 md:left-1/2 size-10 rounded-full border bg-background flex items-center justify-center z-20 cursor-pointer -translate-x-[19px] transition-all duration-300 select-none",
                    active 
                      ? "border-primary glow-primary scale-110" 
                      : "border-border hover:border-primary/50"
                  )}
                  style={{ top: "12px", transformOrigin: "center" }}
                  onClick={() => setActiveStep(idx)}
                >
                  <Icon className={cn("w-4 h-4 transition-colors duration-300", active ? "text-primary" : "text-muted-foreground")} />
                </div>

                {/* Left/Right Text Content Card Column */}
                <div className="w-full md:w-1/2 pl-14 md:pl-0 pr-0 md:pr-10 select-text">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className={cn(
                      "p-6 rounded-3xl glass-card border border-border/60 transition-all duration-300 text-left cursor-pointer",
                      isLeft ? "md:text-right" : "md:text-left",
                      active ? "border-primary/40 shadow-xl shadow-primary/5" : "hover:border-primary/25"
                    )}
                    onClick={() => setActiveStep(idx)}
                  >
                    <span 
                      className="text-[9px] font-black uppercase tracking-wider font-sans"
                      style={{ color: step.accentColor }}
                    >
                      {step.badge}
                    </span>
                    <h3 className="text-xl font-bold font-primary text-foreground mt-1 mb-2">
                      {step.title}
                    </h3>
                    <h4 className="text-xs font-semibold text-accent-foreground/90 font-sans mb-3 text-balance">
                      {step.subtitle}
                    </h4>
                    <p className="text-muted-foreground text-xs leading-relaxed font-sans">
                      {step.description}
                    </p>
                  </motion.div>
                </div>

                {/* Overlapping Mockup Panel column */}
                <div className="w-full md:w-1/2 pl-14 md:pl-10 pr-0 mt-4 md:mt-0 select-text">
                  <div 
                    className={cn(
                      "p-5 rounded-3xl bg-card/25 border border-border/40 shadow-inner h-[190px] flex flex-col justify-center transition-all duration-500 overflow-hidden relative group",
                      active ? "border-primary/30 bg-card/45 shadow-primary/5" : "opacity-60 hover:opacity-90"
                    )}
                  >
                    {/* Glowing highlight inside mockup on active step */}
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
                    )}
                    {step.mockup}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default FeaturesSection;
