// components/ui/url-message-alert.tsx
"use client"

import { useEffect } from "react"
import { useUrlMessages } from "@/hooks/useUrlMessages"
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface UrlMessageAlertProps {
  className?: string
  autoDismiss?: boolean
  autoDismissDelay?: number
}

export function UrlMessageAlert({ 
  className, 
  autoDismiss = true, 
  autoDismissDelay = 5000 
}: UrlMessageAlertProps) {
  const { message, clearMessage } = useUrlMessages()

  useEffect(() => {
    if (message && autoDismiss) {
      const timer = setTimeout(() => {
        clearMessage()
        // Clean up URL params without page reload
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href)
          url.searchParams.delete("error")
          url.searchParams.delete("error_description")
          url.searchParams.delete("error_code")
          url.searchParams.delete("success")
          url.searchParams.delete("message")
          url.searchParams.delete("linked")
          window.history.replaceState({}, "", url.pathname)
        }
      }, autoDismissDelay)
      return () => clearTimeout(timer)
    }
  }, [message, autoDismiss, autoDismissDelay, clearMessage])

  if (!message) return null

  const variants = {
    error: {
      bg: "bg-destructive/10 border-destructive/30",
      text: "text-destructive",
      icon: AlertCircle
    },
    success: {
      bg: "bg-green-500/10 border-green-500/30",
      text: "text-green-600 dark:text-green-400",
      icon: CheckCircle2
    },
    info: {
      bg: "bg-blue-500/10 border-blue-500/30",
      text: "text-blue-600 dark:text-blue-400",
      icon: Info
    }
  }

  const variant = variants[message.type]
  const Icon = variant.icon

  return (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-lg border animate-in fade-in slide-in-from-top-2 duration-300",
      variant.bg,
      className
    )}>
      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", variant.text)} />
      <div className="flex-1 min-w-0">
        {message.title && (
          <p className={cn("font-medium", variant.text)}>{message.title}</p>
        )}
        {message.description && (
          <p className={cn("text-sm mt-0.5", variant.text, "opacity-90")}>
            {message.description}
          </p>
        )}
      </div>
      <button 
        onClick={clearMessage}
        className={cn("p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors", variant.text)}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
