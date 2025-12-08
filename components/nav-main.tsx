"use client"

import { type LucideIcon } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    section: string
    isActive?: boolean
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
    <SidebarMenu className="space-y-1 px-2">
      {items.map((item) => {
        const pathSegments = pathname?.split("/").filter(Boolean) || []

        let isActive = false

        if (item.section === "overview") {
          isActive = pathname === "/dashboard"
        } else {
          isActive = pathSegments.includes(item.section)
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
              {/* Active indicator bar on left */}
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