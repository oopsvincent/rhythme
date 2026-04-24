-- Normalize account identity and product billing.
-- profiles belongs to Amplecen ID. Product subscriptions belong to product-aware tables.

alter table public.profiles
  add column if not exists email text,
  add column if not exists full_name text,
  add column if not exists avatar_url text,
  add column if not exists account_status text not null default 'active',
  add column if not exists updated_at timestamp with time zone not null default now(),
  add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table public.profiles
  add constraint profiles_account_status_check
  check (account_status in ('active', 'disabled', 'pending_deletion'))
  not valid;

alter table public.profiles validate constraint profiles_account_status_check;

create table if not exists public.account_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on update cascade on delete cascade,
  product_key text not null default 'rhythme',
  provider text not null default 'dodo',
  provider_customer_id text,
  provider_subscription_id text not null,
  provider_product_id text,
  plan_key text,
  status text not null default 'pending',
  entitlement_active boolean not null default false,
  amount numeric,
  currency text,
  billing_interval text,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamp with time zone,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint account_subscriptions_provider_subscription_unique unique (provider, provider_subscription_id),
  constraint account_subscriptions_product_provider_subscription_unique unique (product_key, provider, provider_subscription_id)
);

create index if not exists account_subscriptions_user_product_idx
  on public.account_subscriptions (user_id, product_key);

create index if not exists account_subscriptions_entitlement_idx
  on public.account_subscriptions (user_id, product_key, entitlement_active)
  where entitlement_active = true;

create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on update cascade on delete cascade,
  product_key text not null default 'rhythme',
  provider text not null default 'dodo',
  provider_payment_id text,
  provider_subscription_id text,
  plan_key text,
  amount numeric,
  currency text,
  status text not null,
  paid_at timestamp with time zone,
  receipt_url text,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  constraint billing_events_provider_payment_unique unique (provider, provider_payment_id)
);

create index if not exists billing_events_user_product_paid_at_idx
  on public.billing_events (user_id, product_key, paid_at desc nulls last);

-- Migrate the old profile-level subscription state before dropping legacy columns.
insert into public.account_subscriptions (
  user_id,
  product_key,
  provider,
  provider_subscription_id,
  plan_key,
  status,
  entitlement_active,
  amount,
  billing_interval,
  current_period_start,
  current_period_end,
  raw_payload
)
select
  p.id,
  'rhythme',
  'dodo',
  p.subscription_id,
  p.subscription_plan,
  coalesce(p.subscription_status, 'pending'),
  coalesce(p.is_premium, false),
  p.subscription_amount_paid,
  p.subscription_plan,
  p.subscription_start_date,
  p.subscription_end_date,
  jsonb_build_object(
    'migrated_from', 'profiles',
    'legacy_subscription_id', p.subscription_id,
    'legacy_razorpay_subscription_id', p.razorpay_subscription_id
  )
from public.profiles p
where p.subscription_id is not null
on conflict (provider, provider_subscription_id) do update set
  plan_key = excluded.plan_key,
  status = excluded.status,
  entitlement_active = excluded.entitlement_active,
  amount = excluded.amount,
  billing_interval = excluded.billing_interval,
  current_period_start = excluded.current_period_start,
  current_period_end = excluded.current_period_end,
  updated_at = now();

insert into public.billing_events (
  id,
  user_id,
  product_key,
  provider,
  provider_payment_id,
  plan_key,
  amount,
  status,
  paid_at,
  raw_payload
)
select
  coalesce((item->>'id')::uuid, gen_random_uuid()),
  p.id,
  'rhythme',
  'dodo',
  item->>'payment_id',
  item->>'plan_type',
  nullif(item->>'amount', '')::numeric,
  coalesce(item->>'status', 'paid'),
  nullif(item->>'date', '')::timestamp with time zone,
  item
from public.profiles p
cross join lateral jsonb_array_elements(coalesce(p.billing_history, '[]'::jsonb)) item
on conflict (provider, provider_payment_id) do update set
  status = excluded.status,
  paid_at = excluded.paid_at,
  raw_payload = excluded.raw_payload;

alter table public.account_subscriptions enable row level security;
alter table public.billing_events enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'account_subscriptions'
      and policyname = 'Users can view their own account subscriptions'
  ) then
    create policy "Users can view their own account subscriptions"
      on public.account_subscriptions for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'billing_events'
      and policyname = 'Users can view their own billing events'
  ) then
    create policy "Users can view their own billing events"
      on public.billing_events for select
      using (auth.uid() = user_id);
  end if;
end $$;

alter table public.profiles
  drop column if exists razorpay_subscription_id,
  drop column if exists subscription_status,
  drop column if exists subscription_plan,
  drop column if exists subscription_amount_paid,
  drop column if exists subscription_start_date,
  drop column if exists subscription_end_date,
  drop column if exists billing_history,
  drop column if exists subscription_id,
  drop column if exists is_premium;
