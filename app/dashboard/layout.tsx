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
import CalendarDrawer from "@/components/calender-drawer";
import { SettingsProvider } from "@/components/providers/settings";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user settings from your database
  // This runs on the server, so you can make direct DB queries
  const initialData = {
    account: {
      name: user.name || "",
      email: user.email || "",
      bio: "",
    },
    notifications: {
      email: true,
      push: false,
      marketing: false,
    },
    appearance: {
    //   theme: "system" as const,
    //   fontSize: "medium",
    },
    language: {
      language: "en",
      timezone: "utc",
    },
    privacy: {
      profileVisible: true,
      showActivityStatus: true,
    },
  };

  return (
    <SettingsProvider initialData={initialData}>
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
          <div className="fixed bottom-3 right-3 lg:hidden z-50">
            <CalendarDrawer />
          </div>
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
    </SettingsProvider>
  );
}

export const metadata: Metadata = {
  title: "Rhythmé Dashboard",
  description: "Your Personal Dashboard for Productivity",
};
