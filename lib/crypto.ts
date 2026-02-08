/**
 * =============================================================================
 * JOURNAL ENCRYPTION UTILITIES
 * =============================================================================
 * 
 * Zero-knowledge encryption for journal entries using Web Crypto API.
 * Key is derived from user's login password - never stored or transmitted.
 * 
 * Security:
 * - AES-GCM 256-bit encryption
 * - PBKDF2 key derivation (100k iterations)
 * - Unique IV per encryption
 * - Key exists only in memory
 * =============================================================================
 */

// =============================================================================
// CONSTANTS
// =============================================================================

const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 256;
const SALT_PREFIX = "rhythme_journal_v1_"; // Fixed salt prefix for deterministic derivation

// =============================================================================
// BUFFER UTILITIES
// =============================================================================

/**
 * Convert ArrayBuffer or Uint8Array to base64 string
 */
export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string to Uint8Array
 */
export function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// =============================================================================
// KEY DERIVATION
// =============================================================================

/**
 * Derive a CryptoKey from user's password and email.
 * Uses PBKDF2 with a deterministic salt for cross-device compatibility.
 * 
 * @param password - User's login password
 * @param email - User's email (used as part of salt for uniqueness)
 * @returns CryptoKey for AES-GCM encryption/decryption
 */
export async function deriveJournalKey(
  password: string,
  email: string
): Promise<CryptoKey> {
  // Check if crypto.subtle is available (requires secure context)
  if (!crypto.subtle) {
    throw new Error(
      "Web Crypto API not available. Encryption requires HTTPS."
    );
  }

  // Create deterministic salt from email
  const salt = new TextEncoder().encode(SALT_PREFIX + email.toLowerCase());

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  // Derive AES-GCM key
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: KEY_LENGTH },
    false, // Not extractable
    ["encrypt", "decrypt"]
  );

  return key;
}

// =============================================================================
// ENCRYPTION / DECRYPTION
// =============================================================================

export interface EncryptedData {
  encrypted: string; // Base64 encoded ciphertext
  iv: string;        // Base64 encoded IV
}

/**
 * Encrypt journal content using AES-GCM.
 * Generates a random IV for each encryption.
 * 
 * @param key - CryptoKey from deriveJournalKey
 * @param plaintext - Journal content to encrypt
 * @returns Object with encrypted content and IV (both base64)
 */
export async function encryptJournal(
  key: CryptoKey,
  plaintext: string
): Promise<EncryptedData> {
  // Generate random IV (12 bytes for AES-GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  return {
    encrypted: bufferToBase64(ciphertext),
    iv: bufferToBase64(iv),
  };
}

/**
 * Decrypt journal content using AES-GCM.
 * 
 * @param key - CryptoKey from deriveJournalKey
 * @param encrypted - Base64 encoded ciphertext
 * @param iv - Base64 encoded IV
 * @returns Decrypted plaintext
 * @throws OperationError if decryption fails (wrong key or corrupted data)
 */
export async function decryptJournal(
  key: CryptoKey,
  encrypted: string,
  iv: string
): Promise<string> {
  const ciphertext = base64ToBuffer(encrypted);
  const ivBytes = base64ToBuffer(iv);

  // Create proper ArrayBuffer from Uint8Array for crypto.subtle
  // This is needed because TypeScript is strict about ArrayBufferLike vs ArrayBuffer
  const ciphertextBuffer = ciphertext.buffer.slice(
    ciphertext.byteOffset,
    ciphertext.byteOffset + ciphertext.byteLength
  ) as ArrayBuffer;

  const ivBuffer = ivBytes.buffer.slice(
    ivBytes.byteOffset,
    ivBytes.byteOffset + ivBytes.byteLength
  ) as ArrayBuffer;

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBuffer },
    key,
    ciphertextBuffer
  );

  return new TextDecoder().decode(decrypted);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if Web Crypto API is available (requires secure context).
 */
export function isCryptoAvailable(): boolean {
  return typeof crypto !== "undefined" && crypto.subtle !== undefined;
}

/**
 * Validate that a key can be used for encryption.
 * Useful for testing key validity after derivation.
 */
export async function validateKey(key: CryptoKey): Promise<boolean> {
  try {
    const testData = "rhythme_key_validation_test";
    const { encrypted, iv } = await encryptJournal(key, testData);
    const decrypted = await decryptJournal(key, encrypted, iv);
    return decrypted === testData;
  } catch {
    return false;
  }
}

// =============================================================================
// PASSPHRASE FUNCTIONS (for OAuth users)
// =============================================================================

const VALIDATION_PHRASE = "rhythme_encryption_v1";

/**
 * Derive a CryptoKey from a user-set passphrase.
 * Used for OAuth users who don't have a password.
 * 
 * @param passphrase - User-set encryption passphrase
 * @param userId - User's unique ID (used as salt)
 * @returns CryptoKey for AES-GCM encryption/decryption
 */
export async function deriveFromPassphrase(
  passphrase: string,
  userId: string
): Promise<CryptoKey> {
  if (!crypto.subtle) {
    throw new Error("Web Crypto API not available. Encryption requires HTTPS.");
  }

  const salt = new TextEncoder().encode(SALT_PREFIX + userId);
  
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );

  return key;
}

/**
 * Generate a validation token from a key.
 * This token is stored in the database to verify the passphrase later.
 * 
 * @param key - CryptoKey to generate token for
 * @returns Base64 encoded validation token (encrypted + iv combined)
 */
export async function generateValidationToken(key: CryptoKey): Promise<string> {
  const { encrypted, iv } = await encryptJournal(key, VALIDATION_PHRASE);
  // Combine iv and encrypted content with a separator
  return `${iv}:${encrypted}`;
}

/**
 * Verify a passphrase by checking if it produces the correct validation token.
 * 
 * @param key - CryptoKey derived from passphrase
 * @param token - Validation token from database
 * @returns true if passphrase is correct
 */
export async function verifyValidationToken(
  key: CryptoKey,
  token: string
): Promise<boolean> {
  try {
    const [iv, encrypted] = token.split(":");
    if (!iv || !encrypted) return false;
    
    const decrypted = await decryptJournal(key, encrypted, iv);
    return decrypted === VALIDATION_PHRASE;
  } catch {
    return false;
  }
}
