// app/settings/layout.tsx
"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useEffect, useState } from "react"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Dialog 
      open={true} 
      onOpenChange={(open) => {
        if (!open) {
          // Go back to dashboard when closing
          router.push('/dashboard')
        }
      }}
    >
      <DialogContent className="overflow-hidden p-0 md:max-h-[600px] md:max-w-[900px] max-w-[95vw]">
        {children}
      </DialogContent>
    </Dialog>
  )
}