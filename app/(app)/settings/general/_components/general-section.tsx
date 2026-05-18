// app/(dashboard)/settings/general/_components/general-section.tsx
// General settings with flat design

"use client"

import { Globe, Clock, Info } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export function GeneralSection() {
  const handleComingSoon = () => {
    toast.info("This setting is coming soon!", {
      description: "We're working on making this configurable.",
    })
  }

  return (
    <div className="space-y-8">
      {/* Language */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">Language</h3>
        </div>
        
        <div className="max-w-sm">
          <Select defaultValue="en" onValueChange={handleComingSoon}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es" disabled>Spanish (Coming soon)</SelectItem>
              <SelectItem value="fr" disabled>French (Coming soon)</SelectItem>
              <SelectItem value="de" disabled>German (Coming soon)</SelectItem>
              <SelectItem value="ja" disabled>Japanese (Coming soon)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            More languages will be available in future updates.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="border-b border-border/50" />

      {/* Timezone */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">Timezone</h3>
        </div>
        
        <div className="max-w-sm">
          <Select defaultValue="auto" onValueChange={handleComingSoon}>
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Automatic (Browser)</SelectItem>
              <SelectItem value="utc">UTC</SelectItem>
              <SelectItem value="est">Eastern Time (ET)</SelectItem>
              <SelectItem value="pst">Pacific Time (PT)</SelectItem>
              <SelectItem value="ist">India Standard Time (IST)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            Used for scheduling reminders and displaying times.
          </p>
        </div>
      </section>

      {/* Info */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Additional preferences like date format and week start day will be added soon.
        </p>
      </div>
    </div>
  )
}
