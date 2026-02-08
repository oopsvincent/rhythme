/**
 * =============================================================================
 * JOURNAL LIST PAGE (Server Component)
 * =============================================================================
 * 
 * SSR: Fetches all journals server-side via getJournals() action.
 * Passes data to JournalPageClient for client-side interactivity.
 * 
 * ENCRYPTION: Passes user info and encryption token for unlock/setup modals.
 * =============================================================================
 */

import { getJournals } from '@/app/actions/journals'
import { getUser } from '@/app/actions/auth'
import { getEncryptionToken } from '@/app/actions/encryption'
import JournalPageClient from './journal-client'
import { redirect } from 'next/navigation'

const JournalPage = async () => {
    const [journals, user, encryptionToken] = await Promise.all([
      getJournals(),
      getUser(),
      getEncryptionToken()
    ]);
    
    if (!user) {
      redirect('/login');
    }
    
  return (
    <JournalPageClient 
      journals={journals} 
      userEmail={user.email} 
      userId={user.id}
      encryptionToken={encryptionToken}
    />
  )
}

export default JournalPage