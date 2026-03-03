"use client"

import { useState, useEffect } from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  // Sync open state with pathname — auto-open when on a weekly page, stay closed otherwise
  useEffect(() => {
    const newState: Record<string, boolean> = {}
    items.forEach((item) => {
      const isActive = pathname === item.url || item.items?.some(
        subItem => pathname === subItem.url || pathname?.startsWith(subItem.url + "/")
      )
      newState[item.title] = !!isActive
    })
    setOpenSections(newState)
  }, [pathname, items])

  const handleNavigation = (url: string) => {
    router.push(url)
    setOpenMobile(false)
  }

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isParentActive = pathname === item.url || item.items?.some(subItem => pathname === subItem.url || pathname?.startsWith(subItem.url + "/"));
        const isOpen = openSections[item.title] ?? false

        return (
          <Collapsible
            key={item.title}
            asChild
            open={isOpen}
            onOpenChange={(open) => setOpenSections(prev => ({ ...prev, [item.title]: open }))}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() => handleNavigation(item.url)}
                isActive={isParentActive}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const isChildActive = pathname === subItem.url || pathname?.startsWith(subItem.url + "/");
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              onClick={() => handleNavigation(subItem.url)}
                              isActive={isChildActive}
                              className="[&>svg]:text-sidebar-foreground"
                            >
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
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
  )
}
