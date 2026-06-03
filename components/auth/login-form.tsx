"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { createClient } from "@/lib/supabase/client";
import { useOAuthError } from "@/hooks/useOAuthError";
import { OctagonAlert, Mail, ArrowRight, Loader2 } from "lucide-react";
import OAuthButtons from "./OAuth-buttons";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const errorData = useOAuthError();
  const oauthErrorMsg = errorData?.errorDescription ?? null;

  const redirectTo = searchParams?.get("redirect") || "/dashboard";

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("login result:", { data, error });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    router.push(redirectTo);
  }

  return (
    <form
      className={cn("flex flex-col gap-4.5", className)}
      onSubmit={signInWithEmail}
      {...props}
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-primary bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
          Welcome back
        </h2>
        <p className="text-xs text-muted-foreground max-w-[280px]">
          Sign in to your Rhythmé account using your social profile or email.
        </p>
      </div>

      {/* OAuth Row */}
      <div className="w-full">
        <OAuthButtons redirectTo={redirectTo} />
      </div>

      {/* Divider */}
      <div className="relative flex items-center gap-4 py-1">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border/50 to-border" />
        <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest select-none">
          or continue with
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-border/50 to-border" />
      </div>

      {/* Error alerts */}
      {(oauthErrorMsg || (status === "error" && errorMsg)) && (
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
            <AlertDescription className="text-sm leading-relaxed">
              {oauthErrorMsg || errorMsg}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Inputs Group */}
      <div className="space-y-3.5">
        {/* Email field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center pl-1">
            <label
              htmlFor="login-email"
              className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest"
            >
              Email Address
            </label>
          </div>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors duration-200 pointer-events-none" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              id="login-email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="
                flex h-11 w-full rounded-2xl border border-border/50
                bg-muted/10 dark:bg-card/30 backdrop-blur-xs
                pl-11 pr-4 text-sm text-foreground
                placeholder:text-muted-foreground/30
                transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/60
                hover:border-border/80 hover:bg-muted/15 dark:hover:bg-card/45
                shadow-inner
              "
            />
          </div>
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between pl-1">
            <label
              htmlFor="login-password"
              className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest"
            >
              Password
            </label>
            <Link
              href="/auth/reset-password"
              className="text-xs font-semibold text-primary/80 hover:text-primary hover:underline transition-all"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <PasswordInput
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              id="login-password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="
                h-11 rounded-2xl border-border/50 
                bg-muted/10 dark:bg-card/30 backdrop-blur-xs
                pl-4 pr-10 text-sm text-foreground
                transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/60
                hover:border-border/80 hover:bg-muted/15 dark:hover:bg-card/45
                shadow-inner
              "
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <motion.div whileTap={{ scale: 0.98 }} className="w-full">
        <Button
          type="submit"
          disabled={status === "loading"}
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
            <>
              <span>Sign in</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </motion.div>

      {/* Signup Link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup/intro"
          className="font-bold text-primary hover:text-primary/80 hover:underline transition-all"
        >
          Create free account
        </Link>
      </p>
    </form>
  );
}
