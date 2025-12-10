"use client";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
// import { SidebarQuickStats } from "@/components/sidebar-quick-stats"; // Hidden for MVP
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  CalendarSync,
  ClockArrowUp,
  Home,
  ListCheck,
  NotebookPen,
  Settings,
  Sparkles,
} from "lucide-react";

// Main navigation items
const mainNavItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    isActive: true,
    section: "overview",
  },
  {
    title: "Habits",
    icon: CalendarSync,
    url: "/dashboard/habits",
    section: "habits",
  },
  {
    title: "Tasks",
    url: "/dashboard/tasks",
    icon: ListCheck,
    section: "tasks",
  },
  {
    title: "Focus",
    url: "/dashboard/focus",
    icon: ClockArrowUp,
    section: "focus",
  },
  {
    title: "Journal",
    url: "/dashboard/journal",
    icon: NotebookPen,
    section: "journal",
  },
];

// Secondary navigation items
const secondaryNavItems = [
  {
    title: "Ask AI",
    url: "/dashboard/ai",
    icon: Sparkles,
    section: "ai",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    section: "settings",
  },
];

export function AppSidebarClient({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string;
    email: string;
    avatar: string;
  } | null;
}) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border glass"
      {...props}
    >
      {/* Logo Header - Premium minimal */}
      <SidebarHeader className="flex flex-row items-center gap-2 px-4 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Image alt="R" src="/rhythme.svg" width={20} height={20} />
        </div>
        <span className="font-primary text-lg font-bold tracking-tight">
          Rhythmé
        </span>
      </SidebarHeader>

      {/* Subtle divider */}
      <div className="mx-4 h-px bg-border/50" />

      {/* Main Navigation */}
      <SidebarContent className="flex flex-col gap-0">
        {/* Primary Navigation */}
        <SidebarGroup className="px-2 py-3">
          <SidebarGroupLabel className="px-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1">
            Menu
          </SidebarGroupLabel>
          <NavMain items={mainNavItems} />
        </SidebarGroup>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Secondary Navigation */}
        <SidebarGroup className="px-2 py-2">
          <SidebarGroupLabel className="px-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1">
            More
          </SidebarGroupLabel>
          <NavMain items={secondaryNavItems} />
        </SidebarGroup>
      </SidebarContent>

      {/* User Footer - Glass effect */}
      <SidebarFooter className="border-t border-border/50 p-2">
        {user ? (
          <NavUser user={user} />
        ) : (
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            <div className="space-y-1">
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="h-2 w-28 animate-pulse rounded bg-muted" />
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}