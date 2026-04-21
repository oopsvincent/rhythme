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
import { AlertTriangle, Loader2, Trash2, HeartCrack, Flame } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const STEPS = [
  {
    icon: HeartCrack,
    title: "Wait, you're leaving us?",
    description:
      "We thought we had something special... All your habits, journals, and focus sessions will vanish like your motivation on a Monday morning.",
    buttonText: "I'm sure, keep going",
  },
  {
    icon: AlertTriangle,
    title: "Okay, this is getting serious",
    description:
      "Your streaks, your progress, that one really good journal entry from 3am — all gone. Even your data will ghost you. Are you REALLY sure?",
    buttonText: "Yes, I've made peace with it",
  },
  {
    icon: Flame,
    title: "Last chance. No take-backs.",
    description:
      "Type DELETE below to confirm you're breaking up with Rhythmé. We won't send a sad playlist, but we'll think about it.",
    buttonText: "Delete my account forever",
  },
]

export function DeleteAccountModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const currentStep = STEPS[step]
  const StepIcon = currentStep.icon

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return

    setIsDeleting(true)

    const result = await deleteAccount()

    if (!result.success) {
      toast.error(result.error || "Failed to delete account")
      setIsDeleting(false)
    } else {
      toast.success("Account deleted. It's not you, it's... well, goodbye. 👋")
      window.location.href =
        process.env.NEXT_PUBLIC_ACCOUNTS_URL || "https://accounts.amplecen.com"
    }
  }

  const resetModal = () => {
    setIsOpen(false)
    setStep(0)
    setConfirmText("")
    setIsDeleting(false)
  }

  const handleNext = () => {
    if (step < 2) {
      setStep((s) => s + 1)
    }
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
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <StepIcon className="h-7 w-7 text-destructive" />
          </div>
          <DialogTitle className="text-center">{currentStep.title}</DialogTitle>
          <DialogDescription className="text-center">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex justify-center gap-1.5 py-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? "w-6 bg-destructive" : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>

        {step === 2 && (
          <div className="space-y-3 py-2">
            <Label htmlFor="confirm-delete" className="text-muted-foreground font-normal">
              Type <span className="font-bold text-foreground">DELETE</span> to confirm. No going back after this.
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder="DELETE"
              className="border-destructive/30 focus-visible:ring-destructive/30 text-center font-mono tracking-widest"
              disabled={isDeleting}
            />
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={resetModal}
            disabled={isDeleting}
          >
            {step === 0 ? "Never mind, I'll stay" : "Cancel"}
          </Button>

          {step < 2 ? (
            <Button
              variant="destructive"
              onClick={handleNext}
            >
              {currentStep.buttonText}
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={confirmText !== "DELETE" || isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                currentStep.buttonText
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
