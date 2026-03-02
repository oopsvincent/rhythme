"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation"

export function NavWeekly({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      icon?: LucideIcon
    }[]
  }[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  const handleNavigation = (url: string) => {
    router.push(url)
    setOpenMobile(false)
  }

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-1 px-2">
        {items.map((item) => {
          // Check if parent or any child is active
          const isParentActive = pathname === item.url || item.items?.some(subItem => pathname === subItem.url || pathname?.startsWith(subItem.url + "/"));

          return (
            <Collapsible key={item.title} asChild defaultOpen={isParentActive || item.isActive}>
              <SidebarMenuItem className="relative">
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => handleNavigation(item.url)}
                  isActive={isParentActive}
                  className={`
                    group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5
                    text-sm font-medium transition-all duration-200 overflow-hidden
                    ${isParentActive 
                      ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }
                  `}
                >
                  {/* Active indicator bar on left */}
                  {isParentActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  {item.icon && (
                    <item.icon 
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isParentActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      }`} 
                    />
                  )}
                  <span className="truncate">{item.title}</span>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className={`
                        data-[state=open]:rotate-90
                        ${isParentActive ? "text-primary hover:text-primary" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"}
                      `}>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-4 mt-1 border-l border-border/50 pl-2 pr-0 mr-0">
                        {item.items?.map((subItem) => {
                          const isChildActive = pathname === subItem.url || pathname?.startsWith(subItem.url + "/");
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                onClick={() => handleNavigation(subItem.url)}
                                isActive={isChildActive}
                                className={`
                                  group relative flex w-full items-center gap-2 rounded-md px-3 py-1.5
                                  text-sm font-medium transition-all duration-200 overflow-hidden
                                  ${isChildActive 
                                    ? "bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary" 
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                  }
                                `}
                              >
                                {isChildActive && (
                                  <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
                                )}
                                {subItem.icon && (
                                  <subItem.icon 
                                    className={`h-4 w-4 shrink-0 transition-colors ${
                                      isChildActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                    }`} 
                                  />
                                )}
                                <span className="truncate">{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
