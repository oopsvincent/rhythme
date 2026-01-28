"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  PenLine, 
  Send,
  Sparkles,
  BookOpen
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getStoredJournals,
  addJournalEntry,
  JournalEntry
} from "@/lib/journal-storage";

const QUICK_JOURNAL_KEY = "rhythme_quick_journal_draft";

// Writing prompts for quick journal
const quickPrompts = [
  "What's on your mind right now?",
  "One thing I'm grateful for today...",
  "How am I feeling in this moment?",
  "What's my intention for today?",
  "Something I want to remember...",
];

function getRandomPrompt(): string {
  return quickPrompts[Math.floor(Math.random() * quickPrompts.length)];
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function QuickJournalCard() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [todayEntry, setTodayEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Get random prompt
    setPrompt(getRandomPrompt());
    
    // Check for existing draft
    const draft = localStorage.getItem(QUICK_JOURNAL_KEY);
    if (draft) {
      setText(draft);
    }
    
    // Check for today's entry
    try {
      const entries = getStoredJournals();
      const today = getTodayKey();
      const existing = entries.find(e => 
        e.createdAt.startsWith(today)
      );
      if (existing) {
        setTodayEntry(existing);
      }
    } catch (e) {
      console.error("Failed to load journals:", e);
    }
    setIsLoading(false);
  }, []);

  // Save draft as user types
  useEffect(() => {
    if (text) {
      localStorage.setItem(QUICK_JOURNAL_KEY, text);
    } else {
      localStorage.removeItem(QUICK_JOURNAL_KEY);
    }
  }, [text]);

  const handleSave = () => {
    if (!text.trim()) return;
    
    setIsSaving(true);
    
    // Create new entry
    const newEntry: JournalEntry = {
      id: `journal_${Date.now()}`,
      title: prompt,
      body: text,
      mood: "neutral",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add new entry
    addJournalEntry(newEntry);
    
    // Clear draft
    localStorage.removeItem(QUICK_JOURNAL_KEY);
    
    // Navigate to journal
    router.push("/dashboard/journal");
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50">
        <div className="h-32 animate-pulse bg-muted/50 rounded-lg" />
      </div>
    );
  }

  // If user already has today's entry, show preview
  if (todayEntry) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent" />
            <h3 className="font-semibold font-primary text-sm">Today&apos;s Journal</h3>
          </div>
          <button
            onClick={() => router.push("/dashboard/journal/new")}
            className="text-xs text-primary font-medium hover:underline"
          >
            New entry
          </button>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {todayEntry.body}
        </p>
        <button
          onClick={() => router.push(`/dashboard/journal/${todayEntry.id}`)}
          className="text-xs text-primary hover:underline"
        >
          Continue reading →
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <PenLine className="w-4 h-4 text-primary" />
          <h3 className="font-semibold font-primary text-sm">Quick Journal</h3>
        </div>
        <button
          onClick={() => router.push("/dashboard/journal/new")}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Full editor
        </button>
      </div>

      {/* Prompt */}
      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
        <Sparkles className="w-3 h-3" />
        {prompt}
      </p>

      {/* Input area */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start writing..."
          className={cn(
            "w-full min-h-[80px] p-3 rounded-lg resize-none",
            "bg-muted/30 border border-transparent",
            "focus:border-primary/50 focus:bg-muted/50 focus:outline-none",
            "text-sm placeholder:text-muted-foreground/60",
            "transition-all duration-200"
          )}
        />
        
        {/* Save button */}
        {text.trim() && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "absolute bottom-2 right-2",
              "w-8 h-8 rounded-lg flex items-center justify-center",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-colors",
              "disabled:opacity-50"
            )}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
