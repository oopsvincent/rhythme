// app/(dashboard)/settings/security/_components/security-section.tsx
// Security settings with flat design

"use client"

import { Button } from "@/components/ui/button"
import { 
  Key,
  Smartphone,
  Monitor,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { SessionInfo } from "@/components/settings/session-info"
import { ChangePassphraseSection } from "./change-passphrase-section"
import { changePasswordWithVerification, checkUserAuthType } from "@/app/actions/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"

export default function SecuritySection({ userId }: { userId: string }) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const [hasPassword, setHasPassword] = useState(true)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  useEffect(() => {
    if (isPasswordModalOpen) {
      checkUserAuthType()
        .then((res) => {
          setHasPassword(res.hasPassword)
        })
        .finally(() => {
          setIsLoadingAuth(false)
        })
    }
  }, [isPasswordModalOpen])

  const handlePasswordUpdate = async () => {
    if (hasPassword && !oldPassword) {
      toast.error("Current password is required")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsUpdatingPassword(true)
    const result = await changePasswordWithVerification(oldPassword, newPassword)
    setIsUpdatingPassword(false)

    if (result.success) {
      toast.success("Password updated successfully")
      setIsPasswordModalOpen(false)
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setHasPassword(true)
    } else {
      toast.error(result.error || "Failed to update password")
    }
  }

  const handleComingSoon = (feature: string) => {
    toast.info(`${feature} - Coming Soon!`, {
      description: "This feature will be available in a future update.",
    })
  }

  return (
    <div className="space-y-8">
      {/* Password Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">Password</h3>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
          <div>
            <p className="font-medium text-sm">Change Password</p>
            <p className="text-xs text-muted-foreground">
              Ensure your account is using a long, random password to stay secure.
            </p>
          </div>
          
          <Dialog open={isPasswordModalOpen} onOpenChange={(open) => { 
            setIsPasswordModalOpen(open); 
            if (!open) { 
              setOldPassword(""); 
              setNewPassword(""); 
              setConfirmPassword(""); 
            } 
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Password</DialogTitle>
                <DialogDescription>
                  Enter your new password below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                {isLoadingAuth ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    {hasPassword && (
                      <div className="space-y-2">
                        <Label htmlFor="old-password">Current Password</Label>
                        <Input 
                          id="old-password" 
                          type="password" 
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Enter current password"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                      />
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsPasswordModalOpen(false)}>Cancel</Button>
                <Button onClick={handlePasswordUpdate} disabled={isUpdatingPassword}>
                  {isUpdatingPassword ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Update Password
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Divider */}
      <div className="border-b border-border/50" />

      {/* Journal Encryption Passphrase */}
      <ChangePassphraseSection userId={userId} />

      {/* Divider */}
      <div className="border-b border-border/50" />

      {/* Two-Factor Authentication */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Two-Factor Authentication</h3>
          </div>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            Coming Soon
          </span>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/30 opacity-60">
          <div>
            <p className="font-medium text-sm">2FA Status</p>
            <p className="text-xs text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            disabled
            onClick={() => handleComingSoon("Enable MFA")}
          >
            Enable
          </Button>
        </div>
      </section>

      {/* Divider */}
      <div className="border-b border-border/50" />

      {/* Active Sessions */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">Active Sessions</h3>
        </div>
        
        <SessionInfo />

        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-destructive hover:text-destructive" 
            onClick={() => handleComingSoon("Sign out all devices")}
          >
            Sign out of all other sessions
          </Button>
        </div>
      </section>
    </div>
  )
}
