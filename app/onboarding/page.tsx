// app/onboarding/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Loader2, User, Bell } from "lucide-react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkUserAndRedirect();
  }, []);

  async function checkUserAndRedirect() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      router.push("/login");
      return;
    }

    setUserId(user.id);

    // Check if user has already completed onboarding
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("user_preferences_id")
      .eq("user_id", user.id)
      .single();

    if (preferences) {
      // User already onboarded, redirect to dashboard
      router.push("/dashboard");
    }
  }

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }
    setStep(2);
  }

  async function handleComplete() {
    if (!userId) {
      setErrorMsg("User session not found");
      return;
    }

    setStatus("loading");
    setErrorMsg(null);

    try {
      // Update display name in auth.users metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          display_name: displayName,
          full_name: displayName // Also save as full_name for compatibility
        }
      });

      if (updateError) {
        throw updateError;
      }

      // Create user preferences
      const { error: prefsError } = await supabase
        .from("user_preferences")
        .insert({
          user_id: userId,
          notifications_enabled: notificationsEnabled,
        });

      if (prefsError) {
        throw prefsError;
      }

      // Force a session refresh to get updated user metadata
      await supabase.auth.refreshSession();

      // Success! Redirect to dashboard
      router.push("/dashboard");
      router.refresh(); // Force a refresh of server components
    } catch (error: any) {
      console.error("Onboarding error:", error);
      setStatus("error");
      setErrorMsg(error.message || "Failed to complete onboarding");
    }
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {step === 1 ? "Welcome to Rhythmé!" : "Set Your Preferences"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1 
              ? "Let's get to know you better" 
              : "Customize your experience"}
          </CardDescription>
          <div className="flex justify-center gap-2 mt-4">
            <div className={`h-2 w-12 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-2 w-12 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {errorMsg && (
            <Alert variant="destructive">
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          {step === 1 ? (
            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">What should we call you?</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Enter your name"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    setErrorMsg(null);
                  }}
                  required
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  This name will be displayed across your account
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Continue
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Bell className="h-8 w-8 text-primary" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="text-base font-medium">
                      Enable Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminders and updates to stay on track
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleComplete}
                  className="w-full"
                  size="lg"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up your account...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="w-full"
                  disabled={status === "loading"}
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}