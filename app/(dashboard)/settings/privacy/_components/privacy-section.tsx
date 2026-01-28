// app/(dashboard)/settings/privacy/_components/privacy-section.tsx
// Privacy settings with flat design

"use client"

import { 
  Shield,
  AlertTriangle,
  Info
} from "lucide-react"

export function PrivacySection() {
  return (
    <div className="space-y-8">
      {/* Data & Security Info */}
      <section className="space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
          <Shield className="h-5 w-5 text-primary mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium">Your Data is Secure</p>
            <p className="text-sm text-muted-foreground">
              We never share your personal data with third parties. Your habits, tasks, and progress are encrypted and only visible to you unless you explicitly share them.
            </p>
          </div>
        </div>
      </section>

      {/* What We Collect */}
      <section className="space-y-4">
        <h3 className="font-medium">What we collect</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Account Information</p>
              <p className="text-xs text-muted-foreground">
                Email, display name, and profile picture for authentication.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Usage Data</p>
              <p className="text-xs text-muted-foreground">
                Anonymous analytics to improve the app experience.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Your Content</p>
              <p className="text-xs text-muted-foreground">
                Habits, tasks, journal entries, and preferences you create.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-b border-border/50" />

      {/* Data Export / Deletion - Coming Soon */}
      <section className="space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-amber-600 dark:text-amber-400">Data Controls</p>
            <p className="text-sm text-muted-foreground">
              Data export and deletion options are coming soon. For immediate assistance, please contact support.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
