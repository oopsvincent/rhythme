"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Compass, 
  Brain, 
  TrendingUp, 
  Sparkles,
  Lightbulb 
} from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isComingSoon?: boolean;
}

const FeatureCard: React.FC<FeatureProps> = ({ icon, title, description, isComingSoon }) => (
  <Card className={`group relative overflow-hidden backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] ${
    isComingSoon 
      ? "bg-accent/5 border-accent/20 hover:border-accent/40" 
      : "bg-background/40 border-border/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
  }`}>
    {isComingSoon && (
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] sm:text-xs font-medium">
        Coming Soon
      </div>
    )}
    <CardContent className="p-4 sm:p-5">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 ${
        isComingSoon 
          ? "bg-accent/10 text-accent" 
          : "bg-primary/10 text-primary group-hover:bg-primary/20"
      }`}>
        {icon}
      </div>
      <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
    </CardContent>
  </Card>
);

const BetaFeatures: React.FC = () => {
  const coreFeatures = [
    {
      icon: <Target className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "One Goal Focus",
      description: "Set one meaningful goal. Everything aligns to move you forward."
    },
    {
      icon: <Compass className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Next Best Action",
      description: "Get one doable step daily. No overwhelm, just clarity."
    },
    {
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Track Progress",
      description: "Build momentum with tasks, habits, and reflections."
    }
  ];

  const comingSoonFeatures = [
    {
      icon: <Brain className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Rhythmé AI",
      description: "Emotionally intelligent suggestions powered by rv01.",
      isComingSoon: true
    },
    {
      icon: <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Smart Insights",
      description: "Weekly patterns and personalized recommendations.",
      isComingSoon: true
    }
  ];

  return (
    <section className="py-16 sm:py-20 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            What You&apos;ll Get
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 font-primary">
            <span className="text-foreground">Built for </span>
            <span className="text-gradient-primary">clarity</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            Everything you need to find direction and take meaningful action
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {coreFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        {/* Coming Soon Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {comingSoonFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              isComingSoon={feature.isComingSoon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BetaFeatures;
