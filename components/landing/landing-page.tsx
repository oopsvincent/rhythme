import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import FeaturesSection from "./features";

const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background via-accent/5 to-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto text-center">
            {/* Logo */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
              <div className="relative w-full h-full backdrop-blur-xl bg-background/60 border-2 border-primary/30 rounded-full flex items-center justify-center group-hover:border-primary/50 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-primary/10">
                <Image 
                  src="/Rhythme.svg" 
                  alt="Rhythmé logo" 
                  width={50} 
                  height={50}
                  className="group-hover:brightness-110 transition-all duration-300"
                />
              </div>
            </div>

            {/* Hero Text */}
            <h1 className="font-marketing text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent pb-5">
              Everything You Need to Thrive
            </h1>
            <p className="font-marketing text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto">
              Discover powerful features designed to help you build better habits, stay focused, and achieve your goals
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
              <div className="backdrop-blur-xl bg-background/40 border border-border rounded-xl p-4">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">50+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Features</div>
              </div>
              <div className="backdrop-blur-xl bg-background/40 border border-border rounded-xl p-4">
                <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">24/7</div>
                <div className="text-xs sm:text-sm text-muted-foreground">AI Support</div>
              </div>
              <div className="backdrop-blur-xl bg-background/40 border border-border rounded-xl p-4">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">∞</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Unlimited</div>
              </div>
              <div className="backdrop-blur-xl bg-background/40 border border-border rounded-xl p-4">
                <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">100%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Secure</div>
              </div>
            </div>
          </div>
        </section>

        <FeaturesSection />

        {/* CTA Section */}
        <section className="px-4 sm:px-6 pb-12 sm:pb-20  font-marketing">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 animate-pulse"></div>
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                  Ready to Transform Your Life?
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of users who are already building better habits and achieving their goals
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup/intro">
                    <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 group flex items-center justify-center gap-2">
                      Start Free Today
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    </button>
                  </Link>
                  <Link href="/pricing">
                    <button className="w-full sm:w-auto px-8 py-4 backdrop-blur-xl bg-background/60 border-2 border-border hover:border-primary/50 rounded-lg font-semibold transition-all duration-300">
                      View Pricing
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FeaturesPage;