create extension if not exists pgcrypto;

alter table public.children
  add column if not exists xp_total integer not null default 0,
  add column if not exists level integer not null default 1,
  add column if not exists coin_balance integer not null default 0;

alter table public.child_tasks
  add column if not exists xp_reward integer not null default 10;

alter table public.child_tasks
  add column if not exists proof_photo_url text;

create table if not exists public.child_xp_events (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  task_id uuid references public.child_tasks(id) on delete set null,
  amount integer not null check (amount > 0),
  reason text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists child_xp_events_task_reason_unique
  on public.child_xp_events(child_id, task_id, reason)
  where task_id is not null;

create table if not exists public.child_coin_events (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  task_id uuid references public.child_tasks(id) on delete set null,
  reward_id uuid references public.rewards(id) on delete set null,
  amount integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists child_coin_events_task_reason_unique
  on public.child_coin_events(child_id, task_id, reason)
  where task_id is not null;

alter table public.child_xp_events enable row level security;
alter table public.child_coin_events enable row level security;

drop policy if exists "Parents can read child xp events" on public.child_xp_events;
create policy "Parents can read child xp events"
  on public.child_xp_events
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.children
      join public.families on families.id = children.family_id
      where children.id = child_xp_events.child_id
        and families.parent_id = auth.uid()
    )
  );

drop policy if exists "Parents can read child coin events" on public.child_coin_events;
create policy "Parents can read child coin events"
  on public.child_coin_events
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.children
      join public.families on families.id = children.family_id
      where children.id = child_coin_events.child_id
        and families.parent_id = auth.uid()
    )
  );

create or replace function public.get_child_level(input_xp_total bigint)
returns integer
language plpgsql
immutable
as $$
declare
  safe_xp bigint := greatest(coalesce(input_xp_total, 0), 0);
  current_level integer := 1;
  next_level_xp bigint := 60;
  level_step bigint := 60;
begin
  while safe_xp >= next_level_xp loop
    current_level := current_level + 1;
    level_step := level_step + 10;
    next_level_xp := next_level_xp + level_step;
  end loop;

  return current_level;
end;
$$;

create or replace function public.get_child_level(input_xp_total integer)
returns integer
language sql
immutable
as $$
  select public.get_child_level(input_xp_total::bigint);
$$;

insert into public.child_xp_events(child_id, task_id, amount, reason)
select
  child_tasks.child_id,
  child_tasks.id,
  greatest(coalesce(child_tasks.xp_reward, child_tasks.coin_reward * 10, 10), 1),
  'task_completed'
from public.child_tasks
where child_tasks.status = 'done'
on conflict do nothing;

insert into public.child_coin_events(child_id, task_id, amount, reason)
select
  child_tasks.child_id,
  child_tasks.id,
  greatest(coalesce(child_tasks.coin_reward, 1), 1),
  'task_completed'
from public.child_tasks
where child_tasks.status = 'done'
on conflict do nothing;

update public.children
set
  xp_total = coalesce(
    (
      select sum(child_xp_events.amount)
      from public.child_xp_events
      where child_xp_events.child_id = children.id
    ),
    0
  ),
  coin_balance = coalesce(
    (
      select sum(child_coin_events.amount)
      from public.child_coin_events
      where child_coin_events.child_id = children.id
    ),
    0
  ),
  level = public.get_child_level(
    coalesce(
      (
        select sum(child_xp_events.amount)
        from public.child_xp_events
        where child_xp_events.child_id = children.id
      ),
      0
    )
  );

drop function if exists public.update_child_task_status(uuid, text);
drop function if exists public.update_child_task_status(uuid, text, text);

create or replace function public.update_child_task_status(
  input_task_id uuid,
  input_status text,
  input_proof_photo_url text default null
)
returns setof public.child_tasks
language plpgsql
security definer
set search_path = public
as $$
declare
  task_row public.child_tasks%rowtype;
  normalized_status text := lower(trim(input_status));
  xp_amount integer;
  coin_amount integer;
  inserted_xp integer := 0;
  inserted_coins integer := 0;
begin
  if normalized_status not in ('pending', 'review', 'done') then
    raise exception 'Invalid task status';
  end if;

  select child_tasks.*
    into task_row
  from public.child_tasks
  join public.children on children.id = child_tasks.child_id
  join public.families on families.id = children.family_id
  where child_tasks.id = input_task_id
    and families.parent_id = auth.uid()
  for update of child_tasks;

  if not found then
    raise exception 'Task not found';
  end if;

  update public.child_tasks
  set
    status = normalized_status,
    proof_photo_url = coalesce(input_proof_photo_url, proof_photo_url)
  where id = input_task_id
  returning * into task_row;

  if task_row.status = 'done' then
    xp_amount := greatest(coalesce(task_row.xp_reward, task_row.coin_reward * 10, 10), 1);
    coin_amount := greatest(coalesce(task_row.coin_reward, 1), 1);

    with inserted as (
      insert into public.child_xp_events(child_id, task_id, amount, reason)
      values (task_row.child_id, task_row.id, xp_amount, 'task_completed')
      on conflict do nothing
      returning amount
    )
    select coalesce(sum(amount), 0) into inserted_xp from inserted;

    with inserted as (
      insert into public.child_coin_events(child_id, task_id, amount, reason)
      values (task_row.child_id, task_row.id, coin_amount, 'task_completed')
      on conflict do nothing
      returning amount
    )
    select coalesce(sum(amount), 0) into inserted_coins from inserted;

    update public.children
    set
      xp_total = xp_total + coalesce(inserted_xp, 0),
      coin_balance = coin_balance + coalesce(inserted_coins, 0),
      level = public.get_child_level(xp_total + coalesce(inserted_xp, 0))
    where id = task_row.child_id;
  end if;

  return next task_row;
end;
$$;

revoke all on function public.update_child_task_status(uuid, text, text) from public;
grant execute on function public.update_child_task_status(uuid, text, text) to authenticated;
