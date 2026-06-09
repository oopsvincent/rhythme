"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Activity, 
  Brain, 
  Lock,
  ChevronRight
} from "lucide-react";
import { RhythmeLogo } from "@/components/rhythme-logo";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  index: number;
}

const features = [
  {
    icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
    title: "Sleek Task & Habit Tracker",
    description: "Manage your tasks and build habits with visual contribution boards, weekly review notes, and streaks.",
    badge: "Core"
  },
  {
    icon: <BookOpen className="w-6 h-6 text-accent" />,
    title: "Reflective Mood Logs",
    description: "Secure, encrypted journaling integrated with daily mood tracker check-ins to build emotional intelligence.",
  },
  {
    icon: <Activity className="w-6 h-6 text-emerald-500" />,
    title: "Pomodoro Deep Focus Mode",
    description: "Run custom Pomodoro sessions with session notes, focus statistics, and clean ambient screen triggers.",
  },
  {
    icon: <Brain className="w-6 h-6 text-indigo-400" />,
    title: "AI Weekly Intelligence",
    description: "Review automated weekly insights detailing correlations between your habits, task completion, and mood logs.",
    badge: "AI Powered"
  }
];

export default function SignupIntroPage() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 select-none ${mounted && isMobile ? "pb-32" : ""}`}>
      {/* Background blobs for premium ambient lighting */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      
      {/* Decorative Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between">
        <RhythmeLogo size="sm" />
        <Link 
          href="/login" 
          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          Sign in
        </Link>
      </header>

      {/* Main Content Showcase */}
      <main className="relative z-10 w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center py-10 sm:py-16 gap-8">
        
        {/* Intro Tag & Header */}
        <div className="text-center space-y-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary tracking-wider uppercase mb-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Productivity Reimagined
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-primary font-black tracking-tight leading-[1.1] text-balance"
          >
            Welcome to <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Rhythmé
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto font-sans"
          >
            The premium productivity workspace that unifies execution and emotional awareness. Discover your focus streak.
          </motion.p>
        </div>

        {/* Dynamic Card Grid / Mobile steps */}
        {mounted && isMobile ? (
          <div className="w-full flex flex-col gap-6">
            <div className="min-h-[160px] flex items-center justify-center">
              <FeatureCard
                key={currentStep}
                icon={features[currentStep].icon}
                title={features[currentStep].title}
                description={features[currentStep].description}
                badge={features[currentStep].badge}
                index={0}
              />
            </div>
            
            {/* Step Indicator dots */}
            <div className="flex justify-center gap-2 mt-2 select-none">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`size-2.5 rounded-full transition-all duration-300 ${
                    i === currentStep 
                      ? "bg-primary w-6" 
                      : "bg-muted-foreground/20 hover:bg-muted-foreground/40"
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <FeatureCard
              icon={<CheckCircle2 className="w-6 h-6 text-primary" />}
              title="Sleek Task & Habit Tracker"
              description="Manage your tasks and build habits with visual contribution boards, weekly review notes, and streaks."
              badge="Core"
              index={0}
            />
            <FeatureCard
              icon={<BookOpen className="w-6 h-6 text-accent" />}
              title="Reflective Mood Logs"
              description="Secure, encrypted journaling integrated with daily mood tracker check-ins to build emotional intelligence."
              index={1}
            />
            <FeatureCard
              icon={<Activity className="w-6 h-6 text-emerald-500" />}
              title="Pomodoro Deep Focus Mode"
              description="Run custom Pomodoro sessions with session notes, focus statistics, and clean ambient screen triggers."
              index={2}
            />
            <FeatureCard
              icon={<Brain className="w-6 h-6 text-indigo-400" />}
              title="AI Weekly Intelligence"
              description="Review automated weekly insights detailing correlations between your habits, task completion, and mood logs."
              badge="AI Powered"
              index={3}
            />
          </div>
        )}

        {/* CTA Container */}
        {(!mounted || !isMobile) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-md flex flex-col items-center gap-3.5 mt-4"
          >
            <Button
              className="w-full rounded-2xl h-12 text-sm font-semibold shadow-lg shadow-primary/10 hover:shadow-primary/25 cursor-pointer bg-gradient-to-r from-primary to-accent border-none text-primary-foreground hover:scale-[1.02] transition-all duration-200"
              asChild
            >
              <Link href="/signup/create">
                <span className="flex items-center justify-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </Button>
            <Link 
              href="/signup/create"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Skip intro
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
              <Lock className="w-3 h-3" />
              <span>Secure account registration via Amplecen ID</span>
            </div>
          </motion.div>
        )}

      </main>

      {/* Mobile Fixed Bottom CTA */}
      {mounted && isMobile && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border/40 z-20 flex flex-col items-center gap-2">
          <Button
            onClick={() => {
              if (currentStep < 3) {
                setCurrentStep(prev => prev + 1);
              } else {
                router.push("/signup/create");
              }
            }}
            className="w-full max-w-md rounded-2xl h-12 text-sm font-semibold shadow-lg shadow-primary/10 hover:shadow-primary/25 cursor-pointer bg-gradient-to-r from-primary to-accent border-none text-primary-foreground hover:scale-[1.02] transition-all duration-200"
          >
            <span className="flex items-center justify-center gap-2">
              {currentStep < 3 ? "Next" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
          {currentStep < 3 && (
            <button
              onClick={() => router.push("/signup/create")}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground py-1 transition-colors duration-200 cursor-pointer"
            >
              Skip intro
            </button>
          )}
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/80">
            <Lock className="w-3 h-3" />
            <span>Secure account registration via Amplecen ID</span>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-border/40 text-xs text-muted-foreground/60 font-sans">
        <p>© {new Date().getFullYear()} Rhythmé Inc. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/legal/cookie" className="hover:text-foreground transition-colors">Cookie Policy</Link>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, badge, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index + 0.2 }}
      whileHover={{ y: -4 }}
      className="group p-6 backdrop-blur-md bg-card/30 hover:bg-card/45 border border-border/40 hover:border-primary/30 rounded-[24px] shadow-xs hover:shadow-lg hover:shadow-primary/2 transition-colors duration-300 flex flex-col gap-4 text-left justify-between"
    >
      <div className="space-y-4">
        {/* Icon & Badge Header */}
        <div className="flex justify-between items-center">
          <div className="p-3 bg-muted/10 rounded-2xl group-hover:bg-primary/5 transition-colors duration-300">
            {icon}
          </div>
          {badge && (
            <span className="text-[9px] font-extrabold tracking-wider bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase">
              {badge}
            </span>
          )}
        </div>
        
        {/* Text Details */}
        <div className="space-y-1.5">
          <h3 className="font-semibold text-base text-foreground font-primary group-hover:text-primary transition-colors duration-300 flex items-center gap-1.5">
            {title}
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-sans">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
