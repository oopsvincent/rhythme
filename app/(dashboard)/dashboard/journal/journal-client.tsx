/**
 * =============================================================================
 * JOURNAL LIST CLIENT COMPONENT
 * =============================================================================
 * 
 * SSR Pattern: Receives journals as props from server component page.tsx.
 * No useEffect for data fetching - data comes pre-loaded from server.
 * 
 * ENCRYPTION: Journals may be encrypted. Content is decrypted client-side
 * using the key derived from user's password and stored in memory.
 * =============================================================================
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { JournalCard } from "@/components/journal/journal-card";
import { MoodType, moodIcons } from "@/components/journal/mood-selector";
import { JournalUnlockModal } from "@/components/journal/journal-unlock-modal";
import { JournalPassphraseSetup } from "@/components/journal/journal-passphrase-setup";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  PenLine,
  Search,
  Filter,
  Flame,
  Sparkles,
  BookOpen,
  TrendingUp,
  X,
  Lock,
  Shield,
} from "lucide-react";
import { Journal, MoodTags } from "@/types/database";
import { decryptJournal } from "@/lib/crypto";
import { useJournalEncryptionStore } from "@/store/useJournalEncryptionStore";

// Normalized entry type for component use
interface NormalizedEntry {
  id: string;
  title: string;
  body: string;
  mood: MoodTags;
  moodIntensity?: number;
  createdAt: string;
  updatedAt: string;
  isEncrypted: boolean;
  decryptionFailed?: boolean;
}

// Convert Journal from DB to normalized entry (without decryption)
function normalizeJournal(journal: Journal): NormalizedEntry {
  const isEncrypted = !!journal.iv;
  return {
    id: journal.journal_id,
    title: journal.title,
    // For encrypted journals, show placeholder until decrypted
    body: isEncrypted ? "[Encrypted]" : journal.content,
    mood: journal.mood_tags?.mood || "neutral",
    createdAt: journal.created_at,
    updatedAt: journal.updated_at,
    isEncrypted,
  };
}

// Mood filter options
const moodFilters: { type: MoodTags | "all"; label: string }[] = [
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

interface JournalPageClientProps {
  journals: Journal[];
  userEmail: string;
  userId: string;
  encryptionToken: string | null;
}

export default function JournalPageClient({ 
  journals, 
  userEmail,
  userId,
  encryptionToken 
}: JournalPageClientProps) {
  // Encryption state
  const { key: encryptionKey, isReady: isKeyReady } = useJournalEncryptionStore();
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showPassphraseSetup, setShowPassphraseSetup] = useState(false);
  const [decryptedEntries, setDecryptedEntries] = useState<NormalizedEntry[]>([]);
  const [isDecrypting, setIsDecrypting] = useState(false);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState<MoodType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Check if any journals need decryption (iv present = encrypted)
  const hasEncryptedJournals = useMemo(
    () => journals.some((j) => !!j.iv),
    [journals]
  );

  // Decrypt journals when key is available
  useEffect(() => {
    async function decryptJournals() {
      if (!hasEncryptedJournals) {
        // No encrypted journals, just normalize
        setDecryptedEntries(journals.map(normalizeJournal));
        return;
      }

      if (!encryptionKey) {
        // Key not available, show placeholder for encrypted journals
        setDecryptedEntries(journals.map(normalizeJournal));
        
        // Determine which modal to show:
        // - If user has encryption token -> show unlock modal
        // - If user doesn't have encryption token -> they need to set up passphrase first
        if (encryptionToken) {
          setShowUnlockModal(true);
        } else {
          // OAuth user without encryption setup - prompt for passphrase setup
          setShowPassphraseSetup(true);
        }
        return;
      }

      setIsDecrypting(true);
      const decrypted: NormalizedEntry[] = [];

      for (const journal of journals) {
        if (journal.iv) {
          // Encrypted journal - decrypt using content field
          try {
            const decryptedPayload = await decryptJournal(
              encryptionKey,
              journal.content, // content has encrypted base64
              journal.iv
            );
            
            // Parse JSON payload which contains both title and body
            let title: string;
            let body: string;
            try {
              const parsed = JSON.parse(decryptedPayload);
              title = parsed.title || journal.title;
              body = parsed.body || decryptedPayload;
            } catch {
              // Legacy format: only body was encrypted, title is plaintext
              title = journal.title;
              body = decryptedPayload;
            }
            
            decrypted.push({
              id: journal.journal_id,
              title,
              body,
              mood: journal.mood_tags?.mood || "neutral",
              createdAt: journal.created_at,
              updatedAt: journal.updated_at,
              isEncrypted: true,
            });
          } catch (err) {
            console.error(`Failed to decrypt journal ${journal.journal_id}:`, err);
            decrypted.push({
              ...normalizeJournal(journal),
              decryptionFailed: true,
              body: "[Decryption failed]",
            });
          }
        } else {
          decrypted.push(normalizeJournal(journal));
        }
      }

      setDecryptedEntries(decrypted);
      setIsDecrypting(false);
      setShowUnlockModal(false);
      setShowPassphraseSetup(false);
    }

    decryptJournals();
  }, [journals, encryptionKey, hasEncryptedJournals, encryptionToken]);

  // Use decrypted entries
  const entries = decryptedEntries;

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

  return (
    <>
      <SiteHeader />
      
      {/* Unlock Modal - only shown when user has encryption setup */}
      {encryptionToken && (
        <JournalUnlockModal
          open={showUnlockModal}
          onOpenChange={setShowUnlockModal}
          userId={userId}
          validationToken={encryptionToken}
        />
      )}
      
      {/* Passphrase Setup Modal - for OAuth users without encryption setup */}
      <JournalPassphraseSetup
        open={showPassphraseSetup}
        onOpenChange={setShowPassphraseSetup}
        userId={userId}
        onSuccess={() => {
          // After setup, refresh the page to re-fetch with new token
          window.location.reload();
        }}
      />
      
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
