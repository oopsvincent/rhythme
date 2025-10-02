// login/page.tsx
"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { Suspense, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/dashboard");
      }
    };

    checkSession();
  }, [supabase, router]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-background">
      {/* Left side - Hero section */}
      <div className="bg-primary relative hidden lg:flex lg:flex-col justify-center items-start pl-8 p-6">
        <h1 className="scroll-m-20 text-justify text-8xl font-primary font-black tracking-tight text-balance text-primary-foreground">
          Welcome <br /> Back
        </h1>
        <h2 className="scroll-m-20 border-b border-primary-foreground/20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 font-primary text-primary-foreground/90">
          Your rhythm of focus, growth, and balance starts here.
        </h2>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tighter text-primary-foreground/80">
          One account, a simpler path to productivity
        </h3>
      </div>

      {/* Right side - Login form */}
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-background">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium text-foreground">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Rhythmé Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}