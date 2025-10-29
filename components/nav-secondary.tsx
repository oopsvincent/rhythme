"use client";

import * as React from "react";
// import { type Icon } from "@tabler/icons-react";
import { type LucideProps } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useDialogStore } from "@/store/useDialogStore";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: React.ForwardRefExoticComponent<LucideProps>;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { setSettingsOpen } = useDialogStore();
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem
              key={item.title}
              onClick={() => {
                if (item.title === "Settings") {
                  setSettingsOpen(true);
                }
              }}
            >
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
