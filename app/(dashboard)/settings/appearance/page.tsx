// app/settings/appearance/page.tsx
import { SettingsShell } from "@/components/setting-shell"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ModeToggle } from "@/components/theme-button"

export default function AppearancePage() {
  return (
    <SettingsShell section="appearance">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Appearance Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <ModeToggle />
            </div>
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </SettingsShell>
  )
}