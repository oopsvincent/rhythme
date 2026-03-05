create table public.user_preferences (
  user_preferences_id bigserial not null,
  user_id uuid not null,
  notifications_enabled boolean null default true,
  daily_reminder_time time without time zone null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  onboarding_data jsonb null default '{}'::jsonb,
  "isPremium" boolean null default false,
  encryption_token text null,
  last_reminded_at timestamp with time zone null,
  constraint user_preferences_pkey primary key (user_preferences_id),
  constraint user_preferences_user_id_key unique (user_id),
  constraint fk_user_preferences_user foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_user_preferences_user on public.user_preferences using btree (user_id) TABLESPACE pg_default;