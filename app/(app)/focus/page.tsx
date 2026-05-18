import { SiteHeader } from "@/components/site-header";
import { FocusHubClient } from "@/components/focus/focus-hub-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Focus – Rhythmé",
  description: "Start a calm, intentional focus session",
};

export default function FocusPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col px-4 md:px-10">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <FocusHubClient />
          </div>
        </div>
      </div>
    </>
  );
}
