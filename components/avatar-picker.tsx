// components/avatar-picker.tsx
// Reusable avatar picker — Dialog version for settings, Grid for inline use
// Includes personal options: social login avatar and initials
"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AVATAR_CATEGORIES,
  AVATAR_OPTIONS,
  SOCIAL_AVATAR_ID,
  INITIALS_AVATAR_ID,
  getAvatarDataUri,
  getAvatarsByCategory,
  generateInitialsDataUri,
  resolveAvatarUrl,
} from "@/lib/avatars"
import { cn } from "@/lib/utils"

// ============================================================================
// SHARED STYLES
// ============================================================================

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-14 w-14",
}

// ============================================================================
// PERSONAL AVATAR SECTION — Social login + Initials
// ============================================================================

interface PersonalAvatarSectionProps {
  selectedId: string
  onSelect: (id: string) => void
  socialAvatarUrl?: string | null
  userName: string
  size?: "sm" | "md" | "lg"
}

export function PersonalAvatarSection({
  selectedId,
  onSelect,
  socialAvatarUrl,
  userName,
  size = "md",
}: PersonalAvatarSectionProps) {
  const initialsUri = generateInitialsDataUri(userName || "User")

  const items: Array<{ id: string; src: string; label: string }> = []

  if (socialAvatarUrl) {
    items.push({ id: SOCIAL_AVATAR_ID, src: socialAvatarUrl, label: "Account" })
  }
  items.push({ id: INITIALS_AVATAR_ID, src: initialsUri, label: "Initials" })

  return (
    <div className="flex gap-4">
      {items.map((item) => {
        const isSelected = item.id === selectedId
        return (
          <div key={item.id} className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "relative rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                sizeClasses[size],
                isSelected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                  : "ring-2 ring-transparent hover:ring-muted-foreground/30 hover:scale-105"
              )}
              title={item.label}
            >
              <img
                src={item.src}
                alt={item.label}
                className="h-full w-full rounded-full object-cover"
                draggable={false}
                referrerPolicy="no-referrer"
              />
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
                  <Check className="h-4 w-4 text-white drop-shadow-md" />
                </span>
              )}
            </button>
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// AVATAR GRID — Shared rendering primitive for static avatars
// ============================================================================

interface AvatarGridProps {
  selectedId: string
  onSelect: (id: string) => void
  category?: "gradient" | "geometric"
  columns?: number
  size?: "sm" | "md" | "lg"
}

export function AvatarGrid({
  selectedId,
  onSelect,
  category,
  columns = 4,
  size = "md",
}: AvatarGridProps) {
  const avatars = category
    ? getAvatarsByCategory(category)
    : AVATAR_OPTIONS

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {avatars.map((avatar) => {
        const isSelected = avatar.id === selectedId
        return (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar.id)}
            className={cn(
              "relative rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              sizeClasses[size],
              isSelected
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                : "ring-2 ring-transparent hover:ring-muted-foreground/30 hover:scale-105"
            )}
            title={avatar.label}
          >
            <img
              src={getAvatarDataUri(avatar.id)}
              alt={avatar.label}
              className="h-full w-full rounded-full"
              draggable={false}
            />
            {isSelected && (
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
                <Check className="h-4 w-4 text-white drop-shadow-md" />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ============================================================================
// AVATAR PICKER DIALOG — For settings page
// ============================================================================

interface AvatarPickerDialogProps {
  currentAvatarId: string
  onSelect: (avatarId: string) => void
  socialAvatarUrl?: string | null
  userName: string
  children: React.ReactNode // Trigger element
}

export function AvatarPickerDialog({
  currentAvatarId,
  onSelect,
  socialAvatarUrl,
  userName,
  children,
}: AvatarPickerDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(currentAvatarId)

  // Resolve the preview image URL for the currently hovered/selected avatar
  const previewUrl = resolveAvatarUrl(selectedId, { socialAvatarUrl, userName })

  const handleSelect = (id: string) => {
    setSelectedId(id)
    onSelect(id)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (isOpen) setSelectedId(currentAvatarId)
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose your avatar</DialogTitle>
        </DialogHeader>

        {/* Preview */}
        <div className="flex justify-center py-2">
          <div className="relative h-20 w-20 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
            <img
              src={previewUrl}
              alt="Selected avatar"
              className="h-full w-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Personal section */}
        {(socialAvatarUrl || userName) && (
          <div className="space-y-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
              Personal
            </span>
            <PersonalAvatarSection
              selectedId={selectedId}
              onSelect={handleSelect}
              socialAvatarUrl={socialAvatarUrl}
              userName={userName}
              size="lg"
            />
          </div>
        )}

        {/* Category tabs */}
        <Tabs defaultValue="gradient" className="w-full">
          <TabsList className="w-full">
            {AVATAR_CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="flex-1">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {AVATAR_CATEGORIES.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="mt-4">
              <AvatarGrid
                selectedId={selectedId}
                onSelect={handleSelect}
                category={cat.id as "gradient" | "geometric"}
                columns={4}
                size="lg"
              />
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
