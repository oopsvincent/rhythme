// app/(dashboard)/settings/_components/settings-mobile-nav.tsx
// Mobile navigation drawer for settings

"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  settingsGroups, 
  getSectionByPath, 
  getGroupByPath,
  type SettingsSection 
} from "../_config/settings-sections"
import { ChevronDown, Crown, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function SettingsMobileNav() {
  const pathname = usePathname() ?? ""
  const [isOpen, setIsOpen] = useState(false)
  
  const currentSection = getSectionByPath(pathname)
  const currentGroup = getGroupByPath(pathname)

  return (
    <div className="lg:hidden mb-6">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            className={cn(
              "w-full flex items-center justify-between",
              "px-4 py-3 rounded-lg",
              "bg-muted/30 border border-border/50",
              "hover:bg-muted/50 transition-colors",
              "group"
            )}
          >
            <div className="flex items-center gap-3">
              {currentSection && (
                <>
                  <currentSection.icon className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-sm">{currentSection.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {currentGroup?.name}
                    </p>
                  </div>
                </>
              )}
            </div>
            <ChevronDown className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          </button>
        </SheetTrigger>

        <SheetContent side="top" className="h-[80vh] overflow-y-auto">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="text-left">Settings</SheetTitle>
          </SheetHeader>

          <nav className="py-4 space-y-6">
            {settingsGroups.map((group) => (
              <div key={group.id} className="space-y-1">
                {/* Group Header */}
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.name}
                </h3>
                
                {/* Section Links */}
                <div className="space-y-0.5">
                  {group.sections.map((section) => (
                    <MobileNavItem
                      key={section.id}
                      section={section}
                      isActive={pathname === section.href}
                      onSelect={() => setIsOpen(false)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

interface MobileNavItemProps {
  section: SettingsSection
  isActive: boolean
  onSelect: () => void
}

function MobileNavItem({ section, isActive, onSelect }: MobileNavItemProps) {
  const Icon = section.icon

  return (
    <Link
      href={section.href}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      <Icon className={cn(
        "h-5 w-5 shrink-0",
        isActive ? "text-primary" : "text-muted-foreground"
      )} />
      
      <span className="flex-1">{section.name}</span>
      
      {section.premium && (
        <Crown className="h-3.5 w-3.5 text-accent shrink-0" />
      )}
      
      {isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      )}
    </Link>
  )
}
