// app/actions/auth.ts
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Supported OAuth providers
export type OAuthProvider = 'google' | 'github' | 'discord' | 'spotify' | 'apple' | 'facebook'

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

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/auth/callback`,
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

  const { data, error } = await supabase.auth.linkIdentity({
    provider,
    options: {
      redirectTo: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/settings/account?linked=${provider}`,
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

   
  const { error } = await supabase.auth.unlinkIdentity({
    id: identityId,
    provider: user.identities.find(i => i.id === identityId)?.provider || '',
  } as any) // Type assertion needed due to Supabase types

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/settings/account')
  return { success: true }
}
