"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface JournalEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function JournalEditor({ value, onChange, placeholder, className }: JournalEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(300, textarea.scrollHeight)}px`;
    }
  }, []);

  // Adjust height on value change
  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  // Handle input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    adjustHeight();
  }, [onChange, adjustHeight]);

  return (
    <div className={cn("relative", className)}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder || "Start writing your thoughts..."}
        className={cn(
          "w-full min-h-[300px] resize-none bg-transparent",
          "outline-none border-none focus:ring-0",
          "text-base leading-relaxed",
          "placeholder:text-muted-foreground/60",
          "font-sans"
        )}
      />
    </div>
  );
}
