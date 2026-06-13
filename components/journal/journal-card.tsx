"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MoodType, moodIcons } from "./mood-selector";
import { moodColors } from "./emotional-aura";
import { BookOpen, Clock } from "lucide-react";
import Link from "next/link";

interface JournalEntry {
  id: string;
  title: string;
  body: string;
  mood: MoodType;
  moodIntensity?: number;
  createdAt: string;
  updatedAt: string;
}

interface JournalCardProps {
  entry: JournalEntry;
  variant?: "default" | "compact" | "featured";
  className?: string;
}

// Calculate reading time from text content
function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200)); // ~200 wpm
}

// Get excerpt from text content
function getExcerpt(content: string, maxLength: number = 120): string {
  // Clean any residual HTML tags (for backwards compatibility with old entries)
  const text = content.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function JournalCard({ entry, variant = "default", className }: JournalCardProps) {
  const colors = moodColors[entry.mood] || moodColors.neutral;
  const readingTime = calculateReadingTime(entry.body);
  const excerpt = getExcerpt(entry.body);
  const MoodIcon = moodIcons[entry.mood];

  if (variant === "compact") {
    return (
      <Link href={`/journal/${entry.id}`}>
        <div
          className={cn(
            "group relative p-3.5 rounded-2xl cursor-pointer transition-all duration-300",
            "bg-card/60 hover:bg-card/90 border border-border/40 hover:border-border/60 hover:shadow-sm",
            className
          )}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
              style={{ backgroundColor: `${colors.primary}18` }}
            >
              <MoodIcon className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold font-primary text-sm truncate text-foreground/90 group-hover:text-primary transition-colors">{entry.title}</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(entry.createdAt)}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Create solid opacity glow color based on theme context (using tailwind opacity modifiers later or hex)
  const glowColor = `${colors.primary}12`;

  return (
    <Link href={`/journal/${entry.id}`}>
      <article
        className={cn(
          "group relative rounded-[22px] cursor-pointer transition-all duration-300 overflow-hidden",
          "bg-card/75 dark:bg-card/35 border border-border/40",
          "hover:bg-card/90 dark:hover:bg-card/45 hover:-translate-y-0.5",
          variant === "featured" && "row-span-2",
          className
        )}
        style={{
          "--mood-color": colors.primary,
          boxShadow: `0 4px 20px -2px rgba(0, 0, 0, 0.02)`,
        } as React.CSSProperties}
      >
        {/* Soft Mood Glow Shadow on hover */}
        <div 
          className="absolute inset-0 rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ 
            boxShadow: `0 12px 30px -4px ${colors.primary}15`,
            border: `1.5px solid ${colors.primary}35`
          }}
        />

        {/* Notebook vertical margin line */}
        <div className="absolute top-0 bottom-0 left-[3.25rem] w-[1px] bg-red-400/20 dark:bg-red-500/15 pointer-events-none" />

        {/* Mood Icon (on the left side of margin line) */}
        <div className="absolute left-3.5 top-5 z-10">
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm border border-border/10 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${colors.primary}18` }}
          >
            <MoodIcon className="w-3.5 h-3.5" style={{ color: colors.primary }} />
          </div>
        </div>

        {/* Content Area (on the right side of margin line) */}
        <div className="relative p-5 pl-17 flex flex-col h-full min-h-[160px]">
          {/* Header row (date & reading time) */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground/75 uppercase">
              {formatDate(entry.createdAt)}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
              <Clock className="w-3 h-3" />
              <span>{readingTime} min</span>
            </div>
          </div>

          {/* Title - Serif Font */}
          <h3 className="text-base sm:text-lg font-bold font-primary mb-2.5 line-clamp-2 text-foreground/90 group-hover:text-primary transition-colors leading-tight">
            {entry.title}
          </h3>

          {/* Excerpt with lined paper background */}
          <div className="relative flex-1">
            <p 
              className="text-sm text-muted-foreground/85 leading-6 line-clamp-3 font-sans"
              style={{
                backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px)`,
                backgroundSize: "100% 1.5rem",
                backgroundPosition: "0 0.25rem",
              }}
            >
              {excerpt}
            </p>
          </div>

          {/* Read more footer hint */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/60 opacity-60 group-hover:opacity-100 transition-opacity">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="font-medium">Read entry</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
