"use client";
import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle,
  ChevronRight,
  Cloud,
  Palette,
  Shield,
  Target,
  Timer,
  TrendingUp,
  Trophy,
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
  features: Feature[];
}

const FeaturesSection = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories: Category[] = [
    {
      name: "Productivity",
      features: [
        {
          icon: <Target className="w-8 h-8" />,
          title: "Habit Tracking",
          description:
            "Build lasting habits with our intelligent tracking system",
          highlights: [
            "Track unlimited habits",
            "Visual streak counters",
            "Customizable reminders",
            "Habit insights & patterns",
          ],
          gradient: "from-primary to-accent",
        },
        {
          icon: <Timer className="w-8 h-8" />,
          title: "Focus Mode & Pomodoro",
          description: "Stay in the zone with advanced focus tools",
          highlights: [
            "Customizable work sessions",
            "Break time management",
            "Focus statistics",
            "Distraction blocking",
          ],
          gradient: "from-accent to-primary",
        },
        {
          icon: <CheckCircle className="w-8 h-8" />,
          title: "Smart Task Management",
          description: "Organize your day with intelligent prioritization",
          highlights: [
            "AI-powered task sorting",
            "Deadline tracking",
            "Subtasks & dependencies",
            "Calendar integration",
          ],
          gradient: "from-primary via-accent to-primary",
        },
      ],
    },
    {
      name: "Insights",
      features: [
        {
          icon: <Brain className="w-8 h-8" />,
          title: "AI-Powered Analysis",
          description: "Get personalized insights about your productivity",
          highlights: [
            "Behavior pattern detection",
            "Productivity recommendations",
            "Mood correlation analysis",
            "Goal achievement predictions",
          ],
          gradient: "from-purple-500 to-pink-500",
        },
        {
          icon: <BarChart3 className="w-8 h-8" />,
          title: "Advanced Analytics",
          description: "Visualize your progress with beautiful charts",
          highlights: [
            "Daily, weekly, monthly views",
            "Habit completion rates",
            "Time spent analytics",
            "Export reports (PDF/CSV)",
          ],
          gradient: "from-blue-500 to-cyan-500",
        },
        {
          icon: <TrendingUp className="w-8 h-8" />,
          title: "Progress Tracking",
          description: "Monitor your growth journey over time",
          highlights: [
            "Goal milestone tracking",
            "Achievement unlocks",
            "Comparative statistics",
            "Personal best records",
          ],
          gradient: "from-green-500 to-emerald-500",
        },
      ],
    },
    {
      name: "Wellbeing",
      features: [
        {
          icon: <BookOpen className="w-8 h-8" />,
          title: "Journal & Reflection",
          description: "Capture your thoughts and track your mood",
          highlights: [
            "Rich text journaling",
            "Mood tracking",
            "Prompt suggestions",
            "Search & tag entries",
          ],
          gradient: "from-amber-500 to-orange-500",
        },
        {
          icon: <Activity className="w-8 h-8" />,
          title: "Wellness Monitoring",
          description: "Keep track of your physical and mental health",
          highlights: [
            "Sleep tracking",
            "Exercise logging",
            "Water intake reminders",
            "Stress level monitoring",
          ],
          gradient: "from-teal-500 to-green-500",
        },
        {
          icon: <Trophy className="w-8 h-8" />,
          title: "Gamification",
          description: "Stay motivated with rewards and challenges",
          highlights: [
            "Achievement badges",
            "Streak maintenance",
            "Level progression",
            "Daily challenges",
          ],
          gradient: "from-yellow-500 to-red-500",
        },
      ],
    },
    {
      name: "Platform",
      features: [
        {
          icon: <Cloud className="w-8 h-8" />,
          title: "Cloud Sync",
          description: "Access your data anywhere, anytime",
          highlights: [
            "Real-time synchronization",
            "Automatic backups",
            "Version history",
            "Multi-device support",
          ],
          gradient: "from-sky-500 to-blue-500",
        },
        {
          icon: <Shield className="w-8 h-8" />,
          title: "Privacy & Security",
          description: "Your data is encrypted and protected",
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
          title: "Customization",
          description: "Make Rhythmé truly yours",
          highlights: [
            "Custom themes",
            "Widget personalization",
            "Layout options",
            "Icon packs",
          ],
          gradient: "from-purple-500 to-indigo-500",
        },
      ],
    },
  ];

  return (
    <div>
      {" "}
      {/* Category Tabs */}
      <section id="features" className="px-4 sm:px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-background/60 border border-border rounded-2xl p-2 overflow-x-auto">
            <div className="flex gap-2 min-w-max sm:min-w-0 sm:grid sm:grid-cols-4">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(index)}
                  className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeCategory === index
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Features Grid */}
      <section className="px-4 sm:px-6 pb-12 sm:pb-20 font-marketing">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories[activeCategory].features.map((feature, index) => (
              <div
                key={index}
                className="group backdrop-blur-xl bg-background/40 border-2 border-border hover:border-primary/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:scale-105"
              >
                {/* Icon */}
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-6 text-sm">
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
