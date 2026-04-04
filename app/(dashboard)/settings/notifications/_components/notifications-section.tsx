"use client"

import { useState, useEffect } from "react"
import { Mail, Smartphone, Info, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function NotificationsSection() {
  const [isPushEnabled, setIsPushEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkSubscription()
  }, [])

  const checkSubscription = async () => {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setIsLoading(false)
        return
      }

      const registration = await navigator.serviceWorker.getRegistration('/sw.js')
      if (registration) {
        const subscription = await registration.pushManager.getSubscription()
        setIsPushEnabled(!!subscription)
      }
    } catch (error) {
      console.error("Failed to check subscription status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePushNotifications = async (checked: boolean) => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      toast.error("Push notifications are not supported in your browser.")
      return
    }

    setIsLoading(true)

    try {
      if (checked) {
        // Request & Enable
        let permission = Notification.permission
        if (permission === 'default' || permission === 'denied') {
           permission = await Notification.requestPermission()
        }

        if (permission !== "granted") {
          toast.error("You need to allow notifications in your browser settings to enable this.")
          setIsLoading(false)
          return
        }

        const registration = await navigator.serviceWorker.register('/sw.js')
        let subscription = await registration.pushManager.getSubscription()

        if (!subscription) {
          const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
          if (!publicVapidKey) throw new Error("VAPID public key is missing")

          const padding = '='.repeat((4 - (publicVapidKey.length % 4)) % 4)
          const base64 = (publicVapidKey + padding).replace(/\-/g, '+').replace(/_/g, '/')
          const rawData = window.atob(base64)
          const outputArray = new Uint8Array(rawData.length)
          for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i)
          }

          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: outputArray,
          })
        }

        const response = await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription)
        })

        if (!response.ok) throw new Error("Failed to save push subscription on server")

        setIsPushEnabled(true)
        toast.success("Push notifications enabled successfully!")
      } else {
        // Disable & Unsubscribe
        const registration = await navigator.serviceWorker.getRegistration('/sw.js')
        if (registration) {
          const subscription = await registration.pushManager.getSubscription()
          if (subscription) {
            await subscription.unsubscribe()

            // Remove from backend
            await fetch('/api/notifications/subscribe', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ endpoint: subscription.endpoint })
            })
          }
        }
        setIsPushEnabled(false)
        toast.info("Push notifications have been disabled.")
      }
    } catch (error) {
      console.error("Push toggle error:", error)
      toast.error("Could not change notification settings.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleComingSoon = () => {
    toast.info("Notifications - Coming Soon!", {
      description: "This feature will be available in a future update.",
    })
  }

  return (
    <div className="space-y-8">
      {/* Coming Soon Notice */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <Info className="h-4 w-4 text-primary mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Email preferences and fine-grained controls are coming soon. For now, you can toggle browser push alerts.
        </p>
      </div>

      {/* Push Notifications */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Push Notifications</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-card border shadow-sm">
            <div>
              <Label className="font-medium text-sm">Browser Alerts</Label>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 pr-8">
                Receive important reminders, goal milestones, and task due dates directly on this device.
              </p>
            </div>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground shrink-0" />
            ) : (
              <Switch checked={isPushEnabled} onCheckedChange={togglePushNotifications} className="shrink-0" />
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-b border-border/50" />

      {/* Email Notifications */}
      <section className="space-y-4 opacity-60">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">Email Notifications</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/30">
            <div>
              <Label className="font-medium text-sm">Weekly Progress Report</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Get a summary of your habits and tasks every week
              </p>
            </div>
            <Switch disabled onClick={handleComingSoon} />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/30">
            <div>
              <Label className="font-medium text-sm">Product Updates</Label>
              <p className="text-xs text-muted-foreground mt-1">
                New features and improvements
              </p>
            </div>
            <Switch disabled onClick={handleComingSoon} />
          </div>
        </div>
      </section>
    </div>
  )
}
