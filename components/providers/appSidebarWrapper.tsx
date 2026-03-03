// AppSidebarWrapper.tsx (SERVER)
import { createClient } from "@/lib/supabase/server";
import { AppSidebarClient } from "../app-sidebar";

export default async function AppSidebarWrapper(
  props: React.ComponentProps<typeof AppSidebarClient>
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  // ✅ Fetch workspace goal here
  let workspaceGoal = null;

  if (user) {
    const { data, error } = await supabase
      .from("user_preferences")
      .select("onboarding_data")
      .eq("user_id", user.id)
      .single();

    if (!error && data?.onboarding_data?.long_term_goal) {
      workspaceGoal = {
        title: data.onboarding_data.long_term_goal,
        description: data.onboarding_data.long_term_goal_description,
      };
    }
  }

  return (
    <AppSidebarClient
      {...props}
      user={mappedUser}
      workspaceGoal={workspaceGoal}
    />
  );
}