alter table public.child_tasks
add column if not exists parent_task_id uuid references public.child_tasks(id) on delete cascade,
add column if not exists repeat_days text[] not null default '{}'::text[];

alter table public.child_tasks
alter column due_at drop not null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'child_tasks'
      and column_name = 'repeat_days'
      and data_type <> 'ARRAY'
  ) then
    alter table public.child_tasks
      alter column repeat_days drop default;

    alter table public.child_tasks
      alter column repeat_days type text[]
      using case
        when repeat_days is null or trim(repeat_days::text) in ('', '{}') then '{}'::text[]
        when left(trim(repeat_days::text), 1) = '{'
          then string_to_array(trim(both '{}' from trim(repeat_days::text)), ',')
        else array[repeat_days::text]
      end;

    alter table public.child_tasks
      alter column repeat_days set default '{}'::text[],
      alter column repeat_days set not null;
  end if;
end;
$$;

create index if not exists child_tasks_child_due_status_idx
  on public.child_tasks(child_id, due_at, status);

create index if not exists child_tasks_child_parent_idx
  on public.child_tasks(child_id, parent_task_id);

create unique index if not exists child_tasks_daily_occurrence_unique
  on public.child_tasks(child_id, parent_task_id, (due_at::date))
  where parent_task_id is not null and due_at is not null;

create or replace function public.materialize_child_daily_tasks(input_child_id uuid)
returns setof public.child_tasks
language plpgsql
security definer
set search_path = public
as $$
declare
  today_date date := current_date;
  today_key text := trim(to_char(current_date, 'Dy'));
begin
  insert into public.child_tasks(
    child_id,
    parent_task_id,
    title,
    description,
    repeat_days,
    due_at,
    status,
    emoji,
    category,
    coin_reward,
    xp_reward
  )
  select
    template_tasks.child_id,
    template_tasks.id,
    template_tasks.title,
    template_tasks.description,
    template_tasks.repeat_days,
    today_date::timestamptz,
    'pending',
    template_tasks.emoji,
    template_tasks.category,
    greatest(coalesce(template_tasks.coin_reward, 1), 1),
    greatest(coalesce(template_tasks.xp_reward, template_tasks.coin_reward * 10, 10), 1)
  from public.child_tasks as template_tasks
  where template_tasks.child_id = input_child_id
    and template_tasks.parent_task_id is null
    and template_tasks.due_at is null
    and (
      coalesce(array_length(template_tasks.repeat_days, 1), 0) = 0
      or today_key = any(template_tasks.repeat_days)
    )
  on conflict do nothing;

  return query
  select *
  from public.child_tasks
  where child_tasks.child_id = input_child_id
    and child_tasks.due_at::date = today_date
  order by child_tasks.created_at desc;
end;
$$;

revoke all on function public.materialize_child_daily_tasks(uuid) from public;
grant execute on function public.materialize_child_daily_tasks(uuid) to authenticated;

drop function if exists public.get_kid_dashboard_data(uuid, text);

create or replace function public.get_kid_dashboard_data(
  input_child_id uuid,
  input_login_code text
)
returns table (
  child jsonb,
  tasks jsonb,
  rewards jsonb,
  achievement_stats jsonb,
  child_achievements jsonb
)
language sql
security definer
set search_path = public
as $$
  with selected_child as (
    select *
    from public.children
    where id = input_child_id
      and login_code = upper(trim(input_login_code))
    limit 1
  ),
  daily_tasks as (
    select materialized_tasks.*
    from selected_child
    cross join lateral public.materialize_child_daily_tasks(selected_child.id) as materialized_tasks
  ),
  synced_achievements as (
    select count(*) as synced_count
    from selected_child
    cross join lateral public.sync_child_achievements(selected_child.id)
  )
  select
    to_jsonb(selected_child.*) as child,
    coalesce(
      (
        select jsonb_agg(to_jsonb(daily_tasks.*) order by daily_tasks.created_at desc)
        from daily_tasks
      ),
      '[]'::jsonb
    ) as tasks,
    coalesce(
      (
        select jsonb_agg(to_jsonb(rewards.*) order by rewards.id)
        from public.rewards
        where rewards.child_id = selected_child.id
      ),
      '[]'::jsonb
    ) as rewards,
    public.get_child_achievement_stats(selected_child.id) as achievement_stats,
    coalesce(
      (
        select jsonb_agg(to_jsonb(child_achievements.*) order by child_achievements.unlocked_at desc)
        from public.child_achievements
        where child_achievements.child_id = selected_child.id
      ),
      '[]'::jsonb
    ) as child_achievements
  from selected_child
  cross join synced_achievements;
$$;

revoke all on function public.get_kid_dashboard_data(uuid, text) from public;
grant execute on function public.get_kid_dashboard_data(uuid, text) to anon, authenticated;
