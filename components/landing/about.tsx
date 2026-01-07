"use client";

import React, { useState } from "react";
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
  Lock,
  Eye,
  TrendingUp,
  Rocket,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ValueCard {
  icon: React.ElementType;
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const values: ValueCard[] = [
    {
      icon: Lightbulb,
      title: "Clarity First",
      description: "Every feature we build guides you toward action. No confusion, no overwhelm—just clear next steps.",
    },
    {
      icon: Heart,
      title: "Emotional Safety",
      description: "We speak like a supportive friend, never a demanding taskmaster. Your well-being matters more than your output.",
    },
    {
      icon: Target,
      title: "Meaningful Progress",
      description: "Small wins build lasting change. We help you see how every tiny action moves you toward who you want to become.",
    },
    {
      icon: Shield,
      title: "Privacy by Design",
      description: "Your journey is personal. We never sell your data, and we protect your reflections with serious encryption.",
    },
  ];

  const timeline: TimelineItem[] = [
    {
      stage: "Phase 1",
      title: "MVP - Foundation",
      description: "Core goal workspace, tasks, habits, journaling, and basic insights.",
      status: "current",
    },
    {
      stage: "Phase 2",
      title: "Next Best Action Engine",
      description: "AI-powered daily micro-actions with reasoning and context awareness.",
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
      title: "Research Platform",
      description: "Tools for studying human attention and focus in the digital age.",
      status: "upcoming",
    },
  ];

  return (
    <div 
      className="min-h-screen w-full bg-background relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Mouse-following Glow */}
      <div 
        className="pointer-events-none fixed w-[400px] h-[400px] rounded-full opacity-10 blur-[120px] transition-all duration-700 ease-out z-0"
        style={{ 
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
        }}
      />

      {/* Background effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Logo */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-2xl"></div>
              <div className="relative w-full h-full backdrop-blur-xl bg-background/60 border-2 border-primary/30 rounded-full flex items-center justify-center shadow-2xl shadow-primary/20">
                <Image 
                  src="/Rhythme.svg" 
                  alt="Rhythmé logo" 
                  width={50} 
                  height={50}
                />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 font-primary">
              <span className="text-foreground">About </span>
              <span className="text-gradient-primary">Rhythmé</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Building human-aware systems that understand attention, motivation, and focus 
              in the age of endless distraction.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup/intro">
                <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:scale-105 group flex items-center justify-center gap-2">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
              <a href="#partner">
                <button className="w-full sm:w-auto px-8 py-4 glass-card border-primary/30 rounded-xl font-semibold transition-all duration-500 hover:border-primary/50">
                  Partner With Us
                </button>
              </a>
            </div>
          </motion.div>
        </section>

        {/* Vision Section */}
        <section id="vision" className="py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-60 h-60 bg-primary/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-6">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 font-primary">
                  Our Vision
                </h2>
                
                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    <span className="text-foreground font-medium">The problem is clear:</span> We live in an era of unprecedented 
                    distraction. Short-form content, infinite scrolling, and instant gratification have rewired how we interact 
                    with technology—and with our own goals.
                  </p>
                  <p>
                    Traditional productivity apps assume you know what to do and just need a place to write it down. 
                    <span className="text-primary font-medium"> But the real problem is deeper:</span> people struggle to start, 
                    to maintain focus, and to build lasting momentum.
                  </p>
                  <p>
                    <span className="text-foreground font-medium">Rhythmé exists to solve this.</span> We're building AI that 
                    genuinely understands human psychology—attention, motivation, procrastination, and emotional state. 
                    Not to exploit these patterns, but to help people work with their natural rhythms.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Research Focus Section */}
        <section id="research" className="py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                <Brain className="w-4 h-4 inline mr-2" />
                Research Focus
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 font-primary">
                Building Human-Aware AI
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our research pillars shape every feature we build.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  icon: Eye, 
                  title: "Attention Science", 
                  description: "Understanding how human attention works in the digital age, and building tools that respect it rather than exploit it." 
                },
                { 
                  icon: Brain, 
                  title: "Procrastination Research", 
                  description: "Studying the psychological roots of procrastination to create interventions that actually work." 
                },
                { 
                  icon: Heart, 
                  title: "Emotional Intelligence", 
                  description: "Developing AI that can detect emotional state and adapt its approach—supportive when you're struggling, motivating when you're ready." 
                },
                { 
                  icon: Zap, 
                  title: "Behavior Change", 
                  description: "Applying behavioral science to help people build lasting habits and break procrastination cycles." 
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="glass-card rounded-2xl p-6 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold font-primary mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-sm font-medium mb-4">
                <Shield className="w-4 h-4 inline mr-2" />
                Trust & Ethics
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 font-primary">
                Our Commitment
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Lock, title: "No Data Selling", description: "Your personal data is never sold to third parties. Ever." },
                { icon: Eye, title: "Transparent AI", description: "When AI makes suggestions, we show exactly why." },
                { icon: Shield, title: "Privacy First", description: "End-to-end encryption. Anonymous by default." },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="glass-card rounded-2xl p-6 border-green-500/20 text-center"
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold font-primary mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                What We Believe
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 font-primary">
                Core Values
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="glass-card rounded-2xl p-8 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold font-primary mb-2">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Our Journey
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 font-primary">
                Product Roadmap
              </h2>
            </motion.div>

            <div className="space-y-4">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={cn(
                    "glass-card rounded-2xl p-6 transition-all duration-500",
                    item.status === "current" && "border-primary/50 shadow-lg shadow-primary/10"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      item.status === "current" && "bg-gradient-to-br from-primary to-accent text-primary-foreground",
                      item.status === "upcoming" && "bg-muted text-muted-foreground"
                    )}>
                      {item.status === "current" ? (
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs font-semibold",
                          item.status === "current" && "bg-primary text-primary-foreground",
                          item.status === "upcoming" && "bg-muted text-muted-foreground"
                        )}>
                          {item.stage}
                        </span>
                        {item.status === "current" && (
                          <span className="text-xs text-primary font-medium">Now</span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Section - For Investors/VCs */}
        <section id="partner" className="py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Rocket className="w-4 h-4 inline mr-2" />
                Partner With Us
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 font-primary">
                Building the Future Together
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're on a mission to redefine how people interact with productivity tools. 
                We welcome partners who share our vision for human-aware technology.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8 sm:p-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">$2T+</div>
                  <div className="text-sm text-muted-foreground">Global productivity market</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">72%</div>
                  <div className="text-sm text-muted-foreground">Adults struggle with focus</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-1">Novel</div>
                  <div className="text-sm text-muted-foreground">Human-aware AI approach</div>
                </div>
              </div>
              
              <p className="text-muted-foreground text-center mb-6">
                Interested in our mission? We'd love to share our deck and discuss how we're approaching this space.
              </p>
              
              <div className="flex justify-center">
                <a href="mailto:hello@rhythme.app?subject=Partnership%20Inquiry">
                  <button className="px-8 py-4 glass-card border-primary/30 rounded-xl font-semibold transition-all duration-500 hover:border-primary/50 hover:bg-primary/5">
                    Get in Touch
                  </button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 sm:p-12 border-primary/30 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
              
              <div className="relative z-10">
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary to-accent mb-6">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 font-primary">
                  Ready to Find Your Direction?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands who've discovered clarity. Start your journey today.
                </p>
                
                <Link href="/signup/intro">
                  <button className="px-10 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:scale-105">
                    Get Started Free
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
