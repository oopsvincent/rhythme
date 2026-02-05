// app/(dashboard)/settings/onboarding/page.tsx
// Onboarding data / Goals settings page

import { getUser } from "@/app/actions/auth"
import { getUserPreferences } from "@/app/actions/settings"
import { redirect } from "next/navigation"
import { OnboardingSection } from "./_components/onboarding-section"

export default async function OnboardingPage() {
  const user = await getUser()
  
  if (!user) {
    redirect("/login")
  }

  const preferences = await getUserPreferences()
  const onboardingData = preferences?.onboarding_data || null

  return (
    <OnboardingSection
      onboardingData={onboardingData ? {
        role: onboardingData.role || "other",
        daily_habits_target: onboardingData.daily_habits_target || 3,
        daily_tasks_target: onboardingData.daily_tasks_target || 3,
      } : null}
    />
  )
}
