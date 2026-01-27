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
      <Link href={`/dashboard/journal/${entry.id}`}>
        <div
          className={cn(
            "group relative p-3 rounded-xl cursor-pointer transition-colors duration-200",
            "bg-card/50 hover:bg-card/80 border border-border/40 hover:border-border/60",
            className
          )}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${colors.primary}15` }}
            >
              <MoodIcon className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{entry.title}</h4>
              <p className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/dashboard/journal/${entry.id}`}>
      <article
        className={cn(
          "group relative rounded-xl cursor-pointer transition-all duration-200",
          "bg-card/60 border border-border/40",
          "hover:bg-card/80 hover:shadow-md",
          variant === "featured" && "row-span-2",
          className
        )}
        style={{
          "--mood-color": colors.primary,
        } as React.CSSProperties}
      >
        {/* Mood-colored border on hover */}
        <div 
          className="absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{ borderColor: colors.primary }}
        />

        <div className="relative p-5 pl-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <MoodIcon className="w-4 h-4" style={{ color: colors.primary }} />
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(entry.createdAt)}
              </p>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{readingTime} min</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {entry.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {excerpt}
          </p>

          {/* Read more hint - only visible on hover */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read entry</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
