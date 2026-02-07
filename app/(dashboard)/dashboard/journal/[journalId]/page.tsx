/**
 * =============================================================================
 * JOURNAL DETAIL PAGE (Server Component)
 * =============================================================================
 * 
 * SSR: Fetches single journal server-side via getJournalById() action.
 * Passes data to JournalDetailClient for client-side editing/viewing.
 * 
 * LOCAL-FIRST MVP: For offline support, the client component will need to
 * check local storage for the entry if server fetch fails. See journal-detail-client.tsx.
 * =============================================================================
 */

import { getJournalById } from "@/app/actions/journals";
import { notFound } from "next/navigation";
import JournalDetailClient from "./journal-detail-client";

interface JournalDetailPageProps {
  params: Promise<{ journalId: string }>;
}

export default async function JournalDetailPage({ params }: JournalDetailPageProps) {
  const { journalId } = await params;
  
  const journal = await getJournalById(journalId);
  
  if (!journal) {
    notFound();
  }

  return <JournalDetailClient journal={journal} />;
}
