/**
 * =============================================================================
 * NEW JOURNAL ENTRY PAGE (Server Component)
 * =============================================================================
 * 
 * SSR Pattern: Fetches user and encryption data, passes to client component.
 * =============================================================================
 */

import { getUser } from "@/app/actions/auth";
import { getEncryptionToken } from "@/app/actions/encryption";
import { redirect } from "next/navigation";
import NewJournalClient from "./new-journal-client";

export default async function NewJournalPage() {
  const [user, encryptionToken] = await Promise.all([
    getUser(),
    getEncryptionToken(),
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <NewJournalClient
      userId={user.id}
      userEmail={user.email}
      encryptionToken={encryptionToken}
    />
  );
}
