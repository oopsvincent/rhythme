"use client"

import * as React from "react"
import {
  Bell,
  Globe,
  Keyboard,
  Lock,
  Paintbrush,
  Settings,
  User,
  Shield,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDialogStore } from "@/store/useDialogStore"
import { ModeToggle } from "./theme-button"

// Settings sections configuration
const settingsSections = [
  { id: "account", name: "Account", icon: User, description: "Manage your account info" },
  { id: "notifications", name: "Notifications", icon: Bell, description: "Control your alerts" },
  { id: "appearance", name: "Appearance", icon: Paintbrush, description: "Customize your theme" },
  { id: "language", name: "Language & region", icon: Globe, description: "Set your preferences" },
  { id: "accessibility", name: "Accessibility", icon: Keyboard, description: "Improve usability" },
  { id: "privacy", name: "Privacy", icon: Lock, description: "Control your data" },
  { id: "security", name: "Security", icon: Shield, description: "Protect your account" },
  { id: "advanced", name: "Advanced", icon: Settings, description: "Advanced options" },
]

// Settings content component
function SettingsContent({ section }: { section: string }) {
  switch (section) {
    case "account":
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" placeholder="Your name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Tell us about yourself" />
              </div>
            </div>
          </div>
        </div>
      )

    case "notifications":
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about important updates
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive news and offers
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </div>
      )

    case "appearance":
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Appearance Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <ModeToggle />
              </div>
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )

    case "language":
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Language & Region</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time</SelectItem>
                    <SelectItem value="pst">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )

    case "privacy":
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile public
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Activity Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Show when you&apos;re online
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>
      )

    default:
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Coming Soon</h3>
          <p className="text-muted-foreground">
            Settings for &quot;{section}&quot; will be available soon.
          </p>
        </div>
      )
  }
}

// Mobile Menu Component using Shadcn Drawer
function MobileMenu({ 
  activeSection, 
  setActiveSection, 
  onClose 
}: { 
  activeSection: string
  setActiveSection: (section: string) => void
  onClose: () => void
}) {
  const [open, setOpen] = React.useState(false)

  const handleSectionSelect = (sectionId: string) => {
    setActiveSection(sectionId)
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2"
        >
          <Menu className="h-4 w-4" />
          Menu
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Settings Menu</DrawerTitle>
          <DrawerDescription>Choose a category</DrawerDescription>
        </DrawerHeader>
        
        <div className="max-h-[60vh] overflow-y-auto px-4 pb-4">
          <div className="space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon
              const isActive = section.id === activeSection
              
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionSelect(section.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg transition-all active:scale-[0.98] ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'hover:bg-muted active:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-primary-foreground/10' : 'bg-muted'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{section.name}</div>
                      <div className={`text-xs ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {section.description}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0" />
                </button>
              )
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

// Main Settings Dialog Component
export function SettingsDialog() {
  const [activeSection, setActiveSection] = React.useState("account")
  const { settingsOpen, setSettingsOpen } = useDialogStore()

  const currentSection = settingsSections.find(s => s.id === activeSection)

  return (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogTrigger asChild>
        {/* <Button size="lg">
          <Settings className="mr-2 h-5 w-5" />
          Open Settings
        </Button> */}
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 md:max-h-[600px] md:max-w-[900px] max-w-[95vw]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        
        <div className="flex h-[85vh] md:h-[600px]">
          {/* Desktop Sidebar */}
          <div className="hidden md:flex md:w-64 border-r flex-col">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-lg">Settings</h2>
              <p className="text-sm text-muted-foreground">Manage your preferences</p>
            </div>
            <nav className="flex-1 overflow-y-auto p-2">
              {settingsSections.map((section) => {
                const Icon = section.icon
                const isActive = section.id === activeSection
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors mb-1 ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{section.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Mobile Menu Button - Moved to the left */}
                <div className="md:hidden">
                  <MobileMenu 
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    onClose={() => {}}
                  />
                </div>
                
                {currentSection && (
                  <>
                    <currentSection.icon className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">{currentSection.name}</h3>
                  </>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <SettingsContent section={activeSection} />
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button variant="outline" onClick={() => setSettingsOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={() => setSettingsOpen(false)} className="w-full sm:w-auto">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}