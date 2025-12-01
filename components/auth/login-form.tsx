"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useOAuthError } from "@/hooks/useOAuthError";
import { OctagonAlert } from "lucide-react";
import OAuthButtons from "./OAuth-buttons";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  const errorData = useOAuthError();
  console.log(errorData);

  const router = useRouter();

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault(); // ⛔ stop page refresh
    setStatus("loading");
    setErrorMsg(null);

    const supabase = createClient();

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

    // login success: redirect to dashboard
    router.push("/dashboard");
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={signInWithEmail}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center font-primary text-primary">
        <h1 className="text-2xl font-bold">
          Ready to take control of your day?
        </h1>
        <p className="text-muted-foreground text-lg tracking-tighter font-semibold text-balance font-sans">
          Login with your Rhythmé ID
        </p>
      </div>
      <div className="grid gap-6">
        <div className="flex justify-center items-center gap-5">
          <OAuthButtons />
        </div>
        <div
          className={`${
            errorData.error !== null || errorData.errorDescription !== null
              ? "flex"
              : "hidden"
          }`}
        >
          {errorData && (
            <Alert variant="destructive">
              <OctagonAlert />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>{errorData.error}</AlertDescription>
              <AlertDescription>{errorData.errorDescription}</AlertDescription>
            </Alert>
          )}
        </div>
        {status === "error" && errorMsg && (
          <div className="text-sm text-red-500">
            <Alert variant="destructive">
              <OctagonAlert />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          </div>
        )}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/auth/reset-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Logging in..." : "Login"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href={"/signup/intro"} className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
