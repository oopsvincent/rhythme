"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gift, Check, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { claimPromoPremium } from "@/app/actions/subscription";
import Link from "next/link";

interface ClaimPremiumClientProps {
  user: any;
  initialIsPremium: boolean;
}

export function ClaimPremiumClient({ user, initialIsPremium }: ClaimPremiumClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await claimPromoPremium();
      if (res.success) {
        setIsSuccess(true);
      } else {
        setError(res.error || "Failed to claim premium promotion.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const premiumFeatures = [
    {
      title: "Unlimited Habits & Cycles",
      desc: "Go beyond the free tier limits and structure your entire day with custom habit frequencies."
    },
    {
      title: "AI/ML Predictive Analytics",
      desc: "Unlock advanced machine learning predictions of your habit streaks and focus times."
    },
    {
      title: "Extended Focus & Break Presets",
      desc: "Customize your focus sessions with multiple presets and distraction-free audio."
    },
    {
      title: "Rich Mood & Reflection Insights",
      desc: "Discover deep correlations between your daily tasks, focus hours, and emotional state."
    }
  ];

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden select-none">
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-xl z-10 space-y-8">
        
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm"
          >
            <Gift className="h-6 w-6" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold font-primary tracking-tight text-foreground leading-[1.15]"
          >
            Claim Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Free Month of Premium
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed"
          >
            Join our early validator group! Test Rhythmé Premium for 30 days. No credit card required, cancel anytime.
          </motion.p>
        </div>

        {/* Claim Card Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-3xl border border-border/30 bg-card/45 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {isSuccess ? (
            // Success State
            <div className="text-center py-6 space-y-5 animate-in zoom-in duration-300">
              <div className="inline-flex p-3.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-xs animate-bounce">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-primary">Premium Claimed!</h3>
                <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-xs mx-auto">
                  Your 1-Month Rhythmé Premium entitlement is now active on your account.
                </p>
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full inline-flex items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-primary/25 cursor-pointer"
              >
                Go to Dashboard
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </button>
            </div>
          ) : initialIsPremium ? (
            // Already Premium State
            <div className="text-center py-6 space-y-5">
              <div className="inline-flex p-3.5 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-xs">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-primary">You are Already Premium!</h3>
                <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-xs mx-auto">
                  Thank you for being a part of Rhythmé. You already have full access to all premium features.
                </p>
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full inline-flex items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-primary/25 cursor-pointer"
              >
                Enter Dashboard
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </button>
            </div>
          ) : user ? (
            // Logged in, not Premium
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/20 flex flex-col gap-0.5 text-center sm:text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Signed In As</span>
                <span className="text-xs font-semibold text-foreground truncate">{user.email}</span>
              </div>
              
              {error && (
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs font-medium text-destructive text-center">
                  {error}
                </div>
              )}

              <button
                onClick={handleClaim}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-95 transition-all shadow-md hover:shadow-primary/25 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating Premium...
                  </>
                ) : (
                  <>
                    Claim My Free Month
                    <Sparkles className="ml-1.5 h-4 w-4 fill-current" />
                  </>
                )}
              </button>
            </div>
          ) : (
            // Logged Out State
            <div className="space-y-6">
              <div className="space-y-3.5">
                <p className="text-xs text-muted-foreground/80 leading-relaxed text-center">
                  Claiming this promotion requires a Rhythmé account to activate the entitlement.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Link
                    href="/signup?redirect=/claim-premium"
                    className="inline-flex items-center justify-center rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-primary/20 text-center"
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/login?redirect=/claim-premium"
                    className="inline-flex items-center justify-center rounded-xl border border-border/60 bg-transparent py-3 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted/30 transition-all text-center"
                  >
                    Log In
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Premium Features List */}
          <div className="border-t border-border/15 pt-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">
              Included Premium Features
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {premiumFeatures.map((feat) => (
                <div key={feat.title} className="flex gap-3">
                  <div className="shrink-0 h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mt-0.5">
                    <Check className="h-3 w-3 stroke-[2.5]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground/90">{feat.title}</h5>
                    <p className="text-[11px] text-muted-foreground/75 leading-relaxed mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
