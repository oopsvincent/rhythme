// components/notifications/notification-item.tsx
"use client"

import { cn } from "@/lib/utils"
import type { Notification } from "@/types/database"
import { Bell, Info, AlertTriangle, CheckCircle2 } from "lucide-react"

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return "just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    case "info":
      return <Info className="h-4 w-4 text-blue-500" />
    case "system":
    default:
      return <Bell className="h-4 w-4 text-primary" />
  }
}

import Link from "next/link"

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: number) => void
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.notification_id)
    }
  }

  const className = cn(
    "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
    !notification.is_read && "bg-primary/5"
  )

  const innerContent = (
    <>
      {/* Icon */}
      <div className="mt-0.5 shrink-0">
        {getNotificationIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className={cn(
          "text-sm leading-tight truncate",
          !notification.is_read ? "font-semibold" : "font-medium text-muted-foreground"
        )}>
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
        <p className="text-[11px] text-muted-foreground/70">
          {getRelativeTime(notification.created_at)}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.is_read && (
        <div className="mt-2 shrink-0">
          <div className="h-2 w-2 rounded-full bg-primary" />
        </div>
      )}
    </>
  )

  if (notification.link) {
    return (
      <Link href={notification.link} onClick={handleClick} className={className}>
        {innerContent}
      </Link>
    )
  }

  return (
    <button onClick={handleClick} className={className}>
      {innerContent}
    </button>
  )
}
