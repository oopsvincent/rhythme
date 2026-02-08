"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, AlertCircle, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deriveFromPassphrase,
  generateValidationToken,
  isCryptoAvailable,
} from "@/lib/crypto";
import { saveEncryptionToken } from "@/app/actions/encryption";
import { useJournalEncryptionStore } from "@/store/useJournalEncryptionStore";

interface JournalPassphraseSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onSuccess?: () => void;
}

export function JournalPassphraseSetup({
  open,
  onOpenChange,
  userId,
  onSuccess,
}: JournalPassphraseSetupProps) {
  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setKey = useJournalEncryptionStore((s) => s.setKey);

  const handleSetup = useCallback(async () => {
    // Validate
    if (passphrase.length < 8) {
      setError("Passphrase must be at least 8 characters");
      return;
    }

    if (passphrase !== confirmPassphrase) {
      setError("Passphrases do not match");
      return;
    }

    if (!isCryptoAvailable()) {
      setError("Encryption requires HTTPS. Please use a secure connection.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Derive key from passphrase
      const key = await deriveFromPassphrase(passphrase, userId);

      // Generate validation token
      const token = await generateValidationToken(key);

      // Save token to database
      const result = await saveEncryptionToken(token);

      if (!result.success) {
        throw new Error(result.error || "Failed to save encryption setup");
      }

      // Store key in memory
      setKey(key);

      // Clear fields
      setPassphrase("");
      setConfirmPassphrase("");

      // Close modal and notify success
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error("Passphrase setup failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to set up encryption"
      );
    } finally {
      setIsLoading(false);
    }
  }, [passphrase, confirmPassphrase, userId, setKey, onOpenChange, onSuccess]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="mx-4 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
        >
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-primary text-xl font-bold">
                Set Up Journal Encryption
              </h2>
              <p className="text-sm text-muted-foreground">
                Create a passphrase to encrypt your journals
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="mb-6 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            <p className="mb-2 flex items-start gap-2">
              <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              Your journals will be encrypted before leaving your device.
            </p>
            <p className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
              <span>
                <strong>Important:</strong> If you forget this passphrase, your
                encrypted journals cannot be recovered.
              </span>
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="passphrase">Encryption Passphrase</Label>
              <div className="relative mt-1.5">
                <Input
                  id="passphrase"
                  type={showPassphrase ? "text" : "password"}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter a strong passphrase"
                  className="pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassphrase ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passphrase.length > 0 && passphrase.length < 8 && (
                <p className="mt-1 text-xs text-orange-500">
                  Must be at least 8 characters
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassphrase">Confirm Passphrase</Label>
              <Input
                id="confirmPassphrase"
                type={showPassphrase ? "text" : "password"}
                value={confirmPassphrase}
                onChange={(e) => setConfirmPassphrase(e.target.value)}
                placeholder="Confirm your passphrase"
                className="mt-1.5"
                disabled={isLoading}
              />
              {confirmPassphrase.length > 0 &&
                passphrase !== confirmPassphrase && (
                  <p className="mt-1 text-xs text-red-500">
                    Passphrases do not match
                  </p>
                )}
              {confirmPassphrase.length > 0 &&
                passphrase === confirmPassphrase &&
                passphrase.length >= 8 && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-green-500">
                    <Check className="h-3 w-3" /> Passphrases match
                  </p>
                )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSetup}
              disabled={
                isLoading ||
                passphrase.length < 8 ||
                passphrase !== confirmPassphrase
              }
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="mr-2 h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent"
                  />
                  Setting up...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Enable Encryption
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
