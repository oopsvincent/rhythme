// components/site-header.tsx
"use client"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { SearchForm } from "./search-form"

// Mapping sections to display titles
const sectionTitles: Record<string, string> = {
  dashboard: "Dashboard",
  analytics: "Analytics",
  "data-table": "Data Table",
  settings: "Settings",
  tasks: "Tasks",
  goals: "Goals",
  habits: "Habits",
  focus: "Focus",
}

export function SiteHeader() {
    const pathname = usePathname();
  const activeSection: string = pathname?.split("/").pop() ?? "dashboard";
  const displayTitle = sectionTitles[activeSection]

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{displayTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
        <SearchForm />
        </div>
      </div>
    </header>
  )
}