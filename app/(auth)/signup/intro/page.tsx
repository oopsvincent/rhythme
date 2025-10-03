"use client"

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, LineChart, Clock, Trophy, ChevronsRight } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

export default function IntroPage() {
  const [slideProgress, setSlideProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const maxSlideRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const handleStart = (clientX: number): void => {
    setIsDragging(true);
    startXRef.current = clientX - slideProgress;
    currentXRef.current = clientX;
    if (buttonRef.current) {
      maxSlideRef.current = buttonRef.current.offsetWidth - 80;
    }
  };

  const handleMove = (clientX: number): void => {
    if (!isDragging) return;
    
    currentXRef.current = clientX;
    
    // Cancel previous animation frame if it exists
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Use requestAnimationFrame for smooth updates
    animationFrameRef.current = requestAnimationFrame(() => {
      const diff = currentXRef.current - startXRef.current;
      const progress = Math.max(0, Math.min(diff, maxSlideRef.current));
      setSlideProgress(progress);

      // Auto-navigate when slide is complete
      if (progress >= maxSlideRef.current * 0.85) {
        handleComplete();
      }
    });
  };

  const handleEnd = (): void => {
    setIsDragging(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (slideProgress < maxSlideRef.current * 0.85) {
      setSlideProgress(0);
    }
  };

  const handleComplete = (): void => {
    setIsDragging(false);
    setSlideProgress(maxSlideRef.current);
    setTimeout(() => {
      // Navigate to next page
      window.location.href = "/signup/create";
    }, 150);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-background overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center mt-8 md:mt-12 text-center px-6">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
          <span className="text-primary-foreground text-3xl md:text-4xl font-bold font-primary">R</span>
        </div>
        <h1 className="mt-4 md:mt-6 font-bold text-3xl md:text-4xl leading-tight font-primary">
          Welcome to <span className="text-primary">Rhythmé</span>
        </h1>
      </div>

      {/* Features */}
      <div className="flex flex-col justify-center items-center gap-5 w-full bg-accent/20 rounded-t-[3rem] md:rounded-t-[4rem] pt-8 pb-6 px-4">
        <Card className="w-full max-w-md md:max-w-lg rounded-2xl shadow-lg border-border bg-card">
          <CardContent className="space-y-6 p-6 md:p-8">
            <Feature
              icon={<LineChart size={28} className="text-primary mt-2.5" />}
              title="Your Personal Growth Space"
              text="Create routines that stick, stay focused, and reflect on your progress."
            />
            <Feature
              icon={<CheckCircle size={28} className="text-primary mt-2.5" />}
              title="Build Better Days"
              text="Track habits, journal your thoughts, and manage tasks — all in one place."
            />
            <Feature
              icon={<Clock size={28} className="text-primary mt-2.5" />}
              title="Stay Focused, Stay Balanced"
              text="Boost productivity with Focus Mode, Pomodoro, and a smart task scheduler."
            />
            <Feature
              icon={<Trophy size={28} className="text-primary mt-2.5" />}
              title="Achieve Through Play"
              text="Stay motivated with gamified challenges, rewards, and streaks."
            />
          </CardContent>
        </Card>

        {/* Slide to Continue Button */}
        <div className="w-full max-w-md md:max-w-lg px-4">
          <div
            ref={buttonRef}
            className="relative w-full h-16 md:h-20 bg-primary rounded-full overflow-hidden shadow-xl touch-none select-none"
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseMove={(e) => handleMove(e.clientX)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={handleEnd}
          >
            {/* Background Progress */}
            <div
              className="absolute inset-0 bg-secondary will-change-transform"
              style={{
                transform: `scaleX(${slideProgress / maxSlideRef.current || 0})`,
                transformOrigin: 'left',
              }}
            />

            {/* Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-primary-foreground font-bold text-base md:text-lg tracking-wide font-primary">
                {slideProgress > 0 ? "KEEP SLIDING..." : "SLIDE TO CONTINUE"}
              </span>
            </div>

            {/* Slider Button */}
            <div
              className="absolute left-1 top-1/2 w-14 h-14 md:w-16 md:h-16 bg-card rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing will-change-transform"
              style={{
                transform: `translate3d(${slideProgress}px, -50%, 0)`,
                transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <ChevronsRight className="text-primary" size={32} />
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-center text-muted-foreground text-sm mt-3 font-body">
            Swipe right to get started
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, text }: FeatureProps) {
  return (
    <div className="flex items-start space-x-3 md:space-x-4">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold text-sm md:text-base text-card-foreground font-body">{title}</h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 font-body">{text}</p>
      </div>
    </div>
  );
}