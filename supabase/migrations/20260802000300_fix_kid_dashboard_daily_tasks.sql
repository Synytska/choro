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
