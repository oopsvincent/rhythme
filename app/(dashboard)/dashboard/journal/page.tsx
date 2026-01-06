"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { TextGradient } from "@/components/text-gradient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Brain, 
  Heart, 
  BookOpen,
  PenLine,
  BarChart3,
  Calendar,
  Crown,
  ArrowRight,
  Check,
  Zap,
  TrendingUp,
  MessageCircle,
  Lightbulb,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Mock journal entry for demo
const mockJournalEntry = {
  title: "Reflecting on Today",
  excerpt: "Today was challenging but rewarding. I managed to complete my workout even though I felt tired. The meeting went better than expected...",
  date: "January 6, 2026",
};

// Mock analysis results for demo
const mockAnalysis = {
  overallMood: "Positive",
  moodScore: 78,
  emotions: [
    { name: "Accomplished", percentage: 45, color: "bg-green-500" },
    { name: "Tired", percentage: 25, color: "bg-amber-500" },
    { name: "Hopeful", percentage: 30, color: "bg-blue-500" },
  ],
  insights: [
    "You showed great resilience by completing your workout despite fatigue",
    "Your positive outlook on the meeting suggests growing confidence",
    "Consider noting what made the meeting successful for future reference",
  ],
  patterns: {
    weeklyTrend: "+12%",
    dominantEmotion: "Accomplished",
    journalStreak: 5,
  },
};

// Sentiment analysis models
interface SentimentModel {
  id: string;
  name: string;
  codeName: string;
  description: string;
  tier: "free" | "limited" | "premium";
  freeUsage?: string;
  icon: React.ElementType;
}

const sentimentModels: SentimentModel[] = [
  {
    id: "rvo2",
    name: "Standard",
    codeName: "rvo2",
    description: "Fast and reliable sentiment analysis for everyday journaling",
    tier: "free",
    icon: Brain,
  },
  {
    id: "rvo2-sentiment",
    name: "Advanced",
    codeName: "rvo2-sentiment",
    description: "Deep contextual understanding with nuanced emotional insights",
    tier: "limited",
    freeUsage: "5 analyses/month",
    icon: Heart,
  },
];

export default function JournalPage() {
  const [selectedModel, setSelectedModel] = useState<string>("rvo2");
  const [activeDemo, setActiveDemo] = useState<"writing" | "analysis">("writing");

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
                Coming March 2026
              </Badge>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-primary tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <TextGradient 
                  highlightColor="var(--primary)"
                  baseColor="var(--foreground)"
                  duration={3}
                  spread={40}
                >
                  Smart Journaling
                </TextGradient>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                Write your thoughts. Get <span className="text-primary font-semibold">AI-powered insights</span> that help you understand your emotions.
              </p>
            </div>

            {/* Demo Section - How It Works */}
            <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="text-center">
                <h2 className="text-2xl font-bold font-primary mb-2">How It Works</h2>
                <p className="text-muted-foreground">See your reflection come to life</p>
              </div>

              {/* Demo Toggle */}
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setActiveDemo("writing")}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    activeDemo === "writing"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <PenLine className="w-4 h-4 inline mr-2" />
                  1. Write
                </button>
                <button
                  onClick={() => setActiveDemo("analysis")}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    activeDemo === "analysis"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Brain className="w-4 h-4 inline mr-2" />
                  2. Get Insights
                </button>
              </div>

              {/* Demo Content */}
              <div className="relative min-h-[500px]">
                <AnimatePresence mode="wait">
                  {activeDemo === "writing" ? (
                    <motion.div
                      key="writing"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="glass-card rounded-2xl p-6 md:p-8"
                    >
                      {/* Mock Journal Editor */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{mockJournalEntry.date}</span>
                          <Badge variant="secondary" className="bg-accent/10 text-accent border-0">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Auto-analyzing...
                          </Badge>
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold font-primary">
                          {mockJournalEntry.title}
                        </h3>
                        
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                          <p className="text-lg leading-relaxed text-muted-foreground">
                            {mockJournalEntry.excerpt}
                          </p>
                          <div className="mt-4 flex items-center gap-1">
                            <span className="w-2 h-5 bg-primary animate-pulse rounded-full" />
                            <span className="text-muted-foreground/50">Keep writing...</span>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-border/30 flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            <MessageCircle className="w-3 h-3 inline mr-1" />
                            Your thoughts are being analyzed in real-time
                          </p>
                          <Button 
                            onClick={() => setActiveDemo("analysis")}
                            className="bg-primary hover:bg-primary/90"
                          >
                            View Analysis
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="analysis"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                      {/* Mood Overview Card */}
                      <div className="glass-card rounded-2xl p-6 space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold font-primary text-lg">Mood Analysis</h4>
                          <Badge className="bg-green-500/10 text-green-500 border-0">
                            {mockAnalysis.overallMood}
                          </Badge>
                        </div>

                        {/* Mood Score */}
                        <div className="text-center py-4">
                          <div className="relative inline-flex items-center justify-center">
                            <svg className="w-32 h-32 transform -rotate-90">
                              <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-muted/30"
                              />
                              <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="url(#gradient)"
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${mockAnalysis.moodScore * 3.52} 352`}
                              />
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="var(--primary)" />
                                  <stop offset="100%" stopColor="var(--accent)" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute flex flex-col items-center">
                              <span className="text-3xl font-bold font-primary">{mockAnalysis.moodScore}</span>
                              <span className="text-xs text-muted-foreground">out of 100</span>
                            </div>
                          </div>
                        </div>

                        {/* Emotion Breakdown */}
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-muted-foreground">Emotions Detected</p>
                          {mockAnalysis.emotions.map((emotion) => (
                            <div key={emotion.name} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{emotion.name}</span>
                                <span className="text-muted-foreground">{emotion.percentage}%</span>
                              </div>
                              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${emotion.percentage}%` }}
                                  transition={{ duration: 0.8, delay: 0.2 }}
                                  className={cn("h-full rounded-full", emotion.color)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Insights Card */}
                      <div className="space-y-6">
                        {/* AI Insights */}
                        <div className="glass-card rounded-2xl p-6 space-y-4">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-accent" />
                            <h4 className="font-bold font-primary text-lg">AI Insights</h4>
                          </div>
                          <ul className="space-y-3">
                            {mockAnalysis.insights.map((insight, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="flex items-start gap-3 text-sm text-muted-foreground"
                              >
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                                </div>
                                {insight}
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        {/* Pattern Stats */}
                        <div className="glass-card rounded-2xl p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            <h4 className="font-bold font-primary text-lg">Your Patterns</h4>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 text-green-500 font-bold text-xl">
                                <TrendingUp className="w-4 h-4" />
                                {mockAnalysis.patterns.weeklyTrend}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Weekly Mood</p>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-primary">
                                {mockAnalysis.patterns.dominantEmotion}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Top Emotion</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 text-accent font-bold text-xl">
                                <Target className="w-4 h-4" />
                                {mockAnalysis.patterns.journalStreak}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Day Streak</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Model Selection Section */}
            <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <div className="text-center">
                <h2 className="text-2xl font-bold font-primary mb-2">Choose Your Analysis Engine</h2>
                <p className="text-muted-foreground">Pick the model that fits your needs</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {sentimentModels.map((model) => {
                  const Icon = model.icon;
                  const isSelected = selectedModel === model.id;
                  
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={cn(
                        "relative group text-left p-6 rounded-2xl transition-all duration-300",
                        "glass-card border-2",
                        isSelected 
                          ? "border-primary shadow-lg shadow-primary/20" 
                          : "border-transparent hover:border-border"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                          isSelected ? "bg-primary/20" : "bg-muted"
                        )}>
                          <Icon className={cn(
                            "w-6 h-6",
                            isSelected ? "text-primary" : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold font-primary text-lg">{model.name}</h3>
                            {model.tier === "free" && (
                              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-0 text-xs">
                                Free Forever
                              </Badge>
                            )}
                            {model.tier === "limited" && (
                              <Badge variant="secondary" className="bg-accent/10 text-accent border-0 text-xs">
                                <Crown className="w-3 h-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-mono text-muted-foreground mb-2">{model.codeName}</p>
                          <p className="text-sm text-muted-foreground">{model.description}</p>
                          
                          <div className="mt-3 pt-3 border-t border-border/30">
                            {model.tier === "free" ? (
                              <p className="text-sm text-green-500 font-medium flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                Unlimited free usage
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                <span className="text-accent font-medium">{model.freeUsage}</span> free • Unlimited for <span className="text-primary">Premium</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* What's Coming Card + Hanging Premium CTA */}
            <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
              {/* What's Coming Card */}
              <div className="glass-card rounded-2xl p-8 space-y-6 text-center relative">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold font-primary">What&apos;s Coming</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our journaling feature uses advanced <span className="text-accent font-medium">sentiment analysis</span> powered 
                    by our proprietary models to help you understand your emotional patterns, track your mental wellness journey, 
                    and provide personalized insights from your daily reflections—all in real-time as you write.
                  </p>
                </div>

                <div className="pt-4 border-t border-border/30">
                  <p className="text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 inline mr-2 text-primary" />
                    Launching <span className="text-primary font-semibold">March 2026</span>
                  </p>
                </div>

                {/* Hanging rope connectors */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-start gap-32">
                  {/* Left rope */}
                  <div className="w-0.5 h-8 bg-gradient-to-b from-border to-primary/50 rounded-full" />
                  {/* Right rope */}
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
                          Unlock <span className="text-accent font-semibold">unlimited</span> advanced analysis 
                          and be the first to experience Rhythmé Journaling.
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
