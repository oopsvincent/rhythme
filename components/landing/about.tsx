"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Target,
  Heart,
  Users,
  Lightbulb,
  Sparkles,
  Award,
  Shield,
  ArrowRight,
  Rocket,
} from "lucide-react";

interface ValueCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Stat {
  number: string;
  label: string;
  icon: React.ReactNode;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

const AboutPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const values: ValueCard[] = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Human-Centered Design",
      description: "We design for real people with real challenges. Every feature is built with empathy and care.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy First",
      description: "Your data is yours. We never sell your information and use end-to-end encryption to protect it.",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Continuous Innovation",
      description: "We're constantly learning, iterating, and improving based on your feedback and needs.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Driven",
      description: "Our community shapes our roadmap. Your voice matters in building the future of Rhythmé.",
    },
  ];

  const stats: Stat[] = [
    {
      number: "10K+",
      label: "Active Users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      number: "1M+",
      label: "Habits Tracked",
      icon: <Target className="w-5 h-5" />,
    },
    {
      number: "98%",
      label: "Satisfaction Rate",
      icon: <Award className="w-5 h-5" />,
    },
    {
      number: "24/7",
      label: "Support Available",
      icon: <Sparkles className="w-5 h-5" />,
    },
  ];

  const timeline: TimelineItem[] = [
    {
      year: "2024",
      title: "The Beginning",
      description: "Rhythmé was born from a simple idea: productivity tools shouldn't be complicated. Started as a side project by developers frustrated with existing solutions.",
    },
    {
      year: "Q2 2024",
      title: "Beta Launch",
      description: "Released our beta to 100 early adopters. Their feedback shaped everything from our UI to core features.",
    },
    {
      year: "Q3 2024",
      title: "Public Launch",
      description: "Opened Rhythmé to the public. Reached 1,000 users in the first month, exceeding all expectations.",
    },
    {
      year: "Q4 2024",
      title: "Major Updates",
      description: "Launched AI-powered insights, advanced analytics, and mobile apps. Community grew to 10,000+ users.",
    },
    {
      year: "2025",
      title: "The Future",
      description: "Working on team collaboration features, advanced integrations, and expanding our AI capabilities.",
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Building the Future of Productivity
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We believe that building better habits and achieving goals shouldn't require juggling multiple apps or complicated systems. Rhythmé is our answer to that challenge.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup/intro">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 group flex items-center justify-center gap-2">
                  Join Our Community
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
              <Link href="#story">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-xl bg-background/60 border-2 border-border hover:border-primary/50 rounded-lg font-semibold transition-all duration-300">
                  Read Our Story
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 sm:py-12 px-4 sm:px-6">
          <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-background/40 border border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-primary">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="story" className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-xl bg-background/60 border-2 border-border rounded-3xl p-8 sm:p-12 md:p-16">
              <div className="text-center mb-8 sm:mb-12">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                  Our Mission
                </h2>
              </div>

              <div className="space-y-6 text-muted-foreground">
                <p className="text-base sm:text-lg leading-relaxed">
                  We started Rhythmé because we were tired of productivity apps that promised everything but delivered complexity. We tried them all—habit trackers that forgot about journaling, task managers that ignored focus time, analytics tools that overwhelmed rather than inspired.
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  The truth is, building better habits and achieving your goals shouldn't require a PhD in productivity systems. It should feel natural, even enjoyable. That's why we created Rhythmé—a single, beautifully designed space where habits, tasks, focus, and reflection come together seamlessly.
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  Our mission is simple: <strong className="text-foreground">empower everyone to build the life they want, one small habit at a time.</strong> We believe that with the right tools and support, anyone can transform their daily routine and achieve extraordinary things.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Our Values
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                These principles guide every decision we make and every feature we build
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group backdrop-blur-xl bg-background/40 border-2 border-border hover:border-primary/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-105"
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

        {/* Timeline Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Our Journey
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                From idea to impact—here's how we got here
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary transform sm:-translate-x-1/2"></div>

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
                    <div className="absolute left-4 sm:left-1/2 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center transform sm:-translate-x-1/2 shadow-lg shadow-primary/50">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>

                    {/* Content Card */}
                    <div className={`ml-16 sm:ml-0 sm:w-5/12 ${index % 2 === 0 ? 'sm:pr-12' : 'sm:pl-12'}`}>
                      <div className="backdrop-blur-xl bg-background/60 border-2 border-border hover:border-primary/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                        <div className="inline-block px-3 py-1 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full text-sm font-semibold mb-3">
                          {item.year}
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
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Built by Makers, For Makers
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                We're a small, passionate team dedicated to helping you achieve your goals
              </p>
            </div>

            <div className="backdrop-blur-xl bg-background/60 border-2 border-border rounded-3xl p-8 sm:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center border-4 border-background">
                      <Users className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4">We're Growing!</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Rhythmé started as a side project and has grown into a product used by thousands. We're bootstrapped, indie, and focused on building something that genuinely helps people. If you're passionate about productivity and want to join us on this journey, we'd love to hear from you.
                  </p>
                  <Link href="/careers">
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 group">
                      View Open Positions
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </Link>
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
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                  Join Us on This Journey
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Be part of a community that's building better habits and achieving extraordinary things, one day at a time.
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