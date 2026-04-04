"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, BellRing } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const PROMPT_STORAGE_KEY = "rhythme.notification_prompt_dismissed"

export function BrowserNotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined" || !("Notification" in window)) return

    // Check if we've already asked or dismissed
    const hasDismissed = localStorage.getItem(PROMPT_STORAGE_KEY) === "true"
    if (hasDismissed) return

    // Check current permission state
    if (Notification.permission === "default") {
      // Delay showing the prompt slightly so it's not immediately aggressively intercepting the user on load
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(PROMPT_STORAGE_KEY, "true")
    setShowPrompt(false)
  }

  const handleEnable = async () => {
    try {
      const permission = await Notification.requestPermission()
      
      localStorage.setItem(PROMPT_STORAGE_KEY, "true")
      setShowPrompt(false)

      if (permission === "granted") {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
           toast.error("Push notifications are not supported in your browser.")
           return
        }

        try {
          // Register service worker if not already registered
          const registration = await navigator.serviceWorker.register('/sw.js')
          
          let subscription = await registration.pushManager.getSubscription()
          
          if (!subscription) {
            const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            if (!publicVapidKey) {
              throw new Error("VAPID public key is missing")
            }

            // Convert VAPID key for PushManager
            const padding = '='.repeat((4 - (publicVapidKey.length % 4)) % 4);
            const base64 = (publicVapidKey + padding).replace(/\-/g, '+').replace(/_/g, '/');
            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);
            for (let i = 0; i < rawData.length; ++i) {
              outputArray[i] = rawData.charCodeAt(i);
            }

            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: outputArray
            })
          }

          // Send subscription to backend
          const response = await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
          })

          if (!response.ok) {
             throw new Error("Failed to save push subscription on server")
          }

          toast.success("Notifications enabled!", {
            description: "You'll now receive updates directly in your browser.",
            icon: <BellRing className="w-4 h-4 text-emerald-500" />
          })
        } catch (err) {
          console.error("Push subscription failed:", err)
          toast.error("Could not complete subscription setup.")
        }
      } else if (permission === "denied") {
        toast.info("Notifications declined", {
          description: "You can enable them later in your browser settings.",
        })
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
    }
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 z-[100] max-w-[calc(100vw-32px)] sm:max-w-sm w-full"
        >
          <div className="relative overflow-hidden bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 border shadow-2xl rounded-2xl p-5 flex flex-col gap-3">
            {/* Background gradient hint */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
            
            <button 
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-muted-foreground/60 hover:text-foreground transition-colors"
              aria-label="Dismiss notification prompt"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <BellRing className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1 pr-6">
                <h3 className="font-semibold leading-none tracking-tight">Stay in your rhythm</h3>
                <p className="text-sm text-muted-foreground leading-snug">
                  Enable browser notifications so you never miss a reminder or an important update.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Button onClick={handleEnable} className="flex-1 font-medium shadow-sm h-10">
                Enable Notifications
              </Button>
              <Button onClick={handleDismiss} variant="outline" className="flex-1 h-10">
                Not Now
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
