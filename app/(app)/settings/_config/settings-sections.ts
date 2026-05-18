// app/(dashboard)/settings/_config/settings-sections.ts
// Central configuration for all settings sections with grouping

import { 
  User, 
  Link2, 
  Shield, 
  Target, 
  Lock,
  Paintbrush,
  Palette,
  Bell,
  Settings,
  CreditCard,
  Receipt,
  AlertTriangle,
  type LucideIcon 
} from "lucide-react"

export interface SettingsSection {
  id: string
  name: string
  description: string
  href: string
  icon: LucideIcon
  /** If true, requires premium subscription */
  premium?: boolean
}

export interface SettingsGroup {
  id: string
  name: string
  sections: SettingsSection[]
}

export const settingsGroups: SettingsGroup[] = [
  {
    id: "account",
    name: "Account",
    sections: [
      {
        id: "profile",
        name: "Profile",
        description: "Display name, avatar, and personal info",
        href: "/settings/profile",
        icon: User,
      },
      {
        id: "connections",
        name: "Connections",
        description: "Linked social accounts",
        href: "/settings/connections",
        icon: Link2,
      },
      {
        id: "security",
        name: "Passwords & Security",
        description: "Password, 2FA, and active sessions",
        href: "/settings/security",
        icon: Shield,
      },
      {
        id: "onboarding",
        name: "Goals & Preferences",
        description: "Role and daily targets",
        href: "/settings/onboarding",
        icon: Target,
      },
      {
        id: "privacy",
        name: "Privacy",
        description: "Data privacy settings",
        href: "/settings/privacy",
        icon: Lock,
      },
    ],
  },
  {
    id: "appearance",
    name: "Appearance",
    sections: [
      {
        id: "theme",
        name: "Theme",
        description: "Light, dark, or system mode",
        href: "/settings/theme",
        icon: Paintbrush,
      },
      {
        id: "custom-themes",
        name: "Custom Themes",
        description: "Color palettes and accent colors",
        href: "/settings/custom-themes",
        icon: Palette,
        premium: true,
      },
    ],
  },
  {
    id: "preferences",
    name: "Preferences",
    sections: [
      {
        id: "notifications",
        name: "Notifications",
        description: "Email and push notifications",
        href: "/settings/notifications",
        icon: Bell,
      },
      {
        id: "general",
        name: "General",
        description: "Language and region settings",
        href: "/settings/general",
        icon: Settings,
      },
    ],
  },
  {
    id: "payment",
    name: "Payment & Billing",
    sections: [
      {
        id: "subscription",
        name: "Subscription",
        description: "Current plan and upgrade options",
        href: "/settings/subscription",
        icon: CreditCard,
      },
      {
        id: "billing-history",
        name: "Billing History",
        description: "Invoices and payment history",
        href: "/settings/billing-history",
        icon: Receipt,
      },
    ],
  },
  {
    id: "danger",
    name: "Danger Zone",
    sections: [
      {
        id: "delete-account",
        name: "Delete Account",
        description: "Permanently delete your account",
        href: "/settings/delete-account",
        icon: AlertTriangle,
      },
    ],
  },
]

// Helper to get flat list of all sections
export function getAllSections(): SettingsSection[] {
  return settingsGroups.flatMap(group => group.sections)
}

// Helper to find section by path
export function getSectionByPath(path: string): SettingsSection | undefined {
  return getAllSections().find(section => section.href === path)
}

// Helper to find group by section path
export function getGroupByPath(path: string): SettingsGroup | undefined {
  return settingsGroups.find(group => 
    group.sections.some(section => section.href === path)
  )
}

// Default section to show
export const defaultSettingsPath = "/settings/profile"
