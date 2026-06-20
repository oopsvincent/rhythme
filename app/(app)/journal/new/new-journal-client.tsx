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

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
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
  HardDrive,
  CloudOff,
  Shield,
  Smile,
  Sun,
  Minus,
  Frown,
  AlertTriangle,
  Star,
  AlertCircle,
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

// Mood options using requested Lucide icons (no emojis)
const moodOptions = [
  { type: 'happy' as MoodTags, icon: Smile, label: 'Happy', color: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.05)]' },
  { type: 'calm' as MoodTags, icon: Sun, label: 'Calm', color: 'border-blue-400 bg-blue-400/5 text-blue-500 shadow-[0_0_10px_rgba(96,165,250,0.05)]' },
  { type: 'neutral' as MoodTags, icon: Minus, label: 'Neutral', color: 'border-gray-400 bg-gray-400/5 text-gray-500 shadow-[0_0_10px_rgba(156,163,175,0.05)]' },
  { type: 'sad' as MoodTags, icon: Frown, label: 'Sad', color: 'border-indigo-400 bg-indigo-400/5 text-indigo-500 shadow-[0_0_10px_rgba(129,140,248,0.05)]' },
  { type: 'frustrated' as MoodTags, icon: AlertTriangle, label: 'Frustrated', color: 'border-red-400 bg-red-400/5 text-red-500 shadow-[0_0_10px_rgba(248,113,113,0.05)]' },
  { type: 'excited' as MoodTags, icon: Star, label: 'Excited', color: 'border-pink-400 bg-pink-400/5 text-pink-500 shadow-[0_0_10px_rgba(244,114,182,0.05)]' },
  { type: 'anxious' as MoodTags, icon: AlertCircle, label: 'Anxious', color: 'border-orange-400 bg-orange-400/5 text-orange-500 shadow-[0_0_10px_rgba(251,146,60,0.05)]' },
];

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
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPassphraseSetup, setShowPassphraseSetup] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showPremiumGate, setShowPremiumGate] = useState(false);

  // Polaroid image state
  const [imageState, setImageState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  // Reset image state when URL changes
  useEffect(() => {
    if (imageUrl) {
      setImageState('loading');
    } else {
      setImageState('idle');
    }
  }, [imageUrl]);

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
    const draft = { title, body, mood, imageUrl, savedAt: new Date().toISOString() };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    setLastSaved(new Date());
  }, [title, body, mood, imageUrl]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (draft) {
      try {
        const { title: savedTitle, body: savedBody, mood: savedMood, imageUrl: savedImageUrl } = JSON.parse(draft);
        if (savedTitle) setTitle(savedTitle);
        if (savedBody) setBody(savedBody);
        if (savedMood) setMood(savedMood);
        if (savedImageUrl) setImageUrl(savedImageUrl);
      } catch {
        // Ignore malformed draft
      }
    }
  }, []);

  // Auto-save to localStorage every 800ms after changes
  useEffect(() => {
    const timeout = setTimeout(saveDraft, 800);
    return () => clearTimeout(timeout);
  }, [title, body, mood, imageUrl, saveDraft]);

  const handleSave = async () => {
    if (!canSave || !mood) return;

    // If user doesn't have encryption set up, prompt them
    if (needsEncryptionSetup) {
      setShowPassphraseSetup(true);
      return;
    }

    // If user has encryption token but no key in memory, they need to unlock first
    if (!encryptionKey && encryptionToken) {
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

      // TODO: Migrate schema columns `mood` and `image_url` directly when they are added to Supabase.
      // Encrypt content if we have a key
      if (encryptionKey && isCryptoAvailable()) {
        const payload = JSON.stringify({ title: title.trim(), body, imageUrl: imageUrl.trim() || undefined });
        const { encrypted, iv } = await encryptJournal(encryptionKey, payload);
        journalInput = {
          title: "[Encrypted]", // Placeholder title
          content: encrypted, // Encrypted JSON payload contains body + imageUrl
          iv: iv,
          mood_tags: mood,
          created_at: now,
          updated_at: now,
        };
      } else {
        // Plaintext JSON string contains body and imageUrl
        const payload = JSON.stringify({
          title: title.trim(),
          body: body,
          imageUrl: imageUrl.trim() || undefined,
        });
        journalInput = {
          title: title.trim(),
          content: payload,
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
    if (!lastSaved) return "just now";
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
        <div 
          className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06] dark:opacity-[0.03] blur-[130px] transition-all duration-1000"
          style={{ background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)` }}
        />
        <div 
          className="absolute bottom-1/4 left-1/10 w-[500px] h-[500px] rounded-full opacity-[0.05] dark:opacity-[0.02] blur-[110px] transition-all duration-1000"
          style={{ background: `radial-gradient(circle, ${colors.secondary || colors.primary} 0%, transparent 70%)` }}
        />
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <JournalPassphraseSetup
        open={showPassphraseSetup}
        onOpenChange={setShowPassphraseSetup}
        userId={userId}
        onSuccess={() => {
          setShowPassphraseSetup(false);
        }}
      />

      {encryptionToken && (
        <JournalUnlockModal
          open={showUnlockModal}
          onOpenChange={setShowUnlockModal}
          userId={userId}
          validationToken={encryptionToken}
        />
      )}

      <PremiumGateModal
        open={showPremiumGate}
        onOpenChange={setShowPremiumGate}
        reason="journal"
      />
      
      <SiteHeader className="bg-transparent relative z-20" />
      
      <main className="flex-1 flex flex-col px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-4xl mx-auto w-full relative z-10 space-y-6 pb-20">
        
        {/* Navigation Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/journal">
            <Button variant="ghost" size="sm" className="gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </Link>

          {/* terracotta save button matching style */}
          <Button
            onClick={handleSave}
            disabled={!canSave || isSaving}
            size="sm"
            className={cn(
              "gap-2 transition-all duration-300 rounded-xl cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
              canSave && !isSaving && "shadow-lg hover:shadow-primary/25 hover:scale-[1.02]",
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
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            "sm:rounded-[28px] sm:border sm:border-border/30 sm:bg-card/75 sm:dark:bg-card/35 sm:backdrop-blur-md sm:shadow-sm sm:p-8 sm:pl-20 sm:py-10 md:p-10 md:pl-24 md:py-12",
            "rounded-none border-0 bg-transparent backdrop-blur-none shadow-none p-0 pl-0 py-4"
          )}
        >
          {/* Vertical notebook line */}
          <div className="hidden sm:block absolute top-0 bottom-0 left-[4.25rem] md:left-[5.25rem] w-[1px] bg-red-400/20 dark:bg-red-500/15 pointer-events-none" />

          {/* Left margin info (Mood Aura indicator) */}
          <div className="hidden sm:flex absolute left-6 md:left-8 top-10 md:top-12 z-10 flex-col items-center gap-4">
            <EmotionalAura
              mood={mood || "neutral"}
              intensity={3}
              size="sm"
              className="w-10 h-10 shadow-sm border border-border/10"
            >
              {(() => {
                const opt = moodOptions.find(o => o.type === (mood || "neutral"));
                const MoodIcon = opt ? opt.icon : Smile;
                return <MoodIcon className="w-5 h-5" style={{ color: colors.primary }} />;
              })()}
            </EmotionalAura>
          </div>

          {/* Right margin info (Content sheet) */}
          <div className="space-y-6">
            {/* Meta header (Formatted weekday, month, day, year in uppercase) */}
            <div className="text-xs text-muted-foreground/75 font-semibold uppercase tracking-widest">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
              }).toUpperCase()}
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
                  <HardDrive className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>Draft saved locally • {formatLastSaved()}</span>
                </div>
                <span className="opacity-75 hidden sm:inline text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">Sync on save</span>
              </div>

              {/* Rebuilt Mood Selector: 2-Row Grid of large buttons */}
              <div className="p-3 sm:p-4 rounded-2xl bg-muted/30 border border-border/10 space-y-3">
                <label className="text-sm font-semibold tracking-wide text-muted-foreground">
                  How are you feeling?
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                  {moodOptions.map((option) => {
                    const isSelected = mood === option.type;
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.type}
                        type="button"
                        onClick={() => setMood(option.type)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all duration-300 cursor-pointer select-none",
                          isSelected
                            ? "border-yellow-400 bg-yellow-400/10 text-yellow-500 shadow-[0_0_12px_rgba(250,204,21,0.35)] dark:shadow-[0_0_15px_rgba(250,204,21,0.25)] scale-[1.02]"
                            : "bg-background/40 border-border/10 text-muted-foreground hover:bg-background/60 hover:border-border/20 hover:text-foreground"
                        )}
                      >
                        <Icon className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{option.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Pinned Polaroid Image Section */}
              <div className="p-3 sm:p-4 rounded-2xl bg-muted/30 border border-border/10 space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pinned Polaroid Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                    className="flex-1 px-3 py-2 text-sm bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-foreground/90 placeholder:text-muted-foreground/45"
                  />
                  {imageUrl && (
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={() => setImageUrl("")}
                      className="px-2 text-xs hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-lg"
                    >
                      Clear
                    </Button>
                  )}
                </div>

                {/* Live Preview with Polaroid/tape style + Badge above it */}
                {imageUrl && (
                  <div className="pt-3 flex flex-col items-center">
                    
                    {/* "Feeling happy" badge above the image area */}
                    {mood && (
                      <div className="mb-4">
                        <span
                          className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border flex items-center gap-1.5"
                          style={{
                            backgroundColor: `${colors.primary}18`,
                            borderColor: `${colors.primary}35`,
                            color: colors.primary,
                            boxShadow: `0 2px 10px ${colors.primary}10`,
                          }}
                        >
                          {(() => {
                            const opt = moodOptions.find(o => o.type === mood);
                            const MoodIcon = opt ? opt.icon : Smile;
                            return <MoodIcon className="w-3.5 h-3.5" />;
                          })()}
                          Feeling {mood}
                        </span>
                      </div>
                    )}

                    <div className="relative bg-[#fcfbf9] dark:bg-[#1a1917] p-2.5 pb-6 rounded shadow-md border border-border/20 w-44 rotate-[-1.5deg]">
                      {/* Washi Tape Preview */}
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-primary/20 backdrop-blur-[1px] rotate-[1deg] opacity-75 z-10" />
                      
                      <div className="relative aspect-square overflow-hidden bg-muted rounded-sm border border-border/10 flex items-center justify-center">
                        {/* Loading State Skeleton */}
                        {imageState === 'loading' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                          </div>
                        )}

                        {/* Error Fallback State */}
                        {imageState === 'error' && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/5 text-destructive p-3 text-center">
                            <CloudOff className="w-5 h-5 mb-1" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Failed to load image</span>
                          </div>
                        )}

                        {/* The Image Preview */}
                        <img
                          src={imageUrl}
                          alt="Live preview"
                          className={cn(
                            "object-cover w-full h-full transition-opacity duration-300",
                            imageState === 'loaded' ? "opacity-100" : "opacity-0 absolute"
                          )}
                          onLoad={() => setImageState('loaded')}
                          onError={() => setImageState('error')}
                        />
                      </div>
                      <div className="mt-2.5 text-center font-primary text-[10px] text-muted-foreground/60 tracking-wider">
                        {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ruled text editor */}
              <div 
                className="relative p-1 sm:p-2 rounded-xl journal-editor-lined"
              >
                <style jsx global>{`
                  .journal-editor-lined textarea {
                    background-image: linear-gradient(var(--border) 1px, transparent 1px) !important;
                    background-size: 100% 1.625rem !important;
                    background-position: 0 1.45rem !important;
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
