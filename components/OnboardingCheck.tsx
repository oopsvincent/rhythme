// app/dashboard/OnboardingCheck.tsx
"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  async function checkOnboardingStatus() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Middleware should catch this first — this is a safety net
      window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
      return;
    }

    // Check if user has completed onboarding
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("onboarding_completed")
      .eq("user_id", user.id)
      .single();

    if (!preferences || !preferences.onboarding_completed) {
      // User hasn't completed onboarding, redirect
      window.location.href = "/onboarding";
    }
  }

  return <>{children}</>;
}

