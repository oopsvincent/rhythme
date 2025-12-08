// hooks/useUrlMessages.ts
"use client"

import { useEffect, useState } from "react"
import { useSearchParams, usePathname } from "next/navigation"

export interface UrlMessage {
  type: "error" | "success" | "info"
  title?: string
  description?: string
}

/**
 * Hook to read messages from URL query params and hash fragments
 * Supports: ?error=..., ?success=..., ?message=..., ?linked=...
 * Also reads from hash: #error=..., #error_description=...
 */
export function useUrlMessages() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [message, setMessage] = useState<UrlMessage | null>(null)

  useEffect(() => {
    if (!searchParams) return

    // Check for success messages (e.g., ?linked=google)
    const linked = searchParams.get("linked")
    if (linked) {
      setMessage({
        type: "success",
        title: "Account Connected",
        description: `Successfully linked your ${linked.charAt(0).toUpperCase() + linked.slice(1)} account.`
      })
      return
    }

    // Check for success param
    const success = searchParams.get("success")
    if (success) {
      setMessage({
        type: "success",
        title: "Success",
        description: success
      })
      return
    }

    // Check for info message
    const infoMsg = searchParams.get("message")
    if (infoMsg) {
      setMessage({
        type: "info",
        description: infoMsg
      })
      return
    }

    // Check for error in query params
    const queryError = searchParams.get("error")
    const queryDescription = searchParams.get("error_description") || searchParams.get("error_code")

    if (queryError || queryDescription) {
      setMessage({
        type: "error",
        title: queryError || "Error",
        description: queryDescription || undefined
      })
      return
    }

    // Check hash fragment for OAuth errors (#error=...)
    if (typeof window !== "undefined") {
      const hash = window.location.hash
      if (hash) {
        const params = new URLSearchParams(hash.substring(1))
        const hashError = params.get("error")
        const hashDescription = params.get("error_description") || params.get("error_code")

        if (hashError || hashDescription) {
          setMessage({
            type: "error",
            title: hashError || "Authentication Error",
            description: hashDescription || undefined
          })
          return
        }
      }
    }

    // No messages found
    setMessage(null)
  }, [searchParams, pathname])

  const clearMessage = () => setMessage(null)

  return { message, clearMessage }
}
