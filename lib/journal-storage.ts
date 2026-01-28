import { MoodType } from "@/components/journal/mood-selector";

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  mood: MoodType;
  moodIntensity?: number;
  createdAt: string;
  updatedAt: string;
}

const JOURNALS_STORAGE_KEY = "rhythme_journals";

/**
 * Safely retrieve journals from localStorage.
 * Handles JSON parsing errors and ensures the result is an array.
 */
export function getStoredJournals(): JournalEntry[] {
  if (typeof window === "undefined") return []; // SSR safety

  const stored = localStorage.getItem(JOURNALS_STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      console.warn("Stored journals data is not an array, resetting to empty.");
      return [];
    }
  } catch (e) {
    console.error("Failed to parse journals:", e);
    return [];
  }
}

/**
 * Save journals to localStorage.
 */
export function saveStoredJournals(entries: JournalEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(JOURNALS_STORAGE_KEY, JSON.stringify(entries));
}

/**
 * Add a new journal entry to the beginning of the list.
 */
export function addJournalEntry(entry: JournalEntry): void {
  const entries = getStoredJournals();
  const newEntries = [entry, ...entries];
  saveStoredJournals(newEntries);
}

/**
 * Update an existing journal entry by ID.
 */
export function updateJournalEntry(updatedEntry: JournalEntry): void {
  const entries = getStoredJournals();
  const index = entries.findIndex((e) => e.id === updatedEntry.id);
  
  if (index !== -1) {
    entries[index] = updatedEntry;
    saveStoredJournals(entries);
  }
}

/**
 * Delete a journal entry by ID.
 */
export function deleteJournalEntry(id: string): void {
  const entries = getStoredJournals();
  const filtered = entries.filter((e) => e.id !== id);
  saveStoredJournals(filtered);
}

/**
 * Get a specific journal entry by ID.
 */
export function getJournalEntryById(id: string): JournalEntry | undefined {
  const entries = getStoredJournals();
  return entries.find((e) => e.id === id);
}
