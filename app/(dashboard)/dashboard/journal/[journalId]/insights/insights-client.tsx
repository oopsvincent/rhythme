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
      <>
        <SiteHeader />
        {encryptionToken && (
          <JournalUnlockModal
            open={showUnlockModal}
            onOpenChange={setShowUnlockModal}
            userId={userId}
            validationToken={encryptionToken}
          />
        )}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
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
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      {encryptionToken && (
        <JournalUnlockModal
          open={showUnlockModal}
          onOpenChange={setShowUnlockModal}
          userId={userId}
          validationToken={encryptionToken}
        />
      )}
      <div className="flex flex-1 flex-col overflow-hidden overflow-y-auto">
        <div className="flex flex-1 flex-col px-4 md:px-8 py-6 md:py-8 relative">
          {/* Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
              style={{
                background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
              }}
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
                <Link href={`/dashboard/journal/${journalId}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl"
                  >
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
                    {decryptedTitle || initialJournal.title}
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
                <RefreshCw
                  className={cn("w-4 h-4", isAnalyzing && "animate-spin")}
                />
                {analysis ? "Re-analyze" : "Analyze"}
              </Button>
            </motion.div>

            {/* Error State */}
            {error && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6 border-destructive/30"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{error}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      The ML service might be warming up. Try again in a
                      moment.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {isAnalyzing ? (
              /* Analyzing State */
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
                  Rhythmé is analyzing your emotions...
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
                          animate={{
                            strokeDashoffset:
                              440 - (analysis.sentimentScore / 100) * 440,
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
                          {analysis.sentimentScore}
                        </motion.span>
                        <span className="text-xs text-muted-foreground">
                          Confidence
                        </span>
                      </div>
                    </div>

                    {/* Sentiment & Stats */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <EmotionalAura mood={mood} intensity={3} size="md">
                          {(() => {
                            const MoodIcon = moodIcons[mood];
                            return (
                              <MoodIcon
                                className="w-6 h-6"
                                style={{ color: colors.primary }}
                              />
                            );
                          })()}
                        </EmotionalAura>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Sentiment
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-xl font-bold font-primary capitalize">
                              {analysis.sentiment}
                            </p>
                            <Badge
                              className={cn(
                                "text-xs",
                                sentimentColors[analysis.sentiment]?.bg ||
                                  "bg-muted",
                                sentimentColors[analysis.sentiment]?.text ||
                                  "text-foreground"
                              )}
                            >
                              {(analysis.confidence * 100).toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-muted/30">
                          <p className="text-sm text-muted-foreground mb-1">
                            Word Count
                          </p>
                          <p className="text-lg font-bold">
                            {analysis.wordCount}
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-muted/30">
                          <p className="text-sm text-muted-foreground mb-1">
                            Mood
                          </p>
                          <p className="text-lg font-bold capitalize">
                            {moodLabels[mood]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Emotions Detected */}
                {analysis.emotions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <Heart className="w-5 h-5 text-primary" />
                      <h3 className="font-bold font-primary">
                        Emotions Detected
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.emotions.map((emotion, index) => (
                        <motion.div
                          key={emotion}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                        >
                          <Badge
                            variant="outline"
                            className={cn(
                              "px-4 py-2 text-sm capitalize border-0",
                              emotionColors[index % emotionColors.length].bg,
                              emotionColors[index % emotionColors.length].text
                            )}
                          >
                            {emotion}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

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
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-accent">1</span>
                      </div>
                      <p className="text-muted-foreground">
                        Your journal conveys a <strong className="text-foreground">{analysis.sentiment}</strong> sentiment
                        with <strong className="text-foreground">{analysis.sentimentScore}%</strong> confidence,
                        {analysis.wordCount > 100
                          ? " expressed through detailed, thoughtful writing."
                          : " written in a concise and focused manner."}
                      </p>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-accent">2</span>
                      </div>
                      <p className="text-muted-foreground">
                        The primary emotions detected are{" "}
                        <strong className="text-foreground">{analysis.emotions.join(", ")}</strong>,
                        which aligns with your selected mood of <strong className="text-foreground">{moodLabels[mood]}</strong>.
                      </p>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-accent">3</span>
                      </div>
                      <p className="text-muted-foreground">
                        Consider reflecting on what triggered these feelings for deeper self-awareness
                        and emotional growth.
                      </p>
                    </motion.li>
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
                    <h3 className="font-bold font-primary">
                      Suggestions for You
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getSuggestions(analysis.sentiment, analysis.emotions).map(
                      (suggestion, index) => {
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
                            <h4 className="font-bold text-sm mb-1">
                              {suggestion.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {suggestion.description}
                            </p>
                          </motion.div>
                        );
                      }
                    )}
                  </div>
                </motion.div>

                {/* Model info + Disclaimer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center space-y-1"
                >
                  <p className="text-xs text-muted-foreground">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    Analyzed by <span className="font-medium">Rhythmé {getModelDisplayName(analysis.model_used)}</span>
                    {analysis.analyzed_at && (
                      <>
                        {" · "}
                        {new Date(analysis.analyzed_at).toLocaleString()}
                      </>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    AI-generated insights are for self-reflection purposes only
                  </p>
                </motion.div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
