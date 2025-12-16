"use client";

import { SiteHeader } from "@/components/site-header";
import { TextGradient } from "@/components/text-gradient";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Brain, 
  Heart, 
  BookOpen,
  PenLine,
  BarChart3,
  Calendar
} from "lucide-react";

export default function JournalPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative overflow-hidden">
          
          {/* Animated Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Primary glow orb */}
            <div 
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] animate-pulse"
              style={{ 
                background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
                animationDuration: "4s"
              }}
            />
            {/* Accent glow orb */}
            <div 
              className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] animate-pulse"
              style={{ 
                background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
                animationDuration: "5s",
                animationDelay: "1s"
              }}
            />
            {/* Floating particles */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary/30 animate-float"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${3 + i * 0.5}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center max-w-4xl w-full space-y-8 md:space-y-12">
            
            {/* Coming Soon Badge */}
            <Badge 
              variant="outline" 
              className="px-4 py-1.5 text-sm font-medium border-primary/30 bg-primary/5 text-primary backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Coming End of 2025
            </Badge>

            {/* Hero Title */}
            <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-primary tracking-tight">
                <TextGradient 
                  highlightColor="var(--primary)"
                  baseColor="var(--foreground)"
                  duration={3}
                  spread={40}
                >
                  Journaling
                </TextGradient>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Powered by <span className="text-primary font-semibold">AI Sentimental Analysis</span> to understand 
                your emotions and patterns.
              </p>
            </div>

            {/* Model Badge */}
            <div className="animate-in fade-in zoom-in duration-700 delay-300">
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl glass-card glow-primary transition-all duration-500 hover:scale-105">
                <Brain className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Emotion Model</p>
                  <p className="text-lg font-bold font-primary text-gradient-primary">sentiment-rvo2</p>
                </div>
                <Heart className="w-4 h-4 text-accent" />
              </div>
            </div>

            {/* Features Pills */}
            <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              {[
                { icon: PenLine, label: "Daily Journaling" },
                { icon: Heart, label: "Mood Tracking" },
                { icon: BarChart3, label: "Sentiment Analysis" },
                { icon: Calendar, label: "Pattern Recognition" },
              ].map(({ icon: Icon, label }) => (
                <div 
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50 text-sm text-muted-foreground transition-all duration-300 hover:bg-muted hover:border-border"
                >
                  <Icon className="w-4 h-4 text-accent" />
                  {label}
                </div>
              ))}
            </div>

            {/* Description Card */}
            <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
              <div className="glass-card rounded-2xl p-8 space-y-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold font-primary">What&apos;s Coming</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our journaling feature will use advanced <span className="text-accent font-medium">sentimental analysis</span> to 
                    help you understand your emotional patterns, track your mental wellness journey, 
                    and provide personalized insights based on your daily reflections.
                  </p>
                </div>

                <div className="pt-4 border-t border-border/30">
                  <p className="text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 inline mr-2 text-primary" />
                    Stay tuned for the launch at the <span className="text-primary font-semibold">end of 2025</span>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
