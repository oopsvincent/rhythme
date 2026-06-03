"use client"

import { useState, useEffect } from "react"
import { verifyCurrentPassword, checkUserAuthType, setInitialSocialPassword } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, Loader2, Trash2, KeyRound, ArrowRight, ShieldAlert, Key } from "lucide-react"
import { toast } from "sonner"

type AuthFlowState = "checking" | "set_password" | "verify_password" | "confirmation"

export function AccountDeletionModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [flowState, setFlowState] = useState<AuthFlowState>("checking")
  
  // Account details
  const [hasPassword, setHasPassword] = useState(true)
  const [authProvider, setAuthProvider] = useState("")
  const [isLoadingAuthType, setIsLoadingAuthType] = useState(false)

  // Sub-step: Set Password (for social logins)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSettingPassword, setIsSettingPassword] = useState(false)
  const [setPasswordErrorMsg, setSetPasswordErrorMsg] = useState("")

  // Sub-step: Verify Password
  const [password, setPassword] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyPasswordError, setVerifyPasswordError] = useState("")

  // Sub-step: Final Confirmation
  const [confirmText, setConfirmText] = useState("")
  const [acknowledged, setAcknowledledged] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Check auth type when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoadingAuthType(true)
      setFlowState("checking")
      checkUserAuthType()
        .then((res) => {
          setHasPassword(res.hasPassword)
          setAuthProvider(res.provider)
          if (res.hasPassword) {
            setFlowState("verify_password")
          } else {
            setFlowState("set_password")
          }
        })
        .catch((err) => {
          console.error("Error checking auth type:", err)
          setFlowState("verify_password") // Fallback
        })
        .finally(() => {
          setIsLoadingAuthType(false)
        })
    }
  }, [isOpen])

  const resetModal = () => {
    setIsOpen(false)
    setFlowState("checking")
    setNewPassword("")
    setConfirmPassword("")
    setSetPasswordErrorMsg("")
    setPassword("")
    setVerifyPasswordError("")
    setConfirmText("")
    setAcknowledledged(false)
    setIsSettingPassword(false)
    setIsVerifying(false)
    setIsDeleting(false)
  }

  // Handle setting password for social accounts
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSetPasswordErrorMsg("")

    if (!newPassword || !confirmPassword) {
      setSetPasswordErrorMsg("Both password fields are required")
      return
    }

    if (newPassword.length < 6) {
      setSetPasswordErrorMsg("Password must be at least 6 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      setSetPasswordErrorMsg("Passwords do not match")
      return
    }

    setIsSettingPassword(true)

    const result = await setInitialSocialPassword(newPassword)

    setIsSettingPassword(false)

    if (result.success) {
      toast.success("Password successfully configured. Now, please verify it to proceed.")
      setHasPassword(true)
      // Reset input password field to blank and transition to verification
      setPassword("")
      setFlowState("verify_password")
    } else {
      setSetPasswordErrorMsg(result.error || "Failed to set password. Please try again.")
      toast.error(result.error || "Failed to configure password")
    }
  }

  // Handle password verification
  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerifyPasswordError("")

    if (!password) {
      setVerifyPasswordError("Password is required")
      return
    }

    setIsVerifying(true)

    const result = await verifyCurrentPassword(password)

    setIsVerifying(false)

    if (result.success) {
      setFlowState("confirmation")
    } else {
      setVerifyPasswordError(result.error || "Incorrect password. Please try again.")
      toast.error(result.error || "Incorrect password")
    }
  }

  // Handle final account deletion
  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm")
      return
    }
    if (!acknowledged) {
      toast.error("Please acknowledge the terms by ticking the checkbox")
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch("/api/v1/account/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password, // Send the verified password
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Failed to delete account")
        setIsDeleting(false)
        return
      }

      toast.success("Your account and all associated data have been permanently deleted.")
      
      localStorage.clear()
      sessionStorage.clear()

      setTimeout(() => {
        window.location.href = "/login"
      }, 1500)
    } catch (error) {
      console.error("Account deletion error:", error)
      toast.error("Network error. Please check your connection and try again.")
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isDeleting && (open ? setIsOpen(true) : resetModal())}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="gap-2 font-medium shadow-sm hover:shadow-destructive/20 transition-all">
          <Trash2 className="h-4 w-4" />
          Delete My Account
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md border-destructive/20 bg-background/95 backdrop-blur-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            {flowState === "set_password" ? (
              <Key className="h-6 w-6 text-destructive" />
            ) : flowState === "verify_password" ? (
              <KeyRound className="h-6 w-6 text-destructive" />
            ) : (
              <ShieldAlert className="h-6 w-6 text-destructive" />
            )}
          </div>
          <DialogTitle className="text-center font-bold tracking-tight text-xl">
            {flowState === "set_password" && "Configure Account Password"}
            {flowState === "verify_password" && "Verify Your Identity"}
            {flowState === "confirmation" && "Confirm Permanent Deletion"}
            {flowState === "checking" && "Securing Account Deletion"}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-sm">
            {flowState === "set_password" && `Since you log in via ${authProvider || "social login"}, you must set a password first to secure this action.`}
            {flowState === "verify_password" && "Enter your password to verify ownership before initiating deletion."}
            {flowState === "confirmation" && "This is the final step. Review the checklist below before proceeding."}
            {flowState === "checking" && "Loading account configuration details..."}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicators */}
        <div className="flex justify-center gap-1.5 py-1">
          <div className={`h-1 rounded-full transition-all duration-300 ${flowState !== "checking" ? "w-8 bg-destructive" : "w-2 bg-muted"}`} />
          <div className={`h-1 rounded-full transition-all duration-300 ${flowState === "verify_password" || flowState === "confirmation" ? "w-8 bg-destructive" : "w-2 bg-muted"}`} />
          <div className={`h-1 rounded-full transition-all duration-300 ${flowState === "confirmation" ? "w-8 bg-destructive" : "w-2 bg-muted"}`} />
        </div>

        {isLoadingAuthType || flowState === "checking" ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-destructive" />
            <p className="text-sm text-muted-foreground">Checking authentication state...</p>
          </div>
        ) : (
          <>
            {/* STEP: CONFIGURE PASSWORD (OAuth Users only) */}
            {flowState === "set_password" && (
              <form onSubmit={handleSetPassword} className="space-y-4 py-2">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="bg-background/50 focus-visible:ring-destructive/30"
                      disabled={isSettingPassword}
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirm-new-password">Confirm Password</Label>
                    <Input
                      id="confirm-new-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="bg-background/50 focus-visible:ring-destructive/30"
                      disabled={isSettingPassword}
                    />
                  </div>

                  {setPasswordErrorMsg && (
                    <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3" />
                      {setPasswordErrorMsg}
                    </p>
                  )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/20">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resetModal}
                    disabled={isSettingPassword}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isSettingPassword}
                    className="gap-2"
                  >
                    {isSettingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Setting Password...
                      </>
                    ) : (
                      <>
                        Configure Password
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}

            {/* STEP: VERIFY PASSWORD */}
            {flowState === "verify_password" && (
              <form onSubmit={handleVerifyPassword} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Enter Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setVerifyPasswordError("")
                    }}
                    placeholder="Enter your password to verify"
                    className={`bg-background/50 focus-visible:ring-destructive/30 ${verifyPasswordError ? "border-destructive/60" : "border-border/60"}`}
                    disabled={isVerifying}
                    autoFocus
                  />
                  {verifyPasswordError && (
                    <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3" />
                      {verifyPasswordError}
                    </p>
                  )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/20">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resetModal}
                    disabled={isVerifying}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isVerifying}
                    className="gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Password
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}

            {/* STEP: FINAL CONFIRMATION */}
            {flowState === "confirmation" && (
              <div className="space-y-4 py-2">
                <div className="p-3.5 rounded-xl bg-destructive/5 border border-destructive/20 space-y-2 text-xs leading-relaxed text-muted-foreground">
                  <p className="font-semibold text-destructive flex items-center gap-1.5 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    Data Deletion Checklist
                  </p>
                  <ul className="list-disc pl-4 space-y-1 mt-1 text-destructive/90 font-medium">
                    <li>Your profile details & metadata will be deleted.</li>
                    <li>All tracked habits, streaks, and journal logs will be erased.</li>
                    <li>Any active premium subscriptions will be terminated.</li>
                    <li>This action cannot be undone.</li>
                  </ul>
                </div>

                <div className="flex items-start gap-2.5 py-1">
                  <Checkbox
                    id="acknowledge"
                    checked={acknowledged}
                    onCheckedChange={(checked) => setAcknowledledged(checked === true)}
                    className="mt-1 data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
                    disabled={isDeleting}
                  />
                  <label
                    htmlFor="acknowledge"
                    className="text-xs text-muted-foreground cursor-pointer leading-relaxed select-none"
                  >
                    I understand that all my personal data, reflections, and subscriptions will be deleted forever, and there is no way to restore my account.
                  </label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-delete" className="text-xs text-muted-foreground">
                    Type <span className="font-bold text-foreground">DELETE</span> below to confirm:
                  </Label>
                  <Input
                    id="confirm-delete"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                    placeholder="DELETE"
                    className="border-destructive/30 focus-visible:ring-destructive/40 text-center font-mono tracking-widest bg-background/50"
                    disabled={isDeleting}
                    autoComplete="off"
                    autoFocus
                  />
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/20">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      // Allow going back to verify step
                      setFlowState("verify_password")
                    }}
                    disabled={isDeleting}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={confirmText !== "DELETE" || !acknowledged || isDeleting}
                    className="gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Deleting Account...
                      </>
                    ) : (
                      "Delete My Account Forever"
                    )}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
