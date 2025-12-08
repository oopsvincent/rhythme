// app/(dashboard)/settings/privacy/page.tsx
import { getUserPreferences } from "@/app/actions/settings"
import { PrivacySettingsContent } from "./privacy-settings-content"

export default async function PrivacyPage() {
  const preferences = await getUserPreferences()
  
  return (
    <PrivacySettingsContent 
      initialData={{
        profileVisible: preferences?.profile_visible ?? true,
        showActivityStatus: preferences?.show_activity_status ?? true,
      }}
    />
  )
}