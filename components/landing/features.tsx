"use client";
import {
  Compass,
  Target,
  Lightbulb,
  Heart,
  Brain,
  TrendingUp,
  BookOpen,
  Sparkles,
  Shield,
  Cloud,
  Palette,
  Clock,
  CheckCircle,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import React, { useState } from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlights: string[];
  gradient: string;
}

interface Category {
  name: string;
  description: string;
  features: Feature[];
}

const FeaturesSection = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories: Category[] = [
    {
      name: "Core Experience",
      description: "The heart of your daily flow",
      features: [
        {
          icon: <Target className="w-8 h-8" />,
          title: "Goal Workspace",
          description: "One dedicated space for your long-term goal, with everything aligned to move you forward",
          highlights: [
            "Single goal focus",
            "Sub-goal breakdown",
            "Visual progress tracking",
            "AI-assisted goal mapping",
          ],
          gradient: "from-primary to-accent",
        },
        {
          icon: <Compass className="w-8 h-8" />,
          title: "Next Best Action Engine",
          description: "Every day, get one small, doable step tailored to your energy and progress",
          highlights: [
            "AI-powered daily action",
            "Difficulty-adjusted tasks",
            "Clear reasoning provided",
            "Momentum-aware suggestions",
          ],
          gradient: "from-accent to-primary",
        },
        {
          icon: <CheckCircle className="w-8 h-8" />,
          title: "Action Completion Loop",
          description: "Simple, satisfying completion with encouragement that keeps you going",
          highlights: [
            "One-tap completion",
            "Micro-celebrations",
            "Progress visualization",
            "Streak maintenance",
          ],
          gradient: "from-primary via-accent to-primary",
        },
      ],
    },
    {
      name: "Intelligence",
      description: "AI that understands your journey",
      features: [
        {
          icon: <Lightbulb className="w-8 h-8" />,
          title: "AI Reasoning",
          description: "Every action comes with a 'why'—understand how each step connects to your goal",
          highlights: [
            "Context-aware explanations",
            "Goal connection clarity",
            "Momentum insights",
            "Pattern recognition",
          ],
          gradient: "from-purple-500 to-pink-500",
        },
        {
          icon: <Brain className="w-8 h-8" />,
          title: "Micro-Reflections",
          description: "AI-generated insights from your daily check-ins that help you understand yourself",
          highlights: [
            "Sentiment analysis",
            "Behavior patterns",
            "Personalized feedback",
            "Adaptive suggestions",
          ],
          gradient: "from-blue-500 to-cyan-500",
        },
        {
          icon: <TrendingUp className="w-8 h-8" />,
          title: "Weekly & Monthly Insights",
          description: "Deeper analysis of your progress, struggles, and growth over time",
          highlights: [
            "Weekly accomplishments",
            "Struggle identification",
            "Goal adjustments",
            "Identity reinforcement",
          ],
          gradient: "from-green-500 to-emerald-500",
        },
      ],
    },
    {
      name: "Reflection & Growth",
      description: "Build self-awareness and meaning",
      features: [
        {
          icon: <BookOpen className="w-8 h-8" />,
          title: "Micro-Journaling",
          description: "Quick daily prompts—'How did today feel?'—that build self-awareness over time",
          highlights: [
            "One-question prompts",
            "Mood tracking",
            "Optional deep entries",
            "Searchable history",
          ],
          gradient: "from-amber-500 to-orange-500",
        },
        {
          icon: <MessageCircle className="w-8 h-8" />,
          title: "Supportive Dialogue",
          description: "Rhythmé speaks like a supportive friend, not a productivity robot",
          highlights: [
            "Warm, human tone",
            "Encouraging feedback",
            "Empathetic responses",
            "Never overwhelming",
          ],
          gradient: "from-teal-500 to-green-500",
        },
        {
          icon: <Sparkles className="w-8 h-8" />,
          title: "Identity Reinforcement",
          description: "Track who you're becoming—'You are consistent', 'You are improving'",
          highlights: [
            "Positive affirmations",
            "Growth recognition",
            "Achievement unlocks",
            "Confidence building",
          ],
          gradient: "from-yellow-500 to-red-500",
        },
      ],
    },
    {
      name: "Foundation",
      description: "Built for trust and reliability",
      features: [
        {
          icon: <Cloud className="w-8 h-8" />,
          title: "Cloud Sync",
          description: "Access your journey anywhere, with real-time synchronization",
          highlights: [
            "Real-time sync",
            "Automatic backups",
            "Multi-device support",
            "Offline capable",
          ],
          gradient: "from-sky-500 to-blue-500",
        },
        {
          icon: <Shield className="w-8 h-8" />,
          title: "Privacy & Security",
          description: "Your personal journey stays private, always",
          highlights: [
            "End-to-end encryption",
            "GDPR compliant",
            "No data selling",
            "Private by default",
          ],
          gradient: "from-red-500 to-pink-500",
        },
        {
          icon: <Palette className="w-8 h-8" />,
          title: "Personalization",
          description: "Make Rhythmé feel like yours with themes and customization",
          highlights: [
            "Custom themes",
            "Difficulty settings",
            "Notification control",
            "Layout preferences",
          ],
          gradient: "from-purple-500 to-indigo-500",
        },
      ],
    },
  ];

  return (
    <div id="features" className="relative">
      {/* Section Header */}
      <section className="px-4 sm:px-6 py-8 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-primary">
            <span className="text-foreground">Everything you need,</span>
            <br />
            <span className="text-gradient-primary">nothing you don&apos;t</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Designed around clarity and direction—not feature overload
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="px-4 sm:px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-background/60 border border-border rounded-2xl p-2 overflow-x-auto">
            <div className="flex gap-2 min-w-max sm:min-w-0 sm:grid sm:grid-cols-4">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(index)}
                  className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap flex flex-col items-center sm:items-start gap-0.5 ${
                    activeCategory === index
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  <span>{category.name}</span>
                  <span className={`text-xs ${activeCategory === index ? "text-primary-foreground/70" : "text-muted-foreground/70"}`}>
                    {category.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 sm:px-6 pb-20 sm:pb-28 font-marketing">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories[activeCategory].features.map((feature, index) => (
              <div
                key={index}
                className="group backdrop-blur-xl bg-background/40 border-2 border-border hover:border-primary/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02]"
              >
                {/* Icon */}
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-3">
                  {feature.highlights.map((highlight, hIndex) => (
                    <li key={hIndex} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesSection;
