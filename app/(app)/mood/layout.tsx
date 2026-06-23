"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigationTransition } from "@/components/providers/navigation-transition-provider";
import { motion } from "framer-motion";
import { useScrollDirection } from "@/hooks/use-scroll-direction";

interface MoodLayoutProps {
  children: React.ReactNode;
}

function MoodBottomBar() {
  const pathname = usePathname();
  const { navigate } = useNavigationTransition();
  const isVisible = useScrollDirection();

  const isLogActive = pathname === "/mood";
  const isHistoryActive = pathname === "/mood/history";

  const navItems = [
    {
      label: "Log",
      icon: HeartPulse,
      href: "/mood",
      isActive: isLogActive,
    },
    {
      label: "History",
      icon: History,
      href: "/mood/history",
      isActive: isHistoryActive,
    },
  ];

  return (
    <nav className={cn(
      "md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 dark:bg-[#12141A]/90 backdrop-blur-xl border-t border-border/30 dark:border-border/10 p-2 pb-safe-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.45)] rounded-t-2xl transition-all duration-300 ease-in-out",
      isVisible ? "translate-y-0" : "translate-y-full opacity-0 pointer-events-none"
    )}>
      <div className="flex w-full items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.href);
              }}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 relative cursor-pointer select-none",
                item.isActive
                  ? "text-[#E07A5F]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.isActive && (
                <motion.div
                  layoutId="mood-appbar-tab-mobile"
                  className="absolute inset-0 bg-neutral-100 dark:bg-[#1C202C] border border-black/5 dark:border-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] rounded-xl"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              
              <Icon className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function MoodLayout({ children }: MoodLayoutProps) {
  return (
    <div className="flex-1 flex flex-col min-h-screen relative pb-20 md:pb-0">
      {/* Page Content */}
      <div className="flex-1 flex flex-col">{children}</div>

      <MoodBottomBar />
    </div>
  );
}
