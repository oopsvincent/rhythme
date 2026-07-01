/**
 * =============================================================================
 * JOURNAL DETAIL CLIENT COMPONENT
 * =============================================================================
 * 
 * SSR Pattern: Receives single journal as prop from server component page.tsx.
 * Uses server actions (updateJournal, deleteJournal) for mutations.
 * 
 * LOCAL-FIRST MVP INTEGRATION:
 * - Search for "LOCAL_OPS:" comments for sections to uncomment/modify
 * - Will need to: sync local changes before displaying server data
 * - Handle offline edits by saving to local storage
 * - Queue update/delete operations for sync when online
 * 
 * See @/lib/journal-storage.ts for local storage utilities.
 * =============================================================================
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { MoodSelector, MoodType, moodIcons } from "@/components/journal/mood-selector";
import { JournalEditor } from "@/components/journal/journal-editor";
import { EmotionalAura, moodColors } from "@/components/journal/emotional-aura";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  Save,
  X,
  Loader2,
  Check,
  Trash2,
  MoreVertical,
  Clock,
  Calendar,
  Brain,
  Sparkles,
  HardDrive,
  CloudOff,
  Camera,
  Shield,
  Smile,
  Sun,
  Minus,
  Frown,
  AlertTriangle,
  Star,
  AlertCircle,
} from "lucide-react";
import { rhythmCopy } from "@/lib/copy";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Journal, MoodTags } from "@/types/database";
import { updateJournal, deleteJournal } from "@/app/actions/journals";
import { encryptJournal, decryptJournal, isCryptoAvailable } from "@/lib/crypto";
import { useJournalEncryptionStore } from "@/store/useJournalEncryptionStore";
import { JournalUnlockModal } from "@/components/journal/journal-unlock-modal";

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
  imageUrl?: string;
}

const moodOptions = [
  { type: 'happy' as MoodTags, emoji: '😊', icon: Smile, label: 'Happy', color: 'text-yellow-500' },
  { type: 'calm' as MoodTags, emoji: '😌', icon: Sun, label: 'Calm', color: 'text-blue-500' },
  { type: 'neutral' as MoodTags, emoji: '😐', icon: Minus, label: 'Neutral', color: 'text-gray-500' },
  { type: 'sad' as MoodTags, emoji: '😢', icon: Frown, label: 'Sad', color: 'text-indigo-500' },
  { type: 'frustrated' as MoodTags, emoji: '😤', icon: AlertTriangle, label: 'Frustrated', color: 'text-red-500' },
  { type: 'excited' as MoodTags, emoji: '✨', icon: Star, label: 'Excited', color: 'text-pink-500' },
  { type: 'anxious' as MoodTags, emoji: '😰', icon: AlertCircle, label: 'Anxious', color: 'text-orange-500' },
];

// Convert Journal from DB to normalized entry (placeholder for encrypted)
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

// Get mood icon component
function getMoodIcon(mood: MoodType) {
  return moodIcons[mood];
}

// Calculate reading time
function calculateReadingTime(htmlContent: string): number {
  const text = htmlContent.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Format time
function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

interface JournalDetailClientProps {
  journal: Journal;
  userId: string;
  encryptionToken: string | null;
}

export default function JournalDetailClient({ 
  journal: initialJournal, 
  userId,
  encryptionToken 
}: JournalDetailClientProps) {
  const router = useRouter();
  
  // Encryption state
  const { key: encryptionKey } = useJournalEncryptionStore();
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  
  // Journal state
  const [journal, setJournal] = useState<NormalizedEntry>(normalizeJournal(initialJournal));
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(journal.title);
  const [editBody, setEditBody] = useState(journal.body);
  const [editMood, setEditMood] = useState<MoodType | null>(journal.mood);
  const [editImageUrl, setEditImageUrl] = useState<string>("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Polaroid image state for editing
  const [editImageState, setEditImageState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  // Polaroid image state for viewing
  const [viewImageState, setViewImageState] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    if (editImageUrl) {
      setEditImageState('loading');
    } else {
      setEditImageState('idle');
    }
  }, [editImageUrl]);

  useEffect(() => {
    if (journal.imageUrl) {
      setViewImageState('loading');
    }
  }, [journal.imageUrl]);

  // Decrypt journal on load if encrypted (iv presence = encrypted)
  useEffect(() => {
    async function decryptContent() {
      if (!initialJournal.iv) {
        // Not encrypted, use as-is
        const normalized = normalizeJournal(initialJournal);
        setJournal(normalized);
        setEditBody(normalized.body);
        setEditImageUrl(normalized.imageUrl || "");
        setShowImageInput(!!normalized.imageUrl);
        return;
      }

      if (!encryptionKey) {
        // Need to unlock
        setShowUnlockModal(true);
        return;
      }

      setIsDecrypting(true);
      try {
        const decryptedPayload = await decryptJournal(
          encryptionKey,
          initialJournal.content, // content has encrypted base64
          initialJournal.iv
        );
        
        // Parse JSON payload which contains both title, body, and optional imageUrl
        let title: string;
        let body: string;
        let imageUrl: string | undefined = undefined;
        try {
          const parsed = JSON.parse(decryptedPayload);
          title = parsed.title || initialJournal.title;
          body = parsed.body || decryptedPayload;
          imageUrl = parsed.imageUrl;
        } catch {
          // Legacy format: only body was encrypted, title is plaintext
          title = initialJournal.title;
          body = decryptedPayload;
        }
        
        const decrypted: NormalizedEntry = {
          id: initialJournal.journal_id,
          title,
          body,
          mood: initialJournal.mood_tags?.mood || "neutral",
          createdAt: initialJournal.created_at,
          updatedAt: initialJournal.updated_at,
          isEncrypted: true,
          imageUrl,
        };
        
        setJournal(decrypted);
        setEditTitle(title);
        setEditBody(body);
        setEditImageUrl(imageUrl || "");
        setShowImageInput(!!imageUrl);
        setShowUnlockModal(false);
      } catch (err) {
        console.error("Failed to decrypt journal:", err);
        // Keep placeholder
      } finally {
        setIsDecrypting(false);
      }
    }

    decryptContent();
  }, [initialJournal, encryptionKey]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, progress));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSave = async () => {
    if (!journal || !editMood) return;

    setIsSaving(true);

    try {
      // TODO: Migrate to dedicated columns `mood`, `image_url`, and `sentiment_metadata` once they are added to the Supabase journals table schema.
      // Encrypt content if we have a key
      let updateInput: Parameters<typeof updateJournal>[1];
      
      if (encryptionKey && isCryptoAvailable()) {
        const payload = JSON.stringify({
          title: editTitle.trim(),
          body: editBody,
          imageUrl: editImageUrl.trim() || undefined,
        });
        const { encrypted, iv } = await encryptJournal(encryptionKey, payload);
        updateInput = {
          title: "[Encrypted]",
          content: encrypted, // Encrypted JSON payload goes in content
          iv: iv,
          mood_tags: editMood,
        };
      } else {
        // Fallback to plaintext JSON payload
        const payload = JSON.stringify({
          title: editTitle.trim(),
          body: editBody,
          imageUrl: editImageUrl.trim() || undefined,
        });
        updateInput = {
          title: editTitle.trim(),
          content: payload,
          mood_tags: editMood,
        };
      }

      const result = await updateJournal(journal.id, updateInput);

      if (result.error) {
        console.error("Failed to update journal:", result.error);
        setIsSaving(false);
        return;
      }

      // Update local state
      setJournal({
        ...journal,
        title: editTitle.trim(),
        body: editBody,
        mood: editMood,
        imageUrl: editImageUrl.trim() || undefined,
        updatedAt: new Date().toISOString(),
      });

      setIsSaving(false);
      setIsSaved(true);
      setIsEditing(false);

      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save journal:", err);
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!journal) return;

    setIsDeleting(true);

    // LOCAL_OPS: Delete from localStorage - commented for SSR
    // deleteJournalEntry(journal.id);

    const result = await deleteJournal(journal.id);

    if (result.error) {
      console.error("Failed to delete journal:", result.error);
      setIsDeleting(false);
      return;
    }

    router.push("/journal");
  };

  const handleCancelEdit = () => {
    if (journal) {
      setEditTitle(journal.title);
      setEditBody(journal.body);
      setEditMood(journal.mood);
      setEditImageUrl(journal.imageUrl || "");
    }
    setIsEditing(false);
  };

  const colors = moodColors[journal.mood];
  const readingTime = calculateReadingTime(journal.body);

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

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <motion.div
          className="h-full"
          style={{
            width: `${scrollProgress}%`,
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary || colors.primary})`,
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
      
      {/* Blended Header */}
      {!isEditing && <SiteHeader className="bg-transparent z-40" />}
      
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

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-2 rounded-xl cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </Button>
                <Link href={`/journal/${journal.id}/insights`}>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl cursor-pointer">
                    <Brain className="w-4 h-4 text-primary" />
                    AI Insights
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="cursor-pointer">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || !editTitle.trim() || !editMood}
                  className="gap-2 rounded-xl cursor-pointer"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isSaved ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? "Saving..." : isSaved ? "Saved!" : "Save"}
                </Button>
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg cursor-pointer">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-border/30">
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Entry
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
            isEditing 
              ? "rounded-none border-0 bg-transparent backdrop-blur-none shadow-none p-0 py-2 flex-1 flex flex-col"
              : "rounded-none border-0 bg-transparent backdrop-blur-none shadow-none p-0 py-4"
          )}
        >
          {/* Content Sheet */}
          <div className={cn("space-y-4", isEditing ? "flex-1 flex flex-col" : "")}>
            {isEditing ? (
              // Editing Layout (Direct-to-editor minimal style)
              <div className="space-y-4 flex-1 flex flex-col">
                {/* 1. Subtle, Inline Mood Selector at the very top */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none max-w-full scrollbar-none">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1.5 shrink-0">
                    How are you feeling?
                  </span>
                  <div className="flex items-center gap-1.5">
                    {moodOptions.map((option) => {
                      const isSelected = editMood === option.type;
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.type}
                          type="button"
                          onClick={() => setEditMood(option.type)}
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

                {/* 2. Date Header */}
                <div className="text-[10px] sm:text-xs text-muted-foreground/75 font-semibold uppercase tracking-widest select-none">
                  {formatDate(journal.createdAt)} at {formatTime(journal.createdAt)}
                </div>

                {/* 3. Title Input */}
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Untitled Entry"
                  className="w-full text-xl sm:text-2xl md:text-3xl font-bold font-primary bg-transparent border-none outline-none focus:ring-0 placeholder:text-muted-foreground/30 text-foreground/90 leading-tight py-1"
                />

                {/* 4. Small Toolbar Below Title */}
                <div className="flex items-center gap-2 select-none py-1.5 border-t border-b border-border/10">
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

                {/* 4. Optional Cover Input & Live preview */}
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
                          value={editImageUrl}
                          onChange={(e) => setEditImageUrl(e.target.value)}
                          placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                          className="flex-1 px-3 py-2 text-xs bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-foreground/90 placeholder:text-muted-foreground/45"
                        />
                        {editImageUrl && (
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditImageUrl("")}
                            className="px-2 text-xs hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-lg"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                      {editImageUrl && (
                        <div className="flex justify-center pt-1">
                          <div className="relative bg-[#fcfbf9] dark:bg-[#1a1917] p-2 pb-5 rounded shadow-sm border border-border/20 w-36 rotate-[-1deg] select-none">
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-primary/20 backdrop-blur-[1px] rotate-[1deg] opacity-75 z-10" />
                            <div className="relative aspect-square overflow-hidden bg-muted rounded-sm border border-border/10 flex items-center justify-center">
                              {editImageState === 'loading' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                  <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                                </div>
                              )}
                              {editImageState === 'error' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/5 text-destructive p-2 text-center">
                                  <CloudOff className="w-4 h-4 mb-0.5" />
                                  <span className="text-[8px] font-bold uppercase tracking-wider">Error</span>
                                </div>
                              )}
                              <img
                                src={editImageUrl}
                                alt="Preview"
                                className={cn(
                                  "object-cover w-full h-full transition-opacity duration-300",
                                  editImageState === 'loaded' ? "opacity-100" : "opacity-0 absolute"
                                )}
                                onLoad={() => setEditImageState('loaded')}
                                onError={() => setEditImageState('error')}
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
                              if (!editTitle.trim()) setEditTitle(promptText);
                              setEditBody(prev => prev ? prev + "\n\n" + promptText + "\n" : promptText + "\n");
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
                    value={editBody}
                    onChange={setEditBody}
                    placeholder="Start writing your thoughts..."
                    className="text-base md:text-lg text-foreground/95 flex-1 flex flex-col"
                  />
                </div>

                {/* 7. Floating/Fixed Bottom Bar for Stats & Auto-save when editing */}
                <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-t border-border/15 py-3 px-4 sm:px-6">
                  <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-primary" />
                      <span>Autosaving changes to cloud...</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{editBody.split(/\s+/).filter(Boolean).length} words</span>
                      <span>·</span>
                      <span>{Math.max(1, Math.ceil(editBody.split(/\s+/).filter(Boolean).length / 200))} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Viewing Layout
              <div className="space-y-6">
                {/* Meta headers */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground/75 uppercase tracking-wide">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(journal.createdAt)}
                  </span>
                  <span className="hidden sm:inline">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTime(journal.createdAt)}
                  </span>
                  <span className="hidden sm:inline">·</span>
                  <span>{readingTime} min read</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-primary text-foreground/90 leading-tight">
                  {journal.title}
                </h1>

                <div className="border-t border-border/15 pt-6 space-y-8">
                  {/* Mood Badge */}
                  <div className="flex items-center gap-2">
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
                        const MoodIcon = getMoodIcon(journal.mood);
                        return <MoodIcon className="w-3.5 h-3.5" />;
                      })()}
                      Feeling {journal.mood}
                    </span>
                  </div>

                  {/* Polaroid Image Display with Washi Tape */}
                  {journal.imageUrl && (
                    <div className="relative flex justify-center my-8 z-10 select-none">
                      {/* Washi Tape */}
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-primary/20 backdrop-blur-[2px] border border-primary/10 rotate-[-2deg] opacity-80 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center justify-center">
                        <div className="w-[94%] h-[2px] border-t border-dashed border-primary/20" />
                      </div>
                      {/* Polaroid Frame */}
                      <div className="bg-[#fcfbf9] dark:bg-[#1a1917] p-3 pb-8 rounded shadow-md border border-border/20 max-w-[280px] sm:max-w-[320px] rotate-[1.5deg] transform transition-transform duration-300 hover:rotate-0">
                        <div className="relative aspect-square overflow-hidden bg-muted rounded-sm border border-border/10 flex items-center justify-center min-w-[200px] min-h-[200px]">
                          {/* Loading State Skeleton */}
                          {viewImageState === 'loading' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            </div>
                          )}

                          {/* Error Fallback State */}
                          {viewImageState === 'error' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/5 text-destructive p-4 text-center">
                              <CloudOff className="w-6 h-6 mb-2" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Failed to load image</span>
                            </div>
                          )}

                          <img
                            src={journal.imageUrl}
                            alt="Pinned memory"
                            className={cn(
                              "object-cover w-full h-full transition-opacity duration-300",
                              viewImageState === 'loaded' ? "opacity-100" : "opacity-0 absolute"
                            )}
                            onLoad={() => setViewImageState('loaded')}
                            onError={() => setViewImageState('error')}
                          />
                        </div>
                        <div className="mt-3 text-center font-primary text-xs text-muted-foreground/80 tracking-wide">
                          {formatDate(journal.createdAt)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lined body text */}
                  <div 
                    className="text-base md:text-lg text-foreground/85 leading-7 whitespace-pre-wrap font-sans"
                    style={{
                      backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px)`,
                      backgroundSize: "100% 1.75rem",
                      backgroundPosition: "0 1.6rem",
                    }}
                  >
                    {journal.body.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")}
                  </div>

                  {/* Cozy AI Insights CTA */}
                  <div className="pt-6 border-t border-border/15">
                    <Link href={`/journal/${journal.id}/insights`}>
                      <div className="rounded-2xl border border-border/30 bg-muted/40 hover:bg-muted/75 p-5 hover:shadow-sm transition-all duration-300 cursor-pointer group">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/25 to-accent/25 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
                              <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-bold font-primary text-foreground/90">
                                Get AI Insights
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Discover emotional patterns and reflective advice
                              </p>
                            </div>
                          </div>
                          <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180 group-hover:translate-x-1.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.article>

        {/* Last Updated */}
        {journal.updatedAt !== journal.createdAt && (
          <p className="text-center text-xs text-muted-foreground/60">
            Last updated {formatDate(journal.updatedAt)} at {formatTime(journal.updatedAt)}
          </p>
        )}

      </main>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md border-border/30 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-primary text-xl">Delete Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this journal entry? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="rounded-xl cursor-pointer">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl cursor-pointer"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
