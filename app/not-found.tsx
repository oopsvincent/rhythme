"use client";

import Link from "next/link";
import { RhythmeLogo } from "@/components/rhythme-logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard, Compass } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-6 sm:p-10 text-foreground relative overflow-hidden select-none">
      {/* Premium ambient light blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      
      {/* Decorative Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between">
        <RhythmeLogo size="sm" />
      </header>

      {/* Center 404 Visual Content */}
      <main className="relative z-10 w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center text-center gap-8 py-10">
        
        {/* Animated Icon & Rings */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative z-10 backdrop-blur-xl bg-primary/5 border border-primary/20 p-6 rounded-full shadow-lg shadow-primary/5"
          >
            <Compass className="w-12 h-12 text-primary animate-pulse" />
          </motion.div>
          
          {/* Subtle spinning glass rings */}
          <div className="absolute inset-0 border border-border/40 dark:border-border/20 rounded-full animate-[spin_25s_linear_infinite]" />
          <div className="absolute inset-4 border border-primary/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
          <div className="absolute inset-8 border border-accent/5 rounded-full animate-[spin_15s_linear_infinite]" />
        </div>

        {/* Text Headers */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-8xl font-primary font-black tracking-tighter bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] leading-none">
              404
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-bold font-primary tracking-tight"
          >
            Outside the Flow
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto font-sans"
          >
            The page you are looking for does not exist, has been moved, or resides in another rhythm.
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 w-full justify-center"
        >
          <Button
            asChild
            className="rounded-2xl h-11 px-6 font-semibold bg-gradient-to-r from-primary to-accent border-none text-primary-foreground shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="rounded-2xl h-11 px-6 font-semibold border-border/50 hover:bg-accent/40 hover:border-primary/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Link href="/dashboard">
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </Link>
          </Button>
        </motion.div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 text-center text-xs text-muted-foreground/60 font-sans">
        <p>© {new Date().getFullYear()} Rhythmé Inc. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 8s linear infinite;
        }
      `}</style>
    </div>
  );
}