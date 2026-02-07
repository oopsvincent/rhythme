/**
 * =============================================================================
 * JOURNAL LIST PAGE (Server Component)
 * =============================================================================
 * 
 * SSR: Fetches all journals server-side via getJournals() action.
 * Passes data to JournalPageClient for client-side interactivity.
 * 
 * LOCAL-FIRST MVP: For offline support, the client component will need to
 * merge this server data with local storage data. See journal-client.tsx.
 * =============================================================================
 */

import { getJournals } from '@/app/actions/journals'
import JournalPageClient from './journal-client'

const JournalPage = async () => {
    const journals = await getJournals();
    
  return (
    <JournalPageClient journals={journals} />
  )
}

export default JournalPage