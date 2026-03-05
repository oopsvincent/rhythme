create table public.habits (
  habit_id bigserial not null,
  user_id uuid not null,
  name character varying(255) not null,
  description text null,
  frequency character varying(50) not null,
  streak_count integer null default 1,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint habits_pkey primary key (habit_id),
  constraint fk_habits_user foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_habits_user on public.habits using btree (user_id) TABLESPACE pg_default;