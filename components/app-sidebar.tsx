"use client";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
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

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
      {...props}
    >
      <SidebarHeader className="px-2 pt-4 pb-2">
        {isCollapsed ? (
          <div className="flex justify-center py-1">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center justify-center rounded-full size-8 bg-primary/10 border border-primary/25 shadow-sm cursor-pointer hover:border-primary/50 transition-all duration-300 focus:outline-none shrink-0">
                  <Image src="/Rhythme.svg" alt="R" width={16} height={16} className="opacity-90" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 rounded-xl border border-sidebar-border bg-sidebar shadow-xl p-4" align="start" side="right" sideOffset={12}>
                <div className="space-y-3 font-sans select-text">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Current Goal Focus</div>
                  <div className="h-[1px] bg-sidebar-border/60" />
                  <h4 className="text-sm font-bold leading-snug text-sidebar-foreground">
                    {workspaceGoal?.title || "No active goal"}
                  </h4>
                  {workspaceGoal?.description ? (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {workspaceGoal.description}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      No description provided for this goal.
                    </p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-sidebar-border/85 hover:border-primary/30 hover:bg-sidebar-primary/5 transition-all duration-300 cursor-pointer select-none text-left w-full focus:outline-none bg-sidebar-primary/5">
                <div className="flex items-center justify-center rounded-full size-6.5 bg-primary/15 border border-primary/25 shadow-sm shrink-0">
                  <Image src="/Rhythme.svg" alt="R" width={13} height={13} className="opacity-90" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-bold text-muted-foreground/60 tracking-wider font-sans uppercase">Current Goal</div>
                  <div className="text-xs font-semibold text-sidebar-foreground font-sans truncate leading-tight">
                    {workspaceGoal?.title || "No active goal"}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 rounded-xl border border-sidebar-border bg-sidebar shadow-xl p-4" align="start" side="bottom" sideOffset={4}>
              <div className="space-y-3 font-sans select-text">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Goal Focus Details</div>
                <div className="h-[1px] bg-sidebar-border/60" />
                <h4 className="text-sm font-bold leading-snug text-sidebar-foreground">
                  {workspaceGoal?.title || "No active goal"}
                </h4>
                {workspaceGoal?.description ? (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {workspaceGoal.description}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    No description provided for this goal.
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
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
