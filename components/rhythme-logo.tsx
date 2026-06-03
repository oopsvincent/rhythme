"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface RhythmeLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function RhythmeLogo({ size = "md", showText = true, className }: RhythmeLogoProps) {
  const sizeClasses = {
    sm: {
      box: "size-8 p-1.5 rounded-lg border-primary/20",
      img: 18,
      text: "text-lg sm:text-xl",
    },
    md: {
      box: "size-10 p-2 rounded-xl border-primary/25",
      img: 22,
      text: "text-xl sm:text-2xl",
    },
    lg: {
      box: "size-14 p-3 rounded-2xl border-primary/30",
      img: 30,
      text: "text-2xl sm:text-3xl",
    },
  };

  const current = sizeClasses[size];

  return (
    <Link href="/" className={cn("flex items-center gap-2.5 sm:gap-3 group select-none", className)}>
      <div className="relative flex items-center justify-center flex-shrink-0">
        {/* Ambient background glow on hover */}
        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full" />
        
        {/* Frosted icon frame */}
        <div className={cn(
          "relative bg-background/50 backdrop-blur-sm border flex items-center justify-center transition-all duration-500 group-hover:border-primary/50 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-primary/5",
          current.box
        )}>
          <Image
            src="/Rhythme.svg"
            alt="Rhythmé logo"
            width={current.img}
            height={current.img}
            className="transition-transform duration-500 group-hover:rotate-[12deg] group-hover:scale-105"
          />
        </div>
      </div>
      
      {/* Brand text & wordmark */}
      {showText && (
        <span className={cn(
          "font-primary font-black tracking-tight bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent group-hover:from-primary group-hover:via-accent group-hover:to-foreground transition-all duration-500",
          current.text
        )}>
          Rhythmé
        </span>
      )}
    </Link>
  );
}
