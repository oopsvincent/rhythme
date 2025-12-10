import { redirect } from "next/navigation";
import { getUser } from "@/app/actions/auth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { SidebarRight } from "@/components/sidebar-right";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { SettingsProvider } from "@/components/providers/settings";
import OnboardingCheck from "@/components/OnboardingCheck";
import AppSidebarWrapper from "@/components/providers/appSidebarWrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    // Redirect to login with the return URL
    redirect("/login?redirect=/dashboard");
  }

  // Fetch user settings from your database
  // This runs on the server, so you can make direct DB queries
  const initialData = {
    account: {
      name: user.name || "John Doe",
      email: user.email || "johndoe@gmail.com",
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
        <AppSidebarWrapper variant="inset" />
        <SidebarInset>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              
              <OnboardingCheck><main className="flex flex-1 flex-col">{children}</main></OnboardingCheck>
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
