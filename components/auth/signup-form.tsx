"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import OAuthButtons from "./OAuth-buttons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import {
  Mail,
  Loader2,
  OctagonAlert,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function validate(): string | null {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  }

  async function signUpNewUser() {
    setErrorMsg(null);

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      setStatus("error");
      return;
    }

    setStatus("loading");

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/onboarding`,
      },
    });

    if (error) {
      console.error("Supabase signUp error:", error);
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    console.log("Sign up success:", data);
    setStatus("success");
  }

  // ── Success state ──────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div
        className={cn("flex flex-col gap-5 items-center text-center", className)}
        {...props}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Check your email
          </h2>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a confirmation link to <strong>{email}</strong>
          </p>
        </div>

        <div className="w-full space-y-3 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm p-4 text-left text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Next steps:</p>
          <ol className="list-decimal list-inside space-y-1.5 pl-1">
            <li>Open the email we just sent</li>
            <li>Click the confirmation link</li>
            <li>Complete your onboarding</li>
          </ol>
        </div>

        <div className="space-y-2 w-full">
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive it? Check your spam folder.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatus("idle")}
            className="rounded-xl"
          >
            Try a different email
          </Button>
        </div>
      </div>
    );
  }

  // ── Live validation ────────────────────────────────────────────────
  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  // ── Form state ─────────────────────────────────────────────────────
  return (
    <div className={cn("flex flex-col gap-5", className)} {...props}>
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center mb-1">
        <h1 className="text-2xl font-bold tracking-tight font-primary text-foreground">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Start your productivity journey with Rhythmé
        </p>
      </div>

      {/* OAuth */}
      <OAuthButtons />

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-border/60" />
        <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider select-none">
          or
        </span>
        <div className="h-px flex-1 bg-border/60" />
      </div>

      {/* Error */}
      {status === "error" && errorMsg && (
        <Alert
          variant="destructive"
          className="rounded-xl border-destructive/30 bg-destructive/5 py-2.5"
        >
          <OctagonAlert className="h-4 w-4" />
          <AlertDescription className="text-sm">{errorMsg}</AlertDescription>
        </Alert>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="signup-email"
          className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider pl-0.5"
        >
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            disabled={status === "loading"}
            className="
              flex h-11 w-full rounded-xl border border-border/60
              bg-card/50 backdrop-blur-sm
              pl-10 pr-4 text-sm text-foreground
              placeholder:text-muted-foreground/40
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50
              hover:border-border
              disabled:opacity-50
            "
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="signup-password"
          className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider pl-0.5"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-[13px] h-4 w-4 text-muted-foreground/50 pointer-events-none z-10" />
          <PasswordInput
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            id="signup-password"
            placeholder="Create a strong password"
            required
            autoComplete="new-password"
            disabled={status === "loading"}
            showStrength
            className="
              h-11 rounded-xl border-border/60
              bg-card/50 backdrop-blur-sm pl-10
              focus:ring-2 focus:ring-primary/20 focus:border-primary/50
              hover:border-border
            "
          />
        </div>
        <p className="text-[11px] text-muted-foreground/60 pl-0.5">
          At least 8 characters with mixed case, numbers &amp; symbols
        </p>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="signup-confirm-password"
          className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider pl-0.5"
        >
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-[13px] h-4 w-4 text-muted-foreground/50 pointer-events-none z-10" />
          <PasswordInput
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            id="signup-confirm-password"
            placeholder="Re-enter your password"
            required
            autoComplete="new-password"
            disabled={status === "loading"}
            className={cn(
              "h-11 rounded-xl border-border/60 bg-card/50 backdrop-blur-sm pl-10 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 hover:border-border",
              passwordMismatch &&
                "border-destructive focus:border-destructive focus:ring-destructive/20"
            )}
          />
        </div>
        {passwordMismatch && (
          <p className="text-xs text-destructive pl-0.5">
            Passwords do not match
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        onClick={(e) => {
          e.preventDefault();
          signUpNewUser();
        }}
        disabled={
          status === "loading" || !email || !password || !confirmPassword
        }
        className="
          relative h-11 w-full rounded-xl font-medium
          bg-primary text-primary-foreground
          hover:brightness-110
          active:scale-[0.98]
          transition-all duration-200
          disabled:opacity-60
          cursor-pointer
        "
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span className="flex items-center justify-center gap-2">
            Create account
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Sign in
        </Link>
      </p>

      {/* Legal */}
      <p className="text-center text-xs text-muted-foreground/60 text-balance">
        By creating an account, you agree to our{" "}
        <Link href="/legal/terms" className="text-primary hover:underline">
          Terms
        </Link>
        ,{" "}
        <Link href="/legal/privacy" className="text-primary hover:underline">
          Privacy
        </Link>
        , and{" "}
        <Link href="/legal/cookie" className="text-primary hover:underline">
          Cookie Policy
        </Link>
      </p>
    </div>
  );
}