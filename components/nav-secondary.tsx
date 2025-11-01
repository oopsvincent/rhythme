"use client";

import * as React from "react";
// import { type Icon } from "@tabler/icons-react";
import { Settings2, type LucideProps } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useDialogStore } from "@/store/useDialogStore";
import { Button } from "./ui/button";
import { SettingsDialog } from "./settings-dialog";
import { useSettings } from "./providers/settings";

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
  const { openSettings } = useSettings();


  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {/* {items.map((item) => ( */}
            <SidebarMenuItem
            //   key={item.title}
            //   onClick={() => {
            //     if (item.title === "Settings") {
            //       setSettingsOpen(true);
            //     }
            //   }}
            >
              <SidebarMenuButton asChild>
                {/* <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a> */}
                    <Button variant="ghost" size="icon" onClick={openSettings} className="justify-start">
      <Settings2 className="h-5 w-5" />
      <span>Settings</span>
    </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          {/* ))} */}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
