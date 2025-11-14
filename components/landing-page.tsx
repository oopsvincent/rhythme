"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Star, 
  BookOpen, 
  Timer, 
  Trophy, 
  Zap,
  Target,
  Brain,
  Sparkles,
  TrendingUp,
  Calendar,
  BarChart3
} from "lucide-react";
import FeaturesSectionLanding from "./features-section";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TestimonialProps {
  username: string;
  rating: number;
  comment: string;
}

interface RhythmeLandingProps {
  user?: {
    id: string;
  } | null;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Card className="group border-2 border-border backdrop-blur-xl bg-background/40 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105">
    <CardHeader>
      <div className="mb-2 text-center flex justify-center items-center text-primary group-hover:text-accent transition-colors duration-300 group-hover:scale-110 transform">
        {icon}
      </div>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const TestimonialCard: React.FC<TestimonialProps> = ({ username, rating, comment }) => (
  <Card className="backdrop-blur-xl bg-background/40 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
    <CardHeader>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-foreground">{username}</span>
        <div className="flex">
          {[...Array(rating)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-primary text-primary"
            />
          ))}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground italic">&ldquo;{comment}&rdquo;</p>
    </CardContent>
  </Card>
);

const RhythmeLanding: React.FC<RhythmeLandingProps> = ({ user }) => {
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Your Personal Growth Hub",
      description: "Track habits, journal insights, stay focused, and measure your progress—all seamlessly integrated"
    },
    {
      icon: <Check className="w-8 h-8" />,
      title: "Build Better Days",
      description: "Organize tasks, capture thoughts, and manage life with intelligent prioritization and smart scheduling"
    },
    {
      icon: <Timer className="w-8 h-8" />,
      title: "Stay Focused, Stay Balanced",
      description: "Boost productivity with advanced Focus Mode, Pomodoro techniques, and AI-powered time management"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Achieve Through Gamification",
      description: "Hit milestones, unlock achievements, maintain streaks, and compete with yourself through engaging challenges"
    }
  ];

  const testimonials = [
    {
      username: "Sarah M.",
      rating: 5,
      comment: "Rhythmé transformed how I approach my daily routine. My productivity has skyrocketed!"
    },
    {
      username: "Alex K.",
      rating: 5,
      comment: "The focus timer keeps me from doom-scrolling. Total game changer for my work-life balance."
    },
    {
      username: "Maya R.",
      rating: 4,
      comment: "It feels less like work and more like a lifestyle. The gamification makes everything fun!"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background via-accent/5 to-background relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"></div>

      {/* Navbar will be added by parent component */}

      {/* Hero Section */}
      <section id="hero" className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          {/* Logo Circle */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
            <div className="relative w-full h-full backdrop-blur-xl bg-background/60 border-2 border-primary/30 rounded-full flex items-center justify-center group-hover:border-primary/50 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-primary/10">
              <Image 
                src="/Rhythme.svg" 
                alt="Rhythmé logo" 
                width={60} 
                height={60}
                className="group-hover:brightness-110 transition-all duration-300"
              />
            </div>
          </div>

          {/* Hero Text */}
          <h2 className="text-3xl pb-3 font-marketing sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] px-4">
            Find Your Flow with Rhythmé
          </h2>
          <p className="font-marketing text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
            Build lasting habits, maintain laser focus, and unlock your best self with AI-powered insights—all in one beautifully designed app
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
            <Link href="/signup/intro">
              <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 group">
                Get Started Free
                <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 backdrop-blur-xl bg-background/40 border-2 border-border hover:border-primary/50 transition-all duration-300">
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSectionLanding />

      {/* Stats Section */}
      {/* <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-background/40 border border-border rounded-2xl p-6 sm:p-8 md:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  10K+
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Users</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  1M+
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Habits Tracked</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  98%
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Satisfaction Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">AI Support</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      <section id="testimonials" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            The Rhythm to Your Productivity
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12">
            Join thousands who&apos;ve transformed their daily routines
          </p>

          <p className="text-lg sm:text-xl font-semibold mb-6 sm:mb-8 text-primary">Loved by Our Community:</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                username={testimonial.username}
                rating={testimonial.rating}
                comment={testimonial.comment}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-2xl p-8 sm:p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 animate-pulse"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Ready to Find Your Rhythm?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
                Start building better habits today. No credit card required.
              </p>
              <Link href="/signup/intro">
                <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 md:px-10 py-4 sm:py-6 bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 group">
                  Start Your Journey
                  <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RhythmeLanding;