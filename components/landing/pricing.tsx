"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Zap, Brain, Cloud, Shield, Compass, Target, Heart, BookOpen, TrendingUp } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}

type BillingCycle = 'monthly' | 'yearly';

interface PricingTier {
  free: number;
  plus: number;
}

interface Pricing {
  monthly: PricingTier;
  yearly: PricingTier;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`backdrop-blur-xl bg-background/40 border border-border rounded-xl ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<CardHeaderProps> = ({ children }) => (
  <div className="p-6 border-b border-border/50">{children}</div>
);

const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <h3 className={`font-bold ${className}`}>{children}</h3>
);

const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'default', ...props }) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300';
  const variants: Record<'default' | 'outline', string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl hover:shadow-primary/20',
    outline: 'border-2 border-border hover:border-primary hover:text-primary backdrop-blur-sm'
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default function PricingComponent() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');
  
  const pricing: Pricing = {
    monthly: {
      free: 0,
      plus: 9.99
    },
    yearly: {
      free: 0,
      plus: 59.99
    }
  };

  const monthlySavings: string = ((pricing.monthly.plus * 12) - pricing.yearly.plus).toFixed(2);
  const savingsPercentage: number = Math.round((parseFloat(monthlySavings) / (pricing.monthly.plus * 12)) * 100);

  return (
    <section id="pricing" className="py-20 px-6 bg-background relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10 font-marketing">
        {/* Section Header */}
        <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          Simple Pricing
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-primary">
          Choose Your Path
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start free. Upgrade when you&apos;re ready for deeper clarity and AI-powered direction.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-lg font-medium transition-colors ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-16 h-8 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background hover:bg-primary/30"
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 bg-primary rounded-full transition-transform duration-300 shadow-lg shadow-primary/50 ${
                billingCycle === 'yearly' ? 'translate-x-8' : ''
              }`}
            />
          </button>
          <span className={`text-lg font-medium transition-colors ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Yearly
          </span>
          {billingCycle === 'yearly' && (
            <span className="ml-2 px-3 py-1 bg-primary/10 backdrop-blur-sm border border-primary/30 text-primary text-sm font-semibold rounded-full animate-pulse">
              Save {savingsPercentage}%
            </span>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-3xl mb-2">FREE</CardTitle>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                ${pricing[billingCycle].free}
                <span className="text-lg text-muted-foreground font-normal">
                  /forever
                </span>
              </div>
              <p className="text-muted-foreground">Start finding your direction</p>
            </CardHeader>
            <CardContent className="text-left">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground"><strong className="text-foreground">1 Goal workspace</strong> to stay focused</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Track up to <strong className="text-foreground">3 habits</strong></span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground"><strong className="text-foreground">10 tasks</strong> per day</span>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Daily journaling (<strong className="text-foreground">10 entries/month</strong>)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Compass className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground"><strong className="text-foreground">Basic Next Best Action</strong> suggestions</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Basic focus timer</span>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Weekly progress overview</span>
                </div>
              </div>
              <Link href="/signup/intro">
                <Button variant="outline" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Plus Plan */}
          <Card className="border-primary/50 relative shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm border border-primary/30">
                RECOMMENDED
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl pointer-events-none"></div>
            <CardHeader>
              <CardTitle className="text-3xl mb-2 flex items-center justify-center gap-2">
                PLUS <Sparkles className="w-6 h-6 text-accent" />
              </CardTitle>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-primary via-accent to-foreground bg-clip-text text-transparent">
                ${pricing[billingCycle].plus}
                <span className="text-lg text-muted-foreground font-normal">
                  /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>
              {billingCycle === 'yearly' && (
                <p className="text-primary font-medium">
                  ${(pricing.yearly.plus / 12).toFixed(2)}/month billed yearly
                </p>
              )}
              <p className="text-muted-foreground mt-1">Full clarity and AI-powered direction</p>
            </CardHeader>
            <CardContent className="text-left relative">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 group">
                  <Target className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 group-hover:text-primary transition-colors" />
                  <span className="text-muted-foreground"><strong className="text-foreground">Unlimited goal workspaces</strong></span>
                </div>
                <div className="flex items-start gap-3 group">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 group-hover:text-accent transition-colors" />
                  <span className="text-muted-foreground"><strong className="text-foreground">Unlimited habits</strong> & tasks</span>
                </div>
                <div className="flex items-start gap-3 group">
                  <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 group-hover:text-accent transition-colors" />
                  <span className="text-muted-foreground"><strong className="text-foreground">Unlimited journaling</strong></span>
                </div>
                <div className="flex items-start gap-3 group">
                  <Compass className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 group-hover:text-primary transition-colors" />
                  <span className="text-muted-foreground"><strong className="text-foreground">AI-powered Next Best Action</strong> with reasoning</span>
                </div>
                <div className="flex items-start gap-3 group">
                  <Brain className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 group-hover:text-primary transition-colors" />
                  <span className="text-muted-foreground"><strong className="text-foreground">Micro-reflections</strong> & sentiment analysis</span>
                </div>
                <div className="flex items-start gap-3 group">
                  <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 group-hover:text-accent transition-colors" />
                  <span className="text-muted-foreground"><strong className="text-foreground">Weekly & monthly insights</strong></span>
                </div>
                <div className="flex items-start gap-3 group">
                  <Heart className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 group-hover:text-primary transition-colors" />
                  <span className="text-muted-foreground"><strong className="text-foreground">Identity reinforcement</strong> & tracking</span>
                </div>
                <div className="flex items-start gap-3 group">
                  <Cloud className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 group-hover:text-accent transition-colors" />
                  <span className="text-muted-foreground"><strong className="text-foreground">Cloud backup</strong> & multi-device sync</span>
                </div>
                <div className="flex items-start gap-3 group">
                  <Shield className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 group-hover:text-primary transition-colors" />
                  <span className="text-muted-foreground"><strong className="text-foreground">Priority support</strong> & early access</span>
                </div>
                <div className="flex items-start gap-3 group">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 group-hover:text-accent transition-colors" />
                  <span className="text-muted-foreground"><strong className="text-foreground">Custom themes</strong> & personalization</span>
                </div>
              </div>
              <Link href="/signup/intro">
                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/30">
                  Upgrade to Plus
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Message */}
        <div className="mt-16 space-y-4">
          <p className="text-3xl md:text-4xl font-bold font-primary">
            <span className="text-foreground">Start free, </span>
            <span className="text-gradient-primary">grow with clarity</span>
          </p>
          <p className="text-muted-foreground text-lg">
            No credit card required • Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
}