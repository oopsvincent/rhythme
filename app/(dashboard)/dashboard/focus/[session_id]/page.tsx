import { SiteHeader } from "@/components/site-header";
import { SessionDetailClient } from "@/components/focus/session-detail-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Session Detail – Rhythmé",
  description: "View details of a focus session",
};

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ session_id: string }>;
}) {
  const { session_id } = await params;
  const sessionId = Number(session_id);

  if (!Number.isFinite(sessionId)) {
    return (
      <>
        <SiteHeader />
        <div className="flex flex-1 flex-col items-center justify-center py-16">
          <p className="text-destructive text-sm">Invalid session ID.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col px-4 md:px-10">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SessionDetailClient sessionId={sessionId} />
          </div>
        </div>
      </div>
    </>
  );
}
