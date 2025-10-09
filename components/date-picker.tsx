"use client"
import React from "react";
import { Calendar } from "@/components/ui/calendar"
import {
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

export function DatePicker() {
     const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <SidebarGroup className="px-5">
      <SidebarGroupContent>
        {/* <Calendar className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]" /> */}
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm"
      captionLayout="dropdown"
    />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
