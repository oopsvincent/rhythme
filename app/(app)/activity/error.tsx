"use client"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function ActivityError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-[28px] border border-border/60 bg-card/70 p-8 text-center shadow-sm backdrop-blur-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">We couldn&apos;t load your activity.</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {error.message || "Something went wrong while preparing your history view."}
          </p>
          <div className="mt-6 flex justify-center">
            <Button onClick={reset} className="rounded-xl">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
