"use client";

import { SignupForm } from "@/components/auth/signup-form";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { AmplecenLogo } from "@/components/amplecen-logo";
import Link from "next/link";
import { Check, Flame, Smile } from "lucide-react";

export default function SignupCreatePage() {
  return (
    <div className="grid h-screen lg:h-svh lg:grid-cols-2 bg-background relative lg:overflow-hidden overflow-y-auto">
      {/* Immersive background mesh for mobile/desktop background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(0,0,0,0))] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      {/* Left side - Immersive Hero (Desktop) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-primary/95 via-primary to-accent/90 rounded-r-[60px] shadow-2xl shadow-primary/20">
        {/* Decorative Grid Backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[80px] pointer-events-none animate-pulse duration-[5000ms]" />
        
        {/* Product Brand Text */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground transition-colors group">
            <span className="font-primary font-bold text-lg tracking-wider">Rhythmé</span>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-primary-foreground/15 text-primary-foreground/90 px-2 py-0.5 rounded-full border border-primary-foreground/10">App</span>
          </Link>
        </div>

        {/* Big Typography Banner */}
        <div className="relative z-10 my-auto space-y-6 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-6xl xl:text-7xl font-primary font-black tracking-tight text-white leading-[1.1] text-balance">
              Join <br /> Rhythmé
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-medium tracking-tight text-white/95 leading-relaxed font-primary">
              Unify tasks, habits, and emotional awareness.
            </h2>
            <div className="h-[2px] w-20 bg-gradient-to-r from-accent to-white/40 rounded-full" />
            <p className="text-white/80 text-sm leading-relaxed max-w-md font-sans">
              Create a free account to execute consistently — without overwhelm. Experience privacy-first design for your thoughts and streaks.
            </p>
          </motion.div>
        </div>

        {/* Floating Mock Cards Area */}
        <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-[320px] space-y-6 pointer-events-none select-none">
          {/* Mock Task Card */}
          <motion.div
            initial={{ x: 150, opacity: 0, rotate: 5 }}
            animate={{ x: 0, opacity: 1, rotate: -3 }}
            whileHover={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.3 }}
            className="backdrop-blur-md bg-white/10 border border-white/20 p-5 rounded-2xl shadow-xl shadow-black/10 pointer-events-auto"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white/95 tracking-wide flex items-center gap-1.5 font-primary">
                <Check className="w-3.5 h-3.5 bg-green-500 rounded-full p-0.5 text-white" />
                TODAY'S TASKS
              </span>
              <span className="text-[10px] font-semibold text-white/70 bg-white/15 px-2 py-0.5 rounded-full">2/3 Done</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-white/95 line-through opacity-60">
                <div className="size-4 rounded border border-white/30 flex items-center justify-center bg-white text-primary"><Check className="w-3 h-3 text-primary stroke-[3]" /></div>
                <span>⚡ Code review</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/95 line-through opacity-60">
                <div className="size-4 rounded border border-white/30 flex items-center justify-center bg-white text-primary"><Check className="w-3 h-3 text-primary stroke-[3]" /></div>
                <span>🏋️ Go to gym</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/95">
                <div className="size-4 rounded border border-white/30" />
                <span>🧠 Deep work session</span>
              </div>
            </div>
          </motion.div>

          {/* Mock Habit Card */}
          <motion.div
            initial={{ x: 180, opacity: 0, rotate: -5 }}
            animate={{ x: 0, opacity: 1, rotate: 2 }}
            whileHover={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.4 }}
            className="backdrop-blur-md bg-white/10 border border-white/20 p-5 rounded-2xl shadow-xl shadow-black/10 pointer-events-auto"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white/95 tracking-wide flex items-center gap-1.5 font-primary">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                DAILY STREAKS
              </span>
              <span className="text-[10px] font-semibold text-white/70 bg-white/15 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <div className="flex gap-1.5 items-center">
              {[true, true, true, true, false, true, true].map((active, i) => (
                <div 
                  key={i} 
                  className={`size-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    active 
                      ? "bg-amber-500 text-white shadow-sm shadow-amber-500/25" 
                      : "bg-white/15 text-white/50 border border-white/10"
                  }`}
                >
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mock Mood Card */}
          <motion.div
            initial={{ x: 150, opacity: 0, rotate: 10 }}
            animate={{ x: 0, opacity: 1, rotate: -1 }}
            whileHover={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.5 }}
            className="backdrop-blur-md bg-white/10 border border-white/20 p-5 rounded-2xl shadow-xl shadow-black/10 pointer-events-auto"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white/95 tracking-wide flex items-center gap-1.5 font-primary">
                <Smile className="w-3.5 h-3.5 text-green-300" />
                MOOD FLOW
              </span>
              <span className="text-[10px] text-green-300 font-bold bg-green-500/20 px-2 py-0.5 rounded-full">Calm</span>
            </div>
            <p className="text-[11px] text-white/90 leading-relaxed italic">
              "Focus is a muscle, and you've been training it well today."
            </p>
          </motion.div>
        </div>

        {/* Footer Brand Info */}
        <div className="relative z-10 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Amplecen. All rights reserved.</p>
        </div>
      </div>

      {/* Right side - Signup Form & Mobile Container */}
      <div className="flex flex-col gap-4 p-4 sm:p-6 lg:p-8 justify-between items-center w-full max-w-2xl mx-auto lg:max-w-none h-full overflow-y-auto">
        
        {/* Header containing Amplecen ID Logo */}
        <div className="w-full flex justify-center lg:justify-start">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AmplecenLogo size="md" />
          </motion.div>
        </div>

        {/* Center Auth Form Wrapper */}
        <div className="w-full flex justify-center items-center flex-1 my-auto py-2 sm:py-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md backdrop-blur-md bg-card/40 border border-border/40 p-6 sm:p-8 rounded-[32px] shadow-xl shadow-primary/5 dark:shadow-black/20 animate-fade-in"
          >
            <Suspense fallback={
              <div className="h-80 flex flex-col justify-center items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Preparing form...</span>
              </div>
            }>
              <SignupForm />
            </Suspense>
          </motion.div>
        </div>

        {/* Legal Footer Links */}
        <div className="w-full text-center text-xs text-muted-foreground/60 space-y-2">
          <div className="h-px bg-border/40 w-full mb-3" />
          <p>
            Secure account verification by <span className="font-semibold text-foreground/80">Amplecen ID</span>.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/legal/terms" className="hover:text-primary hover:underline transition-all">Terms</Link>
            <span>•</span>
            <Link href="/legal/privacy" className="hover:text-primary hover:underline transition-all">Privacy</Link>
            <span>•</span>
            <Link href="/legal/cookie" className="hover:text-primary hover:underline transition-all">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

// Simple loader helper inside file since lucide-react loader is common
function Loader2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`animate-spin ${className}`}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
