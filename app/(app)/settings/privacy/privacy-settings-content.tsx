// app/(dashboard)/settings/privacy/privacy-settings-content.tsx
"use client"

import { 
  Lock, 
  Shield,
  AlertTriangle
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function PrivacySettingsContent() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Privacy Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Your data privacy and security information.
        </p>
      </div>

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
    </div>
  )
}
