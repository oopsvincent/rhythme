"use client";

import { useState, useRef, useCallback, KeyboardEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
} from "lucide-react";

interface BlockType {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  tag: string;
}

const blockTypes: BlockType[] = [
  { id: 'paragraph', label: 'Text', description: 'Just start writing with plain text', icon: Type, tag: 'p' },
  { id: 'h1', label: 'Heading 1', description: 'Big section heading', icon: Heading1, tag: 'h1' },
  { id: 'h2', label: 'Heading 2', description: 'Medium section heading', icon: Heading2, tag: 'h2' },
  { id: 'h3', label: 'Heading 3', description: 'Small section heading', icon: Heading3, tag: 'h3' },
  { id: 'ul', label: 'Bullet List', description: 'Create a simple bullet list', icon: List, tag: 'ul' },
  { id: 'ol', label: 'Numbered List', description: 'Create a numbered list', icon: ListOrdered, tag: 'ol' },
  { id: 'quote', label: 'Quote', description: 'Capture a quote', icon: Quote, tag: 'blockquote' },
  { id: 'code', label: 'Code', description: 'Write code snippet', icon: Code, tag: 'pre' },
];

interface JournalEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function JournalEditor({ value, onChange, placeholder, className }: JournalEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [slashFilter, setSlashFilter] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isEmpty, setIsEmpty] = useState(!value);

  // Filter block types based on slash filter
  const filteredBlocks = blockTypes.filter(
    block => block.label.toLowerCase().includes(slashFilter.toLowerCase()) ||
             block.description.toLowerCase().includes(slashFilter.toLowerCase())
  );

  // Check if editor is empty
  const checkEmpty = useCallback(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText.trim();
      setIsEmpty(text === '' || text === '\n');
    }
  }, []);

  // Handle input changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      checkEmpty();

      // Check for slash command
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textBeforeCursor = range.startContainer.textContent?.slice(0, range.startOffset) || '';
        
        // Check if last character typed is /
        if (textBeforeCursor.endsWith('/')) {
          const rect = range.getBoundingClientRect();
          const editorRect = editorRef.current.getBoundingClientRect();
          setSlashMenuPosition({
            top: rect.bottom - editorRect.top + 8,
            left: rect.left - editorRect.left,
          });
          setShowSlashMenu(true);
          setSlashFilter("");
          setSelectedIndex(0);
        } else if (showSlashMenu) {
          // Extract filter text after slash
          const slashIndex = textBeforeCursor.lastIndexOf('/');
          if (slashIndex !== -1) {
            setSlashFilter(textBeforeCursor.slice(slashIndex + 1));
          } else {
            setShowSlashMenu(false);
          }
        }
      }
    }
  }, [onChange, showSlashMenu, checkEmpty]);

  // Insert block type
  const insertBlock = useCallback((block: BlockType) => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    // Remove the slash and filter text
    const textNode = range.startContainer;
    if (textNode.nodeType === Node.TEXT_NODE) {
      const text = textNode.textContent || '';
      const slashIndex = text.lastIndexOf('/');
      if (slashIndex !== -1) {
        textNode.textContent = text.slice(0, slashIndex);
      }
    }

    // Create the new block element
    let newElement: HTMLElement;
    switch (block.tag) {
      case 'h1':
        newElement = document.createElement('h1');
        newElement.className = 'text-3xl font-bold mb-4';
        break;
      case 'h2':
        newElement = document.createElement('h2');
        newElement.className = 'text-2xl font-bold mb-3';
        break;
      case 'h3':
        newElement = document.createElement('h3');
        newElement.className = 'text-xl font-bold mb-2';
        break;
      case 'ul':
        newElement = document.createElement('ul');
        newElement.className = 'list-disc list-inside mb-4 space-y-1';
        const li = document.createElement('li');
        newElement.appendChild(li);
        break;
      case 'ol':
        newElement = document.createElement('ol');
        newElement.className = 'list-decimal list-inside mb-4 space-y-1';
        const oli = document.createElement('li');
        newElement.appendChild(oli);
        break;
      case 'blockquote':
        newElement = document.createElement('blockquote');
        newElement.className = 'border-l-4 border-primary/50 pl-4 italic text-muted-foreground mb-4';
        break;
      case 'pre':
        newElement = document.createElement('pre');
        newElement.className = 'bg-muted/50 rounded-lg p-4 font-mono text-sm mb-4 overflow-x-auto';
        break;
      default:
        newElement = document.createElement('p');
        newElement.className = 'mb-2';
    }

    newElement.innerHTML = '<br>';
    
    // Insert the new element
    const parentBlock = range.startContainer.parentElement;
    if (parentBlock && editorRef.current.contains(parentBlock)) {
      parentBlock.after(newElement);
      if (parentBlock.textContent === '') {
        parentBlock.remove();
      }
    } else {
      editorRef.current.appendChild(newElement);
    }

    // Move cursor to new element
    const newRange = document.createRange();
    newRange.setStart(newElement, 0);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);

    setShowSlashMenu(false);
    onChange(editorRef.current.innerHTML);
    checkEmpty();
  }, [onChange, checkEmpty]);

  // Handle keyboard navigation in slash menu
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (showSlashMenu) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredBlocks.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredBlocks.length) % filteredBlocks.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredBlocks[selectedIndex]) {
          insertBlock(filteredBlocks[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowSlashMenu(false);
      }
    }

    // Handle formatting shortcuts
    if (e.metaKey || e.ctrlKey) {
      if (e.key === 'b') {
        e.preventDefault();
        document.execCommand('bold');
      } else if (e.key === 'i') {
        e.preventDefault();
        document.execCommand('italic');
      } else if (e.key === 'u') {
        e.preventDefault();
        document.execCommand('underline');
      }
    }
  }, [showSlashMenu, filteredBlocks, selectedIndex, insertBlock]);

  // Initialize editor with value
  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      checkEmpty();
    }
  }, [value, checkEmpty]);

  // Reset selected index when filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [slashFilter]);

  return (
    <div className={cn("relative", className)}>
      {/* Placeholder */}
      {isEmpty && (
        <div className="absolute top-0 left-0 pointer-events-none text-muted-foreground/60">
          {placeholder || "Start writing, or press '/' for commands..."}
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onBlur={checkEmpty}
        onFocus={checkEmpty}
        className={cn(
          "min-h-[300px] outline-none prose prose-neutral dark:prose-invert max-w-none",
          "focus:ring-0",
          "[&>*:first-child]:mt-0",
          "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:font-primary",
          "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:font-primary",
          "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:font-primary",
          "[&_p]:mb-2",
          "[&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-4",
          "[&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-4",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
          "[&_pre]:bg-muted/50 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm",
          "[&_code]:bg-muted/50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm",
        )}
      />

      {/* Slash Command Menu */}
      <AnimatePresence>
        {showSlashMenu && filteredBlocks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              top: slashMenuPosition.top,
              left: slashMenuPosition.left,
            }}
            className="absolute z-50 min-w-[280px] glass-card rounded-xl border border-border/50 shadow-2xl overflow-hidden"
          >
            <div className="p-2 border-b border-border/30">
              <p className="text-xs text-muted-foreground px-2">
                Blocks
              </p>
            </div>
            <div className="p-1 max-h-[300px] overflow-y-auto">
              {filteredBlocks.map((block, index) => {
                const Icon = block.icon;
                return (
                  <button
                    key={block.id}
                    onClick={() => insertBlock(block)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                      index === selectedIndex
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{block.label}</p>
                      <p className="text-xs text-muted-foreground">{block.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formatting Hint */}
      <div className="mt-4 pt-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Ctrl/⌘ + B</kbd> Bold • 
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] ml-2">Ctrl/⌘ + I</kbd> Italic • 
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] ml-2">/</kbd> Commands
        </p>
      </div>
    </div>
  );
}
