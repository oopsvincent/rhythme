-- Enforce the Rhythme free-tier habit limit at the database boundary.
-- App/UI checks are helpful, but this prevents direct inserts from bypassing the gate.

create or replace function public.enforce_rhythme_habit_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  active_habit_count integer;
  has_premium boolean;
begin
  if coalesce(new.is_active, true) is not true then
    return new;
  end if;

  select exists (
    select 1
    from public.account_subscriptions s
    where s.user_id = new.user_id
      and s.product_key = 'rhythme'
      and s.entitlement_active = true
      and s.status in ('active', 'on_hold')
  )
  into has_premium;

  if has_premium then
    return new;
  end if;

  select count(*)
  from public.habits h
  where h.user_id = new.user_id
    and h.is_active = true
    and (tg_op = 'INSERT' or h.habit_id <> new.habit_id)
  into active_habit_count;

  if active_habit_count >= 3 then
    raise exception 'Free accounts can track up to 3 active habits. Upgrade to Premium for unlimited habits.'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_rhythme_habit_limit_trigger on public.habits;

create trigger enforce_rhythme_habit_limit_trigger
before insert or update of is_active, user_id
on public.habits
for each row
execute function public.enforce_rhythme_habit_limit();
