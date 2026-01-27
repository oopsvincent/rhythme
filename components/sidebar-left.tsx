"use client"

import * as React from "react"
import {
  AudioWaveform,
  BarChart3,
  Briefcase,
  Calendar,
  Camera,
  Command,
  Dumbbell,
  FileText,
  Globe,
  Home,
  LayoutList,
  Lightbulb,
  MapPin,
  Music,
  Palette,
  PiggyBank,
  Target,
  Trophy,
  Tv,
  Users,
  Utensils,
  Wallet,
  Wrench,
  Sprout,
  Languages,
  BookOpen,
  HeartPulse,
  Star,
  Brain,
  Handshake,
  PenLine,
  Image,
  LucideIcon,
} from "lucide-react"

import { NavFavorites } from "@/components/nav-favorites"
import { NavWorkspaces } from "@/components/nav-workspaces"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  favorites: [
    {
      name: "Project Management & Task Tracking",
      url: "#",
      icon: BarChart3,
    },
    {
      name: "Family Recipe Collection & Meal Planning",
      url: "#",
      icon: Utensils,
    },
    {
      name: "Fitness Tracker & Workout Routines",
      url: "#",
      icon: Dumbbell,
    },
    {
      name: "Book Notes & Reading List",
      url: "#",
      icon: BookOpen,
    },
    {
      name: "Sustainable Gardening Tips & Plant Care",
      url: "#",
      icon: Sprout,
    },
    {
      name: "Language Learning Progress & Resources",
      url: "#",
      icon: Languages,
    },
    {
      name: "Home Renovation Ideas & Budget Tracker",
      url: "#",
      icon: Home,
    },
    {
      name: "Personal Finance & Investment Portfolio",
      url: "#",
      icon: Wallet,
    },
    {
      name: "Movie & TV Show Watchlist with Reviews",
      url: "#",
      icon: Tv,
    },
    {
      name: "Daily Habit Tracker & Goal Setting",
      url: "#",
      icon: Target,
    },
  ],
  workspaces: [
    {
      name: "Personal Life Management",
      icon: Home,
      pages: [
        {
          name: "Daily Journal & Reflection",
          url: "#",
          icon: FileText,
        },
        {
          name: "Health & Wellness Tracker",
          url: "#",
          icon: HeartPulse,
        },
        {
          name: "Personal Growth & Learning Goals",
          url: "#",
          icon: Star,
        },
      ],
    },
    {
      name: "Professional Development",
      icon: Briefcase,
      pages: [
        {
          name: "Career Objectives & Milestones",
          url: "#",
          icon: Target,
        },
        {
          name: "Skill Acquisition & Training Log",
          url: "#",
          icon: Brain,
        },
        {
          name: "Networking Contacts & Events",
          url: "#",
          icon: Handshake,
        },
      ],
    },
    {
      name: "Creative Projects",
      icon: Palette,
      pages: [
        {
          name: "Writing Ideas & Story Outlines",
          url: "#",
          icon: PenLine,
        },
        {
          name: "Art & Design Portfolio",
          url: "#",
          icon: Image,
        },
        {
          name: "Music Composition & Practice Log",
          url: "#",
          icon: Music,
        },
      ],
    },
    {
      name: "Home Management",
      icon: Home,
      pages: [
        {
          name: "Household Budget & Expense Tracking",
          url: "#",
          icon: PiggyBank,
        },
        {
          name: "Home Maintenance Schedule & Tasks",
          url: "#",
          icon: Wrench,
        },
        {
          name: "Family Calendar & Event Planning",
          url: "#",
          icon: Calendar,
        },
      ],
    },
    {
      name: "Travel & Adventure",
      icon: Globe,
      pages: [
        {
          name: "Trip Planning & Itineraries",
          url: "#",
          icon: MapPin,
        },
        {
          name: "Travel Bucket List & Inspiration",
          url: "#",
          icon: Globe,
        },
        {
          name: "Travel Journal & Photo Gallery",
          url: "#",
          icon: Camera,
        },
      ],
    },
  ],
}

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        {/* <NavMain items={data.navMain} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        <NavWorkspaces workspaces={data.workspaces} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
