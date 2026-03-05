"use client";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { WorkspaceGoal } from "@/components/workspace-goal";
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
    title: "Habits",
    url: "/dashboard/habits",
    icon: CalendarSync,
    section: "habits",
  },
  {
    title: "Weekly Planning",
    url: "/dashboard/week",
    icon: BookText,
    section: "week",
    items: [
      {
        title: "Plan",
        url: "/dashboard/week/plan",
        icon: Map,
      },
      {
        title: "Review",
        url: "/dashboard/week/review",
        icon: LineChart,
      },
      {
        title: "History",
        url: "/dashboard/week/history",
        icon: History,
      },
    ],
  },
];

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

  {!isCollapsed && <TeamSwitcher teams={workspaceData} />}
<div
  className={`transition-all duration-200 ${
    isCollapsed ? "opacity-0 h-0 overflow-hidden pointer-events-none" : "opacity-100"
  }`}
>
    <WorkspaceGoal goal={workspaceGoal}/>
</div>
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