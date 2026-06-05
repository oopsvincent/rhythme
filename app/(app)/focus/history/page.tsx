import { SiteHeader } from "@/components/site-header";
import { FocusHistoryClient } from "@/components/focus/focus-history-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Focus History – Rhythmé",
  description: "Review your past focus sessions and patterns",
};

export default function FocusHistoryPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="@container/main flex flex-1 flex-col overflow-x-hidden">
          <FocusHistoryClient />
        </div>
      </div>
    </>
  );
}
