"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Target,
  CheckCircle,
  Clock,
  Trophy,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";
import { DragSlider } from "@/components/drag-slider";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

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
              Your journey to better habits and productivity starts here
            </p>
          </div>

          {/* Quick Stats */}
          {/* <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8 flex-wrap justify-center">
            <div className="backdrop-blur-xl bg-background/40 border border-border rounded-full px-3 sm:px-4 py-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium">10K+ Users</span>
            </div>
            <div className="backdrop-blur-xl bg-background/40 border border-border rounded-full px-3 sm:px-4 py-2 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-xs sm:text-sm font-medium">1M+ Habits</span>
            </div>
          </div> */}
        </div>

        {/* Features Section */}
        <div className={`w-full max-w-2xl transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="backdrop-blur-xl bg-background/60 border-2 border-border/50 rounded-3xl shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="p-6 sm:p-8 md:p-10 space-y-6">
              {/* Section Title */}
              <div className="text-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  Everything You Need
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Powerful features to transform your daily routine
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Feature
                  icon={<Target className="w-6 h-6 sm:w-7 sm:h-7" />}
                  title="Personal Growth"
                  text="Create routines that stick and track your progress"
                  delay={0}
                />
                <Feature
                  icon={<CheckCircle className="w-6 h-6 sm:w-7 sm:h-7" />}
                  title="Better Days"
                  text="Track habits and manage tasks in one place"
                  delay={100}
                />
                <Feature
                  icon={<Clock className="w-6 h-6 sm:w-7 sm:h-7" />}
                  title="Stay Focused"
                  text="Boost productivity with Focus Mode & Pomodoro"
                  delay={200}
                />
                <Feature
                  icon={<Trophy className="w-6 h-6 sm:w-7 sm:h-7" />}
                  title="Gamified"
                  text="Stay motivated with challenges and rewards"
                  delay={300}
                />
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-6 sm:mt-8 text-center">
            {/* <DragSlider /> */}
            <Button className="w-full rounded-full h-12" onClick={() => {
                redirect('/signup/create');
            }} >
            <p className="text-sm sm:text-base text-muted-foreground flex items-center justify-center gap-2">
              <span>Click to begin your journey</span>
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </p>
            </Button>
          </div>
        </div>
            <p className="text-sm sm:text-base text-muted-foreground flex items-center justify-center gap-2 mt-3">
              <span>By continuing, You agree to our Terms and Privacy Policy</span>
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </p>

        {/* Bottom Spacing */}
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