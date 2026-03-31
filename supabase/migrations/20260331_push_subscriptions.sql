-- Create push_subscriptions table
create table public.push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  endpoint text not null unique,
  auth_key text not null,
  p256dh_key text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.push_subscriptions enable row level security;

create policy "Users can view their own subscriptions"
  on public.push_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own subscriptions"
  on public.push_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own subscriptions"
  on public.push_subscriptions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own subscriptions"
  on public.push_subscriptions for delete
  using (auth.uid() = user_id);

-- Instructions for setting up the Webhook in Supabase UI:
/*
  To trigger the push notification:
  1. Go to your Supabase Dashboard -> Database -> Webhooks.
  2. Create a new Webhook:
     - Name: push_notification
     - Trigger: INSERT on `notifications` table
     - Type: HTTP Request
     - Method: POST
     - URL: https://your-domain.vercel.app/api/webhooks/push
     - Headers:
       - Authorization: Bearer <your-webhook-secret>
*/
