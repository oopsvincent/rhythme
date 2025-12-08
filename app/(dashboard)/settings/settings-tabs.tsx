// app/(dashboard)/settings/settings-tabs.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Paintbrush, Bell, Lock, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  {
    name: "Account",
    href: "/settings/account",
    icon: User,
  },
  {
    name: "Appearance",
    href: "/settings/appearance",
    icon: Paintbrush,
  },
  {
    name: "Notifications",
    href: "/settings/notifications",
    icon: Bell,
  },
  {
    name: "Privacy",
    href: "/settings/privacy",
    icon: Lock,
  },
  {
    name: "Billing",
    href: "/settings/billing",
    icon: CreditCard,
  },
]

export default function SettingsTabs() {
  const pathname = usePathname()

  return (
    <div className="border-b">
      <nav className="flex gap-1 overflow-x-auto pb-px" aria-label="Settings tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          const Icon = tab.icon
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap",
                "hover:bg-muted/50",
                isActive
                  ? "border-b-2 border-primary text-primary bg-muted/30"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
