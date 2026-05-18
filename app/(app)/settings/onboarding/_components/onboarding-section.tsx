// app/(dashboard)/settings/onboarding/_components/onboarding-section.tsx
// Goals & preferences editing with flat design

"use client"

import { useState } from "react"
import { updateOnboardingData } from "@/app/actions/settings"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Briefcase,
  GraduationCap,
  Laptop,
  Lightbulb,
  MoreHorizontal,
  CheckCircle2,
  Loader2,
} from "lucide-react"

interface OnboardingSectionProps {
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

export function OnboardingSection({ onboardingData }: OnboardingSectionProps) {
  const [role, setRole] = useState(onboardingData?.role || "other")
  const [dailyHabitsTarget, setDailyHabitsTarget] = useState(onboardingData?.daily_habits_target || 3)
  const [dailyTasksTarget, setDailyTasksTarget] = useState(onboardingData?.daily_tasks_target || 3)
  const [isUpdating, setIsUpdating] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setSuccess(false)
    
    const formData = new FormData()
    formData.append("role", role)
    formData.append("dailyHabitsTarget", dailyHabitsTarget.toString())
    formData.append("dailyTasksTarget", dailyTasksTarget.toString())
    
    const result = await updateOnboardingData(formData)
    
    setIsUpdating(false)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Role Selection */}
      <section className="space-y-4">
        <div>
          <h3 className="font-medium">Your Role</h3>
          <p className="text-sm text-muted-foreground">
            Tell us what you do so we can personalize your experience.
          </p>
        </div>
        
        <div className="max-w-sm">
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
      </section>

      {/* Divider */}
      <div className="border-b border-border/50" />

      {/* Daily Targets */}
      <section className="space-y-4">
        <div>
          <h3 className="font-medium">Daily Targets</h3>
          <p className="text-sm text-muted-foreground">
            Set realistic daily goals to stay on track.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="dailyHabitsTarget">Habits per day</Label>
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
            <Label htmlFor="dailyTasksTarget">Tasks per day</Label>
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
      </section>

      {/* Save Button */}
      <Button 
        type="submit" 
        disabled={isUpdating}
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
  )
}
