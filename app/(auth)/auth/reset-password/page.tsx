// app/(auth)/auth/reset-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ResetPasswordRequestPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    const supabase = createClient();
    const baseUrl =
      process.env.VERCEL_PROJECT_PRODUCTION_URL ?? window.location.origin;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/auth/update-password`,
    });

    if (error) {
      console.error("resetPasswordForEmail error:", error);
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    setStatus("success");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          Enter the email associated with your account and we&apos;ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={status === "loading" || !email}
          >
            {status === "loading" ? "Sending reset link..." : "Send reset link"}
          </Button>
        </form>

        {status === "success" && (
          <p className="text-sm text-green-600 text-center">
            If an account exists with that email, we&apos;ve sent a reset link. Check your inbox.
          </p>
        )}

        {status === "error" && errorMsg && (
          <p className="text-sm text-red-500 text-center">
            {errorMsg}
          </p>
        )}

        <p
          className="text-xs text-muted-foreground text-center cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Remember your password? Go back to login
        </p>
      </div>
    </div>
  );
}
