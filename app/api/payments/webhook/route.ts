// app/api/payments/webhook/route.ts
import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const dodopayments = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'test_mode',
});

const webhookSecret = process.env.DODO_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('webhook-signature');

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event: any;

  try {
    // Verify the webhook signature using the SDK
    event = dodopayments.webhooks.unwrap(body, request.headers, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  try {
    switch (event.type) {
      case 'subscription.active':
      case 'subscription.renewed': {
        const subscription = event.data;
        const customerId = subscription.customer_id;
        const email = subscription.customer?.email; // Optional, might need to look up by email

        const userId = subscription.metadata?.user_id;

        if (userId) {
          await supabase
            .from('profiles')
            .update({
              subscription_id: subscription.subscription_id,
              subscription_status: subscription.status,
              is_premium: true,
            })
            .eq('id', userId);
        } else if (email) {
          // Fallback if metadata is missing
          const { data: userData } = await supabase.from('profiles').select('id').eq('email', email).single();
          if (userData?.id) {
            await supabase
              .from('profiles')
              .update({
                subscription_id: subscription.subscription_id,
                subscription_status: subscription.status,
                is_premium: true,
              })
              .eq('id', userData.id);
          }
        }
        break;
      }
      case 'subscription.cancelled':
      case 'subscription.failed':
      case 'subscription.expired': {
        const subscription = event.data;
        await supabase
          .from('profiles')
          .update({
            subscription_status: subscription.status,
            is_premium: false,
          })
          .eq('subscription_id', subscription.subscription_id);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
