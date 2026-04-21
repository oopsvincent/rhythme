// // app/api/payments/verify/route.ts
// // Client-side payment verification — called after Razorpay checkout succeeds
// import { NextResponse } from 'next/server';
// import { createClient } from '@/lib/supabase/server';
// import { createClient as createAdminClient } from '@supabase/supabase-js';
// import crypto from 'crypto';
// import Razorpay from 'razorpay';

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!,
// });

// const PLAN_IDS = {
//   monthly: 'plan_SPmQWhjDt5EyDF',
//   yearly: 'plan_SPmREBwR56C0gG',
// } as const;

// export async function POST(request: Request) {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();

//   if (!user) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const {
//       razorpay_payment_id,
//       razorpay_subscription_id,
//       razorpay_signature,
//     } = await request.json();

//     if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
//       return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
//     }

//     // Verify signature: HMAC SHA256 of "payment_id|subscription_id" with key_secret
//     const generatedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
//       .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
//       .digest('hex');

//     if (generatedSignature !== razorpay_signature) {
//       return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
//     }

//     // Admin client to bypass RLS
//     const adminSupabase = createAdminClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.SUPABASE_SECRET_KEY!
//     );

//     // Fetch subscription from Razorpay to determine plan type
//     const rzpSubscription = await razorpay.subscriptions.fetch(razorpay_subscription_id);
//     const plan = rzpSubscription.plan_id === PLAN_IDS.monthly ? 'monthly' : 'yearly';
//     const amount = plan === 'monthly' ? 9.99 : 99.99;
    
//     // Dates calculation
//     const startDate = new Date();
//     const endDate = new Date();
//     if (plan === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
//     else endDate.setFullYear(endDate.getFullYear() + 1);

//     // Fetch current billing history
//     const { data: profile } = await adminSupabase
//       .from('profiles')
//       .select('billing_history')
//       .eq('id', user.id)
//       .single();

//     const currentHistory = Array.isArray(profile?.billing_history) ? profile.billing_history : [];
    
//     // Ensure we don't duplicate the entry if webhook already captured it
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const paymentExists = currentHistory.some((entry: any) => entry.payment_id === razorpay_payment_id);
    
//     let updatedHistory = currentHistory;
//     if (!paymentExists) {
//       const newBillingEntry = {
//         id: crypto.randomUUID(),
//         date: startDate.toISOString(),
//         amount: amount,
//         plan_type: plan,
//         payment_id: razorpay_payment_id,
//         status: 'paid'
//       };
//       updatedHistory = [newBillingEntry, ...currentHistory];
//     }

//     // Signature valid — activate premium and update history
//     const { error: updateError } = await adminSupabase
//       .from('profiles')
//       .update({
//         is_premium: true,
//         razorpay_subscription_id,
//         subscription_status: 'active',
//         subscription_plan: plan,
//         subscription_amount_paid: amount,
//         subscription_start_date: startDate.toISOString(),
//         subscription_end_date: endDate.toISOString(),
//         billing_history: updatedHistory,
//       })
//       .eq('id', user.id);

//     if (updateError) {
//       console.error('Profile update error:', updateError);
//       return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
//     }

//     return NextResponse.json({ success: true, message: 'Payment verified, premium activated!' });
//   } catch (error) {
//     console.error('Verify payment error:', error);
//     return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
//   }
// }
