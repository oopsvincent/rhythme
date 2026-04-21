/**
 * Amplecen ID — Auth Redirect Helpers
 *
 * Use these instead of hardcoding `/login` anywhere in Rhythmé.
 * The accounts URL is driven by NEXT_PUBLIC_ACCOUNTS_URL so it works
 * in both local dev (localhost:3001) and production (accounts.amplecen.com).
 */

/**
 * Build the full Amplecen ID login URL with a return_to param
 * pointing back to this Rhythmé path.
 *
 * @param returnPath - the Rhythmé path to return to after login (e.g. '/dashboard')
 * @returns full URL string, e.g. https://accounts.amplecen.com/login?return_to=https%3A%2F%2Frythme...
 */
export function getAmplecenLoginUrl(returnPath: string = '/dashboard'): string {
  const accountsUrl = process.env.NEXT_PUBLIC_ACCOUNTS_URL || 'https://accounts.amplecen.com'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rhythme.amplecen.com'
  const returnTo = encodeURIComponent(`${appUrl}${returnPath}`)
  return `${accountsUrl}/login?return_to=${returnTo}`
}

/**
 * Build the accounts app home URL (for sign-out redirects).
 */
export function getAmplecenHomeUrl(): string {
  return process.env.NEXT_PUBLIC_ACCOUNTS_URL || 'https://accounts.amplecen.com'
}
