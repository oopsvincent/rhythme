"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Brain,
  CheckCircle2,
  Timer,
  BookHeart,
  Sparkles,
  ArrowRight,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  text: string;
  delay: number;
}

export default function IntroPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-background via-accent/5 to-background overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] bg-primary/5 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-between px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Header Section */}
        <div className={`flex flex-col items-center text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          {/* Logo with glassmorphism */}
          <div className="relative group mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 backdrop-blur-xl bg-background/60 border-2 border-primary/30 rounded-full flex items-center justify-center group-hover:border-primary/50 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-primary/10">
              <Image 
                src="/Rhythme.svg" 
                alt="Rhythmé logo" 
                width={50} 
                height={50}
                className="sm:w-[70px] sm:h-[70px] group-hover:brightness-110 transition-all duration-300"
              />
            </div>
            {/* Orbiting sparkles */}
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="absolute -bottom-2 -left-2 animate-bounce delay-300">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                Welcome to Rhythmé
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md mx-auto px-4 pb-5">
              The productivity ecosystem that unifies execution and emotional awareness
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className={`w-full max-w-2xl transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="backdrop-blur-xl bg-background/60 border-2 border-border/50 rounded-3xl shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="p-6 sm:p-8 md:p-10 space-y-6">
              {/* Section Title */}
              <div className="text-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  Everything in One Place
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Reduce decision fatigue — know exactly what to do, right now
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Feature
                  icon={<CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />}
                  title="Tasks & Habits"
                  text="Manage tasks, build habits, and track streaks — all unified"
                  delay={0}
                />
                <Feature
                  icon={<BookHeart className="w-6 h-6 sm:w-7 sm:h-7" />}
                  title="Journaling & Mood"
                  text="Encrypted journaling with mood tracking and emotional insights"
                  delay={100}
                />
                <Feature
                  icon={<Timer className="w-6 h-6 sm:w-7 sm:h-7" />}
                  title="Focus Mode"
                  text="Deep work sessions with Pomodoro timer and session logging"
                  delay={200}
                />
                <Feature
                  icon={<Brain className="w-6 h-6 sm:w-7 sm:h-7" />}
                  title="Weekly Intelligence"
                  text="Weekly reviews with habit-mood correlations and AI summaries"
                  delay={300}
                />
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Free Tier Available</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3 text-accent" />
                  <span>Privacy-First Design</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-6 sm:mt-8 text-center">
            <Button
              className="w-full rounded-full h-12"
              asChild
            >
              <Link href="/signup/create">
                <span className="flex items-center justify-center gap-2">
                  Create your account
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Already have an account?{" "}
              <a
                href={`${process.env.NEXT_PUBLIC_ACCOUNTS_URL || "https://accounts.amplecen.com"}/login`}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
        
        {/* Legal Links */}
        <p className="text-xs sm:text-sm text-muted-foreground text-center mt-4 px-4">
          By continuing, you agree to our{" "}
          <Link href="/legal/terms" className="text-primary hover:underline">Terms of Service</Link>,{" "}
          <Link href="/legal/privacy" className="text-primary hover:underline">Privacy Policy</Link>, and{" "}
          <Link href="/legal/cookie" className="text-primary hover:underline">Cookie Policy</Link>
        </p>

        <div className="h-4"></div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 8s linear infinite;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}

function Feature({ icon, title, text, delay }: FeatureProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`group backdrop-blur-xl bg-background/40 border border-border hover:border-primary/50 rounded-2xl p-4 sm:p-5 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 hover:scale-105 cursor-pointer ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0 text-primary group-hover:text-accent transition-colors duration-300 group-hover:scale-110 transform">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
