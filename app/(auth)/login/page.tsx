"use client";

import { AmplecenLogo } from "@/components/amplecen-logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function CentralAuthPage() {
  const accountsUrl = process.env.NEXT_PUBLIC_ACCOUNTS_URL || "https://accounts.amplecen.com";
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background via-accent/5 to-background">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full space-y-8 glass-card p-10 border border-border/50 rounded-3xl text-center shadow-xl shadow-primary/5"
      >
        <div className="flex justify-center mb-6">
          <AmplecenLogo size="lg" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-amp-display font-medium text-foreground tracking-tight">
            One account for all
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            Rhythmé authentication is now managed centrally. Connect with Amplecen ID to continue your journey across the entire productivity ecosystem securely.
          </p>
        </div>
        
        <div className="pt-4 flex flex-col gap-3">
          <Button asChild className="w-full h-12 rounded-full font-amp-sans shadow-md hover:shadow-lg transition-all border-none bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
            <Link href={`${accountsUrl}/login`}>
              Connect with Amplecen ID
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>Secure connection via Amplecen</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
