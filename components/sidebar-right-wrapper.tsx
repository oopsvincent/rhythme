// components/sidebar-right-wrapper.tsx
// Wrapper that conditionally shows SidebarRight based on current route

"use client"

import { usePathname } from "next/navigation"
import { SidebarRight } from "@/components/sidebar-right"

export function SidebarRightWrapper() {
  const pathname = usePathname()

  // Hide sidebar on settings and weekly pages
  if (pathname?.startsWith('/settings') || pathname?.startsWith('/activity') || pathname?.startsWith('/weekly') || pathname?.startsWith('/tasks') || pathname?.startsWith('/mood') || pathname?.startsWith('/journal') || pathname?.startsWith('/focus')) {
    return null
  }

  return <SidebarRight />
}
