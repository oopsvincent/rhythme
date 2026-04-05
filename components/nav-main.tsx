"use client"

import { type LucideIcon, ChevronRight } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { usePathname, useRouter } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: React.ElementType
    section?: string
    isActive?: boolean
    items?: {
      title: string;
      url: string;
      icon?: React.ElementType;
    }[]
  }[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const { state } = useSidebar()
const isCollapsed = state === "collapsed"

  const handleNavigation = (url: string) => {
    router.push(url)
    setOpenMobile(false)
  }

  return (
    <SidebarMenu className="space-y-1 px-2">
      {items.map((item) => {
        const pathSegments = pathname?.split("/").filter(Boolean) || []
        
        let isActive = false
        if (item.section === "overview") {
          isActive = pathname === "/dashboard"
        } else if (item.section) {
          isActive = pathSegments.includes(item.section)
        } else {
          isActive = pathname === item.url || !!item.items?.some(sub => pathname === sub.url || pathname?.startsWith(sub.url + "/"))
        }

        if (item.items && item.items.length > 0) {
          return (
            <Collapsible key={item.title} asChild defaultOpen={isActive} className="group/collapsible">
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => handleNavigation(item.url)}
                  isActive={isActive}
                  className={`
                    group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5
                    text-sm font-medium transition-all duration-200 overflow-hidden
                    ${isActive 
                      ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  {item.icon && (
  <item.icon
    className={`h-4 w-4 shrink-0 transition-colors ${
      isActive
        ? "text-primary"
        : "text-foreground/80 dark:text-foreground/70 group-hover:text-foreground"
    }`}
  />
)}
                  <span className="truncate">{item.title}</span>
                </SidebarMenuButton>
                
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="mr-0.5 data-[state=open]:rotate-90">
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <SidebarMenuSub className="mt-1 border-sidebar-border ml-5 pl-3">
                    {item.items.map((subItem) => {
                      const isChildActive = pathname === subItem.url || pathname?.startsWith(subItem.url + "/");
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isChildActive}
                            onClick={() => handleNavigation(subItem.url)}
                            className={`cursor-pointer rounded-md ${isChildActive ? 'text-primary font-medium bg-primary/5' : 'text-muted-foreground hover:bg-sidebar-accent'}`}
                          >
                            <div className="flex items-center">
                                {subItem.icon && (
  <subItem.icon
    className={`h-3.5 w-3.5 mr-2 transition-colors ${
      isChildActive
        ? "text-primary"
        : "text-foreground/70 dark:text-foreground/70 group-hover:text-foreground"
    }`}
  />
)}
                                <span>{subItem.title}</span>
                            </div>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        }

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              onClick={() => handleNavigation(item.url)}
              isActive={isActive}
              className={`
                group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5
                text-sm font-medium transition-all duration-200 overflow-hidden
                ${isActive 
                  ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }
              `}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              {item.icon && (
                <item.icon 
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  }`} 
                />
              )}
              <span className="truncate">{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
