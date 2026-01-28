// app/(dashboard)/settings/notifications/_components/notifications-section.tsx
// Notifications settings with flat design

"use client"

import { Bell, Mail, Smartphone, Info } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function NotificationsSection() {
  const handleComingSoon = () => {
    toast.info("Notifications - Coming Soon!", {
      description: "This feature will be available in a future update.",
    })
  }

  return (
    <div className="space-y-8">
      {/* Coming Soon Notice */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <Info className="h-4 w-4 text-primary mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Notification preferences are coming soon. Stay tuned for updates!
        </p>
      </div>

      {/* Email Notifications */}
      <section className="space-y-4 opacity-60">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">Email Notifications</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/30">
            <div>
              <Label className="font-medium text-sm">Weekly Progress Report</Label>
              <p className="text-xs text-muted-foreground">
                Get a summary of your habits and tasks every week
              </p>
            </div>
            <Switch disabled onClick={handleComingSoon} />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/30">
            <div>
              <Label className="font-medium text-sm">Goal Milestones</Label>
              <p className="text-xs text-muted-foreground">
                Celebrate when you hit important milestones
              </p>
            </div>
            <Switch disabled onClick={handleComingSoon} />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/30">
            <div>
              <Label className="font-medium text-sm">Product Updates</Label>
              <p className="text-xs text-muted-foreground">
                New features and improvements
              </p>
            </div>
            <Switch disabled onClick={handleComingSoon} />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-b border-border/50" />

      {/* Push Notifications */}
      <section className="space-y-4 opacity-60">
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">Push Notifications</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/30">
            <div>
              <Label className="font-medium text-sm">Habit Reminders</Label>
              <p className="text-xs text-muted-foreground">
                Get reminded to complete your daily habits
              </p>
            </div>
            <Switch disabled onClick={handleComingSoon} />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/30">
            <div>
              <Label className="font-medium text-sm">Task Due Dates</Label>
              <p className="text-xs text-muted-foreground">
                Alerts for upcoming task deadlines
              </p>
            </div>
            <Switch disabled onClick={handleComingSoon} />
          </div>
        </div>
      </section>
    </div>
  )
}
