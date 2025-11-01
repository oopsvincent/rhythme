// components/settings-shell.tsx
"use client"

import * as React from "react"
import {
  Bell,
  Globe,
  Keyboard,
  Lock,
  Paintbrush,
  User,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
  Settings as SettingsIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter, usePathname } from "next/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ScrollArea } from "@/components/ui/scroll-area"

export const settingsSections = [
  { 
    id: "account", 
    name: "Account", 
    icon: User, 
    description: "Manage your account info", 
    path: "/settings/account" 
  },
  { 
    id: "notifications", 
    name: "Notifications", 
    icon: Bell, 
    description: "Control your alerts", 
    path: "/settings/notifications" 
  },
  { 
    id: "appearance", 
    name: "Appearance", 
    icon: Paintbrush, 
    description: "Customize your theme", 
    path: "/settings/appearance" 
  },
  { 
    id: "language", 
    name: "Language & Region", 
    icon: Globe, 
    description: "Set your preferences", 
    path: "/settings/language" 
  },
  { 
    id: "accessibility", 
    name: "Accessibility", 
    icon: Keyboard, 
    description: "Improve usability", 
    path: "/settings/accessibility" 
  },
  { 
    id: "privacy", 
    name: "Privacy", 
    icon: Lock, 
    description: "Control your data", 
    path: "/settings/privacy" 
  },
  { 
    id: "security", 
    name: "Security", 
    icon: Shield, 
    description: "Protect your account", 
    path: "/settings/security" 
  },
]

interface SettingsShellProps {
  section: string
  children: React.ReactNode
}

export function SettingsShell({ section, children }: SettingsShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [showMobileNav, setShowMobileNav] = React.useState(true)
  
  const currentSection = settingsSections.find(s => s.id === section)

  // On mobile, when a section is selected, hide the nav list
  React.useEffect(() => {
    if (!isDesktop && pathname !== "/settings") {
      setShowMobileNav(false)
    }
  }, [pathname, isDesktop])

  const handleSectionClick = (path: string) => {
    router.push(path)
    if (!isDesktop) {
      setShowMobileNav(false)
    }
  }

  const handleBack = () => {
    if (!isDesktop && !showMobileNav) {
      setShowMobileNav(true)
      router.push("/settings/account")
    } else {
      router.back()
    }
  }

  return (
    <>
      <DialogTitle className="sr-only">Settings - {currentSection?.name}</DialogTitle>
      <DialogDescription className="sr-only">
        {currentSection?.description}
      </DialogDescription>
      
      <div className="flex h-[85vh] md:h-[600px]">
        {/* Desktop Sidebar - Always visible on desktop */}
        {isDesktop && (
          <div className="w-64 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-lg">Settings</h2>
                  <p className="text-sm text-muted-foreground">Manage preferences</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <nav className="p-2">
                {settingsSections.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.path
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSectionClick(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors mb-1 ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  )
                })}
              </nav>
            </ScrollArea>
          </div>
        )}

        {/* Mobile Navigation List */}
        {!isDesktop && showMobileNav && (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SettingsIcon className="h-5 w-5" />
                <div>
                  <h2 className="font-semibold text-lg">Settings</h2>
                  <p className="text-sm text-muted-foreground">Manage preferences</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {settingsSections.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.path
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSectionClick(item.path)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg transition-all active:scale-[0.98] ${
                        isActive 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'hover:bg-muted active:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className={`p-2 rounded-lg ${
                          isActive ? 'bg-primary-foreground/10' : 'bg-muted'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className={`text-xs ${
                            isActive 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0" />
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Content Area - Shows on desktop always, on mobile when section selected */}
        {(isDesktop || !showMobileNav) && (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="border-b p-4 flex items-center gap-3">
              {!isDesktop && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              
              {currentSection && (
                <>
                  <currentSection.icon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">{currentSection.name}</h3>
                </>
              )}
              
              {isDesktop && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="h-8 w-8 ml-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1">
              <div className="p-4 md:p-6">
                {children}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t p-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => router.back()} 
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => router.back()} 
                className="w-full sm:w-auto"
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}