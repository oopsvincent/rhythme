"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Lock, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export type PremiumGateReason = "journal" | "task" | "habit" | "mood" | "weekly"

const GATE_CONFIG: Record<PremiumGateReason, {
  description: string
  icon: React.ElementType
}> = {
  journal: {
    description: "Your reflections deserve space. Premium gives you unlimited entries to capture every insight.",
    icon: Lock,
  },
  task: {
    description: "Big days need room to breathe. Premium means no cap on what you can plan.",
    icon: Zap,
  },
  habit: {
    description: "You're building real momentum. Premium removes the ceiling — track every habit that matters to you.",
    icon: Sparkles,
  },
  mood: {
    description: "Consistent tracking reveals the deepest patterns. Premium unlocks unlimited mood logging.",
    icon: Lock,
  },
  weekly: {
    description: "Weekly reviews are where patterns become clarity. This is a Premium capability.",
    icon: Sparkles,
  },
}

interface PremiumGateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reason: PremiumGateReason
}

export function PremiumGateModal({ open, onOpenChange, reason }: PremiumGateModalProps) {
  const router = useRouter()
  const config = GATE_CONFIG[reason]
  const Icon = config.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader className="space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20"
          >
            <Icon className="h-7 w-7 text-primary" />
          </motion.div>

          <DialogTitle className="text-center text-lg font-semibold">
            You&apos;re ready for more.
          </DialogTitle>
          <DialogDescription className="text-center text-sm leading-relaxed">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-col">
          <Button
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              onOpenChange(false)
              router.push("/settings/subscription")
            }}
          >
            Go Premium
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => onOpenChange(false)}
          >
            Not yet
          </Button>
          <p className="text-[11px] text-muted-foreground/60 text-center mt-1">
            Cancel anytime
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
