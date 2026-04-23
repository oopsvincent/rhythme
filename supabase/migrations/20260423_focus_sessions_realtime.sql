alter table public.focus_sessions enable row level security;
alter table public.focus_sessions replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'focus_sessions'
      and policyname = 'focus_sessions_select_own'
  ) then
    create policy focus_sessions_select_own
      on public.focus_sessions
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'focus_sessions'
      and policyname = 'focus_sessions_insert_own'
  ) then
    create policy focus_sessions_insert_own
      on public.focus_sessions
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'focus_sessions'
      and policyname = 'focus_sessions_update_own'
  ) then
    create policy focus_sessions_update_own
      on public.focus_sessions
      for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'focus_sessions'
      and policyname = 'focus_sessions_delete_own'
  ) then
    create policy focus_sessions_delete_own
      on public.focus_sessions
      for delete
      using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.focus_sessions;
exception
  when duplicate_object then null;
end $$;
