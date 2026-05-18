// app/(dashboard)/settings/notifications/notifications-settings-content.tsx
"use client"

import { useState } from "react"
import { updateNotificationPreferences } from "@/app/actions/settings"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Megaphone,
  CheckCircle2,
  Loader2
} from "lucide-react"

interface NotificationsSettingsContentProps {
  initialData: {
    emailNotifications: boolean
    pushNotifications: boolean
    marketingEmails: boolean
  }
}

export default function NotificationsSettingsContent({ initialData }: NotificationsSettingsContentProps) {
  const [emailNotifications, setEmailNotifications] = useState(initialData.emailNotifications)
  const [pushNotifications, setPushNotifications] = useState(initialData.pushNotifications)
  const [marketingEmails, setMarketingEmails] = useState(initialData.marketingEmails)
  const [isUpdating, setIsUpdating] = useState(false)
  const [success, setSuccess] = useState(false)

  const hasChanges = 
    emailNotifications !== initialData.emailNotifications ||
    pushNotifications !== initialData.pushNotifications ||
    marketingEmails !== initialData.marketingEmails

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setSuccess(false)
    
    const formData = new FormData()
    if (emailNotifications) formData.append("emailNotifications", "on")
    if (pushNotifications) formData.append("pushNotifications", "on")
    if (marketingEmails) formData.append("marketingEmails", "on")
    
    const result = await updateNotificationPreferences(formData)
    
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
          <Bell className="h-5 w-5 text-primary" />
          Notification Preferences
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose how you want to be notified about your habits, tasks, and activity.
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email-notifications" className="text-base font-medium cursor-pointer">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive daily summaries, reminders, and important updates via email.
              </p>
            </div>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>

        {/* Push Notifications */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-accent/10">
              <Smartphone className="h-5 w-5 text-accent" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="push-notifications" className="text-base font-medium cursor-pointer">
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Get real-time alerts for habit reminders and task deadlines.
              </p>
            </div>
          </div>
          <Switch
            id="push-notifications"
            checked={pushNotifications}
            onCheckedChange={setPushNotifications}
          />
        </div>

        <Separator />

        {/* Marketing Emails */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-muted">
              <Megaphone className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="marketing-emails" className="text-base font-medium cursor-pointer">
                Marketing & Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive news about new features, tips, and promotional offers.
              </p>
            </div>
          </div>
          <Switch
            id="marketing-emails"
            checked={marketingEmails}
            onCheckedChange={setMarketingEmails}
          />
        </div>
      </div>

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
          "Save Preferences"
        )}
      </Button>
    </form>
  )
}
