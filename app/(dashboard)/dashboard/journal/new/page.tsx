"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { MoodSelector, MoodType } from "@/components/journal/mood-selector";
import { JournalEditor } from "@/components/journal/journal-editor";
import {
  ArrowLeft,
  Save,
  Loader2,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

// Local storage key
const JOURNALS_STORAGE_KEY = 'rhythme_journals';

interface JournalEntry {
  id: string;
  title: string;
  body: string;
  mood: MoodType;
  moodIntensity?: number;
  createdAt: string;
  updatedAt: string;
}

export default function NewJournalPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<MoodType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const canSave = title.trim() !== "" && mood !== null;

  // Auto-save draft to localStorage
  const saveDraft = useCallback(() => {
    const draft = { title, body, mood };
    localStorage.setItem('rhythme_journal_draft', JSON.stringify(draft));
  }, [title, body, mood]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('rhythme_journal_draft');
    if (draft) {
      try {
        const { title: dTitle, body: dBody, mood: dMood } = JSON.parse(draft);
        if (dTitle) setTitle(dTitle);
        if (dBody) setBody(dBody);
        if (dMood) setMood(dMood);
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  // Auto-save draft on change
  useEffect(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    const timeout = setTimeout(saveDraft, 1000);
    setAutoSaveTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [title, body, mood, saveDraft]);

  const handleSave = async () => {
    if (!canSave || !mood) return;

    setIsSaving(true);

    // Simulate a small delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: title.trim(),
      body,
      mood,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Get existing journals
    const existing = localStorage.getItem(JOURNALS_STORAGE_KEY);
    const journals: JournalEntry[] = existing ? JSON.parse(existing) : [];

    // Add new entry
    journals.push(newEntry);
    localStorage.setItem(JOURNALS_STORAGE_KEY, JSON.stringify(journals));

    // Clear draft
    localStorage.removeItem('rhythme_journal_draft');

    setIsSaving(false);
    setIsSaved(true);

    // Navigate back after brief delay to show success
    setTimeout(() => {
      router.push('/dashboard/journal');
    }, 500);
  };

  const handleBack = () => {
    router.push('/dashboard/journal');
  };

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col px-4 md:px-10 pb-8">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-6 py-6 max-w-4xl mx-auto w-full">
            {/* Header */}
            <motion.div
              className="flex items-center justify-between gap-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-xl md:text-2xl font-primary tracking-tight">
                    New Entry
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={!canSave || isSaving}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isSaved ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isSaving ? 'Saving...' : isSaved ? 'Saved!' : 'Save Entry'}
              </button>
            </motion.div>

            {/* Editor Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl border-border/30 overflow-hidden"
            >
              {/* Title Input */}
              <div className="px-6 md:px-8 pt-6 md:pt-8">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Untitled"
                  className="w-full text-3xl md:text-4xl font-primary font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Mood Selector */}
              <div className="px-6 md:px-8 py-6 border-b border-border/30">
                <MoodSelector value={mood} onChange={setMood} />
              </div>

              {/* Body Editor */}
              <div className="px-6 md:px-8 py-6">
                <JournalEditor
                  value={body}
                  onChange={setBody}
                  placeholder="Start writing your thoughts..."
                />
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
