import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { SidebarRightWrapper } from "@/components/sidebar-right-wrapper";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { SettingsProvider } from "@/components/providers/settings";
import { FocusWidgetProvider } from "@/components/providers/focus-widget-provider";
import OnboardingCheck from "@/components/OnboardingCheck";
import AppSidebarWrapper from "@/components/providers/appSidebarWrapper";
import { BrowserNotificationPrompt } from "@/components/notifications/browser-notification-prompt";
import { NavigationTransitionProvider } from "@/components/providers/navigation-transition-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <FocusWidgetProvider>
        <NavigationTransitionProvider>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as React.CSSProperties
            }
          >
            {/* Change from variant="inset" to variant="sidebar" for a docked, seamless sidebar */}
            <AppSidebarWrapper variant="sidebar" />
            <SidebarInset>
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <OnboardingCheck>
                    {/* Clean, borderless container matching the workspace dimensions */}
                    <div className="flex-1 flex flex-col min-h-screen bg-background relative">
                      {children}
                    </div>
                  </OnboardingCheck>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Copy</ContextMenuItem>
                  <ContextMenuItem>Paste</ContextMenuItem>
                  <ContextMenuItem>Share</ContextMenuItem>
                  <ContextMenuItem>Delete</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </SidebarInset>
            <SidebarRightWrapper />
          </SidebarProvider>
          <BrowserNotificationPrompt />
        </NavigationTransitionProvider>
      </FocusWidgetProvider>
    </SettingsProvider>
  );
}

export const metadata: Metadata = {
  title: "Rhythmé Dashboard",
  description: "Your Personal Dashboard for Productivity",
};
