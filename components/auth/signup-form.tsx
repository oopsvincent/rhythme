"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import OAuthButtons from "./OAuth-buttons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function signUpNewUser() {
    setStatus("loading");
    setErrorMsg(null);

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

  if (status === "success") {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Check your email
          </CardTitle>
          <CardDescription className="text-base">
            We&apos;ve sent a confirmation link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle>Next Steps</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>1. Check your inbox for a confirmation email</p>
              <p>2. Click the confirmation link in the email</p>
              <p>3. You&apos;ll be redirected to complete your profile</p>
            </AlertDescription>
          </Alert>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Didn&apos;t receive the email? Check your spam folder.</p>
            <Button
              variant="link"
              onClick={() => setStatus("idle")}
              className="text-primary"
            >
              Try a different email address
            </Button>
          </div>
        </CardContent>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <CardHeader className="text-center font-primary">
        <CardTitle className="lg:hidden text-4xl font-bold text-foreground">
          Welcome to Rhythmé
        </CardTitle>
        <h6 className="lg:hidden scroll-m-20 text-xl font-semibold tracking-tighter font-sans text-muted-foreground">
          One account, a simpler path to productivity
        </h6>
        <h6 className="hidden lg:flex justify-center scroll-m-20 text-center text-2xl font-semibold tracking-tighter font-sans text-foreground">
          Create Your Rhythmé ID
        </h6>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6">
          <div className="flex flex-row gap-2">
            <OAuthButtons />
          </div>

          {status === "error" && errorMsg && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-card text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>

          <div className="grid gap-6 mt-6">
            <div className="grid gap-3">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={status === "loading"}
                className="bg-background text-foreground border-input"
              />
            </div>

            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
              </div>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                required
                disabled={status === "loading"}
                className="bg-background text-foreground border-input"
              />
            </div>

            <Button
              onClick={(e) => {
                e.preventDefault();
                signUpNewUser();
              }}
              className="w-full"
              disabled={status === "loading" || !email || !password}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>

          <div className="text-center text-sm mt-4 text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={"/login"}
              className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </CardContent>

      <div className="text-muted-foreground text-center text-xs text-balance px-4">
        By clicking continue, you agree to our{" "}
        <Link
          className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
          href={"/legal/terms"}
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
          href={"/legal/privacy"}
        >
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}