/**
 * =============================================================================
 * SIDEBAR JOURNAL CONTENT COMPONENT
 * =============================================================================
 * 
 * SSR Pattern: Receives journals as props from parent SidebarRight component.
 * Displays journal stats, recent entries, and writing prompts.
 * 
 * LOCAL-FIRST MVP INTEGRATION:
 * - Search for "LOCAL_OPS:" comments for sections to uncomment/modify
 * - Will need to: merge server data with local storage
 * - Show offline indicator when not connected
 * - Display pending sync count if any
 * 
 * See @/lib/journal-storage.ts for local storage utilities.
 * =============================================================================
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";
import { MoodType } from "./mood-selector";
import { moodColors } from "./emotional-aura";
import { JournalCard } from "./journal-card";
import {
  BookOpen,
  Flame,
  Sparkles,
  PenLine,
  TrendingUp,
  Calendar,
  Quote,
} from "lucide-react";
import Link from "next/link";

// LOCAL_OPS: Keep for future local-first implementation
// import {
//   getStoredJournals,
//   JournalEntry
// } from "@/lib/journal-storage";
import { Journal, MoodTags } from "@/types/database";

// Normalized entry type for component use
interface NormalizedEntry {
  id: string;
  title: string;
  body: string;
  mood: MoodTags;
  moodIntensity?: number;
  createdAt: string;
  updatedAt: string;
}

// Convert Journal from DB to normalized entry
function normalizeJournal(journal: Journal): NormalizedEntry {
  return {
    id: journal.journal_id,
    title: journal.title,
    body: journal.content,
    mood: journal.mood_tags?.[0] || "neutral",
    createdAt: journal.created_at,
    updatedAt: journal.updated_at,
  };
}

// Writing prompts
const writingPrompts = [
  "What made you smile today?",
  "What's one thing you're grateful for?",
  "Describe a challenge you overcame recently.",
  "What are you looking forward to?",
  "How did you practice self-care today?",
  "What's something new you learned?",
  "Describe a moment of peace you experienced.",
  "What would make tomorrow better?",
];

function getRandomPrompt(): string {
  return writingPrompts[Math.floor(Math.random() * writingPrompts.length)];
}

// Calculate streak from entries
function calculateStreak(entries: NormalizedEntry[]): number {
  if (entries.length === 0) return 0;
  
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    
    const hasEntry = sortedEntries.some((entry) => {
      const entryDate = new Date(entry.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === checkDate.getTime();
    });
    
    if (hasEntry) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  
  return streak;
}

// Get dominant mood from recent entries
function getDominantMood(entries: NormalizedEntry[]): MoodType | null {
  if (entries.length === 0) return null;
  
  const moodCounts: Partial<Record<MoodType, number>> = {};
  entries.slice(0, 7).forEach((entry) => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });
  
  let dominant: MoodType | null = null;
  let maxCount = 0;
  
  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominant = mood as MoodType;
    }
  });
  
  return dominant;
}

interface SidebarJournalContentProps {
  journals: Journal[];
}

export function SidebarJournalContent({ journals }: SidebarJournalContentProps) {
  // Normalize journals from DB format
  const entries = journals.map(normalizeJournal);
  
  const [prompt, setPrompt] = useState("");

  // LOCAL_OPS: useEffect for loading from localStorage - removed for SSR
  // useEffect(() => {
  //   const storedEntries = getStoredJournals();
  //   setEntries(storedEntries);
  //   setPrompt(getRandomPrompt());
  //   setIsLoading(false);
  // }, []);

  useEffect(() => {
    setPrompt(getRandomPrompt());
  }, []);

  const streak = calculateStreak(entries);
  const dominantMood = getDominantMood(entries);
  const entriesThisWeek = entries.filter((e) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(e.createdAt) > weekAgo;
  }).length;
  const recentEntries = entries
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 p-2"
    >
      {/* New Entry Button */}
      <Link href="/dashboard/journal/new">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
        >
          <PenLine className="w-4 h-4" />
          New Entry
        </motion.button>
      </Link>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Streak */}
        <div className="p-3 rounded-xl bg-card/80 border border-border/50">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-muted-foreground">Streak</span>
          </div>
          <p className="text-2xl font-bold font-primary">{streak}</p>
          <p className="text-xs text-muted-foreground">days</p>
        </div>

        {/* This Week */}
        <div className="p-3 rounded-xl bg-card/80 border border-border/50">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">This week</span>
          </div>
          <p className="text-2xl font-bold font-primary">{entriesThisWeek}</p>
          <p className="text-xs text-muted-foreground">entries</p>
        </div>
      </div>

      {/* Dominant Mood */}
      {dominantMood && (
        <div className="p-3 rounded-xl bg-card/80 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">Recent vibe</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: moodColors[dominantMood].primary }}
            />
            <span className="text-sm font-medium capitalize">{dominantMood}</span>
          </div>
        </div>
      )}

      {/* Writing Prompt */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
        <div className="flex items-center gap-2 mb-2">
          <Quote className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary">Prompt</span>
        </div>
        <p className="text-sm text-muted-foreground italic leading-relaxed">
          {prompt}
        </p>
      </div>

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Recent</span>
          </div>
          {recentEntries.map((entry) => (
            <JournalCard className="mb-2" key={entry.id} entry={entry} variant="compact" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {entries.length === 0 && (
        <div className="text-center py-6">
          <Sparkles className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Start your journaling journey!
          </p>
        </div>
      )}
    </motion.div>
  );
}
