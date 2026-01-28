// app/(dashboard)/settings/delete-account/page.tsx
// Delete account settings page

import { getUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { DeleteAccountSection } from "./_components/delete-account-section"

export default async function DeleteAccountPage() {
  const user = await getUser()
  
  if (!user) {
    redirect("/login")
  }

  return (
    <DeleteAccountSection
      userEmail={user.email || ""}
    />
  )
}
