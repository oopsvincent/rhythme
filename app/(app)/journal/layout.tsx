"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, BookOpen, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface JournalLayoutProps {
  children: React.ReactNode;
}

function JournalBottomBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams ? searchParams.get("tab") : null;

  const isHomeActive = pathname === "/journal" && (tab === null || tab === "home");
  const isEntriesActive = pathname === "/journal" && tab === "entries";
  const isNewActive = pathname === "/journal/new";
  const isInsightsActive = pathname === "/journal/insights" || (pathname ? pathname.includes("/insights") : false);

  const navItems = [
    {
      label: "Home",
      icon: Home,
      href: "/journal?tab=home",
      isActive: isHomeActive,
    },
    {
      label: "Entries",
      icon: BookOpen,
      href: "/journal?tab=entries",
      isActive: isEntriesActive,
    },
    {
      label: "Insights",
      icon: Sparkles,
      href: "/journal/insights",
      isActive: isInsightsActive,
    },
    {
      label: "New",
      icon: Plus,
      href: "/journal/new",
      isActive: isNewActive,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#12141A]/90 dark:bg-[#12141A]/95 backdrop-blur-xl border-t border-[#1F2A38]/15 dark:border-border/10 px-6 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.35)] flex items-center justify-between pb-safe-bottom">
      <div className="flex w-full items-center justify-between max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-300 relative group active:scale-95",
                item.isActive
                  ? "text-[#E07A5F]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Active Underline Indicator */}
              {item.isActive && (
                <span className="absolute bottom-0 w-8 h-[2px] rounded-full bg-[#E07A5F] shadow-[0_0_8px_#E07A5F]" />
              )}
              
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5",
                  item.isActive && "scale-110 text-[#E07A5F]"
                )}
              />
              <span className="text-[9px] font-semibold mt-1 tracking-wide uppercase opacity-95">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function JournalLayout({ children }: JournalLayoutProps) {
  return (
    <div className="flex-1 flex flex-col min-h-screen relative pb-20 md:pb-0">
      {/* Page Content */}
      <div className="flex-1 flex flex-col">{children}</div>

      {/* Suspense boundary for useSearchParams */}
      <Suspense fallback={null}>
        <JournalBottomBar />
      </Suspense>
    </div>
  );
}
