create or replace function public.get_child_achievement_stats(input_child_id uuid)
returns jsonb
language sql
security definer
set search_path = public
as $$
  with completion_dates as (
    select distinct child_xp_events.created_at::date as completed_date
    from public.child_xp_events
    where child_xp_events.child_id = input_child_id
      and child_xp_events.reason = 'task_completed'
  ),
  streak_groups as (
    select
      completion_dates.completed_date,
      completion_dates.completed_date
        - (row_number() over (order by completion_dates.completed_date))::integer as streak_group
    from completion_dates
  ),
  longest_streak as (
    select coalesce(max(streak_length), 0)::integer as days
    from (
      select count(*)::integer as streak_length
      from streak_groups
      group by streak_group
    ) grouped_streaks
  ),
  current_streak as (
    select coalesce(count(*), 0)::integer as days
    from streak_groups
    where streak_groups.streak_group = (
      select active_group.streak_group
      from streak_groups as active_group
      where active_group.completed_date >= current_date - interval '1 day'
      order by active_group.completed_date desc
      limit 1
    )
  ),
  planned_task_days as (
    select
      coalesce(child_tasks.due_at::date, child_tasks.created_at::date) as task_date,
      count(*)::integer as total_tasks,
      count(*) filter (where child_tasks.status = 'done')::integer as done_tasks
    from public.child_tasks
    where child_tasks.child_id = input_child_id
    group by coalesce(child_tasks.due_at::date, child_tasks.created_at::date)
  ),
  perfect_dates as (
    select planned_task_days.task_date
    from planned_task_days
    where planned_task_days.total_tasks > 0
      and planned_task_days.done_tasks = planned_task_days.total_tasks
  ),
  perfect_groups as (
    select
      perfect_dates.task_date,
      perfect_dates.task_date
        - (row_number() over (order by perfect_dates.task_date))::integer as perfect_group
    from perfect_dates
  ),
  longest_perfect_week as (
    select coalesce(max(perfect_length), 0)::integer as days
    from (
      select count(*)::integer as perfect_length
      from perfect_groups
      group by perfect_group
    ) grouped_perfect_days
  ),
  current_perfect_week as (
    select coalesce(count(*), 0)::integer as days
    from perfect_groups
    where perfect_groups.perfect_group = (
      select active_group.perfect_group
      from perfect_groups as active_group
      where active_group.task_date >= current_date - interval '1 day'
      order by active_group.task_date desc
      limit 1
    )
  )
  select jsonb_build_object(
    'current_task_streak_days', (select days from current_streak),
    'longest_task_streak_days', (select days from longest_streak),
    'current_perfect_week_days', (select days from current_perfect_week),
    'longest_perfect_week_days', (select days from longest_perfect_week)
  );
$$;

revoke all on function public.get_child_achievement_stats(uuid) from public;

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
