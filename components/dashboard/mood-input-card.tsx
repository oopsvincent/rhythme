"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Smile, 
  CloudSun, 
  Minus, 
  Frown, 
  Angry, 
  Star, 
  AlertCircle,
  LucideIcon,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

type MoodType = 'happy' | 'calm' | 'neutral' | 'sad' | 'frustrated' | 'excited' | 'anxious';

interface MoodOption {
  type: MoodType;
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
}

const moods: MoodOption[] = [
  { type: 'happy', icon: Smile, label: 'Happy', color: 'text-yellow-500', bgColor: 'bg-yellow-500/20 hover:bg-yellow-500/30' },
  { type: 'calm', icon: CloudSun, label: 'Calm', color: 'text-blue-400', bgColor: 'bg-blue-400/20 hover:bg-blue-400/30' },
  { type: 'neutral', icon: Minus, label: 'Neutral', color: 'text-gray-400', bgColor: 'bg-gray-400/20 hover:bg-gray-400/30' },
  { type: 'sad', icon: Frown, label: 'Sad', color: 'text-indigo-400', bgColor: 'bg-indigo-400/20 hover:bg-indigo-400/30' },
  { type: 'frustrated', icon: Angry, label: 'Frustrated', color: 'text-red-500', bgColor: 'bg-red-500/20 hover:bg-red-500/30' },
  { type: 'excited', icon: Star, label: 'Excited', color: 'text-pink-500', bgColor: 'bg-pink-500/20 hover:bg-pink-500/30' },
  { type: 'anxious', icon: AlertCircle, label: 'Anxious', color: 'text-orange-400', bgColor: 'bg-orange-400/20 hover:bg-orange-400/30' },
];

const MOOD_STORAGE_KEY = "rhythme_daily_mood";

interface StoredMood {
  mood: MoodType;
  date: string;
}

export function MoodInputCard() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(MOOD_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: StoredMood = JSON.parse(stored);
        const today = new Date().toISOString().split('T')[0];
        if (parsed.date === today) {
          setSelectedMood(parsed.mood);
        }
      } catch (e) {
        console.error("Failed to parse stored mood:", e);
      }
    }
    setIsLoading(false);
  }, []);

  const handleMoodSelect = (mood: MoodType) => {
    const today = new Date().toISOString().split('T')[0];
    const data: StoredMood = { mood, date: today };
    localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(data));
    setSelectedMood(mood);
  };

  const selectedMoodData = moods.find(m => m.type === selectedMood);

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50">
        <div className="h-20 animate-pulse bg-muted/50 rounded-lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50"
    >
      {selectedMood ? (
        // Mood selected state
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              selectedMoodData?.bgColor
            )}>
              {selectedMoodData && <selectedMoodData.icon className={cn("w-5 h-5", selectedMoodData.color)} />}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today you&apos;re feeling</p>
              <p className="font-medium font-primary capitalize">{selectedMood}</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2">
            <button
              onClick={() => setSelectedMood(null)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Change
            </button>
            <Link
              href="/dashboard/journal/new"
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
            >
              Reflect <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        // Mood selection state
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">How are you feeling today?</p>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => {
              const Icon = mood.icon;
              return (
                <motion.button
                  key={mood.type}
                  onClick={() => handleMoodSelect(mood.type)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-200",
                    "border border-transparent",
                    mood.bgColor,
                    mood.color
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{mood.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
