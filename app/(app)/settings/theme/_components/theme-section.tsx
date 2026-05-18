// app/(dashboard)/settings/theme/_components/theme-section.tsx
// Theme mode selection with flat design

"use client"

import { Monitor, Moon, Sun, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const themes = [
  {
    id: "light",
    name: "Light",
    description: "Bright and clean",
    icon: Sun,
    preview: "bg-[#FAFAFA]",
    iconColor: "text-[#0A0A0B]",
  },
  {
    id: "dark",
    name: "Dark",
    description: "Easy on the eyes",
    icon: Moon,
    preview: "bg-[#050506]",
    iconColor: "text-[#FAFAFA]",
  },
  {
    id: "system",
    name: "System",
    description: "Follows your device",
    icon: Monitor,
    preview: "bg-gradient-to-br from-[#FAFAFA] to-[#050506]",
    iconColor: "text-muted-foreground",
  },
]

export function ThemeSection() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Choose how Rhythmé looks to you. Select a single theme, or sync with your system settings.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
        {themes.map((t) => {
          const Icon = t.icon
          const isSelected = theme === t.id
          
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "relative flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-200",
                "border hover:border-primary/50",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border/50 bg-muted/20 hover:bg-muted/40"
              )}
            >
              {/* Selection indicator */}
              {isSelected && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </span>
              )}
              
              {/* Preview */}
              <div className={cn(
                "h-14 w-14 rounded-xl border border-border/50 flex items-center justify-center",
                t.preview
              )}>
                <Icon className={cn("h-7 w-7", t.iconColor)} />
              </div>
              
              {/* Label */}
              <div className="text-center">
                <span className="font-medium text-sm">{t.name}</span>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
