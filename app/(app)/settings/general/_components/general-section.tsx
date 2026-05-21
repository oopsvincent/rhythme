// app/(dashboard)/settings/general/_components/general-section.tsx
// General settings with timezone display

"use client"

import { useState, useEffect } from "react"
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
import { getUserTimezone, getUTCOffsetString } from "@/lib/timezone"

export function GeneralSection() {
  const [timezone, setTimezone] = useState<string>("")
  const [utcOffset, setUtcOffset] = useState<string>("")

  useEffect(() => {
    setTimezone(getUserTimezone())
    setUtcOffset(getUTCOffsetString())
  }, [])

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
        
        <div className="max-w-sm space-y-3">
          {/* Auto-detected timezone display */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-sm font-medium">
              Current timezone:{" "}
              <span className="text-primary">
                {timezone || "Detecting..."}
                {utcOffset && ` (${utcOffset})`}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              Your daily reset happens at 00:00 in your local time.
            </p>
          </div>

          {/* Manual override — coming soon */}
          <div className="opacity-60 pointer-events-none">
            <Select defaultValue="auto" disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Automatic (Browser)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              Manual timezone override coming soon.
            </p>
          </div>
        </div>
      </section>

      {/* Info */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Your timezone is auto-detected from your browser. All daily logs, habits, and insights use your local time for accurate tracking.
        </p>
      </div>
    </div>
  )
}
