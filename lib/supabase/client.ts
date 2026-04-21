import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN // '.amplecen.com' in prod, unset in dev

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    cookieDomain
      ? {
          cookieOptions: {
            domain: cookieDomain,
            path: '/',
            sameSite: 'lax' as const,
            secure: true,
          },
        }
      : undefined
  )
}