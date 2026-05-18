// app/(dashboard)/settings/settings-home.tsx
"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "@/app/actions/auth"
import { 
  CreditCard, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Paintbrush,
  Lock,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingsHomeProps {
  user: {
    id: string
    name: string
    email: string
    avatar: string
    createdAt: string
  }
}

const menuItems = [
  {
    name: "Account",
    description: "Profile, personal info",
    href: "/settings/account",
    icon: User,
  },
  {
    name: "Appearance",
    description: "Theme, display settings",
    href: "/settings/appearance",
    icon: Paintbrush,
  },
  {
    name: "Billing",
    description: "Plans, payment methods",
    href: "/settings/billing",
    icon: CreditCard,
  },
  {
    name: "Privacy",
    description: "Data, visibility settings",
    href: "/settings/privacy",
    icon: Lock,
  },
  {
    name: "Security",
    description: "Password, login sessions",
    href: "/settings/security",
    icon: Shield,
  },
  {
    name: "Help Center",
    description: "Support, documentation",
    href: "/support",
    icon: HelpCircle,
    external: true,
  },
]

export function SettingsHome({ user }: SettingsHomeProps) {
  const handleLogout = async () => {
    await signOut()
  }

  return (
    <div className="flex flex-col min-h-[70vh]">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-16 w-16 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
            {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold truncate">{user.name}</h2>
          <Link 
            href="/settings/account"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            edit profile 
            <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const Component = item.external ? 'a' : Link
          
          return (
            <Component
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl transition-all",
                "bg-card/50 hover:bg-card border border-border/50 hover:border-border",
                "group cursor-pointer"
              )}
            >
              <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors">
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground truncate">{item.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </Component>
          )
        })}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-4 p-4 rounded-xl transition-all w-full text-left",
            "bg-destructive/5 hover:bg-destructive/10 border border-destructive/20 hover:border-destructive/30",
            "group cursor-pointer"
          )}
        >
          <div className="p-2 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
            <LogOut className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-destructive">Log out</p>
            <p className="text-sm text-muted-foreground">Sign out of your account</p>
          </div>
          <ChevronRight className="h-5 w-5 text-destructive/50 group-hover:text-destructive group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* Version Footer */}
      <div className="mt-8 pt-4 border-t border-border/50">
        <p className="text-center text-xs text-muted-foreground">
          version 0.25.0 (pre-alpha)
        </p>
      </div>
    </div>
  )
}
