// components/site-header.tsx
"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { Fragment } from "react"
import { formatSlugToTitle } from "@/lib/slug"
import { ServiceStatusIndicator } from "@/components/service-status-indicator"
import { NotificationPopover } from "@/components/notifications/notification-popover"

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
  ai: "Rhythmé AI",
  account: "Account",
  notifications: "Notifications",
  appearance: "Appearance",
  language: "Language & Region",
  accessibility: "Accessibility",
  privacy: "Privacy",
  security: "Security",
  journal: "Journal",
  week: "Weekly",
  plan: "Plan",
  review: "Review",
  history: "History",
  billing: "Billing",
}

// Generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string) {
  // Remove trailing slash and split
  const paths = pathname.replace(/\/$/, '').split('/').filter(Boolean)
  
  const breadcrumbs = paths.map((path, index) => {
    // Build the URL for this breadcrumb
    const href = '/' + paths.slice(0, index + 1).join('/')
    
    // Get display name (use title mapping or format the path)
    const label = sectionTitles[path] || formatSlugToTitle(path)
    
    return {
      label,
      href,
      isLast: index === paths.length - 1,
    }
  })
  
  return breadcrumbs
}

export function SiteHeader({ className }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname || '/dashboard')

  return (
    <header className={`flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) ${className || ""}`}>
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1 text-sm overflow-hidden">
          {breadcrumbs.map((crumb) => (
            <Fragment key={crumb.href}>
              {crumb.isLast ? (
                // Last item - not clickable, bold
                <span className="font-medium text-base truncate max-w-[200px] sm:max-w-[300px]">
                  {crumb.label}
                </span>
              ) : (
                // Intermediate items - clickable links
                <>
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground hover:text-foreground transition-colors truncate hidden sm:inline"
                  >
                    {crumb.label}
                  </Link>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
                </>
              )}
            </Fragment>
          ))}
        </nav>

        {/* Right side: notifications + status */}
        <div className="ml-auto flex items-center gap-2">
          <ServiceStatusIndicator />
          <NotificationPopover />
        </div>
      </div>
    </header>
  )
}
