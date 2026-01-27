"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { MoodSelector, MoodType } from "@/components/journal/mood-selector";
import { JournalEditor } from "@/components/journal/journal-editor";
import { moodColors } from "@/components/journal/emotional-aura";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Check,
  Clock,
  Type,
  HardDrive,
  Cloud,
  CloudOff,
} from "lucide-react";

// Local storage key
const JOURNALS_STORAGE_KEY = "rhythme_journals";
const DRAFT_STORAGE_KEY = "rhythme_journal_draft";

interface JournalEntry {
  id: string;
  title: string;
  body: string;
  mood: MoodType;
  moodIntensity?: number;
  createdAt: string;
  updatedAt: string;
}

// Calculate word count from text
function calculateWordCount(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}

// Calculate reading time
function calculateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200));
}

export default function NewJournalPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<MoodType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const canSave = title.trim() !== "" && mood !== null;
  const wordCount = calculateWordCount(body);
  const readingTime = calculateReadingTime(wordCount);

  // Get mood colors for ambient effect
  const ambientColor = mood ? moodColors[mood] : null;

  // Auto-save draft to localStorage
  const saveDraft = useCallback(() => {
    const draft = { title, body, mood, savedAt: new Date().toISOString() };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    setLastSaved(new Date());
  }, [title, body, mood]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (draft) {
      try {
        const { title: dTitle, body: dBody, mood: dMood, savedAt } = JSON.parse(draft);
        if (dTitle) setTitle(dTitle);
        if (dBody) setBody(dBody);
        if (dMood) setMood(dMood);
        if (savedAt) setLastSaved(new Date(savedAt));
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, []);

  // Auto-save draft on change (debounced)
  useEffect(() => {
    const timeout = setTimeout(saveDraft, 500);
    return () => clearTimeout(timeout);
  }, [title, body, mood, saveDraft]);

  const handleSave = async () => {
    if (!canSave || !mood) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: title.trim(),
      body,
      mood,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existing = localStorage.getItem(JOURNALS_STORAGE_KEY);
    const journals: JournalEntry[] = existing ? JSON.parse(existing) : [];
    journals.push(newEntry);
    localStorage.setItem(JOURNALS_STORAGE_KEY, JSON.stringify(journals));
    localStorage.removeItem(DRAFT_STORAGE_KEY);

    setIsSaving(false);
    setIsSaved(true);

    setTimeout(() => {
      router.push("/dashboard/journal");
    }, 500);
  };

  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return null;
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 5) return "just now";
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    return `${diffMin}m ago`;
  };

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col overflow-hidden overflow-y-auto relative">
        {/* Ambient Background based on mood */}
        <motion.div
          className="absolute inset-0 pointer-events-none transition-all duration-1000"
          animate={{
            background: ambientColor
              ? `radial-gradient(ellipse at top, ${ambientColor.primary}10 0%, transparent 50%)`
              : "transparent",
          }}
        />

        <div className="relative flex flex-1 flex-col px-4 md:px-8 py-4 md:py-8">
          <div className="max-w-3xl mx-auto w-full space-y-4 md:space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <Link href="/dashboard/journal">
                  <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10 rounded-xl">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-lg md:text-2xl font-primary tracking-tight">
                    New Entry
                  </h1>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={!canSave || isSaving}
                size="sm"
                className={cn(
                  "gap-2 transition-all duration-300",
                  canSave && !isSaving && "shadow-lg hover:shadow-primary/25"
                )}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isSaved ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {isSaving ? "Saving..." : isSaved ? "Saved!" : "Save Entry"}
                </span>
              </Button>
            </motion.div>

            {/* Auto-save Notice - Mobile friendly */}
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/30"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <HardDrive className="w-3.5 h-3.5 text-primary" />
                <span>
                  <span className="font-medium text-foreground">Auto-saved locally</span>
                  {lastSaved && <span> · {formatLastSaved()}</span>}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CloudOff className="w-3 h-3" />
                <span className="hidden sm:inline">Cloud sync coming soon</span>
              </div>
            </motion.div>

            {/* Editor - Embedded feel (no glass-card on mobile) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-4 md:space-y-0 md:glass-card md:rounded-2xl md:border-border/30 md:overflow-hidden"
            >
              {/* Title Input */}
              <div className="md:px-6 md:pt-6">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Untitled"
                  className="w-full text-2xl md:text-4xl font-primary font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Mood Selector */}
              <div className="py-4 md:px-6 md:py-6 md:border-b md:border-border/30">
                <MoodSelector value={mood} onChange={setMood} />
              </div>

              {/* Body Editor */}
              <div className="md:px-6 md:py-6">
                <JournalEditor
                  value={body}
                  onChange={setBody}
                  placeholder="Start writing your thoughts..."
                />
              </div>

              {/* Stats Footer */}
              <div className="py-3 px-0 md:px-6 md:py-4 border-t border-border/30 md:bg-muted/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5" />
                      {wordCount} words
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {readingTime} min read
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Helper Text */}
            {!canSave && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-muted-foreground"
              >
                {!title.trim() && mood === null
                  ? "Add a title and select your mood to save"
                  : !title.trim()
                  ? "Add a title to save"
                  : "Select your mood to save"}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
