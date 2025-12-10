// app/(dashboard)/settings/page.tsx
import { getUser, getFullUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { SettingsHome } from "./settings-home"

export default async function SettingsPage() {
  const user = await getUser()
  const fullUser = await getFullUser()
  
  if (!user || !fullUser) {
    redirect("/login")
  }

  return (
    <SettingsHome 
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: fullUser.created_at,
      }}
    />
  )
}