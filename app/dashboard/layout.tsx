import { redirect } from "next/navigation";
import { getUser } from "@/app/actions/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { SidebarRight } from "@/components/sidebar-right";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <main className="flex flex-1 flex-col">{children}</main>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Copy</ContextMenuItem>
            <ContextMenuItem>Paste</ContextMenuItem>
            <ContextMenuItem>Share</ContextMenuItem>
            <ContextMenuItem>Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  );
}

export const metadata: Metadata = {
  title: "Rhythmé Dashboard",
  description: "Your Personal Dashboard for Productivity",
};
