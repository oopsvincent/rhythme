// app/(dashboard)/settings/account/account-settings-content.tsx
"use client"

import { useState } from "react"
import { updateUserProfile, updateOnboardingData } from "@/app/actions/settings"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Calendar, 
  Target,
  Briefcase,
  GraduationCap,
  Laptop,
  Lightbulb,
  MoreHorizontal,
  CheckCircle2,
  Loader2,
  AlertTriangle
} from "lucide-react"
import { DeleteAccountModal } from "@/components/settings/delete-account-modal"

interface AccountSettingsContentProps {
  user: {
    id: string
    name: string
    email: string
    avatar: string
    createdAt: string
  }
  onboardingData: {
    role: "student" | "working_professional" | "freelancer" | "entrepreneur" | "other"
    daily_habits_target: number
    daily_tasks_target: number
  } | null
}

const roleIcons = {
  student: GraduationCap,
  working_professional: Briefcase,
  freelancer: Laptop,
  entrepreneur: Lightbulb,
  other: MoreHorizontal,
}

const roleLabels = {
  student: "Student",
  working_professional: "Working Professional",
  freelancer: "Freelancer",
  entrepreneur: "Entrepreneur",
  other: "Other",
}

export default function AccountSettingsContent({ user, onboardingData }: AccountSettingsContentProps) {
  const [displayName, setDisplayName] = useState(user.name)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  
  const [role, setRole] = useState(onboardingData?.role || "other")
  const [dailyHabitsTarget, setDailyHabitsTarget] = useState(onboardingData?.daily_habits_target || 3)
  const [dailyTasksTarget, setDailyTasksTarget] = useState(onboardingData?.daily_tasks_target || 3)
  const [isUpdatingGoals, setIsUpdatingGoals] = useState(false)
  const [goalsSuccess, setGoalsSuccess] = useState(false)

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingProfile(true)
    setProfileSuccess(false)
    
    const formData = new FormData()
    formData.append("displayName", displayName)
    
    const result = await updateUserProfile(formData)
    
    setIsUpdatingProfile(false)
    if (result.success) {
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    }
  }

  const handleGoalsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingGoals(true)
    setGoalsSuccess(false)
    
    const formData = new FormData()
    formData.append("role", role)
    formData.append("dailyHabitsTarget", dailyHabitsTarget.toString())
    formData.append("dailyTasksTarget", dailyTasksTarget.toString())
    
    const result = await updateOnboardingData(formData)
    
    setIsUpdatingGoals(false)
    if (result.success) {
      setGoalsSuccess(true)
      setTimeout(() => setGoalsSuccess(false), 3000)
    }
  }

  const RoleIcon = roleIcons[role] || MoreHorizontal
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  })

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex items-start gap-6">
        <Avatar className="h-20 w-20 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
            {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-1">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Member since {memberSince}</span>
          </div>
          <div className="pt-2">
            <Badge variant="secondary" className="gap-1">
              <RoleIcon className="h-3 w-3" />
              {roleLabels[role]}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* Display Name Section */}
      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </h3>
          <p className="text-sm text-muted-foreground">
            Update your display name. This is how you&apos;ll appear throughout the app.
          </p>
        </div>
        
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-muted/50 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed. Contact support if you need to update it.
            </p>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isUpdatingProfile || displayName === user.name}
          className="gap-2"
        >
          {isUpdatingProfile ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : profileSuccess ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Saved!
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>

      <Separator />

      {/* Goals & Preferences Section */}
      <form onSubmit={handleGoalsSubmit} className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Goals & Preferences
          </h3>
          <p className="text-sm text-muted-foreground">
            Adjust your daily targets and role to personalize your experience.
          </p>
        </div>
        
        <div className="grid gap-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="role">Your Role</Label>
            <Select value={role} onValueChange={(value: typeof role) => setRole(value)}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Student
                  </span>
                </SelectItem>
                <SelectItem value="working_professional">
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Working Professional
                  </span>
                </SelectItem>
                <SelectItem value="freelancer">
                  <span className="flex items-center gap-2">
                    <Laptop className="h-4 w-4" />
                    Freelancer
                  </span>
                </SelectItem>
                <SelectItem value="entrepreneur">
                  <span className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Entrepreneur
                  </span>
                </SelectItem>
                <SelectItem value="other">
                  <span className="flex items-center gap-2">
                    <MoreHorizontal className="h-4 w-4" />
                    Other
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dailyHabitsTarget">Daily Habits Target</Label>
              <Select 
                value={dailyHabitsTarget.toString()} 
                onValueChange={(v) => setDailyHabitsTarget(parseInt(v))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} {n === 1 ? "habit" : "habits"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dailyTasksTarget">Daily Tasks Target</Label>
              <Select 
                value={dailyTasksTarget.toString()} 
                onValueChange={(v) => setDailyTasksTarget(parseInt(v))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} {n === 1 ? "task" : "tasks"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isUpdatingGoals}
          className="gap-2"
        >
          {isUpdatingGoals ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : goalsSuccess ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Saved!
            </>
          ) : (
            "Update Goals"
          )}
        </Button>
      </form>
      
      <Separator />

      {/* Danger Zone */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </h3>
        <Card className="border-destructive/20 bg-destructive/5 overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between sm:flex-row flex-col gap-4">
            <div>
              <p className="font-medium text-destructive">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Permanently remove your Personal data, Journal entries, and Settings. This action is not reversible, so please continue with caution.
              </p>
            </div>
            <DeleteAccountModal />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
