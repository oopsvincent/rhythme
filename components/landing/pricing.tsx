"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Brain, 
  Cloud, 
  Shield, 
  Compass, 
  Target, 
  Heart, 
  BookOpen, 
  TrendingUp,
  Rocket,
  Crown,
  Timer,
  Flame,
  BarChart3,
  Palette,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type BillingCycle = 'monthly' | 'yearly';

interface PricingTier {
  starter: number;
  premium: number;
}

interface Pricing {
  monthly: PricingTier;
  yearly: PricingTier;
}

const pricing: Pricing = {
  monthly: {
    starter: 0,
    premium: 9.99
  },
  yearly: {
    starter: 0,
    premium: 99.99
  }
};

const starterFeatures = [
  { text: "1 Goal workspace", icon: Target, description: "Focus on one long-term goal at a time" },
  { text: "Track up to 5 habits", icon: Flame, description: "Build your core daily habits" },
  { text: "10 tasks per day", icon: Check, description: "Manage your daily priorities" },
  { text: "10 journal entries/month", icon: BookOpen, description: "Reflect on your journey" },
  { text: "Basic focus timer", icon: Timer, description: "Stay focused on your work" },
  { text: "Weekly progress overview", icon: TrendingUp, description: "Track your weekly wins" },
];

const premiumFeatures = [
  { text: "Unlimited goal workspaces", icon: Target, description: "Pursue multiple goals simultaneously" },
  { text: "Unlimited habits & tasks", icon: Zap, description: "No limits on your productivity enclaves" },
  { text: "Unlimited journaling", icon: BookOpen, description: "Write and reflect without limits" },
  { text: "Rhythmé AI Agent & Roadmaps", icon: Brain, description: "Generates custom steps for your goals" },
  { text: "NBA Engine (Full Access)", icon: Rocket, description: "AI-powered Next Best Action recommendation" },
  { text: "Journal Sentiment Insights", icon: Heart, description: "Understand your emotional and focus patterns" },
  { text: "Advanced Analytics Charts", icon: BarChart3, description: "Track weekly and monthly deep work details" },
  { text: "Premium Custom Themes", icon: Palette, description: "Custom colors matching your aesthetic" },
  { text: "Cloud Sync & Backups", icon: Cloud, description: "Real-time sync with local IndexedDB caches" }
];

export default function PricingComponent() {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'premium'>('premium');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const yearlyPrice = pricing.yearly.premium;
  const monthlyPrice = pricing.monthly.premium;
  const monthlySavings = (monthlyPrice * 12) - yearlyPrice;
  const savingsPercentage = Math.round((monthlySavings / (monthlyPrice * 12)) * 100);

  return (
    <section 
      id="pricing" 
      className="py-24 px-6 bg-background relative overflow-hidden z-10"
      onMouseMove={handleMouseMove}
    >
      {/* Mouse Follow Glow */}
      <div 
        className="pointer-events-none absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] transition-all duration-700 ease-out z-0"
        style={{ 
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-4 mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 inline mr-1.5 align-text-bottom" />
            Pricing Plans
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-primary text-foreground text-balance">
            Choose your focus baseline
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Kickstart with our forever free Starter plan, or unlock the full depth of Rhythmé with our Premium Enclave.
          </p>
        </motion.div>

        {/* Brand Segmented Plan Selector - Desktop & Mobile Unified */}
        <div className="flex justify-center mb-8 select-none">
          <div className="relative inline-flex p-1 rounded-2xl bg-card border border-border/40 w-full max-w-[340px]">
            <button 
              onClick={() => setSelectedPlan('starter')}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 relative text-center",
                selectedPlan === 'starter' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {selectedPlan === 'starter' && (
                <motion.div 
                  layoutId="planSelectorBg" 
                  className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Starter Plan</span>
            </button>
            <button 
              onClick={() => setSelectedPlan('premium')}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 relative text-center flex items-center justify-center gap-1",
                selectedPlan === 'premium' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {selectedPlan === 'premium' && (
                <motion.div 
                  layoutId="planSelectorBg" 
                  className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Premium Enclave</span>
              <Sparkles className={cn("w-3 h-3 relative z-10 fill-current", selectedPlan === 'premium' ? 'text-amber-400 animate-pulse' : 'text-muted-foreground')} />
            </button>
          </div>
        </div>

        {/* Dashboard Plan Canvas (Single full width container) */}
        <div className="glass-card rounded-3xl border border-border/60 shadow-2xl relative overflow-hidden p-6 sm:p-10 min-h-[420px] flex flex-col justify-center">
          
          <AnimatePresence mode="wait">
            {selectedPlan === 'starter' ? (
              <motion.div
                key="starter"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left"
              >
                {/* Starter: Pricing Column */}
                <div className="md:col-span-5 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Baseline Free</span>
                    <h3 className="text-xl font-bold font-primary text-foreground">Starter Baseline</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      A quiet, focused starting point. Build habits and track tasks without notifications or distraction triggers.
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 select-text">
                    <span className="text-5xl font-black text-foreground">$0</span>
                    <span className="text-muted-foreground text-xs font-semibold">/ forever</span>
                  </div>

                  <Link href="/signup/intro" className="block pt-2">
                    <button className="w-full px-6 py-3.5 rounded-xl font-bold border border-border hover:border-primary hover:text-primary transition-all duration-300">
                      Get Started Free
                    </button>
                  </Link>

                  <div className="text-[11px] text-muted-foreground select-none">
                    No credit card required • Cancel anytime
                  </div>
                </div>

                {/* Starter: Features Column */}
                <div className="md:col-span-7 border-t md:border-t-0 md:border-l border-border/30 pt-6 md:pt-0 md:pl-8 space-y-4">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Features Included:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {starterFeatures.map((feat, i) => {
                      const Icon = feat.icon;
                      return (
                        <div key={i} className="flex gap-2.5 items-start">
                          <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-foreground">{feat.text}</span>
                            <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">{feat.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="premium"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left"
              >
                {/* Premium: Pricing & Switcher Column */}
                <div className="md:col-span-5 space-y-6">
                  {/* Internal Monthly/Yearly toggle */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                        <Crown className="w-3 h-3 fill-primary" /> Premium Access
                      </span>
                      {billingCycle === 'yearly' && (
                        <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded font-black uppercase">
                          Save {savingsPercentage}%
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold font-primary text-foreground">Premium Focus Enclave</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      The complete cognitive productivity space. Full access to goal onboarding, custom themes, and AI guidance.
                    </p>
                  </div>

                  {/* Pricing Toggle Switch */}
                  <div className="relative inline-flex p-1 rounded-xl bg-muted border border-border/40 select-none">
                    <button 
                      onClick={() => setBillingCycle('monthly')}
                      className={cn(
                        "relative z-10 px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300",
                        billingCycle === 'monthly' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      Monthly
                    </button>
                    <button 
                      onClick={() => setBillingCycle('yearly')}
                      className={cn(
                        "relative z-10 px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300",
                        billingCycle === 'yearly' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      Yearly
                    </button>

                    <motion.div 
                      layoutId="internalBillingToggleBg"
                      className="absolute bg-primary rounded-lg shadow"
                      style={{
                        top: 4,
                        bottom: 4,
                        left: billingCycle === 'monthly' ? 4 : '50%',
                        width: 'calc(50% - 8px)',
                        height: 'calc(100% - 8px)'
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  </div>

                  <div className="space-y-1 select-text">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        ${pricing[billingCycle].premium}
                      </span>
                      <span className="text-muted-foreground text-xs font-semibold">/ {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-primary font-bold text-[10px]">
                        ${(yearlyPrice / 12).toFixed(2)}/month billed yearly
                      </p>
                    )}
                  </div>

                  <Link href="/signup/intro" className="block pt-2">
                    <button className="w-full px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.01]">
                      Go Premium
                    </button>
                  </Link>

                  <div className="text-[11px] text-muted-foreground select-none">
                    14-day premium refunds • Cancel anytime
                  </div>
                </div>

                {/* Premium: Features Column */}
                <div className="md:col-span-7 border-t md:border-t-0 md:border-l border-border/30 pt-6 md:pt-0 md:pl-8 space-y-4">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Features Included:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {premiumFeatures.map((feat, i) => {
                      return (
                        <div key={i} className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-500 bg-emerald-500/10 p-0.5 rounded-full shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-foreground">{feat.text}</span>
                            <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">{feat.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Bottom details */}
        <div className="mt-12 space-y-1 select-text">
          <p className="text-xl font-bold font-primary text-foreground">
            Start free. <span className="text-gradient-primary">Go deeper when you&apos;re ready.</span>
          </p>
          <p className="text-muted-foreground text-xs">
            No setup fees • Full data exports allowed anytime
          </p>
        </div>
      </div>
    </section>
  );
}
