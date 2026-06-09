"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export function RedirectToDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Perform redirection to dashboard client-side
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-b from-black/95 via-neutral-900 to-[#0b0b0f] text-white flex flex-col items-center justify-center overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }}></div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center max-w-sm">
        {/* Brand Monogram */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-xl animate-pulse"></div>
          <div className="relative w-full h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-full flex items-center justify-center shadow-2xl">
            <Image 
              src="/Rhythme.svg" 
              alt="Rhythmé Logo" 
              width={36} 
              height={36}
              className="sm:w-[44px] sm:h-[44px]"
            />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight font-primary">
            Welcome back to Rhythmé
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed font-sans">
            Opening your personalized focus workspace...
          </p>
        </div>

        {/* Premium Spinner */}
        <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-[11px] font-medium text-white/70 uppercase tracking-wider">Redirecting</span>
        </div>
      </div>
    </div>
  );
}
