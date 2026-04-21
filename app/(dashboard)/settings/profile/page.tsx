// app/(dashboard)/settings/profile/page.tsx
// Profile settings page

import { getFullUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { ProfileSection } from "./_components/profile-section"
import { getAmplecenLoginUrl } from "@/lib/auth-redirect"

export default async function ProfilePage() {
  const user = await getFullUser()
  
  if (!user) {
    redirect(getAmplecenLoginUrl('/settings/profile'))
  }

  return (
    <ProfileSection
      user={{
        id: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        avatar: user.user_metadata?.avatar_url || `https://avatar.vercel.sh/${user.email}`,
        createdAt: user.created_at,
      }}
    />
  )
}
