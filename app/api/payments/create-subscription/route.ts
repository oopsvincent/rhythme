// app/api/payments/create-subscription/route.ts
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PLAN_IDS = {
  monthly: 'plan_SPmQWhjDt5EyDF',
  yearly: 'plan_SPmREBwR56C0gG',
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

    if (!plan || !PLAN_IDS[plan]) {
      return NextResponse.json({ error: 'Invalid plan. Use "monthly" or "yearly".' }, { status: 400 });
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: PLAN_IDS[plan],
      total_count: plan === 'monthly' ? 12 : 1,
      customer_notify: 1,
    });

    const adminSupabase = getAdminClient();

    // Store subscription ID in profile (status stays pending until payment)
    await adminSupabase
      .from('profiles')
      .update({
        razorpay_subscription_id: subscription.id,
        subscription_status: 'created',
      })
      .eq('id', user.id);

    return NextResponse.json({
      subscription_id: subscription.id,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}