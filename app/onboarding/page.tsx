// app/onboarding/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Loader2, 
  User, 
  Bell, 
  Briefcase, 
  GraduationCap, 
  Laptop, 
  Rocket, 
  MoreHorizontal,
  Target,
  ListTodo,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check
} from "lucide-react";
import { OnboardingData } from "@/types/database";
import { motion, AnimatePresence } from "framer-motion";

type Role = OnboardingData["role"];

const roles: { value: Role; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    value: "student", 
    label: "Student", 
    icon: <GraduationCap className="w-6 h-6" />,
    description: "Managing studies & assignments"
  },
  { 
    value: "working_professional", 
    label: "Professional", 
    icon: <Briefcase className="w-6 h-6" />,
    description: "Balancing work & life"
  },
  { 
    value: "freelancer", 
    label: "Freelancer", 
    icon: <Laptop className="w-6 h-6" />,
    description: "Juggling multiple projects"
  },
  { 
    value: "entrepreneur", 
    label: "Entrepreneur", 
    icon: <Rocket className="w-6 h-6" />,
    description: "Building something great"
  },
  { 
    value: "other", 
    label: "Other", 
    icon: <MoreHorizontal className="w-6 h-6" />,
    description: "Something unique"
  },
];

const dailyTargetOptions = [1, 3, 5, 7, 10];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [dailyTasksTarget, setDailyTasksTarget] = useState(3);
  const [dailyHabitsTarget, setDailyHabitsTarget] = useState(3);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const totalSteps = 5;

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
    
    // Pre-fill name if available
    if (user.user_metadata?.display_name) {
      setDisplayName(user.user_metadata.display_name);
    } else if (user.user_metadata?.full_name) {
      setDisplayName(user.user_metadata.full_name);
    }

    // Check if user has already completed onboarding
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("user_preferences_id")
      .eq("user_id", user.id)
      .single();

    if (preferences) {
      router.push("/dashboard");
    }
  }

  function nextStep() {
    if (step === 0 && !displayName.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }
    if (step === 1 && !role) {
      setErrorMsg("Please select your role");
      return;
    }
    setErrorMsg(null);
    setStep(s => Math.min(s + 1, totalSteps - 1));
  }

  function prevStep() {
    setErrorMsg(null);
    setStep(s => Math.max(s - 1, 0));
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
          full_name: displayName
        }
      });

      if (updateError) throw updateError;

      const onboardingData: OnboardingData = {
        role: role!,
        daily_tasks_target: dailyTasksTarget,
        daily_habits_target: dailyHabitsTarget,
      };

      // Create user preferences with onboarding data
      const { error: prefsError } = await supabase
        .from("user_preferences")
        .insert({
          user_id: userId,
          notifications_enabled: notificationsEnabled,
          onboarding_data: onboardingData,
        });

      if (prefsError) throw prefsError;

      await supabase.auth.refreshSession();
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("Onboarding error:", error);
      setStatus("error");
      setErrorMsg(error.message || "Failed to complete onboarding");
    }
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Step 0: Welcome & Name */}
              {step === 0 && (
                <>
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground mb-4">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                      Welcome to Rhythmé
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      Let&apos;s personalize your productivity journey
                    </p>
                  </div>

                  <div className="space-y-4 bg-card rounded-2xl p-6 border shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <User className="w-5 h-5" />
                      </div>
                      <Label htmlFor="displayName" className="text-lg font-medium">
                        What should we call you?
                      </Label>
                    </div>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Enter your name"
                      value={displayName}
                      onChange={(e) => {
                        setDisplayName(e.target.value);
                        setErrorMsg(null);
                      }}
                      className="text-lg h-14 rounded-xl"
                      autoFocus
                    />
                  </div>
                </>
              )}

              {/* Step 1: Role Selection */}
              {step === 1 && (
                <>
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      What describes you best?
                    </h2>
                    <p className="text-muted-foreground">
                      We&apos;ll tailor your experience accordingly
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {roles.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => { setRole(r.value); setErrorMsg(null); }}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                          role === r.value
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className={`p-3 rounded-xl ${
                          role === r.value ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}>
                          {r.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{r.label}</p>
                          <p className="text-sm text-muted-foreground">{r.description}</p>
                        </div>
                        {role === r.value && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Step 2: Daily Tasks Target */}
              {step === 2 && (
                <>
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 mb-2">
                      <ListTodo className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      Daily task goal
                    </h2>
                    <p className="text-muted-foreground">
                      How many tasks do you want to complete daily?
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    {dailyTargetOptions.map((num) => (
                      <button
                        key={num}
                        onClick={() => setDailyTasksTarget(num)}
                        className={`w-16 h-16 rounded-2xl text-xl font-bold transition-all ${
                          dailyTasksTarget === num
                            ? "bg-blue-500 text-white shadow-lg scale-110"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    You can always change this later in settings
                  </p>
                </>
              )}

              {/* Step 3: Daily Habits Target */}
              {step === 3 && (
                <>
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-2">
                      <Target className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      Daily habit goal
                    </h2>
                    <p className="text-muted-foreground">
                      How many habits do you want to maintain?
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    {dailyTargetOptions.map((num) => (
                      <button
                        key={num}
                        onClick={() => setDailyHabitsTarget(num)}
                        className={`w-16 h-16 rounded-2xl text-xl font-bold transition-all ${
                          dailyHabitsTarget === num
                            ? "bg-green-500 text-white shadow-lg scale-110"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    Start small and build up over time
                  </p>
                </>
              )}

              {/* Step 4: Notifications & Complete */}
              {step === 4 && (
                <>
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-2">
                      <Bell className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      Stay on track
                    </h2>
                    <p className="text-muted-foreground">
                      Get reminders to keep your momentum
                    </p>
                  </div>

                  <div className="bg-card rounded-2xl p-6 border shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                          <Bell className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-semibold">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Daily reminders & updates
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationsEnabled}
                        onCheckedChange={setNotificationsEnabled}
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-muted/50 rounded-2xl p-6 space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Your Setup
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Name</p>
                        <p className="font-medium">{displayName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Role</p>
                        <p className="font-medium capitalize">{role?.replace("_", " ")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Daily Tasks</p>
                        <p className="font-medium">{dailyTasksTarget} tasks/day</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Daily Habits</p>
                        <p className="font-medium">{dailyHabitsTarget} habits/day</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm text-center">
                  {errorMsg}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {step > 0 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 h-14 rounded-xl text-lg"
                    disabled={status === "loading"}
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                )}
                
                {step < totalSteps - 1 ? (
                  <Button
                    onClick={nextStep}
                    className="flex-1 h-14 rounded-xl text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleComplete}
                    className="flex-1 h-14 rounded-xl text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      <>
                        Get Started
                        <Sparkles className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Step Indicator */}
              <div className="flex justify-center gap-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i === step ? "w-8 bg-primary" : i < step ? "w-2 bg-primary/50" : "w-2 bg-muted"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}