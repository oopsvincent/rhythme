"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { TextGradient } from "@/components/text-gradient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Send, 
  Mic, 
  Crown, 
  Brain, 
  Heart, 
  Zap,
  ArrowRight,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const suggestions = [
  "How can I stay focused today?",
  "Generate a morning routine for me",
  "What habits should I build?",
  "Help me plan my week",
];

export default function AIPage() {
  const [inputValue, setInputValue] = useState("");
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  const handleSuggestionClick = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

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
              Coming Soon
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
                  Rhythmé AI
                </TextGradient>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The most <span className="text-primary font-semibold">emotionally intelligent</span> AI companion, 
                designed to understand you.
              </p>
            </div>

            {/* Model Badge */}
            <div className="animate-in fade-in zoom-in duration-700 delay-300">
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl glass-card glow-primary transition-all duration-500 hover:scale-105">
                <Brain className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">First Model</p>
                  <p className="text-lg font-bold font-primary text-gradient-primary">rvo1</p>
                </div>
                <Zap className="w-4 h-4 text-accent" />
              </div>
            </div>

            {/* Features Pills */}
            <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              {[
                { icon: Brain, label: "Deep Understanding" },
                { icon: Heart, label: "Emotional Intelligence" },
                { icon: Zap, label: "Instant Insights" },
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

            {/* AI Input Section */}
            <div className="w-full max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
              <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 rounded-2xl blur-sm opacity-30 group-hover:opacity-60 transition-all duration-500 group-focus-within:opacity-60" />
                <div className="relative flex items-center glass-card rounded-2xl p-1.5 transition-all duration-300">
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask Rhythmé AI anything..."
                    className="flex-1 border-0 bg-transparent text-base md:text-lg px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
                  />
                  <div className="flex items-center gap-2 pr-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleSuggestionClick}
                      className="w-10 h-10 rounded-xl text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300"
                    >
                      <Mic className="w-5 h-5" />
                    </Button>
                    <Button
                      type="submit"
                      size="icon"
                      className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </form>

              {/* Coming Soon Toast */}
              <div 
                className={cn(
                  "text-center text-sm text-primary font-medium transition-all duration-300",
                  showComingSoon 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 -translate-y-2"
                )}
              >
                <Lock className="w-4 h-4 inline mr-2" />
                Coming soon — Stay tuned!
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    onClick={handleSuggestionClick}
                    className="px-4 py-2 text-sm rounded-full border border-border/50 bg-background/50 backdrop-blur-sm text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${800 + index * 100}ms` }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Premium CTA */}
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-all duration-500 animate-gradient" />
                <Link href="/settings/billing">
                  <div className="relative glass-card rounded-2xl p-6 space-y-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center justify-center gap-2">
                      <Crown className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-bold font-primary">Get Premium Access</h3>
                    </div>
                    <p className="text-muted-foreground text-center text-sm">
                      Be the <span className="text-accent font-semibold">first</span> to experience Rhythmé AI. 
                      Premium members get exclusive early access.
                    </p>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/30">
                      Upgrade to Premium
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Link>
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
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  );
}
