"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { JournalCard } from "@/components/journal/journal-card";
import { EmotionalAura, moodColors } from "@/components/journal/emotional-aura";
import { MoodType, moodIcons } from "@/components/journal/mood-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  PenLine,
  Search,
  Filter,
  Flame,
  Sparkles,
  BookOpen,
  Calendar,
  TrendingUp,
  X,
} from "lucide-react";

import {
  getStoredJournals,
  JournalEntry
} from "@/lib/journal-storage";

// Mood filter options
const moodFilters: { type: MoodType | "all"; label: string }[] = [
  { type: "all", label: "All" },
  { type: "happy", label: "Happy" },
  { type: "calm", label: "Calm" },
  { type: "excited", label: "Excited" },
  { type: "neutral", label: "Neutral" },
  { type: "sad", label: "Sad" },
  { type: "anxious", label: "Anxious" },
  { type: "frustrated", label: "Frustrated" },
];

// Calculate streak
function calculateStreak(entries: JournalEntry[]): number {
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

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState<MoodType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Load entries
  useEffect(() => {
    const storedEntries = getStoredJournals();
    setEntries(storedEntries);
    setIsLoading(false);
  }, []);

  // Filter entries
  const filteredEntries = entries
    .filter((entry) => {
      if (moodFilter !== "all" && entry.mood !== moodFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          entry.title.toLowerCase().includes(query) ||
          entry.body.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const streak = calculateStreak(entries);
  const totalEntries = entries.length;
  const thisWeekEntries = entries.filter((e) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(e.createdAt) > weekAgo;
  }).length;

  if (isLoading) {
    return (
      <>
        <SiteHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading journals...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col overflow-hidden overflow-y-auto">
        <div className="flex flex-1 flex-col px-4 md:px-8 lg:px-10 py-6 md:py-8 relative">
          
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-[120px]"
              style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
            />
            <div 
              className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]"
              style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
            />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto w-full space-y-8">
            
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-primary tracking-tight mb-2">
                  Your Journal
                </h1>
                <p className="text-muted-foreground">
                  Capture your thoughts, track your emotions
                </p>
              </div>

              {/* New Entry Button */}
              <Link href="/dashboard/journal/new">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
                >
                  <PenLine className="w-4 h-4" />
                  New Entry
                </Button>
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-4"
            >
              {/* Streak */}
              <div className="glass-card rounded-2xl p-4 md:p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold font-primary">{streak}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Day streak</p>
                </div>
              </div>

              {/* Total Entries */}
              <div className="glass-card rounded-2xl p-4 md:p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold font-primary">{totalEntries}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Total entries</p>
                </div>
              </div>

              {/* This Week */}
              <div className="glass-card rounded-2xl p-4 md:p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold font-primary">{thisWeekEntries}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">This week</p>
                </div>
              </div>
            </motion.div>

            {/* Search & Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {/* Search Bar */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your journals..."
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-card/60 border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/60"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "h-12 w-12 rounded-xl",
                    showFilters && "bg-primary/10 border-primary text-primary"
                  )}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              {/* Mood Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 py-2">
                      {moodFilters.map((filter) => (
                        <button
                          key={filter.type}
                          onClick={() => setMoodFilter(filter.type)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                            moodFilter === filter.type
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {filter.type !== "all" && (() => {
                            const Icon = moodIcons[filter.type as MoodType];
                            return <Icon className="w-4 h-4 mr-1" />;
                          })()}
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Journal Grid */}
            {filteredEntries.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
              >
                {filteredEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <JournalCard
                      entry={entry}
                      variant={index === 0 && filteredEntries.length > 3 ? "featured" : "default"}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : entries.length === 0 ? (
              /* Empty State - No entries at all */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-3xl p-12 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-primary mb-3">
                  Start Your Journaling Journey
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Capture your thoughts, track your emotions, and discover insights about yourself 
                  through the power of reflective writing.
                </p>
                <Link href="/dashboard/journal/new">
                  <Button size="lg" className="gap-2">
                    <PenLine className="w-4 h-4" />
                    Write Your First Entry
                  </Button>
                </Link>
              </motion.div>
            ) : (
              /* No results for filter */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-2xl p-8 text-center"
              >
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-bold font-primary mb-2">No Matches Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setMoodFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
