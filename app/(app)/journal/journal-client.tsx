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
import { useSearchParams } from "next/navigation";
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
  Bell,
  Smile,
} from "lucide-react";
import { Journal, MoodTags } from "@/types/database";
import { decryptJournal } from "@/lib/crypto";
import { useJournalEncryptionStore } from "@/store/useJournalEncryptionStore";
import { moodColors } from "@/components/journal/emotional-aura";

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
  imageUrl?: string;
}

// Convert Journal from DB to normalized entry (without decryption)
function normalizeJournal(journal: Journal): NormalizedEntry {
  const isEncrypted = !!journal.iv;
  let body = isEncrypted ? "[Encrypted]" : journal.content;
  let imageUrl = undefined;

  if (!isEncrypted && journal.content) {
    try {
      const parsed = JSON.parse(journal.content);
      if (parsed && typeof parsed === "object") {
        body = parsed.body || body;
        imageUrl = parsed.imageUrl;
      }
    } catch {
      // Not JSON
    }
  }

  return {
    id: journal.journal_id,
    title: journal.title,
    body,
    mood: journal.mood_tags?.mood || "neutral",
    createdAt: journal.created_at,
    updatedAt: journal.updated_at,
    isEncrypted,
    imageUrl,
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
  const searchParams = useSearchParams();
  const tabParam = searchParams ? searchParams.get("tab") : null;
  const activeTab = tabParam === "entries" ? "entries" : "home";

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
            
            // Parse JSON payload which contains both title, body, and optional imageUrl
            let title: string;
            let body: string;
            let imageUrl: string | undefined = undefined;
            try {
              const parsed = JSON.parse(decryptedPayload);
              title = parsed.title || journal.title;
              body = parsed.body || decryptedPayload;
              imageUrl = parsed.imageUrl;
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
              imageUrl,
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
    <div className="flex-1 flex flex-col min-h-screen bg-background relative overflow-y-auto overflow-x-hidden">
      {/* Background paper texture & glow system */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft floating mood radial gradients */}
        <div 
          className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06] dark:opacity-[0.03] blur-[130px] transition-all duration-1000"
          style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
        />
        <div 
          className="absolute bottom-1/4 left-1/10 w-[500px] h-[500px] rounded-full opacity-[0.05] dark:opacity-[0.02] blur-[110px] transition-all duration-1000"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
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
      
      {/* Blended Header */}
      <SiteHeader className="bg-transparent relative z-20" />
      
      {/* Main Container */}
      <main className="flex-1 flex flex-col px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8 max-w-6xl mx-auto w-full relative z-10 space-y-8 pb-20">
        
        {/* Serene Date Banner */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/15",
            activeTab !== "home" && "hidden md:flex"
          )}
        >
          <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-primary tracking-tight text-foreground/90 leading-none flex items-center justify-center md:justify-start gap-3">
              <span>Journal</span>
              <Bell className="w-6 h-6 text-muted-foreground/60 hover:text-primary transition-colors cursor-pointer" />
            </h1>
            <span className="text-xs font-bold uppercase tracking-widest text-primary/80 mt-1">
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" }).toUpperCase()} • {new Date().toLocaleDateString("en-US", { weekday: "long" })}
            </span>
            <p className="text-sm text-muted-foreground/80 mt-1 leading-relaxed">
              Welcome to your quiet space for reflection. Capture your thoughts and trace your emotional journey in security and peace.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 self-center md:self-auto shrink-0">
            <HeaderIllustration />
            
            {/* New Entry Button */}
            <Link href="/journal/new">
              <Button
                size="lg"
                className="h-14 px-6 rounded-2xl gap-2 bg-gradient-to-r from-primary to-secondary hover:shadow-md hover:shadow-primary/15 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-lg shadow-primary/10"
              >
                <PenLine className="w-4 h-4" />
                <span className="font-semibold text-sm">New Entry</span>
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Memo-style Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "grid grid-cols-1 sm:grid-cols-3 gap-4",
            activeTab !== "home" && "hidden md:grid"
          )}
        >
          {/* Streak Memo */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between shadow-[0_2px_10px_-4px_rgba(var(--primary),0.05)] transition-all duration-300 hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/85">Day streak</p>
                <p className="text-lg font-bold font-primary text-foreground/90 mt-0.5">{streak} days</p>
              </div>
            </div>
          </div>

          {/* Total Entries Memo */}
          <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-accent/5 p-4 flex items-center justify-between shadow-[0_2px_10px_-4px_rgba(var(--accent),0.05)] transition-all duration-300 hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/85">Pages filled</p>
                <p className="text-lg font-bold font-primary text-foreground/90 mt-0.5">{totalEntries} entries</p>
              </div>
            </div>
          </div>

          {/* Weekly Memo */}
          <div className="relative overflow-hidden rounded-2xl border border-[#8FAFC9]/25 bg-[#8FAFC9]/8 p-4 flex items-center justify-between shadow-[0_2px_10px_-4px_rgba(143,175,201,0.05)] transition-all duration-300 hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#8FAFC9]/15 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#7CA0BD] dark:text-[#8FAFC9]" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/85">This week</p>
                <p className="text-lg font-bold font-primary text-foreground/90 mt-0.5">{thisWeekEntries} written</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Today's Entry Teaser / "My Day" Prompt */}
        {(() => {
          const todayEntry = entries.find((e) => {
            const entryDate = new Date(e.createdAt);
            const today = new Date();
            return entryDate.getDate() === today.getDate() &&
                   entryDate.getMonth() === today.getMonth() &&
                   entryDate.getFullYear() === today.getFullYear();
          });

          return (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className={cn(
                "relative overflow-hidden rounded-3xl border border-border/30 bg-card/45 dark:bg-card/20 backdrop-blur-md p-6 sm:p-8",
                activeTab !== "home" && "hidden md:block"
              )}
            >
              {todayEntry && (
                <div 
                  className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full opacity-[0.06] blur-[60px] pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${moodColors[todayEntry.mood]?.primary || "var(--primary)"} 0%, transparent 70%)` }}
                />
              )}

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 w-full">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-bold font-primary tracking-tight text-foreground/90">
                      My Day
                    </h2>
                    {todayEntry && (
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1"
                        style={{
                          backgroundColor: `${moodColors[todayEntry.mood]?.primary || "var(--primary)"}18`,
                          borderColor: `${moodColors[todayEntry.mood]?.primary || "var(--primary)"}35`,
                          color: moodColors[todayEntry.mood]?.primary || "var(--primary)",
                        }}
                      >
                        {(() => {
                          const Icon = moodIcons[todayEntry.mood] || Smile;
                          return <Icon className="w-3 h-3" />;
                        })()}
                        Feeling {todayEntry.mood}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl line-clamp-3">
                    {todayEntry 
                      ? todayEntry.body.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")
                      : "You haven't recorded today's thoughts yet. Taking a few minutes to write can help clear your mind and track your mood."
                    }
                  </p>

                  <div className="pt-1.5">
                    {todayEntry ? (
                      <Link href={`/journal/${todayEntry.id}`}>
                        <Button variant="link" className="p-0 h-auto text-primary font-semibold hover:text-[#E8855A] hover:no-underline gap-1.5 cursor-pointer">
                          <BookOpen className="w-4 h-4" />
                          <span>Read entry</span>
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/journal/new">
                        <Button
                          size="sm"
                          className="rounded-xl bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer font-semibold shadow-md"
                        >
                          <PenLine className="w-4 h-4 mr-2" />
                          Write Today&apos;s Entry
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Polaroid Thumbnail on the right */}
                {todayEntry && todayEntry.imageUrl && (
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-[#FAF8F5] p-1 pb-3.5 shadow-md border border-black/5 rotate-2 shrink-0 select-none pointer-events-none rounded-xs"
                    style={{
                      boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
                    }}
                  >
                    <div className="w-full h-full relative overflow-hidden bg-muted border border-black/5">
                      <img
                        src={todayEntry.imageUrl}
                        alt="Today's memory"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })()}

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={cn(
            "space-y-4",
            activeTab !== "entries" && "hidden md:block"
          )}
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
                className="w-full h-12 pl-11 pr-4 rounded-2xl bg-card/65 dark:bg-card/30 border border-border/40 focus:border-primary focus:ring-4 focus:ring-primary/8 outline-none transition-all placeholder:text-muted-foreground/60 text-sm"
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
                "h-12 w-12 rounded-2xl border-border/40 transition-all duration-300 cursor-pointer active:scale-95",
                showFilters && "bg-primary/10 border-primary text-primary"
              )}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4.5 h-4.5" />
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
                <div className="flex flex-wrap gap-2.5 py-2.5">
                  {moodFilters.map((filter) => {
                    const isSelected = moodFilter === filter.type;
                    const colors = filter.type !== "all" ? moodColors[filter.type] : null;
                    
                    return (
                      <motion.button
                        key={filter.type}
                        onClick={() => setMoodFilter(filter.type)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className={cn(
                          "relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide border cursor-pointer select-none transition-all duration-300 flex items-center gap-1.5",
                          isSelected
                            ? "shadow-sm"
                            : "bg-card/50 hover:bg-card/80 border-border/30 text-muted-foreground hover:text-foreground"
                        )}
                        style={isSelected ? {
                          backgroundColor: colors ? `${colors.primary}18` : "var(--primary)",
                          borderColor: colors ? colors.primary : "var(--primary)",
                          color: colors ? colors.primary : "var(--primary-foreground)",
                          boxShadow: colors ? `0 0 12px ${colors.primary}18` : undefined,
                        } : undefined}
                      >
                        {filter.type !== "all" && (() => {
                          const Icon = moodIcons[filter.type as MoodType];
                          return <Icon className="w-3.5 h-3.5" />;
                        })()}
                        {filter.label}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Spacious, Clean Journal Grid */}
        {filteredEntries.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8",
              activeTab !== "entries" && "hidden md:grid"
            )}
          >
            {filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + (index % 6) * 0.05 }}
              >
                <JournalCard
                  entry={entry}
                  variant="default"
                />
              </motion.div>
            ))}
          </motion.div>
        ) : entries.length === 0 ? (
          /* Empty State - No entries at all */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "relative overflow-hidden rounded-[32px] border border-border/30 bg-card/40 dark:bg-card/20 backdrop-blur-sm p-12 text-center max-w-xl mx-auto mt-6",
              activeTab !== "entries" && "hidden md:block"
            )}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-primary mb-2 text-foreground/90">
              Start Your Journaling Journey
            </h3>
            <p className="text-sm text-muted-foreground/80 max-w-sm mx-auto mb-8 leading-relaxed">
              Capture your thoughts, track your emotions, and discover insights about yourself 
              through the power of reflective writing.
            </p>
            <Link href="/journal/new">
              <Button size="lg" className="gap-2 rounded-xl cursor-pointer">
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
            className={cn(
              "rounded-[24px] border border-border/30 bg-card/30 dark:bg-card/15 p-10 text-center max-w-md mx-auto",
              activeTab !== "entries" && "hidden md:block"
            )}
          >
            <Search className="w-10 h-10 mx-auto mb-4 text-muted-foreground/45" />
            <h3 className="text-base font-bold font-primary mb-2 text-foreground/90">No Matches Found</h3>
            <p className="text-sm text-muted-foreground/80 mb-5">
              Try adjusting your search query or mood filters
            </p>
            <Button
              variant="outline"
              className="rounded-xl cursor-pointer"
              onClick={() => {
                setSearchQuery("");
                setMoodFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}

/* 
 * =============================================================================
 * HEADER ILLUSTRATION COMPONENT
 * =============================================================================
 */
function HeaderIllustration() {
  const [hour, setHour] = useState(12);

  useEffect(() => {
    setHour(new Date().getHours());
  }, []);

  const isMorning = hour >= 5 && hour < 12;
  const isAfternoon = hour >= 12 && hour < 17;
  const isEvening = hour >= 17 && hour < 22;
  const isNight = hour >= 22 || hour < 5;

  let cx = 55;
  let cy = 28;
  if (isMorning) {
    cx = 30;
    cy = 38;
  } else if (isAfternoon) {
    cx = 55;
    cy = 22;
  } else if (isEvening) {
    cx = 80;
    cy = 38;
  } else if (isNight) {
    cx = 55;
    cy = 22;
  }

  return (
    <div className="relative flex items-center justify-center p-3 bg-card/45 dark:bg-card/20 border border-border/30 rounded-[22px] shadow-sm backdrop-blur-md group hover:border-primary/20 transition-all duration-300 shrink-0 select-none pointer-events-none">
      <div className={cn(
        "absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-2xl opacity-15 pointer-events-none transition-all duration-500",
        isMorning && "bg-amber-400",
        isAfternoon && "bg-sky-400",
        isEvening && "bg-orange-500",
        isNight && "bg-indigo-400"
      )} />

      <svg width="110" height="70" viewBox="0 0 110 70" className="overflow-visible select-none pointer-events-none z-10">
        <defs>
          <radialGradient id="bannerSun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD066" />
            <stop offset="70%" stopColor="#E07A5F" />
            <stop offset="100%" stopColor="#C26B55" />
          </radialGradient>
          <linearGradient id="bannerMoon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8F4F0" />
            <stop offset="60%" stopColor="#D2C3B4" />
            <stop offset="100%" stopColor="#8FAFC9" />
          </linearGradient>
          <filter id="bannerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
        </defs>

        {/* Orbit Arc */}
        <path
          d="M 15,58 Q 55,18 95,58"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="3,3"
          className="text-muted-foreground/25"
        />

        {/* Sun/Moon Body & Glow */}
        {!isNight ? (
          <>
            <circle
              cx={cx}
              cy={cy}
              r="12"
              fill="url(#bannerSun)"
              opacity="0.3"
              filter="url(#bannerGlow)"
            />
            <circle cx={cx} cy={cy} r="7.5" fill="url(#bannerSun)" />
          </>
        ) : (
          <>
            <g filter="url(#bannerGlow)" opacity="0.35">
              <path
                d={`M ${cx - 5},${cy - 5} A 9,9 0 1,0 ${cx + 5},${cy + 5} A 6.5,6.5 0 1,1 ${cx - 5},${cy - 5} Z`}
                fill="url(#bannerMoon)"
              />
            </g>
            <path
              d={`M ${cx - 5},${cy - 5} A 9,9 0 1,0 ${cx + 5},${cy + 5} A 6.5,6.5 0 1,1 ${cx - 5},${cy - 5} Z`}
              fill="url(#bannerMoon)"
            />
            <circle cx="20" cy="20" r="0.8" fill="#F8F4F0" opacity="0.6" />
            <circle cx="88" cy="25" r="0.6" fill="#F8F4F0" opacity="0.8" />
            <circle cx="38" cy="35" r="0.8" fill="#F8F4F0" opacity="0.5" />
          </>
        )}

        {/* Cloud Illustrations */}
        <path
          d="M 18,55 A 5,5 0 0,1 23,50 H 42 A 5,5 0 0,1 47,55 A 5,5 0 0,1 42,60 H 23 A 5,5 0 0,1 18,55 Z"
          fill="currentColor"
          className="text-card/85 dark:text-muted/15"
        />
        <path
          d="M 34,58 A 6.5,6.5 0 0,1 40.5,51.5 H 74 A 6.5,6.5 0 0,1 80.5,58 A 6.5,6.5 0 0,1 74,64.5 H 40.5 A 6.5,6.5 0 0,1 34,58 Z"
          fill="currentColor"
          className="text-muted/80 dark:text-muted/30"
        />
      </svg>
    </div>
  );
}
