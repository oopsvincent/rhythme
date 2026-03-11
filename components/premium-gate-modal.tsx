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
import { Crown, Sparkles, Lock, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export type PremiumGateReason = "journal" | "task" | "habit"

const GATE_CONFIG: Record<PremiumGateReason, {
  title: string
  description: string
  limit: string
  icon: React.ElementType
}> = {
  journal: {
    title: "Journal Limit Reached",
    description: "Free users can create 1 journal entry per day.",
    limit: "1 journal/day",
    icon: Lock,
  },
  task: {
    title: "Task Limit Reached",
    description: "Free users can create up to 10 tasks per day.",
    limit: "10 tasks/day",
    icon: Zap,
  },
  habit: {
    title: "Habit Limit Reached",
    description: "Free users can track up to 5 habits.",
    limit: "5 habits total",
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
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader className="space-y-4">
          {/* Icon with glow */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30"
          >
            <Icon className="h-8 w-8 text-amber-500" />
          </motion.div>

          <DialogTitle className="text-center text-xl font-semibold">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {/* Limit indicator */}
        <div className="my-4 p-4 rounded-xl bg-muted/50 border border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Free plan limit</span>
            <span className="text-sm font-semibold text-foreground">{config.limit}</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground text-center">
            You&apos;ve reached your limit for today
          </p>
        </div>

        {/* Premium perks */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            With Premium you get
          </p>
          <div className="grid gap-1.5">
            {["Unlimited journals every day", "Unlimited tasks", "Unlimited habits", "Custom themes & more"].map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-sm">
                <Crown className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="text-muted-foreground">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-col">
          <Button
            className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25"
            onClick={() => {
              onOpenChange(false)
              router.push("/settings/subscription")
            }}
          >
            <Crown className="h-4 w-4" />
            Upgrade to Premium
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => onOpenChange(false)}
          >
            Maybe later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
