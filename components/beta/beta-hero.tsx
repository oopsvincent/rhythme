"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextGradient } from "@/components/text-gradient";
import { ArrowRight, Sparkles, ClipboardList, Gift, MessageSquare } from "lucide-react";

const BetaHero: React.FC = () => {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center px-4 py-20 sm:py-24 overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/15 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
        {/* Beta Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mt-5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl mb-6 sm:mb-8 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-sm font-semibold text-primary">Early Validation Program</span>
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
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight font-primary tracking-tight">
          <span className="text-foreground">Shape the Future of </span>
          <br />
          <TextGradient 
            highlightColor="var(--primary)" 
            baseColor="var(--accent)"
            spread={40}
            duration={2.5}
            className="font-bold"
          >
            Rhythmé
          </TextGradient>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto">
          We are currently recruiting participants for our early product validation phase. Apply for our 15-minute feedback interview and secure <span className="text-foreground font-semibold">one month of free Rhythmé Premium</span>.
        </p>

        {/* Process Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-10 text-left">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-card/40 backdrop-blur-md border border-border/40 hover:border-primary/20 transition-all duration-300">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">1. Apply</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Fill out our quick 2-minute screening survey.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-card/40 backdrop-blur-md border border-border/40 hover:border-primary/20 transition-all duration-300">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">2. Interview</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Selected participants join a 15-minute call.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-card/40 backdrop-blur-md border border-border/40 hover:border-primary/20 transition-all duration-300">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">3. Free Premium</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Get one month of free Rhythmé Premium.</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] group cursor-pointer"
            asChild
          >
            <a href="https://tally.so/r/D4XZ7R" target="_blank" rel="noopener noreferrer">
              Apply for Early Access
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </Button>

          <Button 
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 backdrop-blur-xl bg-background/40 border-2 border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
            asChild
          >
            <Link href="/#features">
              Learn More
            </Link>
          </Button>
        </div>

        {/* Trust Note */}
        <p className="mt-6 text-xs text-muted-foreground">
          Applications are open for a limited time. Selected candidates will be notified via email.
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
