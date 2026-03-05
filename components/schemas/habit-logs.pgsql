create table public.habit_logs (
  habit_log_id bigserial not null,
  habit_id bigint not null,
  user_id uuid not null,
  completed_at timestamp with time zone null default now(),
  note text null,
  constraint habit_logs_pkey primary key (habit_log_id),
  constraint fk_habit_logs_user foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint habit_logs_habit_id_fkey foreign KEY (habit_id) references habits (habit_id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_habit_logs_habit on public.habit_logs using btree (habit_id) TABLESPACE pg_default;

create index IF not exists idx_habit_logs_user on public.habit_logs using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_habit_logs_date on public.habit_logs using btree (completed_at) TABLESPACE pg_default;