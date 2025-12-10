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
  Monitor
} from "lucide-react"

export default function SecuritySettingsContent() {
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
                Last changed: Never
              </p>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Two-Factor Authentication */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-muted-foreground" />
          Two-Factor Authentication
        </h4>
        <Card className="border-muted">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">2FA Status</p>
              <p className="text-xs text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline" size="sm">
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
        <Card className="border-muted">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Current Session</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Active now
                  </p>
                </div>
              </div>
              <span className="text-xs text-green-500 font-medium">Active</span>
            </div>
          </CardContent>
        </Card>
        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
          Sign out of all other sessions
        </Button>
      </div>

      {/* Coming Soon Notice */}
      <Card className="border-muted bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-sm">Security Features Coming Soon</p>
              <p className="text-xs text-muted-foreground">
                Password changes, 2FA, and session management will be available in a future update.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
