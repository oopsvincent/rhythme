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
      window.location.href =
        process.env.NEXT_PUBLIC_ACCOUNTS_URL || "https://accounts.amplecen.com";
      return;
    }

    // Check if user has completed onboarding
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("user_preferences_id")
      .eq("user_id", user.id)
      .single();

    if (!preferences) {
      // User hasn't completed onboarding, redirect
      window.location.href = "/onboarding";
    }
  }

  return <>{children}</>;
}

