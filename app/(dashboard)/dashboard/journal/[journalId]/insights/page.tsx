"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { EmotionalAura, moodColors } from "@/components/journal/emotional-aura";
import { MoodType } from "@/components/journal/mood-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  Sparkles,
  TrendingUp,
  Lightbulb,
  Heart,
  Target,
  Zap,
  Quote,
  RefreshCw,
} from "lucide-react";

// Local storage key
const JOURNALS_STORAGE_KEY = "rhythme_journals";

// Mood emoji mappings
const moodEmojis: Record<MoodType, string> = {
  happy: "😊",
  calm: "😌",
  neutral: "😐",
  sad: "😔",
  frustrated: "😤",
  excited: "🤩",
  anxious: "😰",
};

// Mood labels
const moodLabels: Record<MoodType, string> = {
  happy: "Happy",
  calm: "Calm",
  neutral: "Neutral",
  sad: "Sad",
  frustrated: "Frustrated",
  excited: "Excited",
  anxious: "Anxious",
};

interface JournalEntry {
  id: string;
  title: string;
  body: string;
  mood: MoodType;
  moodIntensity?: number;
  createdAt: string;
  updatedAt: string;
}

// Mock AI analysis generator
function generateAnalysis(entry: JournalEntry) {
  const text = entry.body.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Generate a pseudo-random but consistent score based on content
  const hash = entry.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseScore = 60 + (hash % 30);

  // Mood modifiers
  const moodScores: Record<MoodType, number> = {
    happy: 85,
    excited: 90,
    calm: 75,
    neutral: 60,
    anxious: 45,
    sad: 35,
    frustrated: 40,
  };

  const moodScore = moodScores[entry.mood];
  const overallScore = Math.round((baseScore + moodScore) / 2);

  // Generate emotions detected
  const primaryEmotion = entry.mood;
  const secondaryEmotions: { name: string; percentage: number; color: string }[] = [];

  if (entry.mood === "happy" || entry.mood === "excited") {
    secondaryEmotions.push(
      { name: "Gratitude", percentage: 25 + (hash % 15), color: "bg-green-500" },
      { name: "Optimism", percentage: 20 + (hash % 10), color: "bg-yellow-500" }
    );
  } else if (entry.mood === "calm") {
    secondaryEmotions.push(
      { name: "Contentment", percentage: 30 + (hash % 10), color: "bg-blue-400" },
      { name: "Peace", percentage: 25 + (hash % 10), color: "bg-teal-500" }
    );
  } else if (entry.mood === "sad" || entry.mood === "anxious") {
    secondaryEmotions.push(
      { name: "Uncertainty", percentage: 25 + (hash % 10), color: "bg-gray-500" },
      { name: "Hope", percentage: 15 + (hash % 15), color: "bg-amber-500" }
    );
  } else {
    secondaryEmotions.push(
      { name: "Reflection", percentage: 25 + (hash % 10), color: "bg-purple-500" },
      { name: "Awareness", percentage: 20 + (hash % 10), color: "bg-indigo-500" }
    );
  }

  // Key phrases
  const keyPhrases = words.slice(0, Math.min(15, words.length)).filter((w) => w.length > 4);
  const selectedPhrases = keyPhrases.slice(0, 3);

  // Insights
  const insights = [
    `Your journal entry reflects a ${entry.mood} emotional state with ${wordCount > 100 ? "detailed" : "concise"} expression.`,
    `The writing shows ${overallScore > 70 ? "positive emotional patterns" : "opportunity for emotional growth"}.`,
    `Consider reflecting on what triggered these feelings for deeper self-awareness.`,
  ];

  // Suggestions
  const suggestions = [
    {
      icon: Heart,
      title: "Self-Compassion",
      description: "Practice being kind to yourself about the emotions you expressed.",
    },
    {
      icon: Target,
      title: "Action Step",
      description: entry.mood === "happy" || entry.mood === "excited"
        ? "Capture what made today special so you can recreate it."
        : "Identify one small thing that could improve your mood.",
    },
    {
      icon: Zap,
      title: "Energy Check",
      description: "Notice how your energy levels connect to your emotional state.",
    },
  ];

  return {
    overallScore,
    moodScore,
    primaryEmotion,
    secondaryEmotions,
    keyPhrases: selectedPhrases,
    insights,
    suggestions,
    wordCount,
  };
}

export default function JournalInsightsPage({
  params,
}: {
  params: Promise<{ journalId: string }>;
}) {
  const resolvedParams = use(params);
  const [journal, setJournal] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<ReturnType<typeof generateAnalysis> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load journal
  useEffect(() => {
    const stored = localStorage.getItem(JOURNALS_STORAGE_KEY);
    if (stored) {
      try {
        const journals: JournalEntry[] = JSON.parse(stored);
        const found = journals.find((j) => j.id === resolvedParams.journalId);
        if (found) {
          setJournal(found);
          // Simulate AI analysis delay
          setIsAnalyzing(true);
          setTimeout(() => {
            setAnalysis(generateAnalysis(found));
            setIsAnalyzing(false);
          }, 1500);
        }
      } catch (e) {
        console.error("Failed to load journal:", e);
      }
    }
    setIsLoading(false);
  }, [resolvedParams.journalId]);

  const regenerateAnalysis = () => {
    if (!journal) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysis(generateAnalysis(journal));
      setIsAnalyzing(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <>
        <SiteHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading insights...</p>
          </div>
        </div>
      </>
    );
  }

  if (!journal) {
    return (
      <>
        <SiteHeader />
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-12 text-center max-w-md"
          >
            <h3 className="text-xl font-primary mb-3">Journal Not Found</h3>
            <p className="text-muted-foreground mb-6">
              This journal entry doesn&apos;t exist or has been deleted.
            </p>
            <Link href="/dashboard/journal">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Journal
              </Button>
            </Link>
          </motion.div>
        </div>
      </>
    );
  }

  const colors = moodColors[journal.mood];

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col overflow-hidden overflow-y-auto">
        <div className="flex flex-1 flex-col px-4 md:px-8 py-6 md:py-8 relative">
          {/* Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
              style={{ background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)` }}
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto w-full space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <Link href={`/dashboard/journal/${journal.id}`}>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-5 h-5 text-primary" />
                    <h1 className="text-xl md:text-2xl font-primary font-bold">
                      AI Insights
                    </h1>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {journal.title}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={regenerateAnalysis}
                disabled={isAnalyzing}
                className="gap-2"
              >
                <RefreshCw className={cn("w-4 h-4", isAnalyzing && "animate-spin")} />
                Refresh
              </Button>
            </motion.div>

            {isAnalyzing ? (
              /* Loading State */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-3xl p-12 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-primary font-bold mb-2">
                  Analyzing Your Entry
                </h3>
                <p className="text-muted-foreground">
                  AI is reading your journal and generating insights...
                </p>
              </motion.div>
            ) : analysis ? (
              <>
                {/* Score Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-3xl p-8"
                >
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Score Ring */}
                    <div className="relative flex items-center justify-center">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-muted/30"
                        />
                        <motion.circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="url(#scoreGradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={440}
                          initial={{ strokeDashoffset: 440 }}
                          animate={{ strokeDashoffset: 440 - (analysis.overallScore / 100) * 440 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={colors.primary} />
                            <stop offset="100%" stopColor={colors.secondary} />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <motion.span
                          className="text-4xl font-bold font-primary"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {analysis.overallScore}
                        </motion.span>
                        <span className="text-xs text-muted-foreground">Emotional Score</span>
                      </div>
                    </div>

                    {/* Mood & Stats */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <EmotionalAura mood={journal.mood} intensity={3} size="md">
                          <span className="text-2xl">{moodEmojis[journal.mood]}</span>
                        </EmotionalAura>
                        <div>
                          <p className="text-sm text-muted-foreground">Primary Emotion</p>
                          <p className="text-xl font-bold font-primary capitalize">
                            {moodLabels[journal.mood]}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-muted/30">
                          <p className="text-sm text-muted-foreground mb-1">Word Count</p>
                          <p className="text-lg font-bold">{analysis.wordCount}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-muted/30">
                          <p className="text-sm text-muted-foreground mb-1">Mood Score</p>
                          <p className="text-lg font-bold">{analysis.moodScore}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Emotions Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Heart className="w-5 h-5 text-primary" />
                    <h3 className="font-bold font-primary">Emotions Detected</h3>
                  </div>
                  <div className="space-y-4">
                    {analysis.secondaryEmotions.map((emotion, index) => (
                      <motion.div
                        key={emotion.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{emotion.name}</span>
                          <span className="text-muted-foreground">{emotion.percentage}%</span>
                        </div>
                        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${emotion.percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                            className={cn("h-full rounded-full", emotion.color)}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Lightbulb className="w-5 h-5 text-accent" />
                    <h3 className="font-bold font-primary">Key Insights</h3>
                  </div>
                  <ul className="space-y-4">
                    {analysis.insights.map((insight, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-accent">{index + 1}</span>
                        </div>
                        <p className="text-muted-foreground">{insight}</p>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Suggestions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-bold font-primary">Suggestions for You</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analysis.suggestions.map((suggestion, index) => {
                      const Icon = suggestion.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-3">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <h4 className="font-bold text-sm mb-1">{suggestion.title}</h4>
                          <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Key Phrases */}
                {analysis.keyPhrases.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Quote className="w-5 h-5 text-muted-foreground" />
                      <h3 className="font-bold font-primary">Key Words</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keyPhrases.map((phrase, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {phrase}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Disclaimer */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-xs text-muted-foreground"
                >
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  AI-generated insights are for self-reflection purposes only
                </motion.p>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
