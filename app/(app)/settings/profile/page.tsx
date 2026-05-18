// app/(dashboard)/settings/profile/page.tsx
// Profile settings page

import { getFullUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { ProfileSection } from "./_components/profile-section"
import { getAmplecenLoginUrl } from "@/lib/auth-redirect"
import { createClient } from "@/lib/supabase/server"

export default async function ProfilePage() {
  const user = await getFullUser()
  
  if (!user) {
    redirect(getAmplecenLoginUrl('/settings/profile'))
  }

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url, created_at")
    .eq("id", user.id)
    .maybeSingle()

  const name =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User"

  return (
    <ProfileSection
      user={{
        id: user.id,
        name,
        email: profile?.email || user.email || "",
        avatar: profile?.avatar_url || user.user_metadata?.avatar_url || `https://avatar.vercel.sh/${user.email}`,
        createdAt: profile?.created_at || user.created_at,
      }}
    />
  )
}
