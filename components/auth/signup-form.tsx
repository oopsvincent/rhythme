"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import OAuthButtons from "./OAuth-buttons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { motion } from "framer-motion";
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
        className={cn("flex flex-col gap-6 items-center text-center py-4", className)}
        {...props}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5"
        >
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Check your email
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            We&apos;ve sent a confirmation link to <strong className="text-foreground">{email}</strong>
          </p>
        </div>

        <div className="w-full space-y-4 rounded-2xl border border-border/50 bg-muted/10 dark:bg-card/30 backdrop-blur-md p-6 text-left text-sm text-muted-foreground">
          <p className="font-bold text-foreground tracking-wide text-xs uppercase">Next steps:</p>
          <ol className="list-decimal list-inside space-y-2 pl-1 leading-relaxed">
            <li>Open the email we just sent</li>
            <li>Click the confirmation link</li>
            <li>Complete your onboarding</li>
          </ol>
        </div>

        <div className="space-y-3 w-full">
          <p className="text-xs text-muted-foreground/80">
            Didn&apos;t receive it? Check your spam folder.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatus("idle")}
            className="rounded-xl border-border/60 hover:bg-accent transition-colors cursor-pointer"
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight font-primary bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
          Create account
        </h2>
        <p className="text-sm text-muted-foreground max-w-[280px]">
          Start your productivity journey with Rhythmé today.
        </p>
      </div>

      {/* OAuth */}
      <div className="w-full">
        <OAuthButtons />
      </div>

      {/* Divider */}
      <div className="relative flex items-center gap-4 py-1">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border/50 to-border" />
        <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest select-none">
          or sign up with email
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-border/50 to-border" />
      </div>

      {/* Error */}
      {status === "error" && errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <Alert
            variant="destructive"
            className="rounded-2xl border-destructive/20 bg-destructive/5 py-3 shadow-md shadow-destructive/5"
          >
            <OctagonAlert className="h-4 w-4" />
            <AlertDescription className="text-sm leading-relaxed">{errorMsg}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Inputs Group */}
      <div className="space-y-3.5">
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-email"
            className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest pl-1"
          >
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors duration-200 pointer-events-none" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              disabled={status === "loading"}
              className="
                flex h-11 w-full rounded-2xl border border-border/50
                bg-muted/10 dark:bg-card/30 backdrop-blur-xs
                pl-11 pr-4 text-sm text-foreground
                placeholder:text-muted-foreground/30
                transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/60
                hover:border-border/80 hover:bg-muted/15 dark:hover:bg-card/45
                disabled:opacity-50
                shadow-inner
              "
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-password"
            className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest pl-1"
          >
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-[14px] h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors duration-200 pointer-events-none z-10" />
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
                h-11 rounded-2xl border-border/50
                bg-muted/10 dark:bg-card/30 backdrop-blur-xs pl-11
                focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/60
                hover:border-border/80 hover:bg-muted/15 dark:hover:bg-card/45
                shadow-inner
              "
            />
          </div>
          <p className="text-[11px] text-muted-foreground/60 pl-1">
            At least 8 characters with mixed case, numbers &amp; symbols
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-confirm-password"
            className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest pl-1"
          >
            Confirm Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-[14px] h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors duration-200 pointer-events-none z-10" />
            <PasswordInput
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              id="signup-confirm-password"
              placeholder="Re-enter your password"
              required
              autoComplete="new-password"
              disabled={status === "loading"}
              className={cn(
                "h-11 rounded-2xl border-border/50 bg-muted/10 dark:bg-card/30 backdrop-blur-xs pl-11 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/60 hover:border-border/80 hover:bg-muted/15 dark:hover:bg-card/45 shadow-inner",
                passwordMismatch &&
                  "border-destructive focus:border-destructive focus:ring-destructive/20"
              )}
            />
          </div>
          {passwordMismatch && (
            <p className="text-xs text-destructive pl-1">
              Passwords do not match
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <motion.div whileTap={{ scale: 0.98 }} className="w-full">
        <Button
          onClick={(e) => {
            e.preventDefault();
            signUpNewUser();
          }}
          disabled={
            status === "loading" || !email || !password || !confirmPassword || passwordMismatch
          }
          className="
            relative h-11 w-full rounded-2xl font-semibold text-sm
            bg-primary text-primary-foreground shadow-lg shadow-primary/15
            hover:brightness-110 hover:shadow-primary/25
            transition-all duration-200
            disabled:opacity-60 disabled:shadow-none
            cursor-pointer
            flex items-center justify-center gap-2
          "
        >
          {status === "loading" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <span className="flex items-center justify-center gap-2">
              Create account
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </motion.div>

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-primary hover:text-primary/80 hover:underline transition-all"
        >
          Sign in
        </Link>
      </p>

      {/* Legal Footer Info */}
      <p className="text-center text-[11px] text-muted-foreground/60 leading-relaxed text-balance">
        By creating an account, you agree to our{" "}
        <Link href="/legal/terms" className="hover:text-primary hover:underline transition-all">
          Terms
        </Link>
        ,{" "}
        <Link href="/legal/privacy" className="hover:text-primary hover:underline transition-all">
          Privacy
        </Link>
        , and{" "}
        <Link href="/legal/cookie" className="hover:text-primary hover:underline transition-all">
          Cookie Policy
        </Link>
      </p>
    </div>
  );
}
