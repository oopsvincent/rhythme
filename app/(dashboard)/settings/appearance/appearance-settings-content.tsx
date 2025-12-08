// app/(dashboard)/settings/appearance/appearance-settings-content.tsx
"use client"

import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/theme-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Paintbrush, Type, Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Card, CardContent } from "@/components/ui/card"

export default function AppearanceSettingsContent() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-8">
      {/* Theme Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Paintbrush className="h-5 w-5 text-primary" />
            Theme
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose how Rhythmé looks to you. Select a single theme, or sync with your system.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 max-w-md">
          <Card 
            className={`cursor-pointer transition-all hover:border-primary/50 ${
              theme === "light" ? "border-primary ring-2 ring-primary/20" : ""
            }`}
            onClick={() => setTheme("light")}
          >
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-lg bg-[#FAFAFA] border border-border flex items-center justify-center">
                <Sun className="h-6 w-6 text-[#0A0A0B]" />
              </div>
              <span className="text-sm font-medium">Light</span>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:border-primary/50 ${
              theme === "dark" ? "border-primary ring-2 ring-primary/20" : ""
            }`}
            onClick={() => setTheme("dark")}
          >
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-lg bg-[#050506] border border-border flex items-center justify-center">
                <Moon className="h-6 w-6 text-[#FAFAFA]" />
              </div>
              <span className="text-sm font-medium">Dark</span>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:border-primary/50 ${
              theme === "system" ? "border-primary ring-2 ring-primary/20" : ""
            }`}
            onClick={() => setTheme("system")}
          >
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#FAFAFA] to-[#050506] border border-border flex items-center justify-center">
                <Monitor className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium">System</span>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Font Size Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            Font Size
          </h3>
          <p className="text-sm text-muted-foreground">
            Adjust the font size for better readability.
          </p>
        </div>
        
        <div className="max-w-md">
          <Select defaultValue="medium">
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">
                <span className="flex items-center gap-2">
                  <span className="text-xs">A</span>
                  Small
                </span>
              </SelectItem>
              <SelectItem value="medium">
                <span className="flex items-center gap-2">
                  <span className="text-sm">A</span>
                  Medium (Default)
                </span>
              </SelectItem>
              <SelectItem value="large">
                <span className="flex items-center gap-2">
                  <span className="text-base">A</span>
                  Large
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            Font size preference will be applied on your next visit.
          </p>
        </div>
      </div>
    </div>
  )
}
