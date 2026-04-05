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

    router.push("/dashboard/journal");
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

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <motion.div
          className="h-full"
          style={{
            width: `${scrollProgress}%`,
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
          }}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden overflow-y-auto">
        {/* Hero Section with Mood Gradient */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative pt-8 pb-16 px-4 md:px-8"
          style={{
            background: `linear-gradient(180deg, ${colors.primary}15 0%, transparent 100%)`,
          }}
        >
          <div className="max-w-3xl mx-auto">
            {/* Back Button & Actions */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/dashboard/journal">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>

              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Link href={`/dashboard/journal/${journal.id}/insights`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Brain className="w-4 h-4" />
                        AI Insights
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving || !editTitle.trim() || !editMood}
                      className="gap-2"
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Entry
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Mood & Date */}
            <div className="flex items-center gap-4 mb-6">
              <EmotionalAura
                mood={journal.mood}
                intensity={journal.moodIntensity || 3}
                size="lg"
              >
                {(() => {
                const MoodIcon = getMoodIcon(journal.mood);
                return <MoodIcon className="w-8 h-8" style={{ color: colors.primary }} />;
              })()}
              </EmotionalAura>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(journal.createdAt)}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTime(journal.createdAt)}
                  </span>
                  <span>·</span>
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>

            {/* Title */}
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-3xl md:text-4xl font-bold font-primary bg-transparent border-none outline-none placeholder:text-muted-foreground/40"
                placeholder="Untitled"
              />
            ) : (
              <h1 className="text-3xl md:text-4xl font-bold font-primary">
                {journal.title}
              </h1>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 px-4 md:px-8 pb-16">
          <div className="max-w-3xl mx-auto">
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Auto-save Notice */}
                <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/30">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <HardDrive className="w-3.5 h-3.5 text-primary" />
                    <span>
                      <span className="font-medium text-foreground">Saved to cloud</span>
                      <span> · Changes auto-save</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CloudOff className="w-3 h-3" />
                    <span className="hidden sm:inline">Syncing...</span>
                  </div>
                </div>

                {/* Editor - Embedded feel on mobile */}
                <div className="md:glass-card md:rounded-2xl md:p-6 space-y-4 md:space-y-6">
                  <MoodSelector value={editMood} onChange={setEditMood} />
                  <div className="md:border-t md:border-border/30 md:pt-6">
                    <JournalEditor
                      value={editBody}
                      onChange={setEditBody}
                      placeholder="Start writing your thoughts..."
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-neutral dark:prose-invert max-w-none"
              >
                {/* Mood Badge */}
                <div className="mb-8 flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${colors.primary}20`,
                      color: colors.primary,
                    }}
                  >
                    {(() => {
                      const MoodIcon = getMoodIcon(journal.mood);
                      return <MoodIcon className="w-4 h-4 inline mr-1" />;
                    })()}
                    Feeling {journal.mood}
                  </span>
                </div>

                {/* Body Content */}
                <div className="text-lg leading-relaxed whitespace-pre-wrap">
                  {journal.body.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")}
                </div>

                {/* AI Insights CTA */}
                <div className="mt-12 pt-8 border-t border-border/30">
                  <Link href={`/dashboard/journal/${journal.id}/insights`}>
                    <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold font-primary">
                            Get AI Insights
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Discover emotional patterns and suggestions
                          </p>
                        </div>
                        <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Last Updated */}
            {journal.updatedAt !== journal.createdAt && (
              <p className="text-center text-xs text-muted-foreground mt-8">
                Last updated {formatDate(journal.updatedAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md border-border/10">
          <DialogHeader>
            <DialogTitle className="font-primary text-xl">Delete Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this journal entry? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
