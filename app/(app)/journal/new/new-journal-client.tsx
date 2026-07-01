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
import { motion, AnimatePresence } from "framer-motion";
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
  Camera,
  Sparkles,
} from "lucide-react";
import { createJournal } from "@/app/actions/journals";
import { canCreateJournal } from "@/app/actions/usage-limits";
import { JournalInput, MoodTags } from "@/types/database";
import { encryptJournal, isCryptoAvailable } from "@/lib/crypto";
import { useJournalEncryptionStore } from "@/store/useJournalEncryptionStore";
import { PremiumGateModal } from "@/components/premium-gate-modal";
import { rhythmCopy } from "@/lib/copy";

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
  { type: 'happy' as MoodTags, emoji: '😊', icon: Smile, label: 'Happy', color: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.05)]' },
  { type: 'calm' as MoodTags, emoji: '😌', icon: Sun, label: 'Calm', color: 'border-blue-400 bg-blue-400/5 text-blue-500 shadow-[0_0_10px_rgba(96,165,250,0.05)]' },
  { type: 'neutral' as MoodTags, emoji: '😐', icon: Minus, label: 'Neutral', color: 'border-gray-400 bg-gray-400/5 text-gray-500 shadow-[0_0_10px_rgba(156,163,175,0.05)]' },
  { type: 'sad' as MoodTags, emoji: '😢', icon: Frown, label: 'Sad', color: 'border-indigo-400 bg-indigo-400/5 text-indigo-500 shadow-[0_0_10px_rgba(129,140,248,0.05)]' },
  { type: 'frustrated' as MoodTags, emoji: '😤', icon: AlertTriangle, label: 'Frustrated', color: 'border-red-400 bg-red-400/5 text-red-500 shadow-[0_0_10px_rgba(248,113,113,0.05)]' },
  { type: 'excited' as MoodTags, emoji: '✨', icon: Star, label: 'Excited', color: 'border-pink-400 bg-pink-400/5 text-pink-500 shadow-[0_0_10px_rgba(244,114,182,0.05)]' },
  { type: 'anxious' as MoodTags, emoji: '😰', icon: AlertCircle, label: 'Anxious', color: 'border-orange-400 bg-orange-400/5 text-orange-500 shadow-[0_0_10px_rgba(251,146,60,0.05)]' },
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
  const [showImageInput, setShowImageInput] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
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
        if (savedImageUrl) {
          setImageUrl(savedImageUrl);
          setShowImageInput(true);
        }
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
            // Desktop/Tablet styles
            "sm:rounded-2xl sm:border sm:border-border/20 sm:bg-card/30 sm:shadow-sm sm:p-8 sm:py-10 md:p-10 md:py-12",
            // Mobile styles (flattened/full-screen editor mode)
            "rounded-none border-0 bg-transparent backdrop-blur-none shadow-none p-0 py-2 flex-1 flex flex-col"
          )}
        >
          {/* Main info (Content sheet) */}
          <div className="space-y-4 flex-1 flex flex-col">
            
            {/* 1. Subtle, Inline Mood Selector at the very top */}
            <div className="flex flex-wrap items-center gap-3 select-none">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1.5 shrink-0">
                  How are you feeling?
                </span>
                <div className="flex items-center gap-1.5">
                  {moodOptions.map((option) => {
                    const isSelected = mood === option.type;
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.type}
                        type="button"
                        onClick={() => setMood(option.type)}
                        className={cn(
                          "w-10 h-10 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 border",
                          isSelected
                            ? "bg-primary/10 border-primary scale-110 shadow-sm text-foreground"
                            : "bg-muted/30 border-transparent hover:bg-muted/50 text-muted-foreground"
                        )}
                        title={option.label}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Feeling Badge */}
              <AnimatePresence>
                {mood && (() => {
                  const selectedOption = moodOptions.find(o => o.type === mood);
                  if (!selectedOption) return null;
                  return (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={cn(
                        "inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300",
                        selectedOption.color
                      )}
                    >
                      feeling {mood}
                    </motion.span>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* 2. Date Header */}
            <div className="text-[10px] sm:text-xs text-muted-foreground/75 font-semibold uppercase tracking-widest select-none">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
              }).toUpperCase()}
            </div>

            {/* 3. Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Entry"
              className="w-full text-xl sm:text-2xl md:text-3xl font-bold font-primary bg-transparent border-none outline-none focus:ring-0 placeholder:text-muted-foreground/30 text-foreground/90 leading-tight py-1"
            />

            {/* 4. Small Toolbar Below Title */}
            <div className="flex items-center gap-2 select-none py-1.5 border-t border-b border-border/10">
              {/* Subtle Encryption Warning if needed */}
              {needsEncryptionSetup && (
                <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider flex items-center gap-1 mr-1 select-none">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Setup Encryption</span>
                </span>
              )}

              <button
                type="button"
                onClick={() => setShowImageInput(prev => !prev)}
                className={cn(
                  "p-2 sm:p-1.5 rounded-xl border transition-all duration-200 cursor-pointer active:scale-95",
                  showImageInput ? "bg-[#E07A5F]/15 border-[#E07A5F]/30 text-[#E07A5F]" : "bg-muted/40 border-transparent text-muted-foreground hover:bg-muted/75"
                )}
                title="Add cover polaroid"
              >
                <Camera className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowPrompts(prev => !prev)}
                className={cn(
                  "p-2 sm:p-1.5 rounded-xl border transition-all duration-200 cursor-pointer active:scale-95",
                  showPrompts ? "bg-primary/15 border-primary/30 text-primary" : "bg-muted/40 border-transparent text-muted-foreground hover:bg-muted/75"
                )}
                title="Choose writing prompt"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>

            {/* 4. Optional Cover Polaroid Input & Live Preview */}
            <AnimatePresence>
              {showImageInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden space-y-3 pb-3 border-b border-border/10 animate-in fade-in"
                >
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                      className="flex-1 px-3 py-2 text-xs bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-foreground/90 placeholder:text-muted-foreground/45"
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
                  {imageUrl && (
                    <div className="flex justify-center pt-1">
                      <div className="relative bg-[#fcfbf9] dark:bg-[#1a1917] p-2 pb-5 rounded shadow-sm border border-border/20 w-36 rotate-[-1deg] select-none">
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-primary/20 backdrop-blur-[1px] rotate-[1deg] opacity-75 z-10" />
                        <div className="relative aspect-square overflow-hidden bg-muted rounded-sm border border-border/10 flex items-center justify-center">
                          {imageState === 'loading' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted">
                              <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                            </div>
                          )}
                          {imageState === 'error' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/5 text-destructive p-2 text-center">
                              <CloudOff className="w-4 h-4 mb-0.5" />
                              <span className="text-[8px] font-bold uppercase tracking-wider">Error</span>
                            </div>
                          )}
                          <img
                            src={imageUrl}
                            alt="Preview"
                            className={cn(
                              "object-cover w-full h-full transition-opacity duration-300",
                              imageState === 'loaded' ? "opacity-100" : "opacity-0 absolute"
                            )}
                            onLoad={() => setImageState('loaded')}
                            onError={() => setImageState('error')}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 5. Optional Reflective Prompts Block */}
            <AnimatePresence>
              {showPrompts && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden space-y-2 pb-3 border-b border-border/10"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                    Need a spark? Choose a prompt:
                  </p>
                  <div className="flex flex-col gap-2">
                    {rhythmCopy.logging.reflectivePrompts.slice(0, 3).map((promptText, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!title.trim()) setTitle(promptText);
                          setBody(prev => prev ? prev + "\n\n" + promptText + "\n" : promptText + "\n");
                        }}
                        className="text-[11px] text-left px-3.5 py-2 rounded-xl bg-background hover:bg-muted border border-border/20 text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
                      >
                        {promptText}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 6. Ruled Text Editor (flex-1 so it takes all vertical space) */}
            <div 
              className="relative p-1 sm:p-2 rounded-xl journal-editor-lined flex-1 flex flex-col"
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
                className="text-base md:text-lg text-foreground/95 flex-1 flex flex-col"
              />
            </div>

          </div>
        </motion.article>

        {/* 7. Floating/Fixed Bottom Bar for Stats & Auto-save */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-t border-border/15 py-3 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>Draft saved locally • {formatLastSaved()}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>{wordCount} words</span>
              <span>·</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
