// app/api/payments/webhook/route.ts
// Razorpay webhook handler — verifies signature and updates subscription status
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Use service role client for webhook — no user session available
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function verifyWebhookSignature(body: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('RAZORPAY_WEBHOOK_SECRET not set — skipping signature verification');
    return true; // Allow in dev when secret not configured
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}

const PLAN_IDS = {
  monthly: 'plan_SPmQWhjDt5EyDF',
  yearly: 'plan_SPmREBwR56C0gG',
} as const;

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error('Webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payload = event.payload;

    const supabase = getAdminClient();

    switch (eventType) {
      case 'subscription.activated':
      case 'subscription.completed':
      case 'subscription.charged': {
        const subscription = payload.subscription?.entity;
        const payment = payload.payment?.entity;
        const subscriptionId = subscription?.id;
        if (!subscriptionId) break;

        // Fetch current profile to get billing history
        const { data: profile } = await supabase
          .from('profiles')
          .select('billing_history')
          .eq('razorpay_subscription_id', subscriptionId)
          .single();

        if (!profile) {
          console.error(`Profile not found for subscription ${subscriptionId}`);
          break;
        }

        const currentHistory = Array.isArray(profile.billing_history) ? profile.billing_history : [];
        let updatedHistory = currentHistory;

        // Extract plan and amount
        const planId = subscription?.plan_id;
        const plan = planId === PLAN_IDS.monthly ? 'monthly' : 'yearly';
        
        let amount = 0;
        let paymentId = '';
        if (payment) {
          amount = payment.amount / 100; // convert from smallest currency unit to standard
          paymentId = payment.id;
        } else {
          // fallback if no payment entity attached
          amount = plan === 'monthly' ? 9.99 : 99.99;
        }

        // Add to history if not exists
        if (paymentId && !currentHistory.some((entry: any) => entry.payment_id === paymentId)) {
          const newBillingEntry = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            amount: amount,
            plan_type: plan,
            payment_id: paymentId,
            status: 'paid'
          };
          updatedHistory = [newBillingEntry, ...currentHistory];
        }

        const startDate = subscription?.current_start ? new Date(subscription.current_start * 1000).toISOString() : new Date().toISOString();
        const endDate = subscription?.current_end ? new Date(subscription.current_end * 1000).toISOString() : new Date().toISOString();

        // Find user by subscription ID and activate premium
        await supabase
          .from('profiles')
          .update({
            is_premium: true,
            subscription_status: 'active',
            subscription_plan: plan,
            subscription_amount_paid: amount,
            subscription_start_date: startDate,
            subscription_end_date: endDate,
            billing_history: updatedHistory,
          })
          .eq('razorpay_subscription_id', subscriptionId);

        console.log(`✅ Subscription ${eventType}: ${subscriptionId}`);
        break;
      }

      case 'subscription.halted':
      case 'subscription.cancelled': {
        const subscriptionId = payload.subscription?.entity?.id;
        if (!subscriptionId) break;

        const status = eventType === 'subscription.cancelled' ? 'cancelled' : 'halted';

        await supabase
          .from('profiles')
          .update({
            is_premium: false,
            subscription_status: status,
          })
          .eq('razorpay_subscription_id', subscriptionId);

        console.log(`❌ Subscription ${status}: ${subscriptionId}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
