/**
 * =============================================================================
 * QUICK JOURNAL CARD COMPONENT (Dashboard Widget)
 * =============================================================================
 * 
 * SSR Pattern: Receives journals as props from dashboard page.tsx.
 * Uses createJournal server action for quick entries.
 * 
 * LOCAL-FIRST MVP INTEGRATION:
 * - Search for "LOCAL_OPS:" comments for sections to uncomment/modify
 * - Will need to: check for today's entry in both server + local data
 * - Save quick entries to local storage and queue for sync
 * - Show sync status for pending entries
 * 
 * See @/lib/journal-storage.ts for local storage utilities.
 * =============================================================================
 */

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
import { Journal, MoodTags } from "@/types/database";
import { createJournal } from "@/app/actions/journals";
import { canCreateJournal } from "@/app/actions/usage-limits";
import { getLocalDateString, getUserTimezone } from "@/lib/timezone";
import { PremiumGateModal } from "@/components/premium-gate-modal";
import { useMoodLogs } from "@/hooks/use-mood-logs";
import { useJournalEncryptionStore } from "@/store/useJournalEncryptionStore";
import { decryptJournal } from "@/lib/crypto";
import { rhythmCopy } from "@/lib/copy";

const QUICK_JOURNAL_KEY = "rhythme_quick_journal_draft";

function getTodayKey(): string {
  return getLocalDateString();
}

// Normalized entry type for component use
interface NormalizedEntry {
  id: string;
  title: string;
  body: string;
  mood: MoodTags;
  createdAt: string;
}

// Convert Journal from DB to normalized entry
function normalizeJournal(journal: Journal): NormalizedEntry {
  return {
    id: journal.journal_id,
    title: journal.title,
    // If iv is present, content is encrypted - show placeholder
    body: journal.iv ? "[Encrypted]" : journal.content,
    mood: journal.mood_tags?.mood || "neutral",
    createdAt: journal.created_at,
  };
}

interface QuickJournalCardProps {
  journals: Journal[];
}

export function QuickJournalCard({ journals }: QuickJournalCardProps) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showPremiumGate, setShowPremiumGate] = useState(false);

  // Normalize journals and find today's entry
  const entries = journals.map(normalizeJournal);
  const today = getTodayKey();
  const todayEntry = entries.find(e => e.createdAt.startsWith(today)) || null;

  const { data: moodLogs = [] } = useMoodLogs(14);
  const { key: encryptionKey } = useJournalEncryptionStore();
  const [lastJournalDecrypted, setLastJournalDecrypted] = useState<string | null>(null);

  // Decrypt last journal
  useEffect(() => {
    async function decryptLast() {
      if (!encryptionKey || journals.length === 0) return;
      const lastJournal = journals[0];
      if (lastJournal && lastJournal.iv) {
        try {
          const decrypted = await decryptJournal(encryptionKey, lastJournal.content, lastJournal.iv);
          let bodyText: string;
          try {
            const parsed = JSON.parse(decrypted);
            bodyText = parsed.body || decrypted;
          } catch {
            bodyText = decrypted;
          }
          setLastJournalDecrypted(bodyText);
        } catch (e) {
          console.error("Failed to decrypt last journal in quick card:", e);
        }
      }
    }
    decryptLast();
  }, [encryptionKey, journals]);

  // Set prompt based on today's mood
  useEffect(() => {
    const todayLog = moodLogs.find(m => m.logged_at === today);
    const score = todayLog ? Number(todayLog.mood_score) : null;

    const prompts = rhythmCopy.logging.reflectivePrompts;
    let selectedPrompt = prompts[0]; // fallback

    if (score !== null) {
      if (score >= 4) {
        const highPrompts = [prompts[0], prompts[2], prompts[6]];
        selectedPrompt = highPrompts[Math.floor(Math.random() * highPrompts.length)];
      } else if (score <= 2) {
        const lowPrompts = [prompts[1], prompts[4], prompts[5]];
        selectedPrompt = lowPrompts[Math.floor(Math.random() * lowPrompts.length)];
      } else {
        const neutralPrompts = [prompts[3], prompts[6]];
        selectedPrompt = neutralPrompts[Math.floor(Math.random() * neutralPrompts.length)];
      }
    }
    setPrompt(selectedPrompt);
  }, [moodLogs, today]);

  // Check for existing draft
  useEffect(() => {
    const draft = localStorage.getItem(QUICK_JOURNAL_KEY);
    if (draft) {
      setText(draft);
    }
  }, []);

  // LOCAL_OPS: useEffect for loading journals from localStorage - removed for SSR
  // useEffect(() => {
  //   try {
  //     const entries = getStoredJournals();
  //     const today = getTodayKey();
  //     const existing = entries.find(e => 
  //       e.createdAt.startsWith(today)
  //     );
  //     if (existing) {
  //       setTodayEntry(existing);
  //     }
  //   } catch (e) {
  //     console.error("Failed to load journals:", e);
  //   }
  //   setIsLoading(false);
  // }, []);

  // Save draft as user types
  useEffect(() => {
    if (text) {
      localStorage.setItem(QUICK_JOURNAL_KEY, text);
    } else {
      localStorage.removeItem(QUICK_JOURNAL_KEY);
    }
  }, [text]);

  const handleSave = async () => {
    if (!text.trim()) return;
    
    setIsSaving(true);

    // Check usage limit
    const { allowed } = await canCreateJournal();
    if (!allowed) {
      setIsSaving(false);
      setShowPremiumGate(true);
      return;
    }

    const result = await createJournal({
      title: prompt,
      content: text,
      mood_tags: "neutral",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      timezone: getUserTimezone(),
      local_date: getLocalDateString(),
    });

    if (result.error) {
      console.error("Failed to create journal:", result.error);
      setIsSaving(false);
      return;
    }

    // LOCAL_OPS: Add to localStorage - commented for SSR
    // const newEntry: JournalEntry = {
    //   id: `journal_${Date.now()}`,
    //   title: prompt,
    //   body: text,
    //   mood: "neutral",
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // };
    // addJournalEntry(newEntry);
    
    // Clear draft
    localStorage.removeItem(QUICK_JOURNAL_KEY);
    
    // Navigate to journal
    router.push("/journal");
  };

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
            onClick={() => router.push("/journal/new")}
            className="text-xs text-primary font-medium hover:underline"
          >
            New entry
          </button>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {todayEntry.body}
        </p>
        <button
          onClick={() => router.push(`/journal/${todayEntry.id}`)}
          className="text-xs text-primary hover:underline"
        >
          Continue reading →
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <PremiumGateModal
        open={showPremiumGate}
        onOpenChange={setShowPremiumGate}
        reason="journal"
      />
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
          onClick={() => router.push("/journal/new")}
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

      {/* Suggested memory link / helper text */}
      {!text.trim() && lastJournalDecrypted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2.5 text-[11px] text-muted-foreground leading-normal"
        >
          <span>From yesterday: </span>
          <button
            onClick={() => {
              setText(`Following up on yesterday: "${lastJournalDecrypted.slice(0, 40)}..." `);
            }}
            className="italic text-primary hover:underline text-left inline focus:outline-none cursor-pointer"
          >
            &ldquo;{lastJournalDecrypted.slice(0, 50)}...&rdquo;
          </button>
        </motion.div>
      )}

      {/* Encrypted indicator at bottom */}
      <p className="text-[10px] text-muted-foreground/50 mt-2 text-right">
        {rhythmCopy.logging.helperText}
      </p>
    </motion.div>
    </>
  );
}
