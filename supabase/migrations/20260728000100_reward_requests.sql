alter table public.rewards
add column if not exists status text not null default 'available',
add column if not exists requested_at timestamptz,
add column if not exists given_at timestamptz;

alter table public.rewards
drop constraint if exists rewards_status_check;

alter table public.rewards
add constraint rewards_status_check
check (status in ('available', 'requested', 'given'));

create index if not exists rewards_child_status_idx
on public.rewards(child_id, status);

update public.rewards
set status = 'available'
where status is null;

drop function if exists public.request_child_reward(uuid, text, uuid);

create or replace function public.request_child_reward(
  input_child_id uuid,
  input_login_code text,
  input_reward_id uuid
)
returns public.rewards
language plpgsql
security definer
set search_path = public
as $$
declare
  child_row public.children%rowtype;
  reward_row public.rewards%rowtype;
  reward_cost integer := 0;
begin
  select *
  into child_row
  from public.children
  where id = input_child_id
    and login_code = upper(trim(input_login_code))
  for update;

  if not found then
    raise exception 'Child not found';
  end if;

  select *
  into reward_row
  from public.rewards
  where id = input_reward_id
    and child_id = input_child_id
  for update;

  if not found then
    raise exception 'Reward not found';
  end if;

  if reward_row.status <> 'available' then
    raise exception 'Reward is not available';
  end if;

  reward_cost := coalesce(reward_row.coin_amount, 0);

  if coalesce(child_row.coin_balance, 0) < reward_cost then
    raise exception 'Not enough coins';
  end if;

  update public.children
  set coin_balance = coin_balance - reward_cost
  where id = child_row.id;

  update public.rewards
  set
    status = 'requested',
    requested_at = now(),
    given_at = null
  where id = reward_row.id
  returning * into reward_row;

  return reward_row;
end;
$$;

revoke all on function public.request_child_reward(uuid, text, uuid) from public;
grant execute on function public.request_child_reward(uuid, text, uuid) to anon, authenticated;
