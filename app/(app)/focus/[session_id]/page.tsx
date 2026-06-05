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

  // Extract ID from slug if present (e.g., "morning-focus-52" -> "52")
  const idFromSlug = session_id.split("-").pop();
  const sessionId = Number(idFromSlug || session_id);

  if (isNaN(sessionId) || !Number.isFinite(sessionId)) {
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
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="@container/main flex flex-1 flex-col overflow-x-hidden">
          <SessionDetailClient sessionId={sessionId} />
        </div>
      </div>
    </>
  );
}
