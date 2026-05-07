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
      <div className="flex flex-1 flex-col px-4 md:px-10">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <FocusHistoryClient />
          </div>
        </div>
      </div>
    </>
  );
}
