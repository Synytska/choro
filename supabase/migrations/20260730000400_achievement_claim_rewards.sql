alter table public.child_xp_events
add column if not exists achievement_id text;

alter table public.child_coin_events
add column if not exists achievement_id text;

create unique index if not exists child_xp_events_achievement_reason_unique
  on public.child_xp_events(child_id, achievement_id, reason)
  where achievement_id is not null;

create unique index if not exists child_coin_events_achievement_reason_unique
  on public.child_coin_events(child_id, achievement_id, reason)
  where achievement_id is not null;

drop function if exists public.claim_child_achievement(uuid, text, text);

create or replace function public.claim_child_achievement(
  input_child_id uuid,
  input_login_code text,
  input_achievement_id text
)
returns public.child_achievements
language plpgsql
security definer
set search_path = public
as $$
declare
  achievement_row public.child_achievements%rowtype;
  xp_amount integer := 10;
  coin_amount integer := 5;
  inserted_xp integer := 0;
  inserted_coins integer := 0;
begin
  if not exists (
    select 1
    from public.children
    where children.id = input_child_id
      and children.login_code = upper(trim(input_login_code))
  ) then
    raise exception 'Child not found';
  end if;

  perform public.sync_child_achievements(input_child_id);

  select *
    into achievement_row
  from public.child_achievements
  where child_id = input_child_id
    and achievement_id = input_achievement_id
  for update;

  if not found then
    raise exception 'Achievement not found';
  end if;

  if achievement_row.claimed_at is null then
    update public.child_achievements
    set
      claimed_at = now(),
      shown_at = coalesce(shown_at, now())
    where id = achievement_row.id
    returning * into achievement_row;
  end if;

  with inserted as (
    insert into public.child_xp_events(child_id, achievement_id, amount, reason)
    values (input_child_id, input_achievement_id, xp_amount, 'achievement_claimed')
    on conflict do nothing
    returning amount
  )
  select coalesce(sum(amount), 0) into inserted_xp from inserted;

  with inserted as (
    insert into public.child_coin_events(child_id, achievement_id, amount, reason)
    values (input_child_id, input_achievement_id, coin_amount, 'achievement_claimed')
    on conflict do nothing
    returning amount
  )
  select coalesce(sum(amount), 0) into inserted_coins from inserted;

  update public.children
  set
    xp_total = xp_total + coalesce(inserted_xp, 0),
    coin_balance = coin_balance + coalesce(inserted_coins, 0),
    level = public.get_child_level(xp_total + coalesce(inserted_xp, 0))
  where id = input_child_id;

  return achievement_row;
end;
$$;

revoke all on function public.claim_child_achievement(uuid, text, text) from public;
grant execute on function public.claim_child_achievement(uuid, text, text) to anon, authenticated;
