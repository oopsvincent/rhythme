// app/(dashboard)/settings/_components/settings-sidebar.tsx
// Desktop sidebar navigation for settings

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { settingsGroups, type SettingsSection } from "../_config/settings-sections"
import { Crown } from "lucide-react"

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="sticky top-20 space-y-6">
        {settingsGroups.map((group) => (
          <div key={group.id} className="space-y-1">
            {/* Group Header */}
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {group.name}
            </h3>
            
            {/* Section Links */}
            <div className="space-y-0.5">
              {group.sections.map((section) => (
                <SidebarItem
                  key={section.id}
                  section={section}
                  isActive={pathname === section.href}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}

interface SidebarItemProps {
  section: SettingsSection
  isActive: boolean
}

function SidebarItem({ section, isActive }: SidebarItemProps) {
  const Icon = section.icon

  return (
    <Link
      href={section.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
        "group relative",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
      )}
      
      <Icon className={cn(
        "h-4 w-4 shrink-0 transition-colors",
        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
      )} />
      
      <span className="flex-1 truncate">{section.name}</span>
      
      {section.premium && (
        <Crown className="h-3 w-3 text-accent shrink-0" />
      )}
    </Link>
  )
}
