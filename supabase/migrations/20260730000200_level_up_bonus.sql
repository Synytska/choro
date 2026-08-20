alter table public.child_coin_events
add column if not exists level integer;

create unique index if not exists child_coin_events_level_reason_unique
  on public.child_coin_events(child_id, level, reason)
  where level is not null;

drop function if exists public.claim_child_level_up_bonus(uuid, text, integer);

create or replace function public.claim_child_level_up_bonus(
  input_child_id uuid,
  input_login_code text,
  input_level integer
)
returns public.children
language plpgsql
security definer
set search_path = public
as $$
declare
  child_row public.children%rowtype;
  coin_amount integer := 5;
  inserted_coins integer := 0;
begin
  if input_level < 2 then
    raise exception 'Invalid level';
  end if;

  select *
    into child_row
  from public.children
  where children.id = input_child_id
    and children.login_code = upper(trim(input_login_code))
  for update;

  if not found then
    raise exception 'Child not found';
  end if;

  if greatest(coalesce(child_row.level, 1), public.get_child_level(child_row.xp_total)) < input_level then
    raise exception 'Level is not reached yet';
  end if;

  with inserted as (
    insert into public.child_coin_events(child_id, level, amount, reason)
    values (input_child_id, input_level, coin_amount, 'level_up_bonus')
    on conflict do nothing
    returning amount
  )
  select coalesce(sum(amount), 0) into inserted_coins from inserted;

  update public.children
  set coin_balance = coin_balance + coalesce(inserted_coins, 0)
  where id = input_child_id
  returning * into child_row;

  return child_row;
end;
$$;

revoke all on function public.claim_child_level_up_bonus(uuid, text, integer) from public;
grant execute on function public.claim_child_level_up_bonus(uuid, text, integer) to anon, authenticated;
