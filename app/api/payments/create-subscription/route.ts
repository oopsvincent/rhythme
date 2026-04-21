// app/api/payments/create-subscription/route.ts
import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

const dodopayments = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'test_mode',
});

const PRODUCT_IDS = {
  monthly: process.env.DODO_MONTHLY_SUBSCRIPTION_ID,
  yearly: process.env.DODO_YEARLY_SUBSCRIPTION_ID,
} as const;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const plan = body.plan as 'monthly' | 'yearly';

    if (!plan || !PRODUCT_IDS[plan]) {
      return NextResponse.json({ error: 'Invalid plan or missing product id.' }, { status: 400 });
    }

    // Get app URL for redirect
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const returnUrl = `${appUrl}/settings/subscription`;

    const session = await dodopayments.checkoutSessions.create({
      product_cart: [
        {
          product_id: PRODUCT_IDS[plan]!,
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
      },
    });

    const adminSupabase = getAdminClient();

    // Initial status, waiting for webhook
    await adminSupabase
      .from('profiles')
      .update({
        subscription_status: 'created',
      })
      .eq('id', user.id);

    return NextResponse.json({
      checkout_url: session.checkout_url,
    });
  } catch (error) {
    console.error('Create subscription checkout error:', error);
    return NextResponse.json({ error: 'Failed to create subscription checkout' }, { status: 500 });
  }
}
