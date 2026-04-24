// app/api/payments/create-subscription/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { DODO_PRODUCT_IDS, getDodoClient, RHYTHME_PRODUCT_KEY, type BillingPlan } from '@/lib/payments/dodo';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const plan = body.plan as BillingPlan;

    if (!plan || !DODO_PRODUCT_IDS[plan]) {
      return NextResponse.json({ error: 'Invalid plan or missing product id.' }, { status: 400 });
    }

    // Get app URL for redirect
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const returnUrl = `${appUrl}/settings/subscription`;
    const dodopayments = getDodoClient();

    const session = await dodopayments.checkoutSessions.create({
      product_cart: [
        {
          product_id: DODO_PRODUCT_IDS[plan]!,
          quantity: 1,
        },
      ],
      return_url: returnUrl,
      customer: {
        email: user.email!,
        name: user.user_metadata?.full_name || '',
      },
      metadata: {
        user_id: user.id,
        product_key: RHYTHME_PRODUCT_KEY,
        plan_key: plan,
      },
    });

    const adminSupabase = getAdminClient();

    await adminSupabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    // The subscription id is delivered by webhook after checkout completes.
    await adminSupabase
      .from('account_subscriptions')
      .upsert({
        user_id: user.id,
        product_key: RHYTHME_PRODUCT_KEY,
        provider: 'dodo',
        provider_subscription_id: `checkout:${session.session_id}`,
        provider_product_id: DODO_PRODUCT_IDS[plan],
        plan_key: plan,
        status: 'pending',
        entitlement_active: false,
        raw_payload: session,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'provider,provider_subscription_id' });

    return NextResponse.json({
      checkout_url: session.checkout_url,
    });
  } catch (error) {
    console.error('Create subscription checkout error:', error);
    return NextResponse.json({ error: 'Failed to create subscription checkout' }, { status: 500 });
  }
}
