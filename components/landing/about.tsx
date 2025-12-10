"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Target,
  Heart,
  Lightbulb,
  Sparkles,
  Shield,
  ArrowRight,
  Compass,
  Brain,
  Zap,
  Users,
} from "lucide-react";

interface ValueCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TimelineItem {
  stage: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
}

const AboutPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const values: ValueCard[] = [
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Clarity First",
      description: "Every feature we build guides you toward action.  No confusion, no overwhelm—just clear next steps.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Emotional Safety",
      description: "We speak like a supportive friend, never a demanding taskmaster. Your well-being matters more than your output.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Meaningful Progress",
      description: "Small wins build lasting change. We help you see how every tiny action moves you toward who you want to become.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy by Design",
      description: "Your journey is personal. We never sell your data, and we protect your reflections with serious encryption.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Imperfect Action",
      description: "Done is better than perfect. We encourage you to start before you're ready, because momentum creates confidence.",
    },
  ];

  const timeline: TimelineItem[] = [
    {
      stage: "Phase 1",
      title: "MVP - Foundation",
      description: "Core goal workspace, tasks, habits, journaling, and basic insights. The foundation of clarity.",
      status: "current",
    },
    {
      stage: "Phase 2",
      title: "Next Best Action Engine",
      description: "AI-powered daily micro-actions with reasoning. The heart of Rhythmé's direction system.",
      status: "upcoming",
    },
    {
      stage: "Phase 3",
      title: "Emotionally Intelligent AI",
      description: "Deeper sentiment analysis, adaptive difficulty, and truly supportive dialogue.",
      status: "upcoming",
    },
    {
      stage: "Phase 4",
      title: "Social & Community",
      description: "Optional accountability features, shared journeys, and community support.",
      status: "upcoming",
    },
    {
      stage: "Future",
      title: "Identity Engine & Beyond",
      description: "Advanced identity tracking, behavioral patterns, and features we'll discover along the way.",
      status: "upcoming",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background via-accent/5 to-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            {/* Logo */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
              <div className="relative w-full h-full backdrop-blur-xl bg-background/60 border-2 border-primary/30 rounded-full flex items-center justify-center group-hover:border-primary/50 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-primary/10">
                <Image 
                  src="/Rhythme.svg" 
                  alt="Rhythmé logo" 
                  width={70} 
                  height={70}
                  className="group-hover:brightness-110 transition-all duration-300"
                />
              </div>
            </div>

            {/* Hero Text */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 font-primary">
              <span className="text-foreground">Helping you finally</span>
              <br />
              <span className="text-gradient-primary">know where to start</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Rhythmé is a productivity and well-being companion built around one simple promise: 
              remove the overwhelm and give you clear direction, one small step at a time.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup/intro">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 group flex items-center justify-center gap-2">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
              <Link href="#our-story">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-xl bg-background/60 border-2 border-border hover:border-primary/50 rounded-lg font-semibold transition-all duration-300">
                  Read Our Story
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Philosophy Banner */}
        <section className="py-8 sm:py-12 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-xl bg-gradient-to-r from-primary/10 via-background/60 to-accent/10 border border-border rounded-2xl p-6 sm:p-8 text-center">
              <blockquote className="text-lg sm:text-xl md:text-2xl font-marketing text-muted-foreground leading-relaxed">
                &ldquo;Imperfect action builds confidence. Confidence creates momentum. Momentum shapes identity.&rdquo;
              </blockquote>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {["Confidence", "Direction", "Discipline", "Safety", "Meaning"].map((value, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="our-story" className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-xl bg-background/60 border-2 border-border rounded-3xl p-8 sm:p-12 md:p-16">
              <div className="text-center mb-8 sm:mb-12">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6">
                  <Compass className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 font-primary">
                  Our Mission
                </h2>
              </div>

              <div className="space-y-6 text-muted-foreground">
                <p className="text-base sm:text-lg leading-relaxed">
                  We started Rhythmé because we know what it feels like to be overwhelmed. You have a goal—maybe learning a new skill, building a habit, or changing your life—but you don&apos;t know where to begin. The advice out there says &ldquo;just start,&rdquo; but start <em>where</em>?
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  That question—<strong className="text-foreground">&ldquo;where do I start?&rdquo;</strong>—is the one we&apos;re obsessed with answering. Not with a complicated system or a feature-packed app, but with something simple: one goal, one day, one small step.
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  Rhythmé is our answer. A direction system that meets you where you are, understands your energy, and guides you forward—not with pressure, but with clarity and care.
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  <strong className="text-foreground">Our mission is simple:</strong> help everyone finally know where to start, and trust that imperfect action will take them where they want to go.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                What We Believe
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 font-primary">
                Our Core Values
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                These principles guide every decision we make and every feature we build
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className={`group backdrop-blur-xl bg-background/40 border-2 border-border hover:border-primary/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] ${index === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-primary">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Our Journey
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 font-primary">
                The Road Ahead
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                We&apos;re building Rhythmé in phases—learning what works as we go
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-border transform sm:-translate-x-1/2"></div>

              {/* Timeline Items */}
              <div className="space-y-8 sm:space-y-12">
                {timeline.map((item, index) => (
                  <div
                    key={index}
                    className={`relative flex items-start ${
                      index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-4 sm:left-1/2 w-8 h-8 rounded-full flex items-center justify-center transform sm:-translate-x-1/2 shadow-lg ${
                      item.status === 'current' 
                        ? 'bg-gradient-to-br from-primary to-accent shadow-primary/50' 
                        : item.status === 'completed' 
                          ? 'bg-green-500 shadow-green-500/50' 
                          : 'bg-muted border-2 border-border'
                    }`}>
                      {item.status === 'current' && (
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      )}
                      {item.status === 'completed' && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>

                    {/* Content Card */}
                    <div className={`ml-16 sm:ml-0 sm:w-5/12 ${index % 2 === 0 ? 'sm:pr-12' : 'sm:pl-12'}`}>
                      <div className={`backdrop-blur-xl bg-background/60 border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${
                        item.status === 'current' 
                          ? 'border-primary/50 shadow-lg shadow-primary/10' 
                          : 'border-border hover:border-primary/30 hover:shadow-primary/10'
                      }`}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.status === 'current'
                              ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                              : item.status === 'completed'
                                ? 'bg-green-500/20 text-green-600'
                                : 'bg-muted text-muted-foreground'
                          }`}>
                            {item.stage}
                          </span>
                          {item.status === 'current' && (
                            <span className="text-xs text-primary font-medium animate-pulse">Now</span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-xl bg-background/60 border-2 border-border rounded-3xl p-8 sm:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center border-4 border-background">
                      <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                    Passion Project
                  </span>
                  <h3 className="text-2xl font-bold mb-4 font-primary">Built with Heart</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Rhythmé is built by people who personally understand the struggle of not knowing where to start. We&apos;re not a big company—we&apos;re a small team of passionate creators building something we wish existed when we needed it most.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Every feature, every word, every interaction is crafted with the care of people who genuinely want to help you find your direction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 animate-pulse"></div>
              <div className="relative z-10">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 font-primary">
                  Ready to Find Your Direction?
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join us on this journey. Start with one goal, take one step, and see where clarity takes you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup/intro">
                    <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 group flex items-center justify-center gap-2">
                      Get Started Free
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    </button>
                  </Link>
                  <Link href="/features">
                    <button className="w-full sm:w-auto px-8 py-4 backdrop-blur-xl bg-background/60 border-2 border-border hover:border-primary/50 rounded-lg font-semibold transition-all duration-300">
                      Explore Features
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

export default AboutPage;