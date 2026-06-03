"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WelcomePremiumPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 8000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16">
        <div className="max-w-md w-full text-center space-y-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.3 }}
              className="text-4xl"
            >
              ✦
            </motion.span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-3"
          >
            <h1 className="text-3xl md:text-4xl font-primary font-semibold tracking-tight">
              You&apos;re in.
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Rhythmé Premium is active. Every tool, every insight, every
              capability — unlocked.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-3 text-left"
          >
            <div className="p-4 rounded-xl border border-border/40 bg-muted/20 space-y-3">
              {[
                "Your habit and task limits have been removed",
                "Behavioral insights and weekly reviews are now available",
                "Explore premium themes in Settings → Appearance",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button
              size="lg"
              className="w-full gap-2"
              onClick={() => router.push("/dashboard")}
            >
              Continue building
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground/60 mt-3">
              Redirecting to your dashboard shortly
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
