create table public.weekly_review (
  weekly_review_id bigserial not null,
  user_id uuid not null,
  week_start_date date not null,
  week_end_date date not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint weekly_review_pkey primary key (weekly_review_id),
  constraint weekly_review_user_week_key unique (user_id, week_start_date),
  constraint weekly_review_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_weekly_review_user on public.weekly_review using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_weekly_review_dates on public.weekly_review using btree (week_start_date, week_end_date) TABLESPACE pg_default;