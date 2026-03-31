import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Setup web-push
webpush.setVapidDetails(
  'mailto:support@rhythme.app', // Update with your actual contact email
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

export async function POST(req: Request) {
  try {
    // 1. Verify webhook secret
    const authHeader = req.headers.get('Authorization');
    if (process.env.WEBHOOK_SECRET && authHeader !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Assuming Supabase Database Webhook payload for INSERT
    const notification = body.record;
    
    if (!notification || !notification.user_id) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // 2. Fetch subscriptions for the user
    // We need service role key to bypass RLS and read subscriptions
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
       return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: subscriptions, error } = await supabaseAdmin
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', notification.user_id);

    if (error || !subscriptions) {
      console.error('Error fetching subscriptions:', error);
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }

    if (subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'No active subscriptions' });
    }

    // 3. Send Push Notifications
    const payload = JSON.stringify({
      title: notification.title || 'New Notification',
      body: notification.message || '',
      url: notification.link || '/'
    });

    const sendPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.auth_key,
          p256dh: sub.p256dh_key
        }
      };

      try {
        await webpush.sendNotification(pushSubscription, payload);
      } catch (err: any) {
        // If the subscription is gone/expired (410, 404), delete it from DB
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabaseAdmin
            .from('push_subscriptions')
            .delete()
            .eq('id', sub.id);
        } else {
          console.error('Error sending push to endpoint:', sub.endpoint, err);
        }
      }
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true, count: subscriptions.length });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
