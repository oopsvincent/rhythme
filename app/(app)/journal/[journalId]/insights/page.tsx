/**
 * =============================================================================
 * JOURNAL INSIGHTS PAGE (Server Component)
 * =============================================================================
 * 
 * SSR: Fetches single journal server-side via getJournalById() action.
 * Passes data to InsightsClient for client-side analysis and display.
 * 
 * ENCRYPTION: Passes user ID and encryption token for passphrase unlock.
 * =============================================================================
 */

import { getJournalById } from "@/app/actions/journals";
import { getUser } from "@/app/actions/auth";
import { getEncryptionToken } from "@/app/actions/encryption";
import { notFound, redirect } from "next/navigation";
import InsightsClient from "./insights-client";

interface InsightsPageProps {
  params: Promise<{ journalId: string }>;
}

export default async function JournalInsightsPage({ params }: InsightsPageProps) {
  const { journalId } = await params;

  const [journal, user, encryptionToken] = await Promise.all([
    getJournalById(journalId),
    getUser(),
    getEncryptionToken()
  ]);

  if (!user) {
    redirect('/login');
  }

  if (!journal) {
    notFound();
  }

  return (
    <InsightsClient
      journal={journal}
      userId={user.id}
      encryptionToken={encryptionToken}
    />
  );
}
