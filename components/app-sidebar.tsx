"use client";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import Image from "next/image";
import { useSidebar } from "@/components/ui/sidebar"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  BookText,
  CalendarSync,
  CalendarDays,
  ClockArrowUp,
  HeartPulse,
  Activity,
  Home,
  ListCheck,
  NotebookPen,
  Settings,
  Sparkles,
  Map,
  LineChart,
  History,
  GalleryVerticalEnd,
} from "lucide-react";

const workspaceData = [
  {
    name: "Personal Workspace",
    logo: GalleryVerticalEnd,
    plan: "Pro",
  }
];

const navigationItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Home,
    isActive: true,
    section: "overview",
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: ListCheck,
    section: "tasks",
  },
  {
    title: "Focus",
    url: "/focus",
    icon: ClockArrowUp,
    section: "focus",
    items: [
      {
        title: "Session",
        url: "/focus",
        icon: ClockArrowUp,
      },
      {
        title: "History",
        url: "/focus/history",
        icon: History,
      },
    ],
  },
  {
    title: "Mood",
    url: "/mood",
    icon: HeartPulse,
    section: "mood",
    items: [
      {
        title: "Log",
        url: "/mood",
        icon: HeartPulse,
      },
      {
        title: "History",
        url: "/mood/history",
        icon: CalendarDays,
      },
    ],
  },
  {
    title: "Activity",
    url: "/activity",
    icon: Activity,
    section: "activity",
  },
  {
    title: "Journal",
    url: "/journal",
    icon: NotebookPen,
    section: "journal",
  },
  {
    title: "Habits",
    url: "/habits",
    icon: CalendarSync,
    section: "habits",
  },
    { title: "Weekly", url: "/weekly", icon: BookText, section: "week" },
];

const secondaryNavItems = [
  {
    title: "Ask AI",
    url: "/ai",
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
  workspaceGoal,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string;
    email: string;
    avatar: string;
  } | null;
  workspaceGoal?: {
    title: string;
    description?: string;
  } | null;
}) {

    const { state } = useSidebar()
const isCollapsed = state === "collapsed"


  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
      {...props}
    >
<SidebarHeader className="px-2 pt-4 pb-2 flex flex-col gap-3">
  <div className="flex px-2">
    <div className="flex items-center justify-center rounded-md w-7 h-7 shrink-0 bg-sidebar-primary/5 border border-sidebar-border shadow-sm">
      <Image alt="Rhythme Logo" src="/Rhythme.svg" width={18} height={18} className="opacity-90" />
    </div>
  </div>

  {!isCollapsed && <TeamSwitcher teams={workspaceData} workspaceGoal={workspaceGoal} />}
</SidebarHeader>

      <SidebarContent className="flex flex-col gap-0 overflow-y-auto custom-scrollbar pt-2">
        {/* Main Navigation */}
        <SidebarGroup className="px-2 py-0">
          <SidebarGroupLabel className="px-2 text-[10px] uppercase tracking-wider text-muted-foreground/50 font-semibold mb-1">
            Menu
          </SidebarGroupLabel>
          <NavMain items={navigationItems} />
        </SidebarGroup>

        {/* Spacer */}

        {/* Secondary Navigation */}
        <SidebarGroup className="px-2 py-2 mt-auto">
          <SidebarGroupLabel className="px-2 text-[10px] uppercase tracking-wider text-muted-foreground/50 font-semibold mb-1">
            General
          </SidebarGroupLabel>
          <NavMain items={secondaryNavItems} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        {user ? (
          <NavUser user={user} />
        ) : (
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-sidebar-accent" />
            <div className="space-y-1">
              <div className="h-3 w-20 animate-pulse rounded bg-sidebar-accent" />
              <div className="h-2 w-28 animate-pulse rounded bg-sidebar-accent" />
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
