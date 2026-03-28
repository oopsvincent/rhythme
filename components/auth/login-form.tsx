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
      className={cn("flex flex-col gap-5", className)}
      onSubmit={signInWithEmail}
      {...props}
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center mb-1">
        <h1 className="text-2xl font-bold tracking-tight font-primary text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your Rhythmé account
        </p>
      </div>

      {/* OAuth row */}
      <OAuthButtons redirectTo={redirectTo} />

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-border/60" />
        <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider select-none">
          or
        </span>
        <div className="h-px flex-1 bg-border/60" />
      </div>

      {/* Error alerts */}
      {(oauthErrorMsg || (status === "error" && errorMsg)) && (
        <Alert
          variant="destructive"
          className="rounded-xl border-destructive/30 bg-destructive/5 py-2.5"
        >
          <OctagonAlert className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {oauthErrorMsg || errorMsg}
          </AlertDescription>
        </Alert>
      )}

      {/* Email field */}
      <div className="space-y-1.5">
        <label
          htmlFor="login-email"
          className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider pl-0.5"
        >
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            id="login-email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="
              flex h-11 w-full rounded-xl border border-border/60
              bg-card/50 backdrop-blur-sm
              pl-10 pr-4 text-sm text-foreground
              placeholder:text-muted-foreground/40
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50
              hover:border-border
            "
          />
        </div>
      </div>

      {/* Password field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between pl-0.5">
          <label
            htmlFor="login-password"
            className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider"
          >
            Password
          </label>
          <Link
            href="/auth/reset-password"
            className="text-xs text-primary/70 hover:text-primary transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          id="login-password"
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          className="
            h-11 rounded-xl border-border/60 
            bg-card/50 backdrop-blur-sm 
            focus:ring-2 focus:ring-primary/20 focus:border-primary/50
            hover:border-border
          "
        />
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        disabled={status === "loading"}
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
            Sign in
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>

      {/* Sign up link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup/intro"
          className="font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Create account
        </Link>
      </p>
    </form>
  );
}
