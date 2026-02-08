/**
 * =============================================================================
 * JOURNAL ENCRYPTION STORE
 * =============================================================================
 * 
 * Zustand store for managing the journal encryption key.
 * Key is stored ONLY in memory - never persisted.
 * 
 * Security:
 * - Key cleared on logout
 * - Key cleared on page refresh (by design)
 * - Max unlock attempts before forced logout
 * =============================================================================
 */

import { create } from "zustand";

const MAX_UNLOCK_ATTEMPTS = 5;

interface JournalEncryptionState {
  // The encryption key (null if not derived yet)
  key: CryptoKey | null;
  
  // Whether the key is ready for use
  isReady: boolean;
  
  // Whether we're currently deriving a key
  isUnlocking: boolean;
  
  // Track unlock attempts for rate limiting
  unlockAttempts: number;
  
  // Actions
  setKey: (key: CryptoKey) => void;
  clearKey: () => void;
  setUnlocking: (isUnlocking: boolean) => void;
  incrementAttempts: () => number; // Returns new count
  resetAttempts: () => void;
  shouldForceLogout: () => boolean;
}

export const useJournalEncryptionStore = create<JournalEncryptionState>(
  (set, get) => ({
    key: null,
    isReady: false,
    isUnlocking: false,
    unlockAttempts: 0,

    setKey: (key: CryptoKey) => {
      set({ key, isReady: true, isUnlocking: false });
    },

    clearKey: () => {
      set({ key: null, isReady: false, isUnlocking: false });
    },

    setUnlocking: (isUnlocking: boolean) => {
      set({ isUnlocking });
    },

    incrementAttempts: () => {
      const newCount = get().unlockAttempts + 1;
      set({ unlockAttempts: newCount });
      return newCount;
    },

    resetAttempts: () => {
      set({ unlockAttempts: 0 });
    },

    shouldForceLogout: () => {
      return get().unlockAttempts >= MAX_UNLOCK_ATTEMPTS;
    },
  })
);

// =============================================================================
// UTILITY HOOKS & HELPERS
// =============================================================================

/**
 * Check if journals need to be unlocked.
 * Returns true if there's a session but no encryption key.
 */
export function needsJournalUnlock(): boolean {
  const { key, isUnlocking } = useJournalEncryptionStore.getState();
  return key === null && !isUnlocking;
}

/**
 * Get the current encryption key (or null if not available).
 * Use this for encryption/decryption operations.
 */
export function getJournalKey(): CryptoKey | null {
  return useJournalEncryptionStore.getState().key;
}

/**
 * Clear the encryption key. Call this on logout.
 */
export function clearJournalKey(): void {
  useJournalEncryptionStore.getState().clearKey();
}
