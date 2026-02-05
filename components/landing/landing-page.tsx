"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Sparkles,
  Compass,
  Heart,
  ArrowRight,
  Shield,
  Eye,
  Lock,
  Brain,
  Lightbulb,
  Zap,
  ChevronDown,
  Check,
} from "lucide-react";
import { TextGradient } from "@/components/text-gradient";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import PricingComponent from "./pricing";

interface RhythmeLandingProps {
  user?: {
    id: string;
  } | null;
}

const RhythmeLanding: React.FC<RhythmeLandingProps> = ({ user }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Privacy & Transparency values
  const trustValues = [
    { 
      icon: Lock, 
      title: "Your Data, Your Control", 
      description: "We never sell your data. Period. Your journal entries, goals, and reflections stay yours." 
    },
    { 
      icon: Eye, 
      title: "Transparent AI", 
      description: "When AI assists you, we show you exactly why it made that suggestion. No black boxes." 
    },
    { 
      icon: Shield, 
      title: "Privacy by Design", 
      description: "Data is used only when you need it. Anonymous by default, explicit when required." 
    },
  ];

  // Core pillars - simplified
  const pillars = [
    {
      icon: Target,
      title: "One Goal Focus",
      description: "Set one meaningful long-term goal. Everything else aligns to move you forward.",
    },
    {
      icon: Compass,
      title: "Next Best Action",
      description: "Every day, one small doable step. No overwhelm. Just clarity.",
    },
    {
      icon: Heart,
      title: "Supportive Reflections",
      description: "Daily micro-journals help you understand your patterns.",
    },
  ];

  // FAQ for transparency
  const faqs = [
    {
      question: "How is my data used?",
      answer: "Your data is used only to power your personal experience. We never sell, share, or use your data for advertising. When we use AI features, we're transparent about what data is accessed and why."
    },
    {
      question: "Can I delete my data?",
      answer: "Yes, completely. You can export all your data anytime and request full deletion. No hidden copies, no retention periods beyond what's legally required."
    },
    {
      question: "What makes Rhythmé different?",
      answer: "We're building for the long term—researching human-aware systems that understand attention, procrastination, and focus in the age of short-form dopamine. We're not just another productivity app."
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

      {/* Ambient background effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }}></div>

      {/* ============================================
          HERO SECTION - Simple & Emotional
      ============================================ */}
      <section className="pt-24 sm:pt-28 md:pt-34 pb-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-10">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm font-medium text-primary">Built for those who feel lost but refuse to stay that way</span>
            </div>
          </motion.div>

          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-10 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
            <div className="relative w-full h-full backdrop-blur-xl bg-background/60 border-2 border-primary/30 rounded-full flex items-center justify-center group-hover:border-primary/60 transition-all duration-500 group-hover:scale-105 shadow-2xl shadow-primary/20">
              <Image 
                src="/Rhythme.svg" 
                alt="Rhythmé logo" 
                width={50} 
                height={50}
                className="transition-all duration-500"
              />
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight font-primary"
          >
            <span className="text-foreground">You know where you want to go.</span>
            <br />
            <TextGradient 
              highlightColor="var(--primary)" 
              baseColor="var(--accent)"
              spread={30}
              duration={3}
            >
              We help you start.
            </TextGradient>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-marketing text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            In a world of endless distractions and short-form dopamine, Rhythmé gives you 
            <span className="text-foreground font-medium"> one clear step </span>
            toward your long-term goal. Every single day.
          </motion.p>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link href="/signup/intro">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-500 hover:scale-105 group">
                Find Your Direction
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-muted-foreground"
          >
            Free to start • No credit card • Your data stays yours
          </motion.p>
        </div>
      </section>

      {/* ============================================
          PILLARS - 3 Core Values
      ============================================ */}
      <section className="py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-2xl p-8 text-center group transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-primary mb-3">{pillar.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{pillar.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          TRUST & TRANSPARENCY SECTION
      ============================================ */}
      <section className="py-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-sm font-medium mb-4 border border-green-500/20">
              <Shield className="w-4 h-4 inline mr-2" />
              Trust & Transparency
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-primary mb-4">
              We earn your trust by <span className="text-gradient-primary">being different</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Most apps track you to sell ads. We built Rhythmé to actually help you—nothing more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-2xl p-8 border-green-500/20 group transition-all duration-500"
                >
                  <div className="w-12 h-12 mb-6 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold font-primary mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          FUTURE VISION SECTION
      ============================================ */}
      <section className="py-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden text-center"
          >
            <div className="absolute top-0 right-0 w-60 h-60 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-accent/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-6">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 font-primary">
                Building the Future of <span className="text-gradient-primary">Human-Aware Systems</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                We&apos;re not just building another productivity app. We&apos;re researching how AI can truly understand 
                <span className="text-foreground font-medium"> human attention, procrastination, and motivation </span> 
                in an era dominated by short-form content and instant gratification.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {[
                  { icon: Lightbulb, text: "Focus Research" },
                  { icon: Brain, text: "Human-Aware AI" },
                  { icon: Zap, text: "Anti-Procrastination" },
                  { icon: Heart, text: "Emotional Intelligence" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-sm"
                    >
                      <Icon className="w-4 h-4 text-primary" />
                      {item.text}
                    </div>
                  );
                })}
              </div>

              <p className="text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 inline mr-1 text-primary" />
                Premium members get <span className="text-primary font-medium">early access</span> to our research breakthroughs.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          FAQ - TRANSPARENCY
      ============================================ */}
      <section className="py-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-primary mb-4">
              Questions? We answer honestly.
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 transition-all duration-300"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform duration-300",
                    expandedFaq === index && "rotate-180"
                  )} />
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          PRICING SECTION
      ============================================ */}
      <PricingComponent />

      {/* ============================================
          FINAL CTA
      ============================================ */}
      <section className="py-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 sm:p-12 md:p-16 border-primary/30 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 font-primary">
                Stop scrolling. <span className="text-gradient-primary">Start building.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Your future self will thank you for starting today.
              </p>
              
              <Link href="/signup/intro">
                <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:scale-105 group">
                  Start Your Journey — It&apos;s Free
                  <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                </Button>
              </Link>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                {["No credit card required", "Your data stays private", "Cancel anytime"].map((text, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RhythmeLanding;