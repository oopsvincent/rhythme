// app/(dashboard)/settings/profile/_components/profile-section.tsx
// Profile editing component with avatar picker

"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { updateUserProfile, updateUserEmail } from "@/app/actions/settings"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarPickerDialog } from "@/components/avatar-picker"
import {
  getAvatarDataUri,
  getAvatarIdFromDataUri,
  isStaticAvatar,
  resolveAvatarUrl,
  SOCIAL_AVATAR_ID,
  INITIALS_AVATAR_ID,
} from "@/lib/avatars"
import { 
  Mail, 
  Calendar,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Pencil,
} from "lucide-react"


interface ProfileSectionProps {
  user: {
    id: string
    name: string
    email: string
    avatar: string
    createdAt: string
    socialAvatarUrl?: string | null
  }
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(user.name)
  const [avatarUrl, setAvatarUrl] = useState(user.avatar)
  const [isUpdating, setIsUpdating] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [email, setEmail] = useState(user.email)
  const [isEmailUpdating, setIsEmailUpdating] = useState(false)
  const [emailFeedback, setEmailFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Detect current avatar type
  const currentAvatarId = (() => {
    // Check if it's the social avatar
    if (user.socialAvatarUrl && user.avatar === user.socialAvatarUrl) return SOCIAL_AVATAR_ID
    // Check if it's one of our static avatars
    if (isStaticAvatar(user.avatar)) {
      const id = getAvatarIdFromDataUri(user.avatar)
      if (id) return id
      // Check if it's an initials avatar (contains <text> element)
      if (decodeURIComponent(user.avatar).includes("<text")) return INITIALS_AVATAR_ID
    }
    // External URL (likely social)
    if (user.avatar.startsWith("http") && user.socialAvatarUrl) return SOCIAL_AVATAR_ID
    return "gradient-violet"
  })()

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  })

  const handleAvatarSelect = async (avatarId: string) => {
    const newUrl = resolveAvatarUrl(avatarId, {
      socialAvatarUrl: user.socialAvatarUrl,
      userName: displayName,
    })
    setAvatarUrl(newUrl)

    // Save immediately
    setIsUpdating(true)
    const formData = new FormData()
    formData.append("displayName", displayName)
    formData.append("avatarUrl", newUrl)
    
    const result = await updateUserProfile(formData)
    setIsUpdating(false)
    
    if (result.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      router.refresh()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setSuccess(false)
    
    const formData = new FormData()
    formData.append("displayName", displayName)
    // Include current avatar URL if it was changed
    if (avatarUrl !== user.avatar) {
      formData.append("avatarUrl", avatarUrl)
    }
    
    const result = await updateUserProfile(formData)
    
    setIsUpdating(false)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      router.refresh()
    }
  }

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || email === user.email) return
    setIsEmailUpdating(true)
    setEmailFeedback(null)
    
    try {
      const result = await updateUserEmail(email)
      if (result.success) {
        setEmailFeedback({
          type: "success",
          message: "Verification links sent! Please check both your old and new email addresses to confirm.",
        })
      } else {
        setEmailFeedback({
          type: "error",
          message: result.error || "Failed to update email address.",
        })
      }
    } catch (err) {
      setEmailFeedback({
        type: "error",
        message: "An error occurred while updating your email.",
      })
    } finally {
      setIsEmailUpdating(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex items-start gap-6">
        <AvatarPickerDialog
          currentAvatarId={currentAvatarId}
          onSelect={handleAvatarSelect}
          socialAvatarUrl={user.socialAvatarUrl}
          userName={displayName}
        >
          <button
            type="button"
            className="group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full"
          >
            <Avatar className="h-20 w-20 ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-opacity group-hover:opacity-80">
              <AvatarImage src={avatarUrl} alt={user.name} />
              <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Edit overlay */}
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/30 transition-colors">
              <Pencil className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
            </span>
          </button>
        </AvatarPickerDialog>
        
        <div className="flex-1 space-y-2">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Member since {memberSince}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-border/50" />

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">
              This is how you&apos;ll appear throughout the app.
            </p>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isUpdating || displayName === user.name}
          className="gap-2"
        >
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Saved!
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="border-b border-border/50 my-6" />

      {/* Email Update Form */}
      <form onSubmit={handleEmailUpdate} className="space-y-6">
        <div className="grid gap-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="bg-background"
              />
              <Button
                type="submit"
                variant="outline"
                disabled={isEmailUpdating || email === user.email || !email.trim()}
              >
                {isEmailUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update Email"
                )}
              </Button>
            </div>
            {emailFeedback && (
              <p className={cn(
                "text-xs font-medium",
                emailFeedback.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
              )}>
                {emailFeedback.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Updating your email requires confirmation. We will send verification links to complete this action.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
