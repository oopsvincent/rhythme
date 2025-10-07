"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  CheckCircle,
  Clock,
  Trophy,
  ChevronsRight,
} from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

export default function IntroPage() {
//   const router = useRouter();
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef(0);
  const maxSlideRef = useRef(0);

  // Calculate max slide distance on mount and resize
  useEffect(() => {
    const calculateMaxSlide = () => {
      if (containerRef.current && knobRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const knobWidth = knobRef.current.offsetWidth;
        maxSlideRef.current = containerWidth - knobWidth - 8; // 8px padding
      }
    };

    calculateMaxSlide();
    window.addEventListener("resize", calculateMaxSlide);

    return () => window.removeEventListener("resize", calculateMaxSlide);
  }, []);

  const handleStart = (clientX: number) => {
    if (isCompleting) return;
    setIsDragging(true);
    startPosRef.current = clientX - sliderPosition;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || isCompleting) return;

    requestAnimationFrame(() => {
      const newPosition = clientX - startPosRef.current;
      const clampedPosition = Math.max(
        0,
        Math.min(newPosition, maxSlideRef.current)
      );

      setSliderPosition(clampedPosition);

      // Auto-complete when reaching 90% of the way
      if (clampedPosition >= maxSlideRef.current * 0.98 && !isCompleting) {
        setIsDragging(false);
        handleComplete();
      }
    });
  };

  const handleEnd = () => {
    if (isCompleting) return;
    setIsDragging(false);

    // If not past threshold, animate back to start
    if (sliderPosition < maxSlideRef.current * 0.85) {
      animateToPosition(0);
    }
  };

  const handleComplete = () => {
    if (isCompleting) return;
    setIsCompleting(true);
    setIsDragging(false);

    // Animate to end
    animateToPosition(maxSlideRef.current, () => {
      // Haptic feedback
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(40);
      }

      // Navigate after a short delay
      setTimeout(() => {
        window.location.href = "/signup/create"
        // router.push("/signup/create");
      }, 200);
    });
  };

  const animateToPosition = (targetPosition: number, onComplete?: VoidFunction) => {
  const startPosition = sliderPosition;
  const distance = targetPosition - startPosition;
  const duration = 350; // a touch slower for smoother ease
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuint = 1 - Math.pow(1 - progress, 5);
    const newPosition = startPosition + distance * easeOutQuint;

    setSliderPosition(newPosition);
    if (progress < 1) requestAnimationFrame(animate);
    else if (onComplete) onComplete();
  };

  requestAnimationFrame(animate);
};


  const progressPercentage = (sliderPosition / maxSlideRef.current) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-background overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center mt-8 md:mt-12 text-center px-6">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
          <span className="text-primary-foreground text-3xl md:text-4xl font-bold font-primary">
            R
          </span>
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

        {/* Slide to Continue */}
        <div className="w-full max-w-md md:max-w-lg px-4">
          <div
            ref={containerRef}
            className="relative w-full h-16 md:h-20 bg-primary rounded-full overflow-hidden shadow-xl touch-none select-none"
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseMove={(e) => handleMove(e.clientX)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={handleEnd}
          >
            {/* Progress fill */}
            <div
              className="absolute inset-0 bg-secondary will-change-transform"
              style={{
                transform: `scaleX(${progressPercentage / 100})`,
                transformOrigin: "left",
              }}
            />

            {/* Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className="text-primary-foreground font-bold text-base md:text-lg tracking-wide font-primary transition-opacity duration-200"
                style={{ opacity: sliderPosition > 0 ? 0.6 : 1 }}
              >
                {sliderPosition > 0 ? "KEEP SLIDING..." : "SLIDE TO CONTINUE"}
              </span>
            </div>

            {/* Draggable knob */}
            <div
              ref={knobRef}
              className="absolute left-1 top-1/2 w-14 h-14 md:w-16 md:h-16 bg-card rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing touch-none will-change-transform"
              style={{
                transform: `translate3d(${sliderPosition}px, -50%, 0)`,
                transition: isDragging
                  ? "none"
                  : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseDown={(e) => e.preventDefault()}
              onTouchStart={(e) => e.preventDefault()}
            >
              <ChevronsRight className="text-primary" size={28} />
            </div>
          </div>

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
        <h3 className="font-semibold text-sm md:text-base text-card-foreground font-body">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 font-body">
          {text}
        </p>
      </div>
    </div>
  );
}
