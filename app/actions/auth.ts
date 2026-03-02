// app/actions/auth.ts
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

// Supported OAuth providers
export type OAuthProvider = 'google' | 'github' | 'discord' | 'apple' | 'facebook'

/**
 * Get the base URL from environment or headers (for server actions).
 * 
 * Priority order:
 *  1. NEXT_PUBLIC_APP_URL — explicit override (e.g. custom domain)
 *  2. Request headers — reflects the domain the user is actually visiting
 *  3. VERCEL_PROJECT_PRODUCTION_URL — Vercel's .vercel.app domain (last resort)
 *  4. localhost fallback
 *
 * IMPORTANT: Request headers MUST come before VERCEL_PROJECT_PRODUCTION_URL
 * because the Vercel URL resolves to the .vercel.app domain, which may be
 * behind Vercel Authentication. Using the host header ensures OAuth callbacks
 * redirect to whatever domain the user actually accessed (i.e. your custom domain).
 */
async function getBaseUrl(): Promise<string> {
  // 1. Explicit app URL override (highest priority)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  // 2. Derive from incoming request headers — gives us the real domain
  //    the user is visiting (custom domain, not the .vercel.app domain)
  try {
    const headersList = await headers()
    const host = headersList.get('host')
    const protocol = headersList.get('x-forwarded-proto') || 'https'
    if (host) {
      return `${protocol}://${host}`
    }
  } catch {
    // Headers not available (e.g. called outside of a request context)
  }

  // 3. Vercel's auto-set production URL (may be .vercel.app — use as fallback only)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  // 4. Local development fallback
  return 'http://localhost:3000'
}

export async function signOut() {
  const supabase = await createClient()

  await supabase.auth.signOut()
  redirect('/login')
}

export async function getUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    console.log('No user found, should redirect')
    return null
  }

  return {
    id: user.id,
    email: user.email!,
    name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email!.split('@')[0],
    avatar:
      user.user_metadata?.avatar_url ||
      `https://avatar.vercel.sh/${user.email}`,
  }
}

export async function getFullUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    console.log('No user found, should redirect')
    return null
  }

  return user
}

export async function signInWithProviderAction(
  provider: OAuthProvider,
) {
  const supabase = await createClient()
  const baseUrl = await getBaseUrl()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  })

  if (error) throw new Error(error.message)

  redirect(data.url)
}

// ============================================================================
// IDENTITY MANAGEMENT (Connected Accounts)
// ============================================================================

export interface LinkedIdentity {
  id: string
  provider: string
  email?: string
  name?: string
  avatar?: string
  createdAt?: string
  lastSignIn?: string
}

/**
 * Get all linked identities (social logins) for the current user
 */
export async function getUserIdentities(): Promise<LinkedIdentity[]> {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user || !user.identities) {
    return []
  }

  return user.identities.map((identity) => ({
    id: identity.id,
    provider: identity.provider,
    email: identity.identity_data?.email,
    name: identity.identity_data?.full_name || identity.identity_data?.name,
    avatar: identity.identity_data?.avatar_url || identity.identity_data?.picture,
    createdAt: identity.created_at,
    lastSignIn: identity.last_sign_in_at,
  }))
}

/**
 * Link a new OAuth provider to the current user's account
 */
export async function linkProvider(provider: OAuthProvider) {
  const supabase = await createClient()
  const baseUrl = await getBaseUrl()

  const { data, error } = await supabase.auth.linkIdentity({
    provider,
    options: {
      // Redirect back to callback which will detect linked param and redirect to settings
      redirectTo: `${baseUrl}/auth/callback?linked=${provider}`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // Redirect to OAuth provider
  if (data.url) {
    redirect(data.url)
  }

  return { success: true }
}

/**
 * Unlink an OAuth provider from the current user's account
 * 
 * IMPORTANT: This requires "Enable Manual Linking" to be enabled in 
 * Supabase Dashboard > Authentication > Providers
 */
export async function unlinkProvider(identityId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // First check how many identities the user has
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || !user.identities) {
    return { success: false, error: "User not found" }
  }

  // Prevent unlinking if it's the only identity
  if (user.identities.length <= 1) {
    return { success: false, error: "Cannot remove your only login method. Add another account first." }
  }

  // Find the identity to unlink
  const identity = user.identities.find(i => i.id === identityId)
  
  if (!identity) {
    return { success: false, error: "Identity not found" }
  }

  // Supabase unlinkIdentity requires passing the identity object directly
  // See: https://supabase.com/docs/reference/javascript/auth-unlinkidentity
  const { error } = await supabase.auth.unlinkIdentity(identity)

  if (error) {
    console.error("Unlink error:", error)
    // Common error: Manual linking not enabled
    if (error.message.includes('manual linking')) {
      return { success: false, error: "Account unlinking is not enabled. Please contact support." }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/settings/connections')
  revalidatePath('/settings/account')
  return { success: true }
}

// ============================================================================
// SECURITY & PASSWORD MANAGEMENT
// ============================================================================

export async function updatePassword(password: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { success: false, error: "User not authenticated" }
  }
  

  try {
    // Delete user data from all tables (child tables first to respect FK constraints)
    // Errors on individual tables are non-fatal — some tables might not exist or have no rows
    const tables = [
      'habit_logs',
      'habits',
      'journals',
      'user_preferences',
    ]

    for (const table of tables) {
      await supabase.from(table).delete().eq('user_id', user.id)
    }

    // Sign the user out (clears the session)
    await supabase.auth.signOut()
    
    return { success: true }
  } catch (err) {
    console.error("Failed to delete account:", err)
    return { success: false, error: "Something went wrong during deletion. Please try again." }
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const baseUrl = await getBaseUrl()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/account/update-password`,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
