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
      case 'subscription.completed': {
        const subscriptionId = payload.subscription?.entity?.id;
        if (!subscriptionId) break;

        // Find user by subscription ID and activate premium
        await supabase
          .from('profiles')
          .update({
            is_premium: true,
            subscription_status: 'active',
          })
          .eq('razorpay_subscription_id', subscriptionId);

        console.log(`✅ Subscription activated: ${subscriptionId}`);
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

      case 'payment.captured': {
        // Payment successful — subscription.activated usually handles this,
        // but we log it for completeness
        const paymentId = payload.payment?.entity?.id;
        console.log(`💰 Payment captured: ${paymentId}`);
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
