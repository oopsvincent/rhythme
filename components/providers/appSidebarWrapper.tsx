"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AppSidebarClient } from "../app-sidebar";

type SidebarUser = {
  name: string;
  email: string;
  avatar: string;
};

type WorkspaceGoal = {
  title: string;
  description?: string;
};

export default function AppSidebarWrapper(
  props: React.ComponentProps<typeof AppSidebarClient>
) {
  const [user, setUser] = useState<SidebarUser | null>(null);
  const [workspaceGoal, setWorkspaceGoal] = useState<WorkspaceGoal | null>(
    null
  );

  useEffect(() => {
    const supabase = createClient();

    async function fetchSidebarData() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return;

      setUser({
        name:
          authUser.user_metadata?.full_name ||
          authUser.email?.split("@")[0] ||
          "Anonymous",
        email: authUser.email || "No email",
        avatar:
          authUser.user_metadata?.avatar_url || "/avatars/default-user.png",
      });

      // Fetch workspace goal
      const { data, error } = await supabase
        .from("user_preferences")
        .select("onboarding_data")
        .eq("user_id", authUser.id)
        .single();

      if (!error && data?.onboarding_data?.long_term_goal) {
        setWorkspaceGoal({
          title: data.onboarding_data.long_term_goal,
          description: data.onboarding_data.long_term_goal_description,
        });
      }
    }

    fetchSidebarData();
  }, []);

  return (
    <AppSidebarClient
      {...props}
      user={user}
      workspaceGoal={workspaceGoal}
    />
  );
}
