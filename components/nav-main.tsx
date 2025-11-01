"use client"

import { type LucideIcon } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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

  return (
    <SidebarMenu>
      {items.map((item) => {
        // Get path segments
        const pathSegments = pathname?.split("/").filter(Boolean) || []
        
        let isActive = false

        // Special case for overview/dashboard root
        if (item.section === "overview" || item.section === "dashboard") {
          isActive = pathname === "/dashboard"
        } 
        // For all other sections, check if section is in the path
        else {
          isActive = pathSegments.includes(item.section)
        }

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              onClick={() => router.push(item.url)}
              isActive={isActive}
              className={isActive ? "bg-accent" : ""}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}