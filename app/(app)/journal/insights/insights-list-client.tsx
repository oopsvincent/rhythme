/**
 * =============================================================================
 * JOURNAL INSIGHTS LIST CLIENT COMPONENT
 * =============================================================================
 * 
 * Decrypts entries client-side and lists them for the user to select
 * which entry they want to view AI Insights for.
 * =============================================================================
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Brain, 
  ArrowLeft, 
  Search, 
  X, 
  Sparkles, 
  Calendar,
  ChevronRight
} from "lucide-react";
import { Journal, MoodTags } from "@/types/database";
import { decryptJournal } from "@/lib/crypto";
import { useJournalEncryptionStore } from "@/store/useJournalEncryptionStore";
import { moodIcons } from "@/components/journal/mood-selector";
import { moodColors } from "@/components/journal/emotional-aura";
import { JournalUnlockModal } from "@/components/journal/journal-unlock-modal";
import { JournalPassphraseSetup } from "@/components/journal/journal-passphrase-setup";

interface NormalizedEntry {
  id: string;
  title: string;
  body: string;
  mood: MoodTags;
  createdAt: string;
  isEncrypted: boolean;
  decryptionFailed?: boolean;
}

function normalizeJournal(journal: Journal): NormalizedEntry {
  const isEncrypted = !!journal.iv;
  let body = isEncrypted ? "[Encrypted]" : journal.content;
  let title = journal.title;

  if (!isEncrypted && journal.content) {
    try {
      const parsed = JSON.parse(journal.content);
      if (parsed && typeof parsed === "object") {
        body = parsed.body || body;
        title = parsed.title || title;
      }
    } catch {
      // Not JSON
    }
  }

  return {
    id: journal.journal_id,
    title,
    body,
    mood: journal.mood_tags?.mood || "neutral",
    createdAt: journal.created_at,
    isEncrypted,
  };
}

interface InsightsListClientProps {
  journals: Journal[];
  userId: string;
  userEmail: string;
  encryptionToken: string | null;
}

export default function InsightsListClient({
  journals,
  userId,
  userEmail,
  encryptionToken,
}: InsightsListClientProps) {
  const { key: encryptionKey } = useJournalEncryptionStore();
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showPassphraseSetup, setShowPassphraseSetup] = useState(false);
  const [decryptedEntries, setDecryptedEntries] = useState<NormalizedEntry[]>([]);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const hasEncryptedJournals = useMemo(
    () => journals.some((j) => !!j.iv),
    [journals]
  );

  // Decrypt journals when key is available
  useEffect(() => {
    async function decryptJournals() {
      if (!hasEncryptedJournals) {
        setDecryptedEntries(journals.map(normalizeJournal));
        return;
      }

      if (!encryptionKey) {
        setDecryptedEntries(journals.map(normalizeJournal));
        if (encryptionToken) {
          setShowUnlockModal(true);
        } else {
          setShowPassphraseSetup(true);
        }
        return;
      }

      setIsDecrypting(true);
      const decrypted: NormalizedEntry[] = [];

      for (const journal of journals) {
        if (journal.iv) {
          try {
            const decryptedPayload = await decryptJournal(
              encryptionKey,
              journal.content,
              journal.iv
            );
            
            let title: string;
            let body: string;
            try {
              const parsed = JSON.parse(decryptedPayload);
              title = parsed.title || journal.title;
              body = parsed.body || decryptedPayload;
            } catch {
              title = journal.title;
              body = decryptedPayload;
            }
            
            decrypted.push({
              id: journal.journal_id,
              title,
              body,
              mood: journal.mood_tags?.mood || "neutral",
              createdAt: journal.created_at,
              isEncrypted: true,
            });
          } catch (err) {
            console.error(`Failed to decrypt journal ${journal.journal_id}:`, err);
            decrypted.push({
              ...normalizeJournal(journal),
              decryptionFailed: true,
              title: "[Decryption failed]",
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

  // Filter based on search query
  const filteredEntries = useMemo(() => {
    return decryptedEntries
      .filter((entry) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          entry.title.toLowerCase().includes(query) ||
          entry.body.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [decryptedEntries, searchQuery]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background relative overflow-y-auto overflow-x-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[120px]"
          style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
        />
        <div 
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.03] blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
        />
      </div>

      {encryptionToken && (
        <JournalUnlockModal
          open={showUnlockModal}
          onOpenChange={setShowUnlockModal}
          userId={userId}
          validationToken={encryptionToken}
        />
      )}

      <JournalPassphraseSetup
        open={showPassphraseSetup}
        onOpenChange={setShowPassphraseSetup}
        userId={userId}
        onSuccess={() => window.location.reload()}
      />

      <SiteHeader className="bg-transparent relative z-20" />

      <main className="flex-1 flex flex-col px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-4xl mx-auto w-full relative z-10 space-y-6 pb-20">
        
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4">
          <Link href="/journal">
            <Button variant="ghost" size="sm" className="gap-2 self-start cursor-pointer text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </Link>

          <div className="flex items-center gap-4 border-b border-border/15 pb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary shadow-[0_0_10px_rgba(224,122,95,0.2)]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-primary tracking-tight text-foreground/90">
                Journal Insights
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground/80 mt-0.5">
                Select an entry below to explore its emotional trends, patterns, and AI reflections.
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {journals.length > 0 && (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search journals by title or content..."
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-card/45 dark:bg-card/20 border border-border/40 focus:border-primary focus:ring-4 focus:ring-primary/8 outline-none transition-all placeholder:text-muted-foreground/60 text-sm"
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
        )}

        {/* List of Journals */}
        <div className="space-y-3">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => {
              const colors = moodColors[entry.mood] || moodColors.neutral;
              const MoodIcon = moodIcons[entry.mood];
              
              return (
                <Link key={entry.id} href={`/journal/${entry.id}/insights`}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    className="group flex items-center justify-between p-4 rounded-xl border border-border/30 bg-card/50 hover:bg-card/85 transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden"
                  >
                    {/* Hover Glow */}
                    <div 
                      className="absolute inset-y-0 left-0 w-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: colors.primary }}
                    />

                    <div className="flex items-center gap-4 flex-1 min-w-0 pl-1">
                      {/* Mood Indicator */}
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-border/10 shadow-inner"
                        style={{ backgroundColor: `${colors.primary}18` }}
                      >
                        <MoodIcon className="w-4 h-4" style={{ color: colors.primary }} />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h3 className="font-bold text-sm sm:text-base text-foreground/90 truncate group-hover:text-primary transition-colors">
                          {entry.title || "Untitled Entry"}
                        </h3>
                        <p className="text-[11px] text-muted-foreground/80 flex items-center gap-1.5 uppercase font-semibold tracking-wider">
                          <Calendar className="w-3 h-3" />
                          {new Date(entry.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0">
                      <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                        View AI Insights
                      </span>
                      <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </motion.div>
                </Link>
              );
            })
          ) : journals.length === 0 ? (
            /* Empty State */
            <div className="text-center p-12 border border-border/20 rounded-2xl bg-card/25 backdrop-blur-sm space-y-4 max-w-md mx-auto mt-8">
              <Sparkles className="w-10 h-10 text-muted-foreground/50 mx-auto" />
              <h3 className="text-base font-bold font-primary text-foreground/90">No Journal Entries</h3>
              <p className="text-xs text-muted-foreground/80">
                You must write a journal entry first before you can analyze it and view AI Insights.
              </p>
              <Link href="/journal/new">
                <Button size="sm" className="rounded-xl cursor-pointer">
                  Write Your First Entry
                </Button>
              </Link>
            </div>
          ) : (
            /* No Results Found */
            <div className="text-center p-8 text-muted-foreground">
              <p className="text-sm">No entries matched your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
