// app/onboarding/_components/NotificationsStep.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Smartphone, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface NotificationsStepProps {
  notificationsEnabled: boolean
  onNotificationsEnabledChange: (v: boolean) => void
  onContinue: () => void
  onBack: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function NotificationsStep({
  notificationsEnabled,
  onNotificationsEnabledChange,
  onContinue,
  onBack,
}: NotificationsStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async (checked: boolean) => {
    onNotificationsEnabledChange(checked)
    if (!checked) return

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      toast.error('Push notifications are not supported in your browser.')
      onNotificationsEnabledChange(false)
      return
    }

    setIsLoading(true)
    try {
      let permission = Notification.permission
      if (permission === 'default' || permission === 'denied') {
        permission = await Notification.requestPermission()
      }

      if (permission !== 'granted') {
        toast.error('You need to allow notifications in your browser settings to enable this.')
        onNotificationsEnabledChange(false)
        setIsLoading(false)
        return
      }

      const registration = await navigator.serviceWorker.register('/sw.js')
      let subscription = await registration.pushManager.getSubscription()

      if (!subscription) {
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!publicVapidKey) throw new Error('VAPID public key is missing')

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
        body: JSON.stringify(subscription),
      })

      if (!response.ok) throw new Error('Failed to save push subscription on server')

      toast.success('Push notifications enabled successfully!')
    } catch (error) {
      console.error('Push subscription failed:', error)
      toast.error('Failed to enable push notifications.')
      onNotificationsEnabledChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 py-4"
    >
      <div className="space-y-2">
        <motion.h1
          variants={itemVariants}
          className="text-3xl font-normal tracking-tight text-foreground font-serif-display leading-tight"
        >
          Stay on track
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-sm text-muted-foreground"
        >
          Enable notifications so Rhythmé can remind you of your tasks and habits.
        </motion.p>
      </div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-sm gap-4">
          <div className="flex items-start gap-3">
            <Smartphone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <Label className="font-semibold text-sm">Browser Alerts</Label>
              <p className="text-xs text-muted-foreground leading-normal pr-4">
                Receive important reminders, daily goal summaries, and task due dates.
              </p>
            </div>
          </div>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary shrink-0" />
          ) : (
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={handleToggle}
              className="shrink-0"
            />
          )}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div variants={itemVariants} className="space-y-4 pt-2 max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:bg-background/85 max-sm:backdrop-blur-md max-sm:p-4 max-sm:border-t max-sm:border-border/50 max-sm:z-50">
        <Button
          onClick={onContinue}
          className="h-14 w-full rounded-lg text-base font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary/95 focus-visible:ring-offset-0 focus-visible:ring-primary flex items-center justify-center gap-2"
          size="lg"
        >
          Continue
          <ArrowRight className="h-5 w-5" />
        </Button>
        
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 w-full text-center text-[10px] tracking-widest text-muted-foreground transition-colors hover:text-primary uppercase py-2 max-sm:hidden"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
      </motion.div>
      
      <motion.div variants={itemVariants} className="sm:hidden flex justify-center">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 text-[10px] tracking-widest text-muted-foreground transition-colors hover:text-primary uppercase py-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
      </motion.div>
    </motion.div>
  )
}
