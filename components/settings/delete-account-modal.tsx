"use client"

import { useState } from "react"
import { deleteAccount } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function DeleteAccountModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return

    setIsDeleting(true)
    
    // Call server action
    const result = await deleteAccount()
    
    if (!result.success) {
      toast.error(result.error || "Failed to delete account")
      setIsDeleting(false)
    } else {
      // Redirect happens in server action usually, but if we get here:
      toast.success("Account deleted. Redirecting...")
      // Optional: Client side redirect fallback
      window.location.href = "/login"
    }
  }

  const resetModal = () => {
    setIsOpen(false)
    setStep(1)
    setConfirmText("")
    setIsDeleting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isDeleting && open ? setIsOpen(true) : resetModal()}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-destructive/20">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Delete Account</DialogTitle>
          </div>
          <DialogDescription>
            {step === 1 
              ? "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
              : "Are you absolutely sure? This action is irreversible."
            }
          </DialogDescription>
        </DialogHeader>

        {step === 2 && (
          <div className="space-y-3 py-2">
            <Label htmlFor="confirm-delete" className="text-muted-foreground font-normal">
              Type <span className="font-bold text-foreground">DELETE</span> to confirm.
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="border-destructive/30 focus-visible:ring-destructive/30"
            />
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={resetModal}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          
          {step === 1 ? (
            <Button
              variant="destructive"
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={confirmText !== "DELETE" || isDeleting}
              className="gap-2"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete Account
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
