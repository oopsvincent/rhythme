// components/sidebar-right-wrapper.tsx
// Wrapper that conditionally shows SidebarRight based on current route

"use client"

// components/sidebar-right-wrapper.tsx
// Wrapper that conditionally shows SidebarRight based on current route

"use client"

import { usePathname } from "next/navigation"
import { SidebarRight } from "@/components/sidebar-right"

export function SidebarRightWrapper() {
  return <SidebarRight />
}
