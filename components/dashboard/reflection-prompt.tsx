"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, RefreshCw } from "lucide-react";

// Daily reflection prompts and quotes
const reflectionContent = [
  { type: "prompt", text: "What's one small win you can celebrate today?" },
  { type: "prompt", text: "What are you most looking forward to this week?" },
  { type: "prompt", text: "How can you show yourself kindness today?" },
  { type: "quote", text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { type: "prompt", text: "What would make today feel meaningful?" },
  { type: "quote", text: "Progress, not perfection.", author: "Unknown" },
  { type: "prompt", text: "What's something you're grateful for right now?" },
  { type: "quote", text: "Small steps every day lead to big changes.", author: "Unknown" },
  { type: "prompt", text: "What challenge are you ready to face today?" },
  { type: "quote", text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { type: "prompt", text: "How can you take care of your mental health today?" },
  { type: "quote", text: "Be the change you wish to see.", author: "Gandhi" },
];

function getDailyContent() {
  // Use date as seed for consistent daily content
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return reflectionContent[dayOfYear % reflectionContent.length];
}

export function ReflectionPrompt() {
  const [content, setContent] = useState<typeof reflectionContent[0] | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setContent(getDailyContent());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    const randomIndex = Math.floor(Math.random() * reflectionContent.length);
    setTimeout(() => {
      setContent(reflectionContent[randomIndex]);
      setIsRefreshing(false);
    }, 300);
  };

  if (!content) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent"
    >
      {/* Decorative glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="relative flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Quote className="w-4 h-4 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <motion.p 
            key={content.text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm sm:text-base font-medium leading-relaxed"
          >
            {content.text}
          </motion.p>
          
          {content.type === "quote" && "author" in content && (
            <p className="text-xs text-muted-foreground mt-1">
              — {content.author}
            </p>
          )}
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="shrink-0 w-8 h-8 rounded-lg hover:bg-muted/50 flex items-center justify-center transition-colors disabled:opacity-50"
          title="Get a new prompt"
        >
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>
    </motion.div>
  );
}
