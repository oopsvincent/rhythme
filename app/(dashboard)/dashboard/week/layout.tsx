import React from "react"
import { SiteHeader } from "@/components/site-header"

export default function WeekLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full w-full">
      <SiteHeader />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}