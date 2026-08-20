alter table public.child_xp_events
add column if not exists event_date date not null default current_date;

update public.child_xp_events
set event_date = created_at::date
where event_date is null;

create unique index if not exists child_xp_events_daily_tasks_completed_unique
  on public.child_xp_events(child_id, event_date, reason)
  where reason = 'daily_tasks_completed';

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
  inserted_daily_bonus_xp integer := 0;
  today_tasks_count integer := 0;
  unfinished_today_tasks_count integer := 0;
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
      insert into public.child_xp_events(child_id, task_id, amount, reason, event_date)
      values (task_row.child_id, task_row.id, xp_amount, 'task_completed', coalesce(task_row.due_at::date, current_date))
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

    select
      count(*)::integer,
      count(*) filter (where child_tasks.status <> 'done')::integer
    into today_tasks_count, unfinished_today_tasks_count
    from public.child_tasks
    where child_tasks.child_id = task_row.child_id
      and child_tasks.due_at::date = coalesce(task_row.due_at::date, current_date);

    if today_tasks_count > 0 and unfinished_today_tasks_count = 0 then
      with inserted as (
        insert into public.child_xp_events(child_id, amount, reason, event_date)
        values (task_row.child_id, 10, 'daily_tasks_completed', coalesce(task_row.due_at::date, current_date))
        on conflict do nothing
        returning amount
      )
      select coalesce(sum(amount), 0) into inserted_daily_bonus_xp from inserted;
    end if;

    update public.children
    set
      xp_total = xp_total + coalesce(inserted_xp, 0) + coalesce(inserted_daily_bonus_xp, 0),
      coin_balance = coin_balance + coalesce(inserted_coins, 0),
      level = public.get_child_level(xp_total + coalesce(inserted_xp, 0) + coalesce(inserted_daily_bonus_xp, 0))
    where id = task_row.child_id;
  end if;

  return next task_row;
end;
$$;

revoke all on function public.update_child_task_status(uuid, text, text) from public;
grant execute on function public.update_child_task_status(uuid, text, text) to authenticated;
