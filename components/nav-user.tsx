"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  Building2,
  Check,
  ChevronsUpDown,
  CreditCard,
  Keyboard,
  LayoutGrid,
  LogOut,
  Moon,
  Plus,
  Settings,
  Sparkles,
  Sun,
  User,
  Goal,
  EllipsisVertical,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTheme } from "next-themes";

// Goal from localStorage
interface UserGoal {
  title: string;
  description?: string;
}

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const router = useRouter();
  const { isMobile, state, setOpenMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [userGoal, setUserGoal] = useState<UserGoal | null>(null);

  // Load goal from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedGoal = localStorage.getItem("user_goal");
      if (storedGoal) {
        try {
          setUserGoal(JSON.parse(storedGoal));
        } catch {
          setUserGoal(null);
        }
      }
    }
  }, []);

  const handleSignOut = () => {
    if (isMobile) setOpenMobile(false);
    router.push("/logout");
  };

  const handleNavigation = (path: string) => {
    if (isMobile) setOpenMobile(false);
    router.push(path);
  };

  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group relative rounded-lg px-2 py-2 transition-all duration-200 data-[state=open]:bg-muted/50"
            >
              {/* Avatar with online status */}
              <div className="relative">
                <Avatar className="h-8 w-8 rounded-lg ring-2 ring-background">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-medium">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                {/* Online status indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
              </div>

              {/* User info - hidden when collapsed */}
              {!isCollapsed && (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <EllipsisVertical className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-72 rounded-xl border border-border/50 bg-popover/95 p-1 backdrop-blur-xl"
            side={isMobile ? "top" : "right"}
            align="start"
            sideOffset={8}
          >
            {/* User Profile Header */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-sm font-medium">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                </div>
                <div className="grid flex-1 gap-0.5">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="mx-1 my-1 bg-border/50" />

            {/* Workspace Switcher - Goal Workspace */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="flex items-center gap-2 rounded-lg px-2 py-2 cursor-pointer"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-sm">
                  <Goal className="h-3.5 w-3.5 text-primary" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{userGoal?.title || "My Goal"}</p>
                  {userGoal?.description && (
                    <p className="text-[10px] text-muted-foreground truncate">{userGoal.description}</p>
                  )}
                </div>
                <Check className="h-4 w-4 text-primary" />
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-muted-foreground cursor-pointer"
                onClick={() => handleNavigation("/settings/billing")}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-dashed border-muted-foreground/50">
                  <Plus className="h-3 w-3" />
                </span>
                <span className="text-sm">Add Goal Workspace</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="mx-1 my-1 bg-border/50" />

            {/* Upgrade Section */}
            <DropdownMenuItem 
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 px-2 py-2.5 cursor-pointer"
              onClick={() => handleNavigation("/pricing")}
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="flex-1 text-sm font-medium">Upgrade to Pro</span>
              <Badge variant="secondary" className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0">
                NEW
              </Badge>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="mx-1 my-1 bg-border/50" />

            {/* Account & Settings */}
            <DropdownMenuGroup>
              <DropdownMenuItem 
                className="flex items-center gap-2 rounded-lg px-2 py-2 cursor-pointer"
                onClick={() => handleNavigation("/settings/account")}
              >
                <User className="h-4 w-4" />
                <span className="flex-1 text-sm">Profile</span>
                <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 rounded-lg px-2 py-2 cursor-pointer"
                onClick={() => handleNavigation("/settings/billing")}
              >
                <CreditCard className="h-4 w-4" />
                <span className="flex-1 text-sm">Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 rounded-lg px-2 py-2 cursor-pointer"
                onClick={() => handleNavigation("/settings/notifications")}
              >
                <Bell className="h-4 w-4" />
                <span className="flex-1 text-sm">Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 rounded-lg px-2 py-2 cursor-pointer"
                onClick={() => handleNavigation("/settings")}
              >
                <Settings className="h-4 w-4" />
                <span className="flex-1 text-sm">Settings</span>
                <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="mx-1 my-1 bg-border/50" />

            {/* Theme Switcher */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2 rounded-lg px-2 py-2">
                {theme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span className="text-sm">Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="rounded-lg border border-border/50 bg-popover/95 backdrop-blur-xl">
                  <DropdownMenuItem onClick={() => setTheme("light")} className="rounded-md">
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                    {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")} className="rounded-md">
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                    {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")} className="rounded-md">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    System
                    {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSeparator className="mx-1 my-1 bg-border/50" />

            {/* Sign Out */}
            <DropdownMenuItem 
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-destructive focus:text-destructive cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              <span className="flex-1 text-sm">Log out</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
