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

    const { setOpenMobile } = useSidebar()  // ✅ Get the function

  const handleNavigation = (url: string) => {
    router.push(url)
    setOpenMobile(false)  // ✅ Close mobile sidebar
  }

  return (
    <SidebarMenu>
      {items.map((item) => {
        // Get path segments
        const pathSegments = pathname?.split("/").filter(Boolean) || []
        
        let isActive = false

        // Special case for overview/dashboard root
        if (item.section === "overview") {
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
              onClick={() => handleNavigation(item.url)}
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