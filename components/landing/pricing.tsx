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
  MessageSquare,
  Palette,
  ChevronDown,
  ChevronUp,
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

// Updated pricing
const pricing: Pricing = {
  monthly: {
    starter: 0,
    premium: 12.99
  },
  yearly: {
    starter: 0,
    premium: 79.99
  }
};

// Feature type definition
interface PremiumFeature {
  text: string;
  icon: React.ElementType;
  description: string;
  inDevelopment?: boolean;
}

// Starter plan features
const starterFeatures = [
  { text: "1 Goal workspace", icon: Target, description: "Focus on one long-term goal at a time" },
  { text: "Track up to 3 habits", icon: Flame, description: "Build your core daily habits" },
  { text: "10 tasks per day", icon: Check, description: "Manage your daily priorities" },
  { text: "10 journal entries/month", icon: BookOpen, description: "Reflect on your journey" },
  { text: "Basic NBA suggestions", icon: Compass, description: "Simple next best action hints" },
  { text: "Basic focus timer", icon: Timer, description: "Stay focused on your work" },
  { text: "Weekly progress overview", icon: TrendingUp, description: "Track your weekly wins" },
];

// Premium plan features - organized by category
const premiumFeatures: { core: PremiumFeature[]; ai: PremiumFeature[]; analytics: PremiumFeature[]; extras: PremiumFeature[] } = {
  core: [
    { text: "Unlimited goal workspaces", icon: Target, description: "Pursue multiple long-term goals simultaneously" },
    { text: "Unlimited habits & tasks", icon: Zap, description: "No limits on your productivity system" },
    { text: "Unlimited journaling", icon: BookOpen, description: "Write as much as you need" },
  ],
  ai: [
    { text: "Rhythmé AI Agent", icon: Brain, inDevelopment: true, description: "Your intelligent planning partner" },
    { text: "NBA Engine (Full Access)", icon: Rocket, inDevelopment: true, description: "AI-powered next best action recommendations" },
    { text: "Journal Sentiment Analysis", icon: Heart, inDevelopment: true, description: "Understand your emotional patterns with rvo2-sentiment" },
    { text: "AI Goal Roadmaps", icon: Compass, inDevelopment: true, description: "Auto-generated milestones for your goals" },
    { text: "Smart Task Generation", icon: Sparkles, inDevelopment: true, description: "AI creates tasks linked to your goals" },
    { text: "Habit Suggestions", icon: Flame, inDevelopment: true, description: "Personalized habit recommendations" },
  ],
  analytics: [
    { text: "Weekly & monthly insights", icon: TrendingUp, description: "Deep dive into your patterns" },
    { text: "Advanced analytics", icon: BarChart3, description: "Comprehensive progress tracking" },
    { text: "Identity reinforcement", icon: Heart, description: "Track who you're becoming" },
  ],
  extras: [
    { text: "Cloud backup & sync", icon: Cloud, description: "Access from any device" },
    { text: "Priority support", icon: Shield, description: "Get help when you need it" },
    { text: "Custom themes", icon: Palette, description: "Personalize your experience" },
    { text: "Early access to features", icon: Crown, description: "Be the first to try new updates" },
  ],
};

export default function PricingComponent() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');
  const [showAllFeatures, setShowAllFeatures] = useState(false);
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

  const allPremiumFeatures = [
    ...premiumFeatures.core,
    ...premiumFeatures.ai,
    ...premiumFeatures.analytics,
    ...premiumFeatures.extras,
  ];

  const visibleFeatures = showAllFeatures ? allPremiumFeatures : allPremiumFeatures.slice(0, 8);

  return (
    <section 
      id="pricing" 
      className="py-20 px-6 bg-background relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Mouse-following Glow */}
      <div 
        className="pointer-events-none absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] transition-all duration-700 ease-out z-0"
        style={{ 
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
        }}
      />

      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl transition-all duration-700"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl transition-all duration-700"></div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10 font-marketing">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 backdrop-blur-sm border border-primary/20">
            <Sparkles className="w-4 h-4 inline mr-2" />
            Simple Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-primary">
            Choose Your Path
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start free. Upgrade when you&apos;re ready for <span className="text-primary font-semibold">AI-powered clarity</span>.
          </p>
        </motion.div>

        {/* Billing Toggle - Fixed width container */}
        <div className="flex items-center justify-center mb-12">
          <div className="inline-flex items-center gap-4 p-2 rounded-2xl glass-card">
            <span className={cn(
              "text-sm font-medium transition-all duration-500 ease-out px-3 py-1.5 rounded-lg",
              billingCycle === 'monthly' ? 'text-foreground bg-muted' : 'text-muted-foreground'
            )}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 bg-muted rounded-full transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              <span
                className={cn(
                  "absolute top-1 w-5 h-5 bg-primary rounded-full transition-all duration-500 ease-out shadow-lg shadow-primary/50",
                  billingCycle === 'yearly' ? 'left-8' : 'left-1'
                )}
              />
            </button>
            <span className={cn(
              "text-sm font-medium transition-all duration-500 ease-out px-3 py-1.5 rounded-lg",
              billingCycle === 'yearly' ? 'text-foreground bg-muted' : 'text-muted-foreground'
            )}>
              Yearly
            </span>
            {/* Fixed width badge container to prevent layout shift */}
            <div className="w-24 flex justify-start">
              <AnimatePresence mode="wait">
                {billingCycle === 'yearly' && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="px-3 py-1 bg-green-500/10 text-green-500 text-sm font-semibold rounded-full border border-green-500/20"
                  >
                    Save {savingsPercentage}%
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30"
          >
            <div className="p-8 border-b border-border/50">
              <h3 className="text-2xl font-bold font-primary mb-2">Starter</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-muted-foreground">/forever</span>
              </div>
              <p className="text-muted-foreground">Perfect for getting started</p>
            </div>
            <div className="p-8 text-left">
              <div className="space-y-4 mb-8">
                {starterFeatures.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 group">
                      <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-colors duration-300" />
                      <div>
                        <span className="text-foreground font-medium">{feature.text}</span>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link href="/signup/intro">
                <button className="w-full px-6 py-3 rounded-xl font-semibold border-2 border-border hover:border-primary hover:text-primary transition-all duration-500 ease-out">
                  Get Started Free
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative glass-card rounded-2xl overflow-hidden border-primary/50 shadow-2xl shadow-primary/10 transition-all duration-500 ease-out hover:scale-[1.02]"
          >
            {/* Recommended badge */}
            <div className="absolute -top-0 left-1/2 transform -translate-x-1/2 translate-y-3 z-10">
              <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                <Crown className="w-4 h-4 inline mr-1" />
                RECOMMENDED
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none"></div>
            
            <div className="p-8 border-b border-border/50 pt-12">
              <h3 className="text-2xl font-bold font-primary mb-2 flex items-center gap-2">
                Premium <Sparkles className="w-5 h-5 text-accent" />
              </h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ${pricing[billingCycle].premium}
                </span>
                <span className="text-muted-foreground">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              {billingCycle === 'yearly' && (
                <p className="text-primary font-medium text-sm">
                  ${(yearlyPrice / 12).toFixed(2)}/month billed yearly
                </p>
              )}
              <p className="text-muted-foreground mt-2">Full power, AI-enhanced productivity</p>
            </div>
            
            <div className="p-8 text-left relative">
              <div className="space-y-3 mb-6">
                {visibleFeatures.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-start gap-3 group"
                    >
                      <Icon className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 group-hover:text-primary transition-colors duration-300" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-foreground font-medium">{feature.text}</span>
                          {'inDevelopment' in feature && feature.inDevelopment && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              In Development
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Show More/Less Toggle */}
              {allPremiumFeatures.length > 8 && (
                <button
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  className="w-full py-2 text-sm text-primary font-medium flex items-center justify-center gap-1 hover:underline transition-all duration-300"
                >
                  {showAllFeatures ? (
                    <>Show Less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Show All {allPremiumFeatures.length} Features <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              )}

              {/* Early Access Notice */}
              <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  <Crown className="w-3 h-3 inline mr-1 text-primary" />
                  <span className="text-primary font-medium">Premium members</span> get early access to features currently in development.
                </p>
              </div>

              <Link href="/signup/intro" className="block mt-6">
                <button className="w-full px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-500 ease-out">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Upgrade to Premium
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Message */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 space-y-4"
        >
          <p className="text-3xl md:text-4xl font-bold font-primary">
            <span className="text-foreground">Start free, </span>
            <span className="text-gradient-primary">grow with clarity</span>
          </p>
          <p className="text-muted-foreground text-lg">
            No credit card required • Cancel anytime • 30-day money-back guarantee
          </p>
        </motion.div>
      </div>
    </section>
  );
}