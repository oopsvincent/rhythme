"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextGradient } from "@/components/text-gradient";
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";

const BetaHero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-16 sm:py-20 overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/15 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Beta Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mt-5 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-xl mb-6 sm:mb-8 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <span className="text-sm font-medium text-accent">Limited Beta Access</span>
        </div>

        {/* Logo */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse"></div>
          <div className="relative w-full h-full backdrop-blur-xl bg-background/60 border-2 border-primary/40 rounded-full flex items-center justify-center shadow-2xl shadow-primary/30">
            <Image 
              src="/Rhythme.svg" 
              alt="Rhythmé logo" 
              width={40} 
              height={40}
              className="sm:w-[50px] sm:h-[50px]"
            />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight font-primary">
          <span className="text-foreground">Join the</span>
          <br />
          <TextGradient 
            highlightColor="var(--primary)" 
            baseColor="var(--accent)"
            spread={40}
            duration={2.5}
            className="font-bold"
          >
            Rhythmé Beta
          </TextGradient>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto px-4">
          Be the first to experience the future of personal productivity. 
          <span className="text-foreground font-medium"> One goal, one step at a time.</span>
        </p>

        {/* Stats Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 px-4">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full backdrop-blur-xl bg-background/40 border border-border/50 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Early access</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full backdrop-blur-xl bg-background/40 border border-border/50 text-sm">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">Free forever tier</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full backdrop-blur-xl bg-background/40 border border-border/50 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Priority support</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <Link href="/signup/intro" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-primary to-primary/80 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 group glow-primary"
            >
              Get Early Access
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
          <Link href="/#how-it-works" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 backdrop-blur-xl bg-background/40 border-2 border-border hover:border-primary/50 transition-all duration-300"
            >
              Learn More
            </Button>
          </Link>
        </div>

        {/* Trust Note */}
        <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground">
          No credit card required • Cancel anytime
        </p>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-ping opacity-60 hidden sm:block"></div>
      <div className="absolute bottom-32 right-16 w-3 h-3 bg-accent rounded-full animate-ping opacity-40 hidden sm:block" style={{ animationDelay: "0.5s" }}></div>
      <div className="absolute top-1/3 right-10 w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse hidden sm:block"></div>
    </section>
  );
};

export default BetaHero;
