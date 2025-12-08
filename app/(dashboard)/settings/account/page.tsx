// app/(dashboard)/settings/account/page.tsx
import { getUser, getFullUser, getUserIdentities } from "@/app/actions/auth"
import { getUserPreferences } from "@/app/actions/settings"
import { redirect } from "next/navigation"
import AccountSettingsContent from "./account-settings-content"
import ConnectedAccounts from "./connected-accounts"
import { Separator } from "@/components/ui/separator"

export default async function AccountSettingsPage() {
  const user = await getUser()
  const fullUser = await getFullUser()
  const preferences = await getUserPreferences()
  const identities = await getUserIdentities()
  
  if (!user || !fullUser) {
    redirect("/login")
  }

  const onboardingData = preferences?.onboarding_data || null

  return (
    <div className="space-y-8">
      <AccountSettingsContent 
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: fullUser.created_at,
        }}
        onboardingData={onboardingData}
      />
      
      <Separator />
      
      <ConnectedAccounts identities={identities} />
    </div>
  )
}