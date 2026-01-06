"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { TextGradient } from "@/components/text-gradient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Send, 
  Mic, 
  Crown, 
  Brain, 
  Heart, 
  Zap,
  ArrowRight,
  Lock,
  Target,
  Map,
  CheckCircle2,
  ListTodo,
  Timer,
  RefreshCw,
  AlertTriangle,
  BookOpen,
  MessageSquare,
  ChevronRight,
  Flame,
  Clock,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const suggestions = [
  "Break down my goal into steps",
  "Create a weekly plan for me",
  "What habits should I build?",
  "Help me stay focused today",
];

// Type definitions for demo data
interface Milestone { month: number; title: string; status: string; }
interface StepItem { step: number; action: string; time: string; }
interface TaskItem { title: string; priority: string; linked: boolean; }
interface HabitItem { title: string; frequency: string; streak: number; }
interface InsightItem { icon: React.ElementType; text: string; positive: boolean; }

interface RoadmapContent { goal: string; timeline: string; milestones: Milestone[]; }
interface StepsContent { title: string; steps: StepItem[]; note: string; }
interface GeneratedContent { tasks: TaskItem[]; habits: HabitItem[]; }
interface ContextContent { analysis: string; insights: InsightItem[]; recommendation: string; }
interface PersonalContent { message: string; tips: string[]; closing: string; }

interface DemoStep {
  id: number;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  userInput: string;
  responseType: "roadmap" | "steps" | "generated" | "context" | "personal";
  roadmapContent?: RoadmapContent;
  stepsContent?: StepsContent;
  generatedContent?: GeneratedContent;
  contextContent?: ContextContent;
  personalContent?: PersonalContent;
}

// Step-by-step demo data
const demoSteps: DemoStep[] = [
  {
    id: 1,
    icon: Map,
    title: "Define Your Goal",
    subtitle: "Start with your big dream",
    color: "text-primary",
    bgColor: "bg-primary/10",
    userInput: "I want to become a senior software engineer in 2 years",
    responseType: "roadmap",
    roadmapContent: {
      goal: "Senior Software Engineer",
      timeline: "24 months",
      milestones: [
        { month: 3, title: "Master System Design", status: "upcoming" },
        { month: 6, title: "Lead a Major Project", status: "upcoming" },
        { month: 12, title: "Mentor Junior Developers", status: "upcoming" },
        { month: 18, title: "Architect a System", status: "upcoming" },
        { month: 24, title: "Senior Engineer Role", status: "upcoming" },
      ],
    },
  },
  {
    id: 2,
    icon: RefreshCw,
    title: "Get Realistic Steps",
    subtitle: "No hallucinations, just practical guidance",
    color: "text-accent",
    bgColor: "bg-accent/10",
    userInput: "How do I master system design?",
    responseType: "steps",
    stepsContent: {
      title: "System Design Mastery Plan",
      steps: [
        { step: 1, action: "Study distributed systems fundamentals", time: "2 weeks" },
        { step: 2, action: "Practice with real-world case studies", time: "3 weeks" },
        { step: 3, action: "Build a scalable project from scratch", time: "4 weeks" },
        { step: 4, action: "Mock interviews and feedback", time: "3 weeks" },
      ],
      note: "Based on proven learning paths, not generic advice.",
    },
  },
  {
    id: 3,
    icon: ListTodo,
    title: "Auto-Generate Tasks & Habits",
    subtitle: "Everything linked to your goal",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    userInput: "Create tasks and habits for this week",
    responseType: "generated",
    generatedContent: {
      tasks: [
        { title: "Read Chapter 3: Load Balancers", priority: "high", linked: true },
        { title: "Complete LeetCode system design problem", priority: "medium", linked: true },
        { title: "Review AWS architecture patterns", priority: "medium", linked: true },
      ],
      habits: [
        { title: "30 min technical reading", frequency: "Daily", streak: 0 },
        { title: "Code review practice", frequency: "3x/week", streak: 0 },
      ],
    },
  },
  {
    id: 4,
    icon: Timer,
    title: "Reference Your Progress",
    subtitle: "AI knows your full context",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    userInput: "What should I focus on based on my recent progress?",
    responseType: "context",
    contextContent: {
      analysis: "Based on your activity:",
      insights: [
        { icon: CheckCircle2, text: "You completed 8/10 tasks this week", positive: true },
        { icon: Flame, text: "5-day streak on technical reading", positive: true },
        { icon: Clock, text: "Focus sessions averaging 45 mins", positive: true },
        { icon: Target, text: "System design milestone at 60%", positive: false },
      ],
      recommendation: "Prioritize the load balancer chapter today to stay on track for your milestone.",
    },
  },
  {
    id: 5,
    icon: MessageSquare,
    title: "Personal Assistant",
    subtitle: "Beyond just goals",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    userInput: "I'm feeling overwhelmed today, any advice?",
    responseType: "personal",
    personalContent: {
      message: "It's completely normal to feel overwhelmed when pursuing ambitious goals. Here's what I suggest:",
      tips: [
        "Take a 10-minute break away from screens",
        "Focus on just ONE small task to build momentum",
        "Remember: progress over perfection",
      ],
      closing: "You've already completed 80% of this week's goals. You're doing great! 💪",
    },
  },
];

export default function AIPage() {
  const [inputValue, setInputValue] = useState("");
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  const handleSuggestionClick = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  const currentDemo = demoSteps[activeStep];
  const Icon = currentDemo.icon;

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col overflow-hidden overflow-y-auto">
        <div className="flex flex-1 flex-col items-center px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
          
          {/* Animated Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] animate-pulse"
              style={{ 
                background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
                animationDuration: "4s"
              }}
            />
            <div 
              className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] animate-pulse"
              style={{ 
                background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
                animationDuration: "5s",
                animationDelay: "1s"
              }}
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center max-w-5xl w-full space-y-10 md:space-y-14">
            
            {/* Header Section */}
            <div className="text-center space-y-4">
              <Badge 
                variant="outline" 
                className="px-4 py-1.5 text-sm font-medium border-primary/30 bg-primary/5 text-primary backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700"
              >
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                In Development
              </Badge>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-primary tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <TextGradient 
                  highlightColor="var(--primary)"
                  baseColor="var(--foreground)"
                  duration={3}
                  spread={40}
                >
                  Rhythmé AI
                </TextGradient>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                The most <span className="text-primary font-semibold">emotionally intelligent</span> AI companion, 
                designed to turn your dreams into actionable plans.
              </p>

              {/* Model Badge */}
              <div className="animate-in fade-in zoom-in duration-700 delay-300 pt-4">
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl glass-card glow-primary transition-all duration-500 hover:scale-105">
                  <Brain className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">First Model</p>
                    <p className="text-lg font-bold font-primary text-gradient-primary">rvo1</p>
                  </div>
                  <Zap className="w-4 h-4 text-accent" />
                </div>
              </div>
            </div>

            {/* Interactive Demo Section */}
            <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold font-primary mb-2">See How It Works</h2>
                <p className="text-muted-foreground">Experience the power of goal-focused AI</p>
              </div>

              {/* Step Navigation */}
              <div className="flex justify-center">
                <div className="flex items-center gap-1 p-1 rounded-full bg-muted/50 backdrop-blur-sm">
                  {demoSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <button
                        key={step.id}
                        onClick={() => setActiveStep(index)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                          activeStep === index
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <StepIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">{step.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Demo Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  {/* Step Header */}
                  <div className="p-6 border-b border-border/30">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", currentDemo.bgColor)}>
                        <Icon className={cn("w-6 h-6", currentDemo.color)} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Step {currentDemo.id}</Badge>
                          <h3 className="font-bold font-primary text-lg">{currentDemo.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{currentDemo.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat-like Demo */}
                  <div className="p-6 space-y-4">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="max-w-md bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3">
                        <p className="text-sm">{currentDemo.userInput}</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="max-w-lg glass-card rounded-2xl rounded-tl-sm px-4 py-4 space-y-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Brain className="w-3 h-3 text-primary" />
                          <span>Rhythmé AI</span>
                        </div>

                        {/* Roadmap Response */}
                        {currentDemo.responseType === "roadmap" && currentDemo.roadmapContent && (
                          <div className="space-y-3">
                            <p className="text-sm font-medium">Here&apos;s your personalized roadmap:</p>
                            <div className="space-y-2">
                              {currentDemo.roadmapContent.milestones.map((milestone, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                    M{milestone.month}
                                  </div>
                                  <span className="text-muted-foreground">{milestone.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Steps Response */}
                        {currentDemo.responseType === "steps" && currentDemo.stepsContent && (
                          <div className="space-y-3">
                            <p className="text-sm font-medium">{currentDemo.stepsContent.title}</p>
                            <div className="space-y-2">
                              {currentDemo.stepsContent.steps.map((step) => (
                                <div key={step.step} className="flex items-start gap-3 text-sm p-2 rounded-lg bg-muted/30">
                                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent shrink-0">
                                    {step.step}
                                  </div>
                                  <div className="flex-1">
                                    <p>{step.action}</p>
                                    <p className="text-xs text-muted-foreground">{step.time}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-accent italic">{currentDemo.stepsContent.note}</p>
                          </div>
                        )}

                        {/* Generated Tasks/Habits */}
                        {currentDemo.responseType === "generated" && currentDemo.generatedContent && (
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                <ListTodo className="w-4 h-4 text-green-500" />
                                Tasks Created
                              </p>
                              <div className="space-y-1">
                                {currentDemo.generatedContent.tasks.map((task, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-green-500/5 border border-green-500/20">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span className="flex-1">{task.title}</span>
                                    <Badge variant="outline" className="text-xs">{task.priority}</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                <Flame className="w-4 h-4 text-orange-500" />
                                Habits Created
                              </p>
                              <div className="space-y-1">
                                {currentDemo.generatedContent.habits.map((habit, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-orange-500/5 border border-orange-500/20">
                                    <Target className="w-4 h-4 text-orange-500" />
                                    <span className="flex-1">{habit.title}</span>
                                    <span className="text-xs text-muted-foreground">{habit.frequency}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Context-Aware Response */}
                        {currentDemo.responseType === "context" && currentDemo.contextContent && (
                          <div className="space-y-3">
                            <p className="text-sm font-medium">{currentDemo.contextContent.analysis}</p>
                            <div className="space-y-2">
                              {currentDemo.contextContent.insights.map((insight, idx) => {
                                const InsightIcon = insight.icon;
                                return (
                                  <div key={idx} className={cn(
                                    "flex items-center gap-2 text-sm p-2 rounded-lg",
                                    insight.positive ? "bg-green-500/5" : "bg-amber-500/5"
                                  )}>
                                    <InsightIcon className={cn("w-4 h-4", insight.positive ? "text-green-500" : "text-amber-500")} />
                                    <span>{insight.text}</span>
                                  </div>
                                );
                              })}
                            </div>
                            <p className="text-sm text-primary font-medium">{currentDemo.contextContent.recommendation}</p>
                          </div>
                        )}

                        {/* Personal Response */}
                        {currentDemo.responseType === "personal" && currentDemo.personalContent && (
                          <div className="space-y-3">
                            <p className="text-sm">{currentDemo.personalContent.message}</p>
                            <ul className="space-y-1">
                              {currentDemo.personalContent.tips.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <Heart className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                            <p className="text-sm text-pink-500 font-medium">{currentDemo.personalContent.closing}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Step Navigation Footer */}
                  <div className="p-4 border-t border-border/30 flex items-center justify-between">
                    <button
                      onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                      disabled={activeStep === 0}
                      className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {activeStep + 1} of {demoSteps.length}
                    </span>
                    <button
                      onClick={() => setActiveStep(Math.min(demoSteps.length - 1, activeStep + 1))}
                      disabled={activeStep === demoSteps.length - 1}
                      className="text-sm text-primary hover:text-primary/80 disabled:opacity-30 transition-colors flex items-center gap-1"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* AI Caution Notice */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 max-w-2xl mx-auto">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">AI Can Make Mistakes</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    While Rhythmé AI is designed to be helpful and accurate, always verify important information. 
                    Use your own judgment for critical decisions.
                  </p>
                </div>
              </div>
            </div>

            {/* Features Pills */}
            <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              {[
                { icon: Brain, label: "Deep Understanding" },
                { icon: Heart, label: "Emotional Intelligence" },
                { icon: Target, label: "Goal-Focused" },
                { icon: Zap, label: "Instant Insights" },
              ].map(({ icon: FeatureIcon, label }) => (
                <div 
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50 text-sm text-muted-foreground transition-all duration-300 hover:bg-muted hover:border-border"
                >
                  <FeatureIcon className="w-4 h-4 text-accent" />
                  {label}
                </div>
              ))}
            </div>

            {/* AI Input Section */}
            <div className="w-full max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
              <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 rounded-2xl blur-sm opacity-30 group-hover:opacity-60 transition-all duration-500 group-focus-within:opacity-60" />
                <div className="relative flex items-center glass-card rounded-2xl p-1.5 transition-all duration-300">
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask Rhythmé AI anything..."
                    className="flex-1 border-0 bg-transparent text-base md:text-lg px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
                  />
                  <div className="flex items-center gap-2 pr-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleSuggestionClick}
                      className="w-10 h-10 rounded-xl text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300"
                    >
                      <Mic className="w-5 h-5" />
                    </Button>
                    <Button
                      type="submit"
                      size="icon"
                      className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </form>

              {/* Coming Soon Toast */}
              <div 
                className={cn(
                  "text-center text-sm text-primary font-medium transition-all duration-300",
                  showComingSoon 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 -translate-y-2"
                )}
              >
                <Lock className="w-4 h-4 inline mr-2" />
                Coming soon — Stay tuned!
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    onClick={handleSuggestionClick}
                    className="px-4 py-2 text-sm rounded-full border border-border/50 bg-background/50 backdrop-blur-sm text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${800 + index * 100}ms` }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* What's Coming Card + Hanging Premium CTA */}
            <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-900">
              {/* What's Coming Card */}
              <div className="glass-card rounded-2xl p-8 space-y-6 text-center relative">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold font-primary">What&apos;s Coming</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Rhythmé AI will be your <span className="text-accent font-medium">intelligent planning partner</span>—transforming 
                    your ambitious, long-term goals into structured roadmaps with clear milestones. Create interconnected 
                    tasks, habits, and focus sessions that all work together towards your vision.
                  </p>
                </div>

                <div className="pt-4 border-t border-border/30">
                  <p className="text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 inline mr-2 text-primary" />
                    Premium members get <span className="text-primary font-semibold">exclusive early access</span>
                  </p>
                </div>

                {/* Hanging rope connectors */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-start gap-32">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-border to-primary/50 rounded-full" />
                  <div className="w-0.5 h-8 bg-gradient-to-b from-border to-primary/50 rounded-full" />
                </div>
              </div>

              {/* Hanging Premium CTA */}
              <div className="relative mt-8 flex justify-center">
                {/* Horizontal bar connecting ropes */}
                <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-36 h-0.5 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 rounded-full" />
                
                {/* Swinging card */}
                <div className="w-full max-w-md animate-swing origin-top">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-all duration-500 animate-gradient" />
                    <Link href="/settings/billing">
                      <div className="relative glass-card rounded-2xl p-6 space-y-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                        {/* Hanging knob */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                          <div className="w-2 h-2 rounded-full bg-white/80" />
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <Crown className="w-6 h-6 text-primary" />
                          <h3 className="text-xl font-bold font-primary">Get Premium Access</h3>
                        </div>
                        <p className="text-muted-foreground text-center text-sm">
                          Be the <span className="text-accent font-semibold">first</span> to experience Rhythmé AI. 
                          Premium members get exclusive early access.
                        </p>
                        <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/30">
                          Upgrade to Premium
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes swing {
          0%, 100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-swing {
          animation: swing 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
