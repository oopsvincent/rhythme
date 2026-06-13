"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { EmotionalAura, moodColors } from "@/components/journal/emotional-aura";
import { MoodType, moodIcons } from "@/components/journal/mood-selector";
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
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { Journal, JournalMoodTags } from "@/types/database";
import { decryptJournal } from "@/lib/crypto";
import { useJournalEncryptionStore } from "@/store/useJournalEncryptionStore";
import { JournalUnlockModal } from "@/components/journal/journal-unlock-modal";
import { analyzeJournalSentiment } from "@/app/actions/journals";
import { toLocalDateTimeString } from "@/lib/timezone";

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

// Sentiment color mappings
const sentimentColors: Record<string, { bg: string; text: string }> = {
  positive: { bg: "bg-green-500/20", text: "text-green-500" },
  negative: { bg: "bg-red-500/20", text: "text-red-500" },
  neutral: { bg: "bg-blue-500/20", text: "text-blue-500" },
};

// Emotion color mappings (bg + text for dark mode compatibility)
const emotionColors: { bg: string; text: string }[] = [
  { bg: "bg-violet-500/15", text: "text-violet-400" },
  { bg: "bg-blue-500/15", text: "text-blue-400" },
  { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  { bg: "bg-amber-500/15", text: "text-amber-400" },
  { bg: "bg-rose-500/15", text: "text-rose-400" },
  { bg: "bg-cyan-500/15", text: "text-cyan-400" },
  { bg: "bg-indigo-500/15", text: "text-indigo-400" },
];

// Map ML model names to branded Rhythmé codenames
const modelCodenames: Record<string, string> = {
  roberta: "Cadence",
  vader: "Verse",
};
function getModelDisplayName(modelName: string): string {
  return modelCodenames[modelName.toLowerCase()] || "Cadence";
}

interface AnalysisData {
  sentiment: string;
  confidence: number;
  sentimentScore: number;
  emotions: string[];
  model_used: string;
  analyzed_at: string;
  wordCount: number;
  mood: MoodType;
}

// Generate action suggestions based on sentiment
function getSuggestions(sentiment: string, emotions: string[]) {
  const suggestions = [];

  if (sentiment === "positive" || emotions.includes("joy")) {
    suggestions.push({
      icon: Heart,
      title: "Capture This Feeling",
      description: "Write down what made today great so you can recreate it.",
    });
  } else if (sentiment === "negative" || emotions.includes("sadness") || emotions.includes("anger")) {
    suggestions.push({
      icon: Heart,
      title: "Self-Compassion",
      description: "Be kind to yourself. These feelings are temporary and valid.",
    });
  } else {
    suggestions.push({
      icon: Heart,
      title: "Mindful Reflection",
      description: "Take a moment to check in with how you're really feeling.",
    });
  }

  suggestions.push(
    {
      icon: Target,
      title: "Action Step",
      description: sentiment === "negative"
        ? "Identify one small thing that could improve your mood right now."
        : "Set an intention for how you want to carry this energy forward.",
    },
    {
      icon: Zap,
      title: "Energy Check",
      description: "Notice how your energy levels connect to your emotional state today.",
    }
  );

  return suggestions;
}

interface InsightsClientProps {
  journal: Journal;
  userId: string;
  encryptionToken: string | null;
}

export default function InsightsClient({
  journal: initialJournal,
  userId,
  encryptionToken,
}: InsightsClientProps) {
  const { key: encryptionKey } = useJournalEncryptionStore();
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Decrypted content
  const [decryptedTitle, setDecryptedTitle] = useState<string | null>(null);
  const [decryptedBody, setDecryptedBody] = useState<string | null>(null);

  // Analysis state
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const journalId = `${initialJournal.journal_id}`;
  const mood: MoodType = initialJournal.mood_tags?.mood || "neutral";

  // Check if analysis is already cached in DB
  const hasExistingAnalysis = !!(initialJournal.mood_tags?.sentiment && initialJournal.sentiment_score);

  // Decrypt content on load
  useEffect(() => {
    async function prepareContent() {
      const isEncrypted = !!initialJournal.iv;

      if (!isEncrypted) {
        setDecryptedTitle(initialJournal.title);
        setDecryptedBody(initialJournal.content);
        return;
      }

      if (!encryptionKey) {
        setShowUnlockModal(true);
        return;
      }

      setIsDecrypting(true);
      try {
        const decryptedPayload = await decryptJournal(
          encryptionKey,
          initialJournal.content,
          initialJournal.iv!
        );

        let title: string;
        let body: string;
        try {
          const parsed = JSON.parse(decryptedPayload);
          title = parsed.title || initialJournal.title;
          body = parsed.body || decryptedPayload;
        } catch {
          title = initialJournal.title;
          body = decryptedPayload;
        }

        setDecryptedTitle(title);
        setDecryptedBody(body);
        setShowUnlockModal(false);
      } catch (err) {
        console.error("Failed to decrypt journal:", err);
        setError("Failed to decrypt journal content.");
      } finally {
        setIsDecrypting(false);
      }
    }

    prepareContent();
  }, [initialJournal, encryptionKey]);

  // Load cached analysis from DB or trigger fresh analysis
  useEffect(() => {
    if (decryptedBody === null) return; // Not ready yet

    if (hasExistingAnalysis) {
      // Use cached results from DB
      const tags = initialJournal.mood_tags as JournalMoodTags;
      const plainText = decryptedBody.replace(/<[^>]*>/g, "");
      const wordCount = plainText.split(/\s+/).filter(Boolean).length;

      setAnalysis({
        sentiment: tags.sentiment!,
        confidence: (initialJournal.sentiment_score || 0) / 100,
        sentimentScore: initialJournal.sentiment_score || 0,
        emotions: tags.emotions || [],
        model_used: tags.model_used || "unknown",
        analyzed_at: tags.analyzed_at || "",
        wordCount,
        mood,
      });
    } else {
      // Trigger fresh analysis
      runAnalysis();
    }
  }, [decryptedBody]);

  async function runAnalysis() {
    if (!decryptedTitle || decryptedBody === null) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Strip HTML for plain text to send to ML
      const plainText = decryptedBody.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
      const wordCount = plainText.split(/\s+/).filter(Boolean).length;

      const result = await analyzeJournalSentiment(
        journalId,
        decryptedTitle,
        plainText
      );

      if (result.error) {
        setError(result.error);
        setIsAnalyzing(false);
        return;
      }

      if (result.data) {
        setAnalysis({
          sentiment: result.data.sentiment,
          confidence: result.data.confidence,
          sentimentScore: result.data.sentimentScore,
          emotions: result.data.emotions,
          model_used: result.data.model_used,
          analyzed_at: result.data.analyzed_at,
          wordCount,
          mood,
        });
      }
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze journal. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  const regenerateAnalysis = () => {
    runAnalysis();
  };

  const colors = moodColors[mood];

  // Loading / decrypting state
  if (decryptedBody === null && !error) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-background relative overflow-y-auto overflow-x-hidden">
        {/* Blended Header */}
        <SiteHeader className="border-b-0 bg-transparent relative z-20" />
        
        {encryptionToken && (
          <JournalUnlockModal
            open={showUnlockModal}
            onOpenChange={setShowUnlockModal}
            userId={userId}
            validationToken={encryptionToken}
          />
        )}
        
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-4 p-8 bg-card/65 dark:bg-card/30 border border-border/20 rounded-2xl backdrop-blur-sm max-w-sm text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              {showUnlockModal
                ? "Unlock your vault to view insights..."
                : isDecrypting
                  ? "Decrypting journal..."
                  : "Loading..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background relative overflow-y-auto overflow-x-hidden">
      {/* Background paper texture & glow system */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft floating mood radial gradients */}
        <div 
          className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06] dark:opacity-[0.03] blur-[130px] transition-all duration-1000"
          style={{ background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)` }}
        />
        <div 
          className="absolute bottom-1/4 left-1/10 w-[500px] h-[500px] rounded-full opacity-[0.05] dark:opacity-[0.02] blur-[110px] transition-all duration-1000"
          style={{ background: `radial-gradient(circle, var(--accent) 0%, transparent 70%)` }}
        />
        {/* Dotted notebook/bullet journal grid paper style */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Unlock Modal - only shown when user has encryption setup */}
      {encryptionToken && (
        <JournalUnlockModal
          open={showUnlockModal}
          onOpenChange={setShowUnlockModal}
          userId={userId}
          validationToken={encryptionToken}
        />
      )}
      
      {/* Blended Header */}
      <SiteHeader className="bg-transparent relative z-20" />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-4xl mx-auto w-full relative z-10 space-y-6 pb-20">
        
        {/* Navigation Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4 pb-4 border-b border-border/15"
        >
          <div className="flex items-center gap-3">
            <Link href={`/journal/${journalId}`}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Entry</span>
              </Button>
            </Link>
            
            <div className="h-4 w-[1px] bg-border/40 hidden sm:block" />
            
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <Brain className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold tracking-wide uppercase">AI Insights</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={regenerateAnalysis}
            disabled={isAnalyzing}
            className="gap-2 rounded-xl cursor-pointer"
          >
            <RefreshCw
              className={cn("w-3.5 h-3.5", isAnalyzing && "animate-spin")}
            />
            <span>{analysis ? "Re-analyze" : "Analyze"}</span>
          </Button>
        </motion.div>

        {/* Error State */}
        {error && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground/90">{error}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  The machine learning analysis engine might be warming up. Try again in a moment.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {isAnalyzing ? (
          /* Analyzing State */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[28px] border border-border/30 bg-card/65 dark:bg-card/30 backdrop-blur-md p-12 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center shadow-inner">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-bold font-primary mb-2 text-foreground/90 animate-pulse">
              Analyzing Your Entry
            </h3>
            <p className="text-sm text-muted-foreground/80 max-w-xs mx-auto">
              Rhythmé is running Cadence sentiment engines to decipher emotional undertones...
            </p>
          </motion.div>
        ) : analysis ? (
          <>
            {/* Main Insights Sheet */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-[28px] border border-border/30 bg-card/75 dark:bg-card/35 backdrop-blur-md shadow-sm p-6 sm:p-8 md:p-10 space-y-8"
            >
              {/* Score & Sentiment */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-6 border-b border-border/15">
                
                {/* Sentiment descriptor */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <EmotionalAura mood={mood} intensity={3} size="sm">
                      {(() => {
                        const MoodIcon = moodIcons[mood];
                        return (
                          <MoodIcon
                            className="w-5 h-5"
                            style={{ color: colors.primary }}
                          />
                        );
                      })()}
                    </EmotionalAura>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/75">
                        Selected Mood
                      </p>
                      <p className="text-lg font-bold font-primary capitalize text-foreground/90 leading-none mt-1">
                        {moodLabels[mood]}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/75">
                      Sentiment Analysis
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-2.5 mt-1.5">
                      <span className="text-xl font-bold font-primary capitalize text-foreground/90">
                        {analysis.sentiment}
                      </span>
                      <Badge
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 border-0 rounded-md select-none",
                          sentimentColors[analysis.sentiment]?.bg || "bg-muted",
                          sentimentColors[analysis.sentiment]?.text || "text-foreground"
                        )}
                      >
                        {(analysis.confidence * 100).toFixed(0)}% Match
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Score Ring Widget */}
                <div className="relative flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-muted/15"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="54"
                      stroke="url(#scoreGradient)"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={340}
                      initial={{ strokeDashoffset: 340 }}
                      animate={{
                        strokeDashoffset:
                          340 - (analysis.sentimentScore / 100) * 340,
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient
                        id="scoreGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor={colors.primary} />
                        <stop offset="100%" stopColor={colors.secondary || colors.primary} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold font-primary text-foreground/90">
                      {analysis.sentimentScore}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground/60 leading-none mt-0.5">
                      Intensity
                    </span>
                  </div>
                </div>

                {/* Simple Stats Memo */}
                <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 md:min-w-[200px]">
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/10">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/75 mb-1">
                      Word Count
                    </p>
                    <p className="text-base font-bold font-primary text-foreground/90">
                      {analysis.wordCount} words
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/10">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/75 mb-1">
                      Log Length
                    </p>
                    <p className="text-base font-bold font-primary text-foreground/90">
                      {analysis.wordCount > 100 ? "Expressive" : "Reflective"}
                    </p>
                  </div>
                </div>

              </div>

              {/* Emotions Detected */}
              {analysis.emotions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4.5 h-4.5 text-primary" />
                    <h3 className="font-bold font-primary text-foreground/90 text-sm tracking-wide">
                      Emotions Detected
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.emotions.map((emotion, index) => (
                      <motion.div
                        key={emotion}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <Badge
                          variant="outline"
                          className={cn(
                            "px-3 py-1.5 text-xs font-semibold uppercase tracking-wide border-0 rounded-xl select-none",
                            emotionColors[index % emotionColors.length].bg,
                            emotionColors[index % emotionColors.length].text
                          )}
                        >
                          {emotion}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Insights List */}
              <div className="space-y-4 pt-4 border-t border-border/15">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4.5 h-4.5 text-accent" />
                  <h3 className="font-bold font-primary text-foreground/90 text-sm tracking-wide">Key Insights</h3>
                </div>
                <ul className="space-y-3.5">
                  <motion.li
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5.5 h-5.5 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 border border-accent/20">
                      <span className="text-[10px] font-bold text-accent">1</span>
                    </div>
                    <p className="text-sm text-muted-foreground/85 leading-relaxed">
                      Your journal conveys a <strong className="text-foreground">{analysis.sentiment}</strong> sentiment
                      with <strong className="text-foreground">{analysis.sentimentScore}%</strong> intensity,
                      {analysis.wordCount > 100
                        ? " expressed through a detailed and reflective writing style."
                        : " written as a brief, direct check-in."}
                    </p>
                  </motion.li>
                  
                  <motion.li
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5.5 h-5.5 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 border border-accent/20">
                      <span className="text-[10px] font-bold text-accent">2</span>
                    </div>
                    <p className="text-sm text-muted-foreground/85 leading-relaxed">
                      The core emotions of <strong className="text-foreground">{analysis.emotions.join(", ")}</strong> provide a deeper look behind the log, aligning with the feeling of <strong className="text-foreground">{moodLabels[mood]}</strong>.
                    </p>
                  </motion.li>
                  
                  <motion.li
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5.5 h-5.5 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 border border-accent/20">
                      <span className="text-[10px] font-bold text-accent">3</span>
                    </div>
                    <p className="text-sm text-muted-foreground/85 leading-relaxed">
                      Tracing these emotional tags regularly will help you identify what specific activities or environments are triggering these states.
                    </p>
                  </motion.li>
                </ul>
              </div>

            </motion.div>

            {/* Suggestions Memos */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pl-1">
                <TrendingUp className="w-4.5 h-4.5 text-primary" />
                <h3 className="font-bold font-primary text-foreground/90 text-sm tracking-wide">
                  Reflection Suggestions
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getSuggestions(analysis.sentiment, analysis.emotions).map(
                  (suggestion, index) => {
                    const Icon = suggestion.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className="rounded-2xl border border-border/30 bg-card/65 dark:bg-card/30 backdrop-blur-md p-5 hover:shadow-sm transition-all duration-300 group hover:border-primary/20"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-inner">
                          <Icon className="w-4.5 h-4.5 text-primary" />
                        </div>
                        <h4 className="font-bold font-primary text-sm text-foreground/90 mb-1 leading-tight">
                          {suggestion.title}
                        </h4>
                        <p className="text-xs text-muted-foreground/85 leading-relaxed">
                          {suggestion.description}
                        </p>
                      </motion.div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Model Info Banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center space-y-1.5"
            >
              <p className="text-xs text-muted-foreground/60 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary/70" />
                <span>Analyzed by <span className="font-medium">Rhythmé {getModelDisplayName(analysis.model_used)}</span></span>
                {analysis.analyzed_at && (
                  <>
                    <span>·</span>
                    <span>{toLocalDateTimeString(analysis.analyzed_at)}</span>
                  </>
                )}
              </p>
              <p className="text-[10px] text-muted-foreground/45 max-w-xs mx-auto leading-normal">
                AI reflection analysis is an assistive tool and does not constitute medical advice.
              </p>
            </motion.div>
          </>
        ) : null}
      </main>
    </div>
  );
}
