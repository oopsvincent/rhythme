"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Monitor, Smartphone, Globe, Clock, Laptop } from "lucide-react"

export function SessionInfo() {
  const [deviceInfo, setDeviceInfo] = useState<{
    os: string
    browser: string
    isMobile: boolean
  } | null>(null)

  useEffect(() => {
    // Simple client-side detection
    const ua = navigator.userAgent
    let os = "Unknown OS"
    let browser = "Unknown Browser"
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua)

    if (ua.indexOf("Win") !== -1) os = "Windows"
    if (ua.indexOf("Mac") !== -1) os = "macOS"
    if (ua.indexOf("Linux") !== -1) os = "Linux"
    if (ua.indexOf("Android") !== -1) os = "Android"
    if (ua.indexOf("like Mac") !== -1) os = "iOS"

    if (ua.indexOf("Chrome") !== -1) browser = "Chrome"
    else if (ua.indexOf("Firefox") !== -1) browser = "Firefox"
    else if (ua.indexOf("Safari") !== -1) browser = "Safari"
    else if (ua.indexOf("Edge") !== -1) browser = "Edge"

    setDeviceInfo({ os, browser, isMobile })
  }, [])

  if (!deviceInfo) return null

  const DeviceIcon = deviceInfo.isMobile ? Smartphone : deviceInfo.os === "macOS" || deviceInfo.os === "Windows" ? Laptop : Monitor

  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <DeviceIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm flex items-center gap-2">
                {deviceInfo.os} <span className="text-muted-foreground font-normal">• {deviceInfo.browser}</span>
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Globe className="h-3 w-3" />
                <span>India (Approximate)</span>
                <span className="text-muted-foreground/50">•</span>
                <Clock className="h-3 w-3" />
                <span className="text-green-500 font-medium">Active now</span>
              </p>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold tracking-wider uppercase border border-green-500/20">
            Current
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
