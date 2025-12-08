// app/(dashboard)/settings/notifications/page.tsx
import { getUserPreferences } from "@/app/actions/settings"
import  NotificationsSettingsContent from "./notifications-settings-content"

export default async function NotificationsPage() {
  const preferences = await getUserPreferences()
  
  return (
    <NotificationsSettingsContent 
      initialData={{
        emailNotifications: preferences?.email_notifications ?? true,
        pushNotifications: preferences?.push_notifications ?? false,
        marketingEmails: preferences?.marketing_emails ?? false,
      }}
    />
  )
}