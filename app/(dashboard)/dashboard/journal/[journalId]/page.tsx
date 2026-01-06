"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { MoodSelector, MoodType } from "@/components/journal/mood-selector";
import { JournalEditor } from "@/components/journal/journal-editor";
import {
  ArrowLeft,
  Save,
  Loader2,
  Check,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { motion } from "framer-motion";
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

// Local storage key
const JOURNALS_STORAGE_KEY = 'rhythme_journals';

interface JournalEntry {
  id: string;
  title: string;
  body: string;
  mood: MoodType;
  moodIntensity?: number;
  createdAt: string;
  updatedAt: string;
}

export default function JournalDetailPage({ params }: { params: Promise<{ journalId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [journal, setJournal] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<MoodType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canSave = hasChanges && title.trim() !== "" && mood !== null;

  // Load journal on mount
  useEffect(() => {
    const stored = localStorage.getItem(JOURNALS_STORAGE_KEY);
    if (stored) {
      try {
        const journals: JournalEntry[] = JSON.parse(stored);
        const found = journals.find(j => j.id === resolvedParams.journalId);
        if (found) {
          setJournal(found);
          setTitle(found.title);
          setBody(found.body);
          setMood(found.mood);
        }
      } catch (e) {
        console.error('Failed to load journal:', e);
      }
    }
    setIsLoading(false);
  }, [resolvedParams.journalId]);

  // Track changes
  useEffect(() => {
    if (journal) {
      const changed = 
        title !== journal.title || 
        body !== journal.body || 
        mood !== journal.mood;
      setHasChanges(changed);
    }
  }, [title, body, mood, journal]);

  const handleSave = async () => {
    if (!canSave || !mood || !journal) return;

    setIsSaving(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    const updatedEntry: JournalEntry = {
      ...journal,
      title: title.trim(),
      body,
      mood,
      updatedAt: new Date().toISOString(),
    };

    // Update in storage
    const stored = localStorage.getItem(JOURNALS_STORAGE_KEY);
    if (stored) {
      const journals: JournalEntry[] = JSON.parse(stored);
      const index = journals.findIndex(j => j.id === journal.id);
      if (index !== -1) {
        journals[index] = updatedEntry;
        localStorage.setItem(JOURNALS_STORAGE_KEY, JSON.stringify(journals));
      }
    }

    setJournal(updatedEntry);
    setIsSaving(false);
    setIsSaved(true);
    setHasChanges(false);

    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = async () => {
    if (!journal) return;

    setIsDeleting(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    // Remove from storage
    const stored = localStorage.getItem(JOURNALS_STORAGE_KEY);
    if (stored) {
      const journals: JournalEntry[] = JSON.parse(stored);
      const filtered = journals.filter(j => j.id !== journal.id);
      localStorage.setItem(JOURNALS_STORAGE_KEY, JSON.stringify(filtered));
    }

    router.push('/dashboard/journal');
  };

  const handleBack = () => {
    router.push('/dashboard/journal');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <>
        <SiteHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading journal...</p>
          </div>
        </div>
      </>
    );
  }

  if (!journal) {
    return (
      <>
        <SiteHeader />
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-12 text-center max-w-md"
          >
            <h3 className="text-xl font-primary mb-3">Journal Not Found</h3>
            <p className="text-muted-foreground mb-6">
              This journal entry doesn&apos;t exist or has been deleted.
            </p>
            <button
              onClick={handleBack}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Journal
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col px-4 md:px-10 pb-8">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-6 py-6 max-w-4xl mx-auto w-full">
            {/* Header */}
            <motion.div
              className="flex items-center justify-between gap-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-xl md:text-2xl font-primary tracking-tight">
                    Edit Entry
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(journal.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={!canSave || isSaving}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : isSaved ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isSaving ? 'Saving...' : isSaved ? 'Saved!' : 'Save Changes'}
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
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
            </motion.div>

            {/* Editor Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl border-border/30 overflow-hidden"
            >
              {/* Title Input */}
              <div className="px-6 md:px-8 pt-6 md:pt-8">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Untitled"
                  className="w-full text-3xl md:text-4xl font-primary font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Mood Selector */}
              <div className="px-6 md:px-8 py-6 border-b border-border/30">
                <MoodSelector value={mood} onChange={setMood} />
              </div>

              {/* Body Editor */}
              <div className="px-6 md:px-8 py-6">
                <JournalEditor
                  value={body}
                  onChange={setBody}
                  placeholder="Start writing your thoughts..."
                />
              </div>
            </motion.div>

            {/* Last Updated */}
            {journal.updatedAt !== journal.createdAt && (
              <p className="text-center text-xs text-muted-foreground">
                Last updated {formatDate(journal.updatedAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="glass border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-primary text-xl">Delete Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this journal entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center rounded-lg bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
