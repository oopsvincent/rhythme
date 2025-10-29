// app/settings/privacy/page.tsx
import { SettingsShell } from "@/components/setting-shell"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function PrivacyPage() {
  return (
    <SettingsShell section="privacy">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label className="text-base">Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  Make your profile public
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label className="text-base">Activity Status</Label>
                <p className="text-sm text-muted-foreground">
                  Show when you&apos;re online
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </SettingsShell>
  )
}