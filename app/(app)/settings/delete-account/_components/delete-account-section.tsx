// app/(dashboard)/settings/delete-account/_components/delete-account-section.tsx
// Delete account section with confirmation

"use client"

import { AlertTriangle, Trash2, Info } from "lucide-react"
import { DeleteAccountModal } from "@/components/settings/delete-account-modal"

interface DeleteAccountSectionProps {
  userEmail: string
}

export function DeleteAccountSection({ userEmail }: DeleteAccountSectionProps) {
  return (
    <div className="space-y-6">
      {/* Warning */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
        <div className="space-y-1">
          <p className="font-medium text-destructive">This action cannot be undone</p>
          <p className="text-sm text-muted-foreground">
            Deleting your account will permanently remove all your data, including habits, tasks, 
            journal entries, and settings. This action is irreversible.
          </p>
        </div>
      </div>

      {/* What gets deleted */}
      <section className="space-y-3">
        <h3 className="font-medium">What will be deleted:</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive/70" />
            Your profile and account information
          </li>
          <li className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive/70" />
            All habits and tracking history
          </li>
          <li className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive/70" />
            All tasks and progress data
          </li>
          <li className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive/70" />
            All journal entries
          </li>
          <li className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive/70" />
            All preferences and settings
          </li>
          <li className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive/70" />
            Connected social accounts
          </li>
        </ul>
      </section>

      {/* Divider */}
      <div className="border-b border-border/50" />

      {/* Delete Action */}
      <section className="space-y-4">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Account deletion request will be processed within 24 hours. You will receive a confirmation 
            email at <span className="font-medium text-foreground">{userEmail}</span>.
          </p>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
          <div>
            <p className="font-medium text-destructive">Delete Account</p>
            <p className="text-xs text-muted-foreground">
              Permanently remove your account and all data
            </p>
          </div>
          <DeleteAccountModal />
        </div>
      </section>
    </div>
  )
}
