"use client";

import * as React from "react";
// import {
//   IconCamera,
//   IconChartBar,
//   IconDashboard,
//   IconDatabase,
//   IconFileAi,
//   IconFileDescription,
//   IconFileWord,
//   IconFolder,
//   IconHelp,
//   IconInnerShadowTop,
//   IconListDetails,
//   IconReport,
//   IconSearch,
//   IconSettings,
//   IconUsers,
// } from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import {
    Aperture,
    CalendarSync,
  CheckSquare,
  ClockArrowUp,
  FolderKanban,
  Goal,
  HelpCircle,
  Home,
  ListCheck,
  NotebookPen,
  Search,
  SearchCheck,
  Section,
  Settings,
  Sparkles,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { title } from "process";
import { url } from "inspector";
import { FaStopwatch } from "react-icons/fa";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      section: "dashboard",
    },
    { 
        title: "Habits", 
        icon: CalendarSync, 
        url: "/dashboard/habits", 
        section: "habits" ,
    },
    {
      title: "Goals",
      url: "/dashboard/goals",
      icon: Goal,
      section: "goals",
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
      title: "Projects",
      url: "#",
      icon: FolderKanban,
      section: "data-table",
    },
  ],
//   navClouds: [
//     {
//       title: "Capture",
//       icon: IconCamera,
//       isActive: true,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Proposal",
//       icon: IconFileDescription,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Prompts",
//       icon: IconFileAi,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//   ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings/appearance",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircle,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchCheck,
    },
  ],
//   documents: [
//     {
//       name: "Journals Library",
//       url: "#",
//       icon: IconDatabase,
//     },
//     {
//       name: "Reports",
//       url: "#",
//       icon: IconReport,
//     },
//     {
//       name: "Word Assistant",
//       url: "#",
//       icon: IconFileWord,
//     },
//   ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = createClient();
  const [user, setUser] = React.useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      const currentUser = data?.user;
      if (currentUser) {
        setUser({
          name:
            currentUser.user_metadata?.name ||
            currentUser.email?.split("@")[0] ||
            "Anonymous",
          email: currentUser.email || "No email",
          avatar:
            currentUser.user_metadata?.avatar_url ||
            "/avatars/default-user.png",
        });
      }
    };

    fetchUser();
  }, [supabase]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Aperture className="!size-5" />
                <span className="text-base font-semibold">Rhythmé Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* <NavMain items={data.navMain} /> */}
      </SidebarHeader>

      <Separator />
      <SidebarContent className="py-3">
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        {user ? (
          <NavUser user={user} />
        ) : (
          <div className="p-4 text-sm text-muted-foreground">
            Loading user...
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
