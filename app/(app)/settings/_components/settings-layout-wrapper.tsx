// app/(dashboard)/settings/_components/settings-layout-wrapper.tsx
// Main layout wrapper with responsive navigation

"use client"

import { usePathname } from "next/navigation"
import { SettingsSidebar } from "./settings-sidebar"
import { SettingsMobileNav } from "./settings-mobile-nav"
import { SettingsMessages } from "../settings-messages"
import { getSectionByPath, getGroupByPath } from "../_config/settings-sections"

interface SettingsLayoutWrapperProps {
  children: React.ReactNode
}

export function SettingsLayoutWrapper({ children }: SettingsLayoutWrapperProps) {
  const pathname = usePathname() ?? ""
  
  const currentSection = getSectionByPath(pathname)
  const currentGroup = getGroupByPath(pathname)

  return (
    <div className="max-w-6xl mx-auto">
      {/* URL-based messages (error/success) */}
      <SettingsMessages />
      
      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <SettingsSidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Mobile Navigation */}
          <SettingsMobileNav />
          
          {/* Content Header - Only show on subsections */}
          {currentSection && (
            <header className="mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{currentGroup?.name}</span>
                <span className="text-border">/</span>
                <span className="text-foreground">{currentSection.name}</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold font-primary">
                {currentSection.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                {currentSection.description}
              </p>
            </header>
          )}
          
          {/* Page Content - No card wrapper for flat design */}
          <div className="space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
