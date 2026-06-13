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
} from "lucide-react";
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
}

// Convert Journal from DB to normalized entry (placeholder for encrypted)
function normalizeJournal(journal: Journal): NormalizedEntry {
  const isEncrypted = !!journal.iv;
  return {
    id: journal.journal_id,
    title: journal.title,
    body: isEncrypted ? "[Encrypted]" : journal.content,
    mood: journal.mood_tags?.mood || "neutral",
    createdAt: journal.created_at,
    updatedAt: journal.updated_at,
    isEncrypted,
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
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Decrypt journal on load if encrypted (iv presence = encrypted)
  useEffect(() => {
    async function decryptContent() {
      if (!initialJournal.iv) {
        // Not encrypted, use as-is
        const normalized = normalizeJournal(initialJournal);
        setJournal(normalized);
        setEditBody(normalized.body);
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
        
        // Parse JSON payload which contains both title and body
        let title: string;
        let body: string;
        try {
          const parsed = JSON.parse(decryptedPayload);
          title = parsed.title || initialJournal.title;
          body = parsed.body || decryptedPayload;
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
        };
        
        setJournal(decrypted);
        setEditTitle(title);
        setEditBody(body);
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
      // Encrypt content if we have a key
      let updateInput: Parameters<typeof updateJournal>[1];
      
      if (encryptionKey && isCryptoAvailable()) {
        const { encrypted, iv } = await encryptJournal(encryptionKey, editBody);
        updateInput = {
          title: editTitle.trim(),
          content: encrypted, // Encrypted base64 goes in content
          iv: iv,
          mood_tags: editMood,
        };
      } else {
        // Fallback to plaintext (shouldn't happen normally)
        updateInput = {
          title: editTitle.trim(),
          content: editBody,
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
          className="relative rounded-[28px] border border-border/30 bg-card/75 dark:bg-card/35 backdrop-blur-md shadow-sm overflow-hidden p-6 sm:p-8 md:p-10 pl-16 sm:pl-20 md:pl-24 py-8 sm:py-10 md:py-12"
        >
          {/* Vertical notebook line */}
          <div className="absolute top-0 bottom-0 left-[3.25rem] sm:left-[4.25rem] md:left-[5.25rem] w-[1px] bg-red-400/20 dark:bg-red-500/15 pointer-events-none" />

          {/* Left margin info (Mood Aura indicator) */}
          <div className="absolute left-3.5 sm:left-6 md:left-8 top-8 sm:top-10 md:top-12 z-10 flex flex-col items-center gap-4">
            <EmotionalAura
              mood={isEditing && editMood ? editMood : journal.mood}
              intensity={3}
              size="sm"
              className="w-10 h-10 shadow-sm border border-border/10"
            >
              {(() => {
                const MoodIcon = getMoodIcon(isEditing && editMood ? editMood : journal.mood);
                return <MoodIcon className="w-5 h-5" style={{ color: colors.primary }} />;
              })()}
            </EmotionalAura>
          </div>

          {/* Right margin info (Content sheet) */}
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
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-2xl sm:text-3xl md:text-4xl font-bold font-primary bg-transparent border-none outline-none focus:ring-0 placeholder:text-muted-foreground/30 text-foreground/90 leading-tight"
                placeholder="Untitled Entry"
              />
            ) : (
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-primary text-foreground/90 leading-tight">
                {journal.title}
              </h1>
            )}

            <div className="border-t border-border/15 pt-6">
              {isEditing ? (
                <div className="space-y-6">
                  {/* Cloud save notice */}
                  <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-muted/40 border border-border/20 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-primary" />
                      <span>Changes autosave to cloud</span>
                    </div>
                    <span className="opacity-75">Sync active</span>
                  </div>

                  {/* Mood Selector inside card */}
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/10">
                    <MoodSelector value={editMood} onChange={setEditMood} />
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
                      value={editBody}
                      onChange={setEditBody}
                      placeholder="Start writing your thoughts..."
                      className="text-base md:text-lg text-foreground/95"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
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

                  {/* Lined body text */}
                  <div 
                    className="text-base md:text-lg text-foreground/85 leading-7 whitespace-pre-wrap font-sans"
                    style={{
                      backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px)`,
                      backgroundSize: "100% 1.75rem",
                      backgroundPosition: "0 0.4rem",
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
              )}
            </div>
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
