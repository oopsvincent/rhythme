/**
 * =============================================================================
 * JOURNAL DETAIL PAGE (Server Component)
 * =============================================================================
 * 
 * SSR: Fetches single journal server-side via getJournalById() action.
 * Passes data to JournalDetailClient for client-side editing/viewing.
 * 
 * ENCRYPTION: Passes user ID and encryption token for passphrase unlock.
 * =============================================================================
 */

import { getJournalById } from "@/app/actions/journals";
import { getUser } from "@/app/actions/auth";
import { getEncryptionToken } from "@/app/actions/encryption";
import { notFound, redirect } from "next/navigation";
import JournalDetailClient from "./journal-detail-client";

interface JournalDetailPageProps {
  params: Promise<{ journalId: string }>;
}

export default async function JournalDetailPage({ params }: JournalDetailPageProps) {
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
    <JournalDetailClient 
      journal={journal} 
      userId={user.id}
      encryptionToken={encryptionToken}
    />
  );
}
