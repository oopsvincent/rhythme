"use client";

import { useState, useEffect, use } from "react";
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

import {
  getStoredJournals,
  updateJournalEntry,
  deleteJournalEntry,
  JournalEntry
} from "@/lib/journal-storage";

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

export default function JournalDetailPage({
  params,
}: {
  params: Promise<{ journalId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [journal, setJournal] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editMood, setEditMood] = useState<MoodType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Load journal on mount
  useEffect(() => {
    const journals = getStoredJournals();
    const found = journals.find((j) => j.id === resolvedParams.journalId);
    if (found) {
      setJournal(found);
      setEditTitle(found.title);
      setEditBody(found.body);
      setEditMood(found.mood);
    }
    setIsLoading(false);
  }, [resolvedParams.journalId]);

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
    await new Promise((resolve) => setTimeout(resolve, 300));

    const updatedEntry: JournalEntry = {
      ...journal,
      title: editTitle.trim(),
      body: editBody,
      mood: editMood,
      updatedAt: new Date().toISOString(),
    };

    updateJournalEntry(updatedEntry);

    setJournal(updatedEntry);
    setIsSaving(false);
    setIsSaved(true);
    setIsEditing(false);

    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = async () => {
    if (!journal) return;

    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    deleteJournalEntry(journal.id);

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
            <Link href="/dashboard/journal">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Journal
              </Button>
            </Link>
          </motion.div>
        </div>
      </>
    );
  }

  const colors = moodColors[journal.mood];
  const readingTime = calculateReadingTime(journal.body);

  return (
    <>
      <SiteHeader />

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
                      <span className="font-medium text-foreground">Saved locally</span>
                      <span> · Changes auto-save</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CloudOff className="w-3 h-3" />
                    <span className="hidden sm:inline">Cloud sync coming soon</span>
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
        <DialogContent className="glass border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-primary text-xl">Delete Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this journal entry? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
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
