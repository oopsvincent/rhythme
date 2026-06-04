"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Sparkles,
  Compass,
  Heart,
  ArrowRight,
  Shield,
  Eye,
  Lock,
  Brain,
  Lightbulb,
  Zap,
  ChevronDown,
  ChevronRight,
  Check,
  Flame,
  BookOpen,
  TrendingUp,
  BarChart3,
  Timer,
  Volume2,
  VolumeX,
  Sparkle,
  Layers,
  Activity,
  Smile,
  ArrowDown
} from "lucide-react";
import { TextGradient } from "@/components/text-gradient";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import PricingComponent from "./pricing";

interface RhythmeLandingProps {
  user?: {
    id: string;
  } | null;
}

// Particle type for goal completion explosion
interface Particle {
  id: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  color: string;
}

// Synthesizer chime for interactive actions
const playChime = (type: 'complete' | 'click' | 'success' | 'refinement', enabled: boolean) => {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (type === 'complete') {
      // Warm E5 (659.25Hz) and A5 (880Hz) chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.5);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08 + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.08);
      osc2.stop(ctx.currentTime + 0.08 + 0.6);
    } else if (type === 'success') {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.4);
      });
    } else if (type === 'refinement') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else { // 'click'
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    }
  } catch (e) {
    console.warn("Audio synthesis failed:", e);
  }
};

const RhythmeLanding: React.FC<RhythmeLandingProps> = ({ user }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // Interactive Sandbox state
  const [activeTab, setActiveTab] = useState<'goal' | 'habits' | 'journal' | 'analytics'>('goal');
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Tab 1: Goal state
  const [selectedGoalIdx, setSelectedGoalIdx] = useState(0);
  const [goalChecked, setGoalChecked] = useState(false);
  const [goalProgress, setGoalProgress] = useState(40);
  const [goalStreak, setGoalStreak] = useState(12);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Tab 2: Habits state
  const [habitsData, setHabitsData] = useState([
    { name: "90m Deep Focus", streak: 5, completedDays: [true, true, true, false, false, false, false] },
    { name: "Read 15 Pages", streak: 2, completedDays: [true, true, false, false, false, false, false] },
    { name: "Write reflection journal", streak: 14, completedDays: [true, true, true, true, false, false, false] }
  ]);

  // Tab 3: Reflection state
  const [selectedMood, setSelectedMood] = useState<'struggling' | 'flat' | 'productive' | 'flow' | null>(null);
  const [aiAnalysisText, setAiAnalysisText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Tab 4: Analytics hover state
  const [hoveredBarIdx, setHoveredBarIdx] = useState<number | null>(null);

  const goalPresets = [
    { 
      title: "Launch Indie SaaS App", 
      category: "Development", 
      milestones: "4 / 10 Completed",
      action: "Set up supabase authentication & proxy schemas",
      desc: "Takes ~45 minutes to hook up auth. Completing this ensures you have active authentication before building secondary database dependencies."
    },
    { 
      title: "Run a 21km Half Marathon", 
      category: "Fitness", 
      milestones: "3 / 8 Completed",
      action: "6km steady base run at easy breathing pace",
      desc: "Focus on cardiovascular zone 2 conditioning. Don't worry about speed; focus on consistency and running without physical strain."
    },
    { 
      title: "Speak Conversational Japanese", 
      category: "Language", 
      milestones: "5 / 12 Completed",
      action: "Review 30 custom Kanji cards on Anki deck",
      desc: "Daily review reinforces SRS (Spaced Repetition System). Ensure you finish your review queue before learning new vocabulary."
    }
  ];

  const moodInsights = {
    flow: "AI Insights: Your cognitive alignment is excellent today. Your reflection indicates high efficacy. Pro-tip: Lock in this momentum by documenting your core breakthrough now.",
    productive: "AI Insights: Great steady progress. You completed your primary action. AI Suggestion: Keep building on this baseline. You're on track.",
    flat: "AI Insights: A calm, neutral day. Consistency is the quiet engine of growth. AI Suggestion: Reflect on what drained your energy today.",
    struggling: "AI Insights: It is okay to have off days. Procrastination is often just emotional regulation. AI Suggestion: Tomorrow, let's break your Next Best Action into a 5-minute task. Slow progress is still progress."
  };

  // Mouse tilt effect for 3D Hero Mockups
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    
    // Tilt calculations
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = (e.clientX - width / 2) / (width / 2) * 10; // -10 to 10 degrees
    const y = (e.clientY - height / 2) / (height / 2) * -10; // -10 to 10 degrees
    setTilt({ x, y });
  };

  // Goal Presets change callback
  const handleGoalChange = (idx: number) => {
    playChime('click', audioEnabled);
    setSelectedGoalIdx(idx);
    setGoalChecked(false);
    setGoalProgress(40);
    setGoalStreak(12);
  };

  // Check action callback
  const handleCheckAction = () => {
    if (goalChecked) {
      // uncheck
      playChime('click', audioEnabled);
      setGoalChecked(false);
      setGoalProgress(40);
      setGoalStreak(12);
    } else {
      // check
      playChime('complete', audioEnabled);
      setGoalChecked(true);
      setGoalProgress(50);
      setGoalStreak(13);

      // Create burst particles
      const newParticles = Array.from({ length: 20 }).map((_, i) => ({
        id: Math.random(),
        x: (Math.random() - 0.5) * 220,
        y: (Math.random() - 0.5) * 220 - 40,
        rotate: Math.random() * 360,
        scale: Math.random() * 0.7 + 0.4,
        color: i % 2 === 0 ? "var(--primary)" : "var(--accent)"
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 1000);
    }
  };

  // Habit cell click callback
  const toggleHabitDay = (hIdx: number, dIdx: number) => {
    const updated = [...habitsData];
    const prevVal = updated[hIdx].completedDays[dIdx];
    updated[hIdx].completedDays[dIdx] = !prevVal;
    
    setHabitsData(updated);

    if (!prevVal) {
      // Checked
      playChime('click', audioEnabled);
      
      // If full week completed, play success sound
      const fullWeek = updated[hIdx].completedDays.every(d => d);
      if (fullWeek) {
        setTimeout(() => playChime('success', audioEnabled), 200);
        updated[hIdx].streak += 1;
      }
    } else {
      playChime('click', audioEnabled);
    }
  };

  // Mood selection callback
  const selectMood = (mood: 'struggling' | 'flat' | 'productive' | 'flow') => {
    playChime('refinement', audioEnabled);
    setSelectedMood(mood);
    setAiAnalysisText("");
    setIsTyping(true);
  };

  // Typewriter effect simulation for AI analysis
  useEffect(() => {
    if (!selectedMood) return;
    const targetText = moodInsights[selectedMood];
    let currentText = "";
    let index = 0;
    
    const timer = setInterval(() => {
      if (index < targetText.length) {
        currentText += targetText.charAt(index);
        setAiAnalysisText(currentText);
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 15);

    return () => clearInterval(timer);
  }, [selectedMood]);

  // Privacy & Transparency values
  const trustValues = [
    { 
      icon: Lock, 
      title: "Your Data, Your Control", 
      description: "We never sell your data. Period. Your journal entries, goals, and reflections stay yours. Export everything anytime." 
    },
    { 
      icon: Eye, 
      title: "Transparent AI Guidance", 
      description: "When AI assists you, we show you exactly why it made that suggestion. No hidden telemetry, no black boxes." 
    },
    { 
      icon: Shield, 
      title: "Privacy by Design", 
      description: "Secure by default. Local storage backups, explicit Supabase encryption, and completely anonymous browsing." 
    },
  ];

  // Core pillars
  const pillars = [
    {
      icon: Target,
      title: "One Goal Focus",
      description: "Set one meaningful long-term goal. Everything else aligns to move you forward.",
      accent: "var(--primary)"
    },
    {
      icon: Compass,
      title: "Next Best Action",
      description: "Every day, one small doable step. No overwhelm. Just clarity.",
      accent: "var(--accent)"
    },
    {
      icon: Heart,
      title: "Supportive Reflections",
      description: "Daily micro-journals help you understand your patterns.",
      accent: "var(--primary)"
    },
  ];

  // FAQ
  const faqs = [
    {
      question: "How is my data used?",
      answer: "Your data is used only to power your personal experience. We never sell, share, or use your data for advertising. When we use AI features, we're transparent about what data is accessed and why."
    },
    {
      question: "Can I delete my data?",
      answer: "Yes, completely. You can export all your data anytime and request full deletion. No hidden copies, no retention periods beyond what's legally required."
    },
    {
      question: "What makes Rhythmé different?",
      answer: "We're building for the long term—researching human-aware systems that understand attention, procrastination, and focus in the age of short-form dopamine. We're not just another productivity app."
    },
  ];

  return (
    <div 
      className="min-h-screen w-full bg-background relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Decorative Interactive Mesh Backdrop */}
      <div 
        className="pointer-events-none fixed w-[500px] h-[500px] rounded-full opacity-15 blur-[120px] transition-all duration-700 ease-out z-0"
        style={{ 
          background: "radial-gradient(circle, var(--primary) 0%, var(--accent) 70%, transparent 100%)",
          left: mousePosition.x - 250,
          top: mousePosition.y - 250,
        }}
      />

      {/* Grid Pattern mask backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8888880a_1px,transparent_1px),linear-gradient(to_bottom,#8888880a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_80%,transparent_100%)] pointer-events-none z-0" />

      {/* Ambient static blur nodes */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[6000ms]"></div>
      <div className="absolute bottom-1/4 left-[-15%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[5000ms]" style={{ animationDelay: "2s" }}></div>

      {/* ============================================
          HERO SECTION - Re-designed split layout
      ============================================ */}
      <section className="pt-32 sm:pt-36 md:pt-40 pb-20 px-6 sm:px-8 relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left: Text Details */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Pulsing Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/20 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs font-semibold tracking-wide text-primary uppercase font-sans">
                  The Anti-Dopamine Focus Engine
                </span>
              </div>
            </motion.div>

            {/* Main Premium Typography */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] font-primary tracking-tight text-foreground text-balance"
            >
              You know where you want to go. <br />
              <span className="text-gradient-primary">We help you start.</span>
            </motion.h1>

            {/* Premium Supporting copy */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground font-sans max-w-2xl leading-relaxed"
            >
              In a world of constant notification triggers and infinite feeds, Rhythmé gives you <span className="text-foreground font-semibold">one clear step</span> toward your long-term goal. Every single day. No burnout. No clutter.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-start pt-2"
            >
              <Link href="/signup/intro" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 group border-0 text-white font-semibold">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              
              <button 
                onClick={() => {
                  playChime('click', audioEnabled);
                  document.getElementById("sandbox")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-base px-6 py-3 rounded-xl border border-border hover:border-primary/40 backdrop-blur-sm bg-card/30 hover:bg-card/70 text-foreground transition-all duration-300"
              >
                Play Sandbox Demo
                <ArrowDown className="w-4 h-4 text-muted-foreground animate-bounce" />
              </button>
            </motion.div>

            {/* Social Proof / Trust metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/40 max-w-md"
            >
              <div className="flex -space-x-3">
                {[
                  "from-amber-400 to-orange-500",
                  "from-emerald-400 to-teal-600",
                  "from-blue-400 to-indigo-600",
                  "from-pink-500 to-purple-500"
                ].map((gradient, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "size-8 rounded-full border-2 border-background bg-gradient-to-br flex items-center justify-center text-[10px] font-bold text-white shadow-sm",
                      gradient
                    )}
                  >
                    {["JD", "MK", "AL", "VT"][i]}
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Join <span className="font-semibold text-foreground">14,200+</span> creators & builders finding their daily focus.
              </div>
            </motion.div>
          </div>

          {/* Right: Floating 3D angulate card stack (Interactive mockup showcase) */}
          <div className="lg:col-span-5 relative w-full h-[450px] sm:h-[500px] flex items-center justify-center lg:justify-end select-none mt-10 lg:mt-0">
            {/* Background glowing circle */}
            <div className="absolute inset-0 m-auto size-80 bg-gradient-to-br from-primary/10 to-accent/15 rounded-full blur-[80px]" />

            {/* Stack elements wrapper */}
            <motion.div 
              style={{
                rotateX: tilt.y,
                rotateY: tilt.x,
                transformStyle: "preserve-3d"
              }}
              className="relative w-full max-w-[380px] h-full flex items-center justify-center transition-all duration-300 ease-out"
            >
              {/* Card 1: Goal Workspace (Rear floating) */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[-10px] top-6 w-[290px] p-5 rounded-2xl glass-card border border-border/60 shadow-xl z-10 transform -rotate-6 transform-gpu"
              >
                <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-primary/80 uppercase font-sans tracking-wider">
                  <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> GOAL WORKSPACE</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">Active</span>
                </div>
                <h4 className="text-base font-bold font-primary mb-2 text-foreground">Launch Indie SaaS App</h4>
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Milestones</span>
                    <span>4 / 10</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[40%] bg-primary rounded-full" />
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Habit Streaks (Middle overlapping) */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute right-[-10px] bottom-10 w-[300px] p-5 rounded-2xl glass-card border border-border/60 shadow-2xl z-20 transform rotate-3 transform-gpu"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-accent-foreground/90 flex items-center gap-1.5 uppercase font-sans tracking-wider">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" /> Daily Streaks
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full">Consistent</span>
                </div>
                
                <div className="space-y-2">
                  {[
                    { name: "90m Deep Focus", streak: 5 },
                    { name: "Reflection Journal", streak: 14 }
                  ].map((habit, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-foreground/80 font-medium">{habit.name}</span>
                      <span className="font-bold flex items-center gap-1 text-amber-500">
                        {habit.streak}d <Flame className="w-3 h-3 fill-amber-500" />
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Card 3: Micro-Journal (Front glowing) */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                whileHover={{ scale: 1.05, rotate: 0 }}
                className="absolute w-[310px] p-5 rounded-2xl glass-card border-primary/30 border shadow-2xl z-30 transform -rotate-1 transform-gpu hover:shadow-primary/5 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-foreground font-primary">Reflective Journal</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">Today, 9:30 AM</span>
                </div>
                <div className="p-3 rounded-lg bg-muted/40 text-[11px] leading-relaxed italic text-foreground/90 font-serif">
                  &ldquo;Focus feels natural when the target is clear. Today I completed billing, and the mental load is halved.&rdquo;
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-primary font-medium">
                  <Sparkles className="w-3 h-3" /> Sentiment: Calm & Aligned
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ============================================
          INTERACTIVE APP SANDBOX SECTION
      ============================================ */}
      <section id="sandbox" className="py-24 px-6 sm:px-8 relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/8 text-accent text-xs font-semibold border border-accent/20">
              Interactive Sandbox Playground
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-primary text-foreground">
              Experience the Rhythmé Dashboard
            </h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              Test out the core interface features right here. Try checking off a task, setting habit days, or selecting a mood to see how Rhythmé adapts.
            </p>
          </motion.div>
        </div>

        {/* Mac-style Window Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full glass-card rounded-3xl border border-border/70 shadow-2xl overflow-hidden flex flex-col h-[520px] sm:h-[480px]"
        >
          {/* Header OS style bar */}
          <div className="px-6 py-4 border-b border-border/40 bg-card/60 backdrop-blur-md flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <div className="size-3 rounded-full bg-red-500/80" />
              <div className="size-3 rounded-full bg-amber-500/80" />
              <div className="size-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-xs font-semibold text-muted-foreground font-sans tracking-wide">
              rhythme_sandbox_v0.67.dev
            </div>
            
            {/* Chime controls */}
            <button 
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-all duration-300 bg-background/50 border border-border/40 px-2.5 py-1 rounded-lg"
              title="Toggle Sandbox Chime Sound"
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden xs:inline">Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="hidden xs:inline">Muted</span>
                </>
              )}
            </button>
          </div>

          {/* Sandbox Body Layout */}
          <div className="flex flex-1 overflow-hidden flex-col sm:flex-row">
            {/* Sidebar Mock navigation */}
            <div className="w-full sm:w-[220px] bg-card/20 border-b sm:border-b-0 sm:border-r border-border/30 p-3 sm:p-4 flex flex-row sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible shrink-0 scrollbar-none">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2.5 mb-3">
                <div className="size-6 rounded-lg border border-primary/20 bg-background flex items-center justify-center">
                  <Image src="/Rhythme.svg" alt="logo" width={14} height={14} />
                </div>
                <span className="font-primary font-black text-sm text-foreground">Rhythmé App</span>
              </div>

              {[
                { id: 'goal', label: 'One Goal Focus', icon: Target },
                { id: 'habits', label: 'Habit Streaks', icon: Flame },
                { id: 'journal', label: 'AI Reflection', icon: Heart },
                { id: 'analytics', label: 'Quiet Analytics', icon: BarChart3 }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playChime('click', audioEnabled);
                      setActiveTab(tab.id as any);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 relative text-left w-full whitespace-nowrap sm:whitespace-normal",
                      active 
                        ? "text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeSandboxTab"
                        className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className={cn("w-4 h-4 z-10 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                    <span className="z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sandbox Canvas area */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto bg-background/25">
              <AnimatePresence mode="wait">
                {activeTab === 'goal' && (
                  <motion.div
                    key="goal"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-xs text-muted-foreground mr-1">Choose a goal:</span>
                      {goalPresets.map((preset, i) => (
                        <button
                          key={i}
                          onClick={() => handleGoalChange(i)}
                          className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-bold border transition-all duration-300",
                            selectedGoalIdx === i
                              ? "bg-primary/10 border-primary/40 text-primary"
                              : "border-border/40 text-muted-foreground hover:text-foreground hover:bg-card/40"
                          )}
                        >
                          {preset.category}
                        </button>
                      ))}
                    </div>

                    {/* Interactive Goal Card */}
                    <div className="p-5 rounded-2xl bg-card/30 border border-border/50 shadow-md relative overflow-hidden">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-primary/80 uppercase font-sans tracking-wide">
                          {goalPresets[selectedGoalIdx].category}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                          <Flame className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{goalStreak} Day Streak</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold font-primary text-foreground mb-4">
                        {goalPresets[selectedGoalIdx].title}
                      </h3>

                      {/* Progress meter */}
                      <div className="space-y-1 mb-5">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Milestone progress</span>
                          <span className="font-semibold text-primary">{goalProgress}% ({goalProgress === 50 ? "5 / 10" : "4 / 10"} completed)</span>
                        </div>
                        <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden relative">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500 ease-out glow-primary relative" 
                            style={{ width: `${goalProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Next Best Action box */}
                      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 relative">
                        <div className="flex items-start gap-4">
                          {/* Checked button */}
                          <div className="relative flex-shrink-0 mt-0.5">
                            <button
                              onClick={handleCheckAction}
                              className={cn(
                                "size-6 rounded-lg border flex items-center justify-center transition-all duration-300 relative z-10",
                                goalChecked
                                  ? "bg-primary border-primary text-white scale-105 shadow-md shadow-primary/20"
                                  : "border-border hover:border-primary/50 bg-background/80"
                              )}
                            >
                              {goalChecked && <Check className="w-4 h-4 stroke-[3]" />}
                            </button>
                            
                            {/* Particle explosion elements */}
                            {particles.map((p) => (
                              <motion.div
                                key={p.id}
                                className="absolute pointer-events-none w-2 h-2 rounded-full"
                                style={{ backgroundColor: p.color, left: 12, top: 12 }}
                                initial={{ x: 0, y: 0, scale: 0.2, opacity: 1 }}
                                animate={{ 
                                  x: p.x, 
                                  y: p.y, 
                                  scale: p.scale, 
                                  opacity: 0,
                                  rotate: p.rotate 
                                }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                              />
                            ))}
                          </div>

                          <div className="space-y-1 select-text">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-primary tracking-wide uppercase">Today&apos;s Next Best Action</span>
                              <span className="text-[9px] font-bold text-accent-foreground/60 bg-accent/15 px-1.5 py-0.5 rounded uppercase">Daily Priority</span>
                            </div>
                            <h4 className={cn("text-sm font-semibold transition-all duration-300", goalChecked ? "line-through text-muted-foreground opacity-60" : "text-foreground")}>
                              {goalPresets[selectedGoalIdx].action}
                            </h4>
                            <p className="text-[11px] leading-relaxed text-muted-foreground">
                              {goalPresets[selectedGoalIdx].desc}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Simulated AI advice box */}
                      <AnimatePresence>
                        {goalChecked && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: 10, height: 0 }}
                            className="mt-4 p-3.5 rounded-xl bg-accent/5 border border-accent/20 text-xs flex gap-2 select-text"
                          >
                            <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-accent-foreground">AI Action Reflection</p>
                              <p className="text-muted-foreground mt-0.5 leading-relaxed">
                                Great work completing today&apos;s milestone! Billing is the gateway to shipping. Your attention efficiency is optimal. Take a 10m break before starting something new.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'habits' && (
                  <motion.div
                    key="habits"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="text-xs text-muted-foreground mb-1 select-text">
                      Click the day bubbles below to complete a habit. Complete a full row to trigger a streak chime!
                    </div>

                    <div className="space-y-3">
                      {habitsData.map((habit, hIdx) => (
                        <div key={hIdx} className="p-4 rounded-xl bg-card/30 border border-border/50 flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-foreground flex items-center gap-1.5 font-primary select-text">
                              <Check className="w-3.5 h-3.5 text-primary bg-primary/10 rounded p-0.5" />
                              {habit.name}
                            </span>
                            
                            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Flame className="w-3.5 h-3.5 fill-amber-500" />
                              {habit.streak}d streak
                            </span>
                          </div>

                          <div className="flex justify-between items-center gap-1.5">
                            {["M", "T", "W", "T", "F", "S", "S"].map((day, dIdx) => {
                              const checked = habit.completedDays[dIdx];
                              return (
                                <button
                                  key={dIdx}
                                  onClick={() => toggleHabitDay(hIdx, dIdx)}
                                  className={cn(
                                    "size-8 rounded-lg flex flex-col items-center justify-center transition-all duration-300",
                                    checked
                                      ? "bg-primary text-white shadow-sm shadow-primary/20 border-primary scale-[1.03]"
                                      : "bg-background/80 border border-border/50 text-muted-foreground hover:border-primary/40"
                                  )}
                                >
                                  <span className="text-[9px] font-bold select-none">{day}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'journal' && (
                  <motion.div
                    key="journal"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="p-5 rounded-2xl bg-card/30 border border-border/50 space-y-4">
                      <div className="text-center font-primary text-base font-bold text-foreground">
                        How did today feel?
                      </div>

                      <div className="flex justify-center gap-4">
                        {[
                          { mood: 'struggling', emoji: '😔', label: 'Struggling' },
                          { mood: 'flat', emoji: '😐', label: 'Flat' },
                          { mood: 'productive', emoji: '🙂', label: 'Productive' },
                          { mood: 'flow', emoji: '🤩', label: 'Flow State' }
                        ].map((item) => (
                          <button
                            key={item.mood}
                            onClick={() => selectMood(item.mood as any)}
                            className={cn(
                              "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-300",
                              selectedMood === item.mood
                                ? "border-primary bg-primary/10 scale-105"
                                : "border-border/40 hover:border-primary/30 hover:bg-card/40"
                            )}
                          >
                            <span className="text-2xl select-none">{item.emoji}</span>
                            <span className="text-[9px] font-semibold text-muted-foreground uppercase">{item.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* AI Sentiment analysis result with Typewriter effect */}
                      <AnimatePresence>
                        {selectedMood && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="p-4 rounded-xl border border-accent/30 bg-accent/5 select-text"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkle className="w-4 h-4 text-accent animate-spin-slow" />
                              <span className="text-xs font-bold text-accent-foreground uppercase tracking-wider">AI Sentiment Reflection</span>
                              {isTyping && (
                                <span className="inline-flex size-1.5 bg-accent rounded-full animate-ping ml-1" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed italic min-h-[50px] font-serif">
                              {aiAnalysisText}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'analytics' && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-2xl bg-card/30 border border-border/50 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground select-text">Deep Work attention (Hours / Day)</span>
                        <span className="text-muted-foreground">This Week: <span className="text-primary font-bold">34.2h</span></span>
                      </div>

                      {/* SVG Bar Chart */}
                      <div className="h-44 w-full flex items-end justify-between px-2 pt-4 relative">
                        {/* Target line */}
                        <div className="absolute top-[40%] left-0 right-0 border-t border-dashed border-primary/20 pointer-events-none" />
                        <span className="absolute left-1 top-[30%] text-[8px] text-primary/60 font-semibold select-none">Target (4.5h)</span>

                        {[
                          { day: "Mon", hours: 4.2, percentage: "42%", flow: "72%" },
                          { day: "Tue", hours: 6.8, percentage: "68%", flow: "92%" },
                          { day: "Wed", hours: 5.1, percentage: "51%", flow: "80%" },
                          { day: "Thu", hours: 3.0, percentage: "30%", flow: "64%" },
                          { day: "Fri", hours: 6.2, percentage: "62%", flow: "88%" },
                          { day: "Sat", hours: 4.5, percentage: "45%", flow: "75%" },
                          { day: "Sun", hours: 4.4, percentage: "44%", flow: "78%" }
                        ].map((bar, idx) => {
                          const active = hoveredBarIdx === idx;
                          return (
                            <div 
                              key={idx} 
                              className="flex flex-col items-center flex-1 group"
                              onMouseEnter={() => {
                                playChime('click', audioEnabled);
                                setHoveredBarIdx(idx);
                              }}
                              onMouseLeave={() => setHoveredBarIdx(null)}
                            >
                              <div className="w-[80%] max-w-[28px] bg-muted/50 hover:bg-primary/25 rounded-t-lg h-28 flex items-end overflow-hidden transition-all duration-300 relative cursor-pointer">
                                <motion.div 
                                  className="w-full bg-gradient-to-t from-primary to-accent relative"
                                  initial={{ height: 0 }}
                                  animate={{ height: bar.percentage }}
                                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                                >
                                  {active && (
                                    <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
                                  )}
                                </motion.div>
                              </div>
                              <span className="text-[10px] text-muted-foreground mt-2 font-semibold select-none">{bar.day}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Dynamic tooltip details based on hover */}
                      <div className="h-12 flex justify-center items-center select-text">
                        {hoveredBarIdx !== null ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-xs bg-primary/10 border border-primary/20 text-primary font-semibold px-4 py-2 rounded-xl"
                          >
                            {[
                              { day: "Monday", hours: "4.2 Hours Focus", flow: "72% Flow State" },
                              { day: "Tuesday", hours: "6.8 Hours Focus", flow: "92% Flow State" },
                              { day: "Wednesday", hours: "5.1 Hours Focus", flow: "80% Flow State" },
                              { day: "Thursday", hours: "3.0 Hours Focus", flow: "64% Flow State" },
                              { day: "Friday", hours: "6.2 Hours Focus", flow: "88% Flow State" },
                              { day: "Saturday", hours: "4.5 Hours Focus", flow: "75% Flow State" },
                              { day: "Sunday", hours: "4.4 Hours Focus", flow: "78% Flow State" }
                            ][hoveredBarIdx].day}: <span className="text-foreground">{[
                              { day: "Monday", hours: "4.2 Hours Focus", flow: "72% Flow State" },
                              { day: "Tuesday", hours: "6.8 Hours Focus", flow: "92% Flow State" },
                              { day: "Wednesday", hours: "5.1 Hours Focus", flow: "80% Flow State" },
                              { day: "Thursday", hours: "3.0 Hours Focus", flow: "64% Flow State" },
                              { day: "Friday", hours: "6.2 Hours Focus", flow: "88% Flow State" },
                              { day: "Saturday", hours: "4.5 Hours Focus", flow: "75% Flow State" },
                              { day: "Sunday", hours: "4.4 Hours Focus", flow: "78% Flow State" }
                            ][hoveredBarIdx].hours}</span> | <span className="text-accent-foreground font-bold">{[
                              { day: "Monday", hours: "4.2 Hours Focus", flow: "72% Flow State" },
                              { day: "Tuesday", hours: "6.8 Hours Focus", flow: "92% Flow State" },
                              { day: "Wednesday", hours: "5.1 Hours Focus", flow: "80% Flow State" },
                              { day: "Thursday", hours: "3.0 Hours Focus", flow: "64% Flow State" },
                              { day: "Friday", hours: "6.2 Hours Focus", flow: "88% Flow State" },
                              { day: "Saturday", hours: "4.5 Hours Focus", flow: "75% Flow State" },
                              { day: "Sunday", hours: "4.4 Hours Focus", flow: "78% Flow State" }
                            ][hoveredBarIdx].flow}</span>
                          </motion.div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Hover over the weekly bars to view cognitive metrics.</span>
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================
          PILLARS - Refined micro-interactions
      ============================================ */}
      <section className="py-20 px-6 sm:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="glass-card rounded-2xl p-8 text-center group border border-border/40 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 select-text"
                >
                  <div 
                    className="w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                    style={{ background: `linear-gradient(135deg, ${pillar.accent}20, ${pillar.accent}05)` }}
                  >
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-primary mb-3 text-foreground">{pillar.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{pillar.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          TRUST & TRANSPARENCY SECTION
      ============================================ */}
      <section className="py-24 px-6 sm:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <span className="inline-flex px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold border border-emerald-500/20">
              <Shield className="w-3.5 h-3.5 inline mr-1.5 text-emerald-500 align-text-bottom" />
              Trust & Transparency
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-primary text-foreground">
              We earn your trust by <span className="text-gradient-primary">being different</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Most productivity platforms trade attention loops for monthly metrics. We built Rhythmé to facilitate quiet consistency—nothing more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-2xl p-8 border-emerald-500/10 hover:border-emerald-500/30 group transition-all duration-500 text-left select-text"
                >
                  <div className="w-12 h-12 mb-6 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold font-primary mb-2 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          FUTURE VISION SECTION
      ============================================ */}
      <section className="py-24 px-6 sm:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden text-center border-primary/20"
          >
            <div className="absolute top-0 right-0 w-60 h-60 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 select-text">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 mb-6">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 font-primary text-foreground text-balance">
                Building the Future of <span className="text-gradient-primary">Human-Aware Systems</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                We&apos;re not building another quick todo-list app. We study how intelligent software systems can dynamically analyze attentional fatigue, mitigate dopamine-chasing behaviors, and support emotional regulation.
              </p>

              <div className="flex flex-wrap justify-center gap-2.5 mb-8">
                {[
                  { icon: Lightbulb, text: "Attentional Research" },
                  { icon: Brain, text: "Human-Centric AI" },
                  { icon: Zap, text: "Burnout Mitigation" },
                  { icon: Heart, text: "Self-Efficacy Analytics" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/40 text-xs text-muted-foreground select-none"
                    >
                      <Icon className="w-4 h-4 text-primary" />
                      {item.text}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground">
                <Sparkles className="w-4 h-4 inline mr-1 text-primary animate-pulse" />
                Premium enclaves get early beta builds of our experimental attention tools.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          FAQ - Accordions Reworked
      ============================================ */}
      <section className="py-24 px-6 sm:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-primary text-foreground">
              Questions? We answer honestly.
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const expanded = expandedFaq === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-2xl overflow-hidden border border-border/40"
                >
                  <button
                    onClick={() => {
                      playChime('click', audioEnabled);
                      setExpandedFaq(expanded ? null : index);
                    }}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 transition-all duration-300 bg-card/10 hover:bg-card/40 focus:outline-none"
                  >
                    <span className="font-semibold text-foreground text-sm sm:text-base">{faq.question}</span>
                    <div className={cn(
                      "size-8 rounded-full border border-border flex items-center justify-center shrink-0 transition-transform duration-300",
                      expanded ? "bg-primary/10 border-primary/20 rotate-180" : "bg-background"
                    )}>
                      <ChevronDown className={cn(
                        "w-4 h-4 text-muted-foreground transition-colors duration-300",
                        expanded && "text-primary"
                      )} />
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <p className="px-6 pb-6 text-muted-foreground text-sm leading-relaxed border-t border-border/10 pt-4 select-text">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          PRICING SECTION
      ============================================ */}
      <PricingComponent />

      {/* ============================================
          FINAL CTA - Premium Rework
      ============================================ */}
      <section className="py-24 px-6 sm:px-8 relative z-10 mb-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 sm:p-12 md:p-16 border border-primary/30 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
            
            <div className="relative z-10 space-y-6 select-text">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-primary text-foreground text-balance">
                Stop scrolling. <span className="text-gradient-primary">Start building.</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Reclaim your attention and focus on the things that actually matter. Your future self is waiting.
              </p>
              
              <div className="pt-2">
                <Link href="/signup/intro">
                  <Button size="lg" className="text-base px-10 py-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 group text-white border-0 font-semibold">
                    Start Your Journey — It&apos;s Free
                    <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground font-medium select-none">
                {["No credit card required", "Your data stays private", "Export / Cancel anytime"].map((text, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 bg-emerald-500/10 p-0.5 rounded-full" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RhythmeLanding;
