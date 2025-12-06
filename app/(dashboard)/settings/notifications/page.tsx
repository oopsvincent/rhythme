// app/settings/notifications/page.tsx
import { SettingsShell } from "@/components/setting-shell"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function NotificationsPage() {
  return (
    <SettingsShell section="notifications">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            {/* More switches... */}
          </div>
        </div>
      </div>
    </SettingsShell>
  )
}