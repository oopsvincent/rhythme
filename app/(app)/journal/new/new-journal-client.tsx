/**
 * =============================================================================
 * NEW JOURNAL ENTRY CLIENT COMPONENT
 * =============================================================================
 * 
 * SSR Pattern: Receives user data as props from server component page.tsx.
 * Draft auto-saving to localStorage is kept for UX.
 * 
 * ENCRYPTION: All new journals are encrypted client-side before saving.
 * OAuth users without encryption setup will see passphrase setup modal.
 * =============================================================================
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { MoodSelector, MoodType, moodIcons } from "@/components/journal/mood-selector";
import { JournalEditor } from "@/components/journal/journal-editor";
import { EmotionalAura, moodColors } from "@/components/journal/emotional-aura";
import { JournalPassphraseSetup } from "@/components/journal/journal-passphrase-setup";
import { JournalUnlockModal } from "@/components/journal/journal-unlock-modal";
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
  CloudOff,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { createJournal } from "@/app/actions/journals";
import { canCreateJournal } from "@/app/actions/usage-limits";
import { JournalInput, MoodTags } from "@/types/database";
import { encryptJournal, isCryptoAvailable } from "@/lib/crypto";
import { useJournalEncryptionStore } from "@/store/useJournalEncryptionStore";
import { PremiumGateModal } from "@/components/premium-gate-modal";

// Local storage key
const DRAFT_STORAGE_KEY = "rhythme_journal_draft";

// Calculate word count from text
function calculateWordCount(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}

// Calculate reading time
function calculateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200));
}

interface NewJournalClientProps {
  userId: string;
  userEmail: string;
  encryptionToken: string | null;
}

export default function NewJournalClient({
  userId,
  userEmail,
  encryptionToken,
}: NewJournalClientProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<MoodTags | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPassphraseSetup, setShowPassphraseSetup] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showPremiumGate, setShowPremiumGate] = useState(false);

  const canSave = title.trim() !== "" && mood !== null;
  const wordCount = calculateWordCount(body);
  const readingTime = calculateReadingTime(wordCount);

  // Get mood colors for ambient effect
  const ambientColor = mood ? moodColors[mood] : null;

  // Get encryption key from store
  const { key: encryptionKey } = useJournalEncryptionStore();

  // Check if user needs to set up encryption (no key and no token)
  const needsEncryptionSetup = !encryptionKey && !encryptionToken;

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
        const { title: savedTitle, body: savedBody, mood: savedMood } = JSON.parse(draft);
        if (savedTitle) setTitle(savedTitle);
        if (savedBody) setBody(savedBody);
        if (savedMood) setMood(savedMood);
      } catch {
        // Ignore malformed draft
      }
    }
  }, []);

  // Auto-save to localStorage every 500ms after changes
  useEffect(() => {
    const timeout = setTimeout(saveDraft, 500);
    return () => clearTimeout(timeout);
  }, [title, body, mood, saveDraft]);

  const handleSave = async () => {
    if (!canSave || !mood) return;

    // If user doesn't have encryption set up, prompt them
    if (needsEncryptionSetup) {
      setShowPassphraseSetup(true);
      return;
    }

    // If user has encryption token but no key in memory, they need to unlock first
    if (!encryptionKey && encryptionToken) {
      // Show unlock modal instead of redirecting
      setShowUnlockModal(true);
      return;
    }

    setIsSaving(true);

    // Check usage limit before saving
    const { allowed } = await canCreateJournal();
    if (!allowed) {
      setIsSaving(false);
      setShowPremiumGate(true);
      return;
    }

    try {
      let journalInput: JournalInput;
      const now = new Date().toISOString();

      console.log("handleSave - encryptionKey available:", !!encryptionKey);
      console.log("handleSave - isCryptoAvailable:", isCryptoAvailable());

      // Encrypt content if we have a key
      if (encryptionKey && isCryptoAvailable()) {
        // Encrypt both title and body as JSON payload
        const payload = JSON.stringify({ title: title.trim(), body });
        const { encrypted, iv } = await encryptJournal(encryptionKey, payload);
        journalInput = {
          title: "[Encrypted]", // Placeholder title for display in lists
          content: encrypted, // Encrypted JSON payload goes in content
          iv: iv,
          mood_tags: mood,
          created_at: now,
          updated_at: now,
        };
        console.log("Encrypting journal (title+body) with IV:", iv.substring(0, 20) + "...");
      } else {
        // Fallback to plaintext (shouldn't happen normally with logged-in user)
        console.warn("No encryption key available, saving as plaintext");
        journalInput = {
          title: title.trim(),
          content: body,
          mood_tags: mood,
          created_at: now,
          updated_at: now,
        };
      }

      await createJournal(journalInput);

      // Clear draft
      localStorage.removeItem(DRAFT_STORAGE_KEY);

      setIsSaving(false);
      setIsSaved(true);

      setTimeout(() => {
        router.push("/journal");
      }, 500);
    } catch (err) {
      console.error("Failed to save journal:", err);
      setIsSaving(false);
    }
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

  const colors = mood ? moodColors[mood] : moodColors.neutral;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background relative overflow-y-auto overflow-x-hidden">
      {/* Background paper texture & glow system */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft floating mood radial gradients */}
        <div 
          className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06] dark:opacity-[0.03] blur-[130px] transition-all duration-1000"
          style={{ background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)` }}
        />
        <div 
          className="absolute bottom-1/4 left-1/10 w-[500px] h-[500px] rounded-full opacity-[0.05] dark:opacity-[0.02] blur-[110px] transition-all duration-1000"
          style={{ background: `radial-gradient(circle, ${colors.secondary || colors.primary} 0%, transparent 70%)` }}
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

      {/* Passphrase Setup Modal - for users without encryption */}
      <JournalPassphraseSetup
        open={showPassphraseSetup}
        onOpenChange={setShowPassphraseSetup}
        userId={userId}
        onSuccess={() => {
          // After setup, try saving again
          setShowPassphraseSetup(false);
          // Key is now in store, so handleSave will work
        }}
      />

      {/* Unlock Modal - for users with existing encryption */}
      {encryptionToken && (
        <JournalUnlockModal
          open={showUnlockModal}
          onOpenChange={setShowUnlockModal}
          userId={userId}
          validationToken={encryptionToken}
        />
      )}

      {/* Premium Gate Modal */}
      <PremiumGateModal
        open={showPremiumGate}
        onOpenChange={setShowPremiumGate}
        reason="journal"
      />
      
      {/* Blended Header */}
      <SiteHeader className="bg-transparent relative z-20" />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-4xl mx-auto w-full relative z-10 space-y-6 pb-20">
        
        {/* Navigation Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/journal">
            <Button variant="ghost" size="sm" className="gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </Link>

          <Button
            onClick={handleSave}
            disabled={!canSave || isSaving}
            size="sm"
            className={cn(
              "gap-2 transition-all duration-300 rounded-xl cursor-pointer",
              canSave && !isSaving && "shadow-lg hover:shadow-primary/25",
            )}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSaved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>
              {isSaving ? "Saving..." : isSaved ? "Saved!" : "Save Entry"}
            </span>
          </Button>
        </div>

        {/* Notebook Page Sheet */}
        <motion.article
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[28px] border border-border/30 bg-card/75 dark:bg-card/35 backdrop-blur-md shadow-sm overflow-hidden p-6 sm:p-8 md:p-10 pl-16 sm:pl-20 md:pl-24 py-8 sm:py-10 md:py-12"
        >
          {/* Vertical notebook line */}
          <div className="absolute top-0 bottom-0 left-[3.25rem] sm:left-[4.25rem] md:left-[5.25rem] w-[1px] bg-red-400/20 dark:bg-red-500/15 pointer-events-none" />

          {/* Left margin info (Mood Aura indicator) */}
          <div className="absolute left-3.5 sm:left-6 md:left-8 top-8 sm:top-10 md:top-12 z-10 flex flex-col items-center gap-4">
            <EmotionalAura
              mood={mood || "neutral"}
              intensity={3}
              size="sm"
              className="w-10 h-10 shadow-sm border border-border/10"
            >
              {(() => {
                const MoodIcon = moodIcons[mood || "neutral"];
                return <MoodIcon className="w-5 h-5" style={{ color: colors.primary }} />;
              })()}
            </EmotionalAura>
          </div>

          {/* Right margin info (Content sheet) */}
          <div className="space-y-6">
            {/* Meta header */}
            <div className="text-xs text-muted-foreground/75 uppercase tracking-wide">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
              })}
            </div>

            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Entry"
              className="w-full text-2xl sm:text-3xl md:text-4xl font-bold font-primary bg-transparent border-none outline-none focus:ring-0 placeholder:text-muted-foreground/30 text-foreground/90 leading-tight"
            />

            <div className="border-t border-border/15 pt-6 space-y-6">
              
              {/* Encryption Status Notice */}
              {needsEncryptionSetup && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <Shield className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                      Setup Journal Encryption
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Create a passphrase to encrypt your journals. You&apos;ll be prompted when saving.
                    </p>
                  </div>
                </div>
              )}

              {/* Auto-save Notice */}
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-muted/40 border border-border/20 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-primary" />
                  <span>Draft saved locally {lastSaved && <span>· {formatLastSaved()}</span>}</span>
                </div>
                <span className="opacity-75 hidden sm:inline">Sync on save</span>
              </div>

              {/* Mood Selector inside card */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/10">
                <MoodSelector value={mood} onChange={setMood} />
              </div>

              {/* Ruled text editor */}
              <div 
                className="relative p-2 rounded-xl journal-editor-lined"
              >
                <style jsx global>{`
                  .journal-editor-lined textarea {
                    background-image: linear-gradient(var(--border) 1px, transparent 1px) !important;
                    background-size: 100% 1.625rem !important;
                    background-position: 0 0.25rem !important;
                    background-attachment: local !important;
                    line-height: 1.625rem !important;
                  }
                `}</style>
                <JournalEditor
                  value={body}
                  onChange={setBody}
                  placeholder="Start writing your thoughts..."
                  className="text-base md:text-lg text-foreground/95"
                />
              </div>

              {/* Stats Footer */}
              <div className="pt-4 border-t border-border/15">
                <div className="flex items-center justify-between text-xs text-muted-foreground/60">
                  <div className="flex items-center gap-4">
                    <span>{wordCount} words</span>
                    <span>·</span>
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.article>

        {/* Helper text */}
        {!canSave && (
          <p className="text-center text-xs text-muted-foreground/60">
            {!title.trim() && mood === null
              ? "Add a title and select your mood to save"
              : !title.trim()
                ? "Add a title to save"
                : "Select your mood to save"}
          </p>
        )}

      </main>
    </div>
  );
}
