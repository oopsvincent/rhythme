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

// Layout is synchronous — no server-side data fetching.
// Auth gating is handled by middleware.ts (via lib/supabase/proxy.ts).
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <FocusWidgetProvider>
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
                
<OnboardingCheck>
  <div className="flex flex-1 bg-muted/30 dark:bg-background">
    <main className="@container/main flex flex-1 p-0 pb-20 md:p-4 md:pb-4 lg:p-6 lg:pb-6">
      <div
        className="
          w-full
          bg-card
          p-4
          md:rounded-xl md:border md:border-border md:shadow-sm md:p-4
          lg:rounded-2xl lg:p-6
        "
      >
        {children}
      </div>
    </main>
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
      </FocusWidgetProvider>
    </SettingsProvider>
  );
}

export const metadata: Metadata = {
  title: "Rhythmé Dashboard",
  description: "Your Personal Dashboard for Productivity",
};
