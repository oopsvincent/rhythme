// AppSidebarWrapper.tsx (SERVER)
import { createClient } from "@/lib/supabase/server";
import { AppSidebarClient } from "../app-sidebar";
// import AppSidebarClient from "./AppSidebarClient";

export default async function AppSidebarWrapper(
  props: React.ComponentProps<typeof AppSidebarClient>
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const mappedUser = user
    ? {
        name:
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Anonymous",
        email: user.email || "No email",
        avatar:
          user.user_metadata?.avatar_url || "/avatars/default-user.png",
      }
    : null;

  return <AppSidebarClient {...props} user={mappedUser} />;
}
