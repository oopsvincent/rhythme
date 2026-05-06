alter table if exists public.mood_logs
  drop constraint if exists mood_logs_user_date_unique;

alter table if exists public.mood_logs
  alter column mood_score type numeric(2,1)
  using mood_score::numeric(2,1);

alter table if exists public.mood_logs
  drop constraint if exists mood_logs_mood_score_check;

alter table if exists public.mood_logs
  add constraint mood_logs_mood_score_check
  check (
    mood_score >= 1
    and mood_score <= 5
    and mod((mood_score * 10)::integer, 5) = 0
  );

alter table if exists public.focus_sessions
  alter column task_id drop not null;
