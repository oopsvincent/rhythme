// app/actions/subscription.ts
'use server'

import { createClient } from '@/lib/supabase/server'

export interface SubscriptionStatus {
  isPremium: boolean
  subscriptionStatus: string
  subscriptionId: string | null
}

/**
 * Get the current user's subscription/premium status from the profiles table.
 * Auto-creates a profile row if one doesn't exist (handles new signups).
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      isPremium: false,
      subscriptionStatus: 'inactive',
      subscriptionId: null,
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_premium, subscription_status, subscription_id')
    .eq('id', user.id)
    .single()

  // If no profile exists, create one with defaults
  if (profileError || !profile) {
    await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        is_premium: false,
        subscription_status: 'inactive',
      }, { onConflict: 'id' })

    return {
      isPremium: false,
      subscriptionStatus: 'inactive',
      subscriptionId: null,
    }
  }

  return {
    isPremium: profile.is_premium ?? false,
    subscriptionStatus: profile.subscription_status ?? 'inactive',
    subscriptionId: profile.subscription_id ?? null,
  }
}
