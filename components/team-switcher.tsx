"use client"

import * as React from "react"
import { ChevronDown, ChevronsUpDown, Plus, Target } from "lucide-react"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

export function TeamSwitcher({
  teams,
  workspaceGoal,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
  workspaceGoal?: {
    title: string;
    description?: string;
  } | null;
}) {
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  const isMobile = useIsMobile();

  if (!activeTeam) {
    return null
  }

return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            {workspaceGoal && (
              <div className="px-2 my-2 mt-1">
                <div className="flex flex-col gap-1 px-3 py-3 rounded-xl bg-sidebar-accent/30 border border-sidebar-border shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Workspace Goal
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold leading-snug text-sidebar-foreground">
                    {workspaceGoal.title}
                  </h4>

                  {workspaceGoal.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                      {workspaceGoal.description}
                    </p>
                  )}
                </div>
              </div>
            )}
            {workspaceGoal && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo className="size-3.5 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="gap-2 p-2"
              onClick={() => {
                toast("New Workspace", {
                  description: "The new workspace feature will be available soon."
                })
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
