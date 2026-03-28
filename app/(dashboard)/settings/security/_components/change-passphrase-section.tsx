"use client";

/**
 * =============================================================================
 * CHANGE JOURNAL PASSPHRASE SECTION
 * =============================================================================
 *
 * Multi-step flow for updating the journal encryption passphrase:
 * Step 1: Verify current passphrase
 * Step 2: Enter new passphrase
 * Step 3: Re-encrypt all journals (progress indicator)
 *
 * Security:
 * - All decryption/re-encryption happens client-side
 * - Old passphrase is verified against stored validation token
 * - Batch update ensures atomicity on the server
 * =============================================================================
 */

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import {
  deriveFromPassphrase,
  verifyValidationToken,
  generateValidationToken,
  encryptJournal,
  decryptJournal,
  isCryptoAvailable,
} from "@/lib/crypto";
import {
  getEncryptionToken,
  reEncryptJournals,
} from "@/app/actions/encryption";
import { getJournals } from "@/app/actions/journals";
import { useJournalEncryptionStore } from "@/store/useJournalEncryptionStore";
import { toast } from "sonner";

interface ChangePassphraseSectionProps {
  userId: string;
}

type Step = "idle" | "verify" | "new-passphrase" | "re-encrypting" | "done";

export function ChangePassphraseSection({
  userId,
}: ChangePassphraseSectionProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("idle");

  // Step 1: verify old passphrase
  const [currentPassphrase, setCurrentPassphrase] = useState("");
  const [showCurrentPassphrase, setShowCurrentPassphrase] = useState(false);

  // Step 2: new passphrase
  const [newPassphrase, setNewPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [showNewPassphrase, setShowNewPassphrase] = useState(false);

  // Shared state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [oldKey, setOldKey] = useState<CryptoKey | null>(null);

  const setEncryptionKey = useJournalEncryptionStore((s) => s.setKey);

  // Reset everything when dialog closes
  useEffect(() => {
    if (!open) {
      setStep("idle");
      setCurrentPassphrase("");
      setNewPassphrase("");
      setConfirmPassphrase("");
      setShowCurrentPassphrase(false);
      setShowNewPassphrase(false);
      setError(null);
      setIsLoading(false);
      setProgress({ current: 0, total: 0 });
      setOldKey(null);
    } else {
      setStep("verify");
    }
  }, [open]);

  // Step 1: Verify current passphrase
  const handleVerify = useCallback(async () => {
    if (!currentPassphrase.trim()) {
      setError("Please enter your current passphrase");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await getEncryptionToken();
      if (!token) {
        setError("No encryption setup found. Please set up encryption first.");
        return;
      }

      const key = await deriveFromPassphrase(currentPassphrase, userId);
      const isValid = await verifyValidationToken(key, token);

      if (!isValid) {
        setError("Incorrect passphrase. Please try again.");
        return;
      }

      // Store the old key for re-encryption
      setOldKey(key);
      setStep("new-passphrase");
    } catch (err) {
      console.error("Verification failed:", err);
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPassphrase, userId]);

  // Step 2 → 3: Validate new passphrase and re-encrypt
  const handleChangePassphrase = useCallback(async () => {
    if (newPassphrase.length < 8) {
      setError("Passphrase must be at least 8 characters");
      return;
    }

    if (newPassphrase !== confirmPassphrase) {
      setError("Passphrases do not match");
      return;
    }

    if (!isCryptoAvailable()) {
      setError("Encryption requires HTTPS. Please use a secure connection.");
      return;
    }

    if (!oldKey) {
      setError("Session expired. Please start over.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setStep("re-encrypting");

    try {
      // Derive new key
      const newKey = await deriveFromPassphrase(newPassphrase, userId);

      // Generate new validation token
      const newToken = await generateValidationToken(newKey);

      // Fetch all journals
      const journals = await getJournals();

      // Filter to encrypted journals only (those with an iv)
      const encryptedJournals = journals.filter((j) => j.iv && j.content);

      if (encryptedJournals.length === 0) {
        // No journals to re-encrypt, just update the token
        const result = await reEncryptJournals([], newToken);
        if (!result.success) {
          throw new Error(result.error || "Failed to update passphrase");
        }

        setEncryptionKey(newKey);
        setStep("done");
        toast.success("Passphrase updated successfully");
        return;
      }

      setProgress({ current: 0, total: encryptedJournals.length });

      // Re-encrypt each journal
      const reEncryptedJournals: {
        journalId: string;
        content: string;
        iv: string;
      }[] = [];

      for (let i = 0; i < encryptedJournals.length; i++) {
        const journal = encryptedJournals[i];

        // Decrypt with old key
        const decrypted = await decryptJournal(
          oldKey,
          journal.content,
          journal.iv!
        );

        // Re-encrypt with new key
        const { encrypted, iv } = await encryptJournal(newKey, decrypted);

        reEncryptedJournals.push({
          journalId: journal.journal_id,
          content: encrypted,
          iv,
        });

        setProgress({ current: i + 1, total: encryptedJournals.length });
      }

      // Batch update on server
      const result = await reEncryptJournals(reEncryptedJournals, newToken);

      if (!result.success) {
        throw new Error(result.error || "Failed to save re-encrypted journals");
      }

      // Update in-memory key
      setEncryptionKey(newKey);
      setStep("done");
      toast.success("Passphrase updated successfully", {
        description: `${encryptedJournals.length} journal${encryptedJournals.length === 1 ? "" : "s"} re-encrypted.`,
      });
    } catch (err) {
      console.error("Re-encryption failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Re-encryption failed. Your journals are unchanged."
      );
      setStep("new-passphrase");
    } finally {
      setIsLoading(false);
    }
  }, [
    newPassphrase,
    confirmPassphrase,
    oldKey,
    userId,
    setEncryptionKey,
  ]);

  const handleKeyDown = (
    e: React.KeyboardEvent,
    action: () => void
  ) => {
    if (e.key === "Enter" && !isLoading) {
      action();
    }
  };

  const progressPercent =
    progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">Journal Encryption</h3>
      </div>

      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
        <div>
          <p className="font-medium text-sm">Change Encryption Passphrase</p>
          <p className="text-xs text-muted-foreground">
            Update the passphrase used to encrypt your journal entries.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" id="change-passphrase-btn">
              Change
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md" onInteractOutside={(e) => step === "re-encrypting" && e.preventDefault()}>
            <DialogHeader>
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                {step === "done" ? (
                  <ShieldCheck className="h-6 w-6 text-primary" />
                ) : (
                  <Lock className="h-6 w-6 text-primary" />
                )}
              </div>
              <DialogTitle className="text-center">
                {step === "verify" && "Verify Current Passphrase"}
                {step === "new-passphrase" && "Set New Passphrase"}
                {step === "re-encrypting" && "Re-encrypting Journals"}
                {step === "done" && "Passphrase Updated"}
              </DialogTitle>
              <DialogDescription className="text-center">
                {step === "verify" &&
                  "Enter your current passphrase to continue."}
                {step === "new-passphrase" &&
                  "Choose a new passphrase for your journals."}
                {step === "re-encrypting" &&
                  "Please wait while your journals are being re-encrypted."}
                {step === "done" &&
                  "Your journals are now encrypted with your new passphrase."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              {/* Error display */}
              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Step 1: Verify current passphrase */}
              {step === "verify" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="current-passphrase">
                      Current Passphrase
                    </Label>
                    <div className="relative">
                      <Input
                        id="current-passphrase"
                        type={showCurrentPassphrase ? "text" : "password"}
                        value={currentPassphrase}
                        onChange={(e) => setCurrentPassphrase(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, handleVerify)}
                        placeholder="Enter your current passphrase"
                        disabled={isLoading}
                        autoFocus
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() =>
                          setShowCurrentPassphrase(!showCurrentPassphrase)
                        }
                      >
                        {showCurrentPassphrase ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleVerify}
                    disabled={isLoading || !currentPassphrase.trim()}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Step 2: New passphrase */}
              {step === "new-passphrase" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="new-passphrase">New Passphrase</Label>
                    <div className="relative">
                      <Input
                        id="new-passphrase"
                        type={showNewPassphrase ? "text" : "password"}
                        value={newPassphrase}
                        onChange={(e) => setNewPassphrase(e.target.value)}
                        placeholder="Enter a strong passphrase"
                        disabled={isLoading}
                        autoFocus
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() =>
                          setShowNewPassphrase(!showNewPassphrase)
                        }
                      >
                        {showNewPassphrase ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {newPassphrase.length > 0 && newPassphrase.length < 8 && (
                      <p className="text-xs text-orange-500">
                        Must be at least 8 characters
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-new-passphrase">
                      Confirm New Passphrase
                    </Label>
                    <Input
                      id="confirm-new-passphrase"
                      type={showNewPassphrase ? "text" : "password"}
                      value={confirmPassphrase}
                      onChange={(e) => setConfirmPassphrase(e.target.value)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, handleChangePassphrase)
                      }
                      placeholder="Confirm your new passphrase"
                      disabled={isLoading}
                    />
                    {confirmPassphrase.length > 0 &&
                      newPassphrase !== confirmPassphrase && (
                        <p className="text-xs text-red-500">
                          Passphrases do not match
                        </p>
                      )}
                    {confirmPassphrase.length > 0 &&
                      newPassphrase === confirmPassphrase &&
                      newPassphrase.length >= 8 && (
                        <p className="flex items-center gap-1 text-xs text-green-500">
                          <Check className="h-3 w-3" /> Passphrases match
                        </p>
                      )}
                  </div>

                  <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-orange-500" />
                      <span>
                        <strong>Important:</strong> All your existing journals
                        will be re-encrypted with the new passphrase. This may
                        take a moment.
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setStep("verify");
                        setNewPassphrase("");
                        setConfirmPassphrase("");
                        setError(null);
                      }}
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleChangePassphrase}
                      disabled={
                        isLoading ||
                        newPassphrase.length < 8 ||
                        newPassphrase !== confirmPassphrase
                      }
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Update Passphrase
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}

              {/* Step 3: Re-encrypting progress */}
              {step === "re-encrypting" && (
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm font-medium">
                      Re-encrypting journals...
                    </span>
                  </div>

                  {progress.total > 0 && (
                    <div className="space-y-2">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <p className="text-center text-xs text-muted-foreground">
                        {progress.current} of {progress.total} journals
                        re-encrypted
                      </p>
                    </div>
                  )}

                  <p className="text-center text-xs text-muted-foreground">
                    Please don&apos;t close this window.
                  </p>
                </div>
              )}

              {/* Step 4: Done */}
              {step === "done" && (
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                      <Check className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Your journals are now encrypted with your new passphrase.
                    Remember to use it next time you unlock your journals.
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    Done
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
