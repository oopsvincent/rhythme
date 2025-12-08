"use client";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
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

// Streamlined navigation - removed Goals and Projects
const navItems = [
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
  {
    title: "Ask AI",
    url: "/dashboard/ai",
    icon: Sparkles,
    section: "analytics",
  },
  {
    title: "Settings",
    url: "/settings/account",
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
      className="fixed left-0 top-0 z-40 h-screen border-r-0 bg-sidebar/80 backdrop-blur-xl"
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
      <SidebarContent className="px-2 py-4">
        <NavMain items={navItems} />
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