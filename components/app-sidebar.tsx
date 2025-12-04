"use client";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "./ui/separator";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
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
      section: "overview",
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
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="font-black font-primary tracking-wide text-xl flex flex-row justify-start items-center ml-2 select-none"><Image alt="R" src={"/rhythme.svg"} width={25} height={25}/><span>Rhythmé</span></SidebarHeader>
      <Separator />
      <SidebarContent className="py-3">
        <NavMain items={data.navMain} />
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