/**
 * =============================================================================
 * JOURNAL INSIGHTS LIST PAGE (Server Component)
 * =============================================================================
 * 
 * SSR: Fetches all journals server-side via getJournals() action.
 * Passes data to InsightsListClient for interactive decryption, search, and selection.
 * =============================================================================
 */

import { getJournals } from "@/app/actions/journals";
import { getUser } from "@/app/actions/auth";
import { getEncryptionToken } from "@/app/actions/encryption";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import InsightsListClient from "./insights-list-client";

export default async function JournalInsightsPage() {
  const [journals, user, encryptionToken] = await Promise.all([
    getJournals(),
    getUser(),
    getEncryptionToken(),
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-screen bg-background text-muted-foreground">Loading insights...</div>}>
      <InsightsListClient
        journals={journals}
        userId={user.id}
        userEmail={user.email}
        encryptionToken={encryptionToken}
      />
    </Suspense>
  );
}
