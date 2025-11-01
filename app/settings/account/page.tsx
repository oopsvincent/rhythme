// app/settings/account/page.tsx
import { SettingsShell } from "@/components/setting-shell"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AccountSettingsPage() {
  return (
    <SettingsShell section="account">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" placeholder="Your name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" placeholder="Tell us about yourself" />
            </div>
          </div>
        </div>
      </div>
    </SettingsShell>
  )
}