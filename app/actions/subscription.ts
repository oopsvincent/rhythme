// app/actions/subscription.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { RHYTHME_PRODUCT_KEY } from '@/lib/payments/dodo'

export interface SubscriptionStatus {
  isPremium: boolean
  subscriptionStatus: string
  subscriptionId: string | null
  cancelAtPeriodEnd?: boolean
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
    .from('account_subscriptions')
    .select('entitlement_active, status, provider_subscription_id, cancel_at_period_end')
    .eq('user_id', user.id)
    .eq('product_key', RHYTHME_PRODUCT_KEY)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // If no profile exists, create one with defaults for the central account table.
  if (profileError || !profile) {
    await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      }, { onConflict: 'id' })

    return {
      isPremium: false,
      subscriptionStatus: 'inactive',
      subscriptionId: null,
    }
  }

  return {
    isPremium: profile.entitlement_active ?? false,
    subscriptionStatus: profile.status ?? 'inactive',
    subscriptionId: profile.provider_subscription_id ?? null,
    cancelAtPeriodEnd: profile.cancel_at_period_end ?? false,
  }
}

export async function isCurrentUserPremium(): Promise<boolean> {
  const status = await getSubscriptionStatus()
  return status.isPremium
}

/**
 * Claim the 1-month free premium promotion.
 * Inserts an active subscription row in database.
 */
export async function claimPromoPremium(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'You must be signed in to claim this promotion.' }
  }

  // Check if they have already claimed this promotion
  const { data: existingPromo } = await supabase
    .from('account_subscriptions')
    .select('provider_subscription_id')
    .eq('user_id', user.id)
    .eq('provider', 'free_promotion')
    .maybeSingle()

  if (existingPromo) {
    return { success: false, error: 'You have already claimed this free premium promotion.' }
  }

  // Create/Upsert profile to be safe
  await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })

  // Insert the subscription row
  const { error: insertError } = await supabase
    .from('account_subscriptions')
    .insert({
      user_id: user.id,
      product_key: RHYTHME_PRODUCT_KEY,
      provider: 'free_promotion',
      provider_subscription_id: `promo_1month:${user.id}`,
      provider_product_id: 'promo_premium_1month',
      plan_key: 'monthly',
      status: 'active',
      entitlement_active: true,
      raw_payload: { claimed_at: new Date().toISOString(), promo: "1month_free" },
      updated_at: new Date().toISOString(),
    })

  if (insertError) {
    console.error('Failed to claim premium promo:', insertError)
    return { success: false, error: 'Failed to claim premium. Please try again later.' }
  }

  return { success: true }
}
