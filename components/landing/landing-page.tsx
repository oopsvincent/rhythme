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
  Target, 
  Sparkles,
  Compass,
  Heart,
  TrendingUp,
  ArrowRight,
  Play,
  CheckCircle2,
  Lightbulb
} from "lucide-react";
import { TextGradient } from "@/components/text-gradient";
import FeaturesSection from "./features";

interface PillarCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

interface RhythmeLandingProps {
  user?: {
    id: string;
  } | null;
}

const PillarCard: React.FC<PillarCardProps> = ({ icon, title, description, gradient }) => (
  <Card className="group relative overflow-hidden border border-border/50 backdrop-blur-xl bg-background/40 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:scale-[1.02]">
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${gradient}`}></div>
    <CardHeader className="relative z-10">
      <div className="mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <div className="text-primary group-hover:text-accent transition-colors duration-300">
          {icon}
        </div>
      </div>
      <CardTitle className="text-xl font-bold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="relative z-10">
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </CardContent>
  </Card>
);

const HowItWorksStep = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <div className="flex gap-4 group">
    <div className="flex-shrink-0">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/30">
        {number}
      </div>
      {number < 4 && (
        <div className="w-0.5 h-16 bg-gradient-to-b from-primary/50 to-transparent mx-auto mt-2"></div>
      )}
    </div>
    <div className="pb-8">
      <h4 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors duration-300">{title}</h4>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  </div>
);

const RhythmeLanding: React.FC<RhythmeLandingProps> = ({ user }) => {
  const pillars = [
    {
      icon: <Target className="w-7 h-7" />,
      title: "One Goal Focus",
      description: "Set one meaningful long-term goal. Everything else—tasks, habits, reflections—aligns to move you forward.",
      gradient: "from-primary/10 to-transparent"
    },
    {
      icon: <Compass className="w-7 h-7" />,
      title: "Next Best Action",
      description: "Every day, Rhythmé gives you one small, doable step. No overwhelm. Just clarity on where to start.",
      gradient: "from-accent/10 to-transparent"
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Meaningful Progress",
      description: "Track not just tasks completed, but confidence built. Every small win shapes who you're becoming.",
      gradient: "from-primary/10 to-transparent"
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Supportive Reflections",
      description: "Daily micro-journals and weekly insights help you understand your patterns and refine your path.",
      gradient: "from-accent/10 to-transparent"
    }
  ];

  const coreValues = [
    { icon: <Compass className="w-5 h-5" />, text: "Direction over productivity" },
    { icon: <Heart className="w-5 h-5" />, text: "Safety over pressure" },
    { icon: <Lightbulb className="w-5 h-5" />, text: "Clarity over complexity" },
  ];

  // Hidden testimonials - ready for real data
  const testimonials = [
    {
      username: "Coming Soon",
      role: "Early User",
      comment: "Real testimonials will appear here once we have user feedback.",
      avatar: null
    }
  ];
  const showTestimonials = false; // Toggle when ready

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-[150px]"></div>

      {/* Hero Section */}
      <section id="hero" className="pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-20 md:pb-28 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-sm font-medium text-primary">Your personal direction system</span>
          </div>

          {/* Logo Circle */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            <div className="relative w-full h-full backdrop-blur-xl bg-background/60 border-2 border-primary/30 rounded-full flex items-center justify-center group-hover:border-primary/60 transition-all duration-300 group-hover:scale-105 shadow-2xl shadow-primary/20">
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight font-primary">
            <span className="text-foreground">Finally know</span>
            <br />
            <TextGradient 
              highlightColor="var(--primary)" 
              baseColor="var(--accent)"
              spread={30}
              duration={3}
              className="font-bold"
            >
              where to start.
            </TextGradient>
          </h1>
          
          <p className="font-marketing text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Rhythmé is your personal direction system. Set one goal, break it down, and take 
            <span className="text-foreground font-medium"> one small step </span>
            every day.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/signup/intro">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 group glow-primary">
                Find Your Direction
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 backdrop-blur-xl bg-background/40 border-2 border-border hover:border-primary/50 transition-all duration-300 group">
                <Play className="w-5 h-5 mr-2 group-hover:text-primary transition-colors duration-300" />
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Core Values Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {coreValues.map((value, index) => (
              <div 
                key={index}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-background/40 border border-border/50 text-sm text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all duration-300"
              >
                <span className="text-primary">{value.icon}</span>
                {value.text}
              </div>
            ))}
          </div>

          {/* Pillar Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, index) => (
              <PillarCard
                key={index}
                icon={pillar.icon}
                title={pillar.title}
                description={pillar.description}
                gradient={pillar.gradient}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Simple & Powerful
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-primary">
              <span className="text-foreground">How </span>
              <span className="text-gradient-primary">Rhythmé</span>
              <span className="text-foreground"> works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From overwhelm to action in four simple steps
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Steps */}
            <div className="space-y-2">
              <HowItWorksStep 
                number={1}
                title="Set your one long-term goal"
                description="What do you truly want to achieve? Learn web development, write a book, get fit—pick the one thing that matters most."
              />
              <HowItWorksStep 
                number={2}
                title="Break it into sub-goals"
                description="Either list your own milestones or let our AI suggest them. HTML → CSS → JavaScript → Your first project."
              />
              <HowItWorksStep 
                number={3}
                title="Get your Next Best Action"
                description="Every day, Rhythmé gives you one small, doable step with a reason why it matters. No decision fatigue."
              />
              <HowItWorksStep 
                number={4}
                title="Reflect, refine, repeat"
                description="Quick daily check-ins and weekly reviews help Rhythmé learn your rhythm and optimize your path forward."
              />
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="backdrop-blur-xl bg-background/40 border border-border rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 space-y-6">
                  {/* Mock NBAE Card */}
                  <div className="bg-background/60 border border-border rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-sm font-medium text-primary">Today&apos;s Next Best Action</span>
                    </div>
                    <p className="text-lg font-medium mb-3">
                      Spend 15 minutes watching a CSS Flexbox tutorial
                    </p>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Lightbulb className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <p>This builds on yesterday&apos;s HTML basics and keeps your momentum light while moving toward your goal.</p>
                    </div>
                  </div>

                  {/* Goal Progress */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Goal: Learn Web Development</span>
                    <span className="text-primary font-medium">Sub-goal 2 of 6</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">7</div>
                      <div className="text-xs text-muted-foreground">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">23</div>
                      <div className="text-xs text-muted-foreground">Actions Done</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">↑</div>
                      <div className="text-xs text-muted-foreground">Momentum</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-br from-primary/5 via-background/80 to-accent/5 border border-border rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-accent/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 font-primary">
                The Rhythmé Philosophy
              </h2>
              
              <blockquote className="text-xl sm:text-2xl md:text-3xl font-marketing text-muted-foreground mb-8 leading-relaxed">
                &ldquo;Imperfect action builds confidence.<br />
                Confidence creates momentum.<br />
                Momentum shapes identity.&rdquo;
              </blockquote>

              <div className="flex flex-wrap justify-center gap-3">
                {["Confidence", "Direction", "Discipline", "Safety", "Meaning"].map((value, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section - Hidden for now */}
      {showTestimonials && (
        <section id="testimonials" className="py-20 sm:py-28 px-4 sm:px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Community
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-primary">
              Loved by Those Who Found Their Direction
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Real stories from real people who finally know where to start
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="backdrop-blur-xl bg-background/40 border border-border hover:border-primary/30 transition-all duration-300 text-left">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground italic mb-4">&ldquo;{testimonial.comment}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold">{testimonial.username[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.username}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 animate-pulse"></div>
            <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 bg-accent/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 font-primary">
                Ready to Know Your Next Step?
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Stop wondering where to start. Let Rhythmé guide you to clarity, one small action at a time.
              </p>
              <Link href="/signup/intro">
                <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 group">
                  Start Your Journey
                  <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                </Button>
              </Link>
              <p className="mt-6 text-sm text-muted-foreground">
                No credit card required • Free to start
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RhythmeLanding;