// app/dashboard/OnboardingCheck.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  async function checkOnboardingStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/login");
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
      router.push("/onboarding");
    }
  }

  return <>{children}</>;
}
