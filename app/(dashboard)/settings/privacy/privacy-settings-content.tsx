// app/(dashboard)/settings/privacy/privacy-settings-content.tsx
"use client"

import { useState } from "react"
import { updatePrivacySettings } from "@/app/actions/settings"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Lock, 
  Eye, 
  Activity,
  Shield,
  CheckCircle2,
  Loader2,
  AlertTriangle
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface PrivacySettingsContentProps {
  initialData: {
    profileVisible: boolean
    showActivityStatus: boolean
  }
}

export function PrivacySettingsContent({ initialData }: PrivacySettingsContentProps) {
  const [profileVisible, setProfileVisible] = useState(initialData.profileVisible)
  const [showActivityStatus, setShowActivityStatus] = useState(initialData.showActivityStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const [success, setSuccess] = useState(false)

  const hasChanges = 
    profileVisible !== initialData.profileVisible ||
    showActivityStatus !== initialData.showActivityStatus

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setSuccess(false)
    
    const formData = new FormData()
    if (profileVisible) formData.append("profileVisible", "on")
    if (showActivityStatus) formData.append("showActivityStatus", "on")
    
    const result = await updatePrivacySettings(formData)
    
    setIsUpdating(false)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Privacy Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Control who can see your profile and activity.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Visibility */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="profile-visible" className="text-base font-medium cursor-pointer">
                Profile Visibility
              </Label>
              <p className="text-sm text-muted-foreground">
                When enabled, other users can view your profile and progress.
              </p>
            </div>
          </div>
          <Switch
            id="profile-visible"
            checked={profileVisible}
            onCheckedChange={setProfileVisible}
          />
        </div>

        {/* Activity Status */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-accent/10">
              <Activity className="h-5 w-5 text-accent" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="activity-status" className="text-base font-medium cursor-pointer">
                Activity Status
              </Label>
              <p className="text-sm text-muted-foreground">
                Show when you&apos;re online or last active to other users.
              </p>
            </div>
          </div>
          <Switch
            id="activity-status"
            checked={showActivityStatus}
            onCheckedChange={setShowActivityStatus}
          />
        </div>
      </div>

      <Separator />

      {/* Data & Security Info */}
      <Card className="border-muted bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Your Data is Secure</p>
              <p className="text-xs text-muted-foreground">
                We never share your personal data with third parties. Your habits, tasks, and progress are encrypted and only visible to you unless you explicitly share them.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone - Coming Soon */}
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-destructive">Danger Zone</p>
              <p className="text-xs text-muted-foreground">
                Account deletion and data export options coming soon.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        disabled={isUpdating || !hasChanges}
        className="gap-2"
      >
        {isUpdating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : success ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Saved!
          </>
        ) : (
          "Save Privacy Settings"
        )}
      </Button>
    </form>
  )
}
