create table public.weekly_plan (
  weekly_plan_id bigserial not null,
  user_id uuid not null,
  week_start_date date not null,
  week_end_date date not null,
  content jsonb not null default '{}'::jsonb,
  is_completed boolean null default false,
  completion_notes text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint weekly_plan_pkey primary key (weekly_plan_id),
  constraint weekly_plan_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_weekly_plan_user on public.weekly_plan using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_weekly_plan_dates on public.weekly_plan using btree (week_start_date, week_end_date) TABLESPACE pg_default;