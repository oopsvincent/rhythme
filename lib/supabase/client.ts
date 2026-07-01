import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function createClient() {
  if (client) return client

  const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN // '.amplecen.com' in prod, unset in dev

  client = createBrowserClient(
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

  return client
}
