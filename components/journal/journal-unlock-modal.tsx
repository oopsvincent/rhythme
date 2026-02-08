"use client";

/**
 * =============================================================================
 * JOURNAL UNLOCK MODAL
 * =============================================================================
 * 
 * All users now use the same passphrase-based encryption approach.
 * This ensures consistent encryption across all login methods.
 * 
 * Security:
 * - Max 5 attempts before forced logout
 * - No passphrase persistence
 * - Loading state during key derivation
 * =============================================================================
 */

import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Key, Eye, EyeOff, ShieldCheck, LogOut } from "lucide-react";
import { 
  deriveFromPassphrase,
  verifyValidationToken,
} from "@/lib/crypto";
import { useJournalEncryptionStore } from "@/store/useJournalEncryptionStore";
import { signOut } from "@/app/actions/auth";

interface JournalUnlockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** User's ID (used for key derivation salt) */
  userId: string;
  /** Validation token from DB */
  validationToken: string;
}

export function JournalUnlockModal({
  open,
  onOpenChange,
  userId,
  validationToken,
}: JournalUnlockModalProps) {
  const [passphrase, setPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    setKey,
    incrementAttempts,
    resetAttempts,
    shouldForceLogout,
    unlockAttempts,
  } = useJournalEncryptionStore();

  // Reset input when modal opens/closes
  useEffect(() => {
    if (!open) {
      setPassphrase("");
      setError(null);
    }
  }, [open]);

  const handleUnlock = useCallback(async () => {
    if (!passphrase.trim()) {
      setError("Please enter your passphrase");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Derive key from passphrase
      const key = await deriveFromPassphrase(passphrase, userId);
      
      // Verify with stored token
      const isValid = await verifyValidationToken(key, validationToken);
      
      if (!isValid) {
        throw new Error("Verification failed");
      }

      // Success - store the key
      setKey(key);
      resetAttempts();
      setPassphrase(""); // Clear from memory
      onOpenChange(false);
    } catch {
      const attempts = incrementAttempts();
      
      if (shouldForceLogout()) {
        setError("Too many failed attempts. Logging out for security.");
        setTimeout(() => {
          signOut();
        }, 2000);
        return;
      }

      const remaining = 5 - attempts;
      setError(
        `Incorrect passphrase. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    passphrase,
    userId,
    validationToken,
    setKey,
    incrementAttempts,
    resetAttempts,
    shouldForceLogout,
    onOpenChange,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleUnlock();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Key className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Unlock Your Journals
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your encryption passphrase to unlock your journals.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="unlock-passphrase">Encryption Passphrase</Label>
            <div className="relative">
              <Input
                id="unlock-passphrase"
                type={showPassphrase ? "text" : "password"}
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your passphrase"
                disabled={isLoading}
                autoFocus
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassphrase(!showPassphrase)}
                disabled={isLoading}
              >
                {showPassphrase ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button
            onClick={handleUnlock}
            disabled={isLoading || !passphrase.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Unlocking...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Unlock Journals
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Sign out instead
            </Button>
          </div>

          {unlockAttempts > 0 && (
            <p className="text-center text-xs text-muted-foreground">
              {5 - unlockAttempts} attempts remaining
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
