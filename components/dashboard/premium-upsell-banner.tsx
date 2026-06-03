"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, X } from "lucide-react"

export function PremiumUpsellBanner() {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    const isDismissed = localStorage.getItem("rhythme_premium_upsell_dismissed") === "true"
    setDismissed(isDismissed)
  }, [])

  const handleDismiss = () => {
    localStorage.setItem("rhythme_premium_upsell_dismissed", "true")
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div className="bg-primary/[0.03] border border-primary/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left relative pr-10 sm:pr-12 shadow-sm">
      <div className="flex gap-2.5 items-start">
        <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">
            Identify patterns that derail your momentum
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Premium unlocks weekly reviews, advanced behavioral analytics, and unlimited goal tracking.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link href="/settings/subscription">
          <Button size="sm" variant="outline" className="h-9 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all text-xs font-medium bg-background/50">
            Go Premium
          </Button>
        </Link>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss upsell"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
