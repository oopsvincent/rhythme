"use client";

import React from "react";
import BetaHero from "./beta-hero";
import BetaFeatures from "./beta-features";
import ShareButtons from "./share-buttons";

const BetaPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      {/* Global ambient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-primary/5 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-accent/5 rounded-full blur-[80px]"></div>
      </div>

      {/* Page Content */}
      <div className="relative z-10">
        <BetaHero />
        <BetaFeatures />
        <ShareButtons />
        
        {/* Final CTA */}
        <section className="py-12 sm:py-16 px-4 pb-20 sm:pb-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="backdrop-blur-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden">
              {/* Glow effects */}
              <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 sm:w-40 h-32 sm:h-40 bg-accent/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <p className="text-xl sm:text-2xl md:text-3xl font-marketing text-muted-foreground mb-2">
                  &ldquo;Oh... now I know what to do next.&rdquo;
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground/70">
                  — The moment Rhythmé gives you
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BetaPage;
