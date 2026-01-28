// app/(dashboard)/settings/security/security-settings-content.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Shield, 
  Key,
  Smartphone,
  Globe,
  AlertCircle,
  Clock,
  Monitor,
  CheckCircle2,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { SessionInfo } from "@/components/settings/session-info"
import { updatePassword } from "@/app/actions/auth"
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
import { useState } from "react"

export default function SecuritySettingsContent() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsUpdatingPassword(true)
    const result = await updatePassword(newPassword)
    setIsUpdatingPassword(false)

    if (result.success) {
      toast.success("Password updated successfully")
      setIsPasswordModalOpen(false)
      setNewPassword("")
      setConfirmPassword("")
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
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Security Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage your account security and login sessions.
        </p>
      </div>

      {/* Password Section */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Key className="h-4 w-4 text-muted-foreground" />
          Password
        </h4>
        <Card className="border-muted">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Change Password</p>
              <p className="text-xs text-muted-foreground">
                Ensure your account is using a long, random password to stay secure.
              </p>
            </div>
            
            <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
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
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
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
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Two-Factor Authentication */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            Two-Factor Authentication
            </h4>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Coming Soon</span>
        </div>
        <Card className="border-muted opacity-60">
          <CardContent className="p-4 flex items-center justify-between">
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
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Active Sessions */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          Active Sessions
        </h4>
        
        <SessionInfo />

        <div className="flex justify-end">
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleComingSoon("Sign out all devices")}>
            Sign out of all other sessions
            </Button>
        </div>
      </div>
    </div>
  )
}

