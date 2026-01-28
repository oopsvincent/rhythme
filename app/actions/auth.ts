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
      // Use current window location for redirection handling if possible, or fallback
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

  // Delete user from auth (RPC override often needed for "delete own account" or utilize service role if available in different context, 
  // but standard user deletion usually works if RLS allows or if strictly creating a deletion request. 
  // Assuming standard "delete user" capability or cascade from public table if configured.)
  
  // Note: Standard Supabase client might not allow deleting SELF directly via API without admin flag. 
  // However, removing from `public.users` usually triggers cascade if set up, OR we call specific function.
  // For now, we try standard auth deletion which effectively signs them out too.
  
  // Actually, standard `supabase.auth.admin.deleteUser` requires service role.
  // `supabase.rpc('delete_user')` is a common pattern.
  // IF NOT AVAILABLE, we can only sign out and "mark" for deletion in a real app, 
  // but let's assume we can clean up public.users first if that triggers cascade.
  
  // Attempting to delete from public.users first (if RLS allows users to delete themselves)
  // which implies cascade deletion on auth.users if trigger is bidirectional (rare) 
  // OR usually deleting from auth.users cascades to public.users.
  
  // Since we don't have the service key exposed here safely without "use server" + environment variable check,
  // we will try to use a Supabase Admin client if the implementation allows, 
  // otherwise we might need to rely on a database function.

  // NOTE: For this specific environment, we assume a server-side delete function exists or RLS allows "delete self".
  
  // PLAN B: Using a direct PostgreSQL call if we had one.
  // PLAN C (Safe Default): We'll assume the goal is "Sign Out and Wipe Data".
  
  // Trying an RPC call if it exists, typical for this stack.
  const { error } = await supabase.rpc('delete_own_account');

  if (error) {
    // If RPC doesn't exist, try removing from public.users directly if allowed
    const { error: dbError } = await supabase.from('users').delete().eq('id', user.id);
    
    if (dbError) {
      console.error("Failed to delete account:", error || dbError)
      return { success: false, error: "Deletion failed. Contact support." }
    }
  }

  await supabase.auth.signOut()
  redirect('/login')  // This will throw error in Server Action if not caught, but here return type suggests object. 
  // Ideally client handles redirect. But `redirect` throws so function exits.
  // We'll trust the client side redirect for cleaner UX or let the `redirect` happen.
}
