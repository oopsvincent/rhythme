// components/site-header.tsx
"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { SearchForm } from "./search-form"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { Fragment } from "react"

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
  account: "Account",
  notifications: "Notifications",
  appearance: "Appearance",
  language: "Language & Region",
  accessibility: "Accessibility",
  privacy: "Privacy",
  security: "Security",
}

// Generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string) {
  // Remove trailing slash and split
  const paths = pathname.replace(/\/$/, '').split('/').filter(Boolean)
  
  const breadcrumbs = paths.map((path, index) => {
    // Build the URL for this breadcrumb
    const href = '/' + paths.slice(0, index + 1).join('/')
    
    // Get display name (use title mapping or format the path)
    const label = sectionTitles[path] || formatPathSegment(path)
    
    return {
      label,
      href,
      isLast: index === paths.length - 1,
    }
  })
  
  return breadcrumbs
}

// Format path segments that aren't in the mapping (like slugs or IDs)
function formatPathSegment(segment: string): string {
  // If it's a UUID or ID-like string, truncate it
  if (segment.match(/^[a-f0-9-]{20,}$/i)) {
    return segment.substring(0, 8) + '...'
  }
  
  // Otherwise, capitalize and replace hyphens with spaces
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function SiteHeader() {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname || '/dashboard')

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1 text-sm overflow-hidden">
          {breadcrumbs.map((crumb, index) => (
            <Fragment key={crumb.href}>
              {crumb.isLast ? (
                // Last item - not clickable, bold
                <span className="font-medium text-base truncate">
                  {crumb.label}
                </span>
              ) : (
                // Intermediate items - clickable links
                <>
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground hover:text-foreground transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </>
              )}
            </Fragment>
          ))}
        </nav>

        <div className="hidden ml-auto lg:flex items-center gap-2">
          <SearchForm />
        </div>
      </div>
    </header>
  )
}