create extension if not exists pgcrypto;

create table if not exists public.child_achievements (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  shown_at timestamptz,
  claimed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (child_id, achievement_id)
);

create index if not exists child_achievements_child_id_idx
  on public.child_achievements(child_id);

alter table public.child_achievements enable row level security;

drop policy if exists "Parents can read child achievements" on public.child_achievements;
create policy "Parents can read child achievements"
  on public.child_achievements
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.children
      join public.families on families.id = children.family_id
      where children.id = child_achievements.child_id
        and families.parent_id = auth.uid()
    )
  );

drop policy if exists "Parents can update child achievements" on public.child_achievements;
create policy "Parents can update child achievements"
  on public.child_achievements
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.children
      join public.families on families.id = children.family_id
      where children.id = child_achievements.child_id
        and families.parent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.children
      join public.families on families.id = children.family_id
      where children.id = child_achievements.child_id
        and families.parent_id = auth.uid()
    )
  );

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists child_achievements_set_updated_at on public.child_achievements;
create trigger child_achievements_set_updated_at
before update on public.child_achievements
for each row
execute function public.set_updated_at();

create or replace function public.sync_child_achievements(input_child_id uuid)
returns setof public.child_achievements
language plpgsql
security definer
set search_path = public
as $$
declare
  child_row public.children%rowtype;
  stats jsonb;
  completed_tasks integer;
  unique_completed_tasks integer;
  cleaning_tasks integer;
  helping_tasks integer;
  pet_tasks integer;
  cooking_tasks integer;
  organization_tasks integer;
begin
  select *
    into child_row
  from public.children
  where id = input_child_id;

  if not found then
    raise exception 'Child not found';
  end if;

  stats := public.get_child_achievement_stats(input_child_id);

  select
    count(*) filter (where child_tasks.status = 'done')::integer,
    count(distinct lower(trim(child_tasks.title))) filter (where child_tasks.status = 'done')::integer,
    count(*) filter (where child_tasks.status = 'done' and child_tasks.category = 'cleaning')::integer,
    count(*) filter (where child_tasks.status = 'done' and child_tasks.category = 'helping')::integer,
    count(*) filter (where child_tasks.status = 'done' and child_tasks.category = 'pet')::integer,
    count(*) filter (where child_tasks.status = 'done' and child_tasks.category = 'cooking')::integer,
    count(*) filter (where child_tasks.status = 'done' and child_tasks.category = 'organization')::integer
    into completed_tasks, unique_completed_tasks, cleaning_tasks, helping_tasks, pet_tasks, cooking_tasks, organization_tasks
  from public.child_tasks
  where child_tasks.child_id = input_child_id;

  insert into public.child_achievements(child_id, achievement_id, metadata)
  select input_child_id, achievement_id, metadata
  from (
    values
      ('streak', ((stats ->> 'longest_task_streak_days')::integer >= 7), jsonb_build_object('value', stats ->> 'longest_task_streak_days', 'target', 7)),
      ('streakpro', ((stats ->> 'longest_task_streak_days')::integer >= 14), jsonb_build_object('value', stats ->> 'longest_task_streak_days', 'target', 14)),
      ('streakepic', ((stats ->> 'longest_task_streak_days')::integer >= 30), jsonb_build_object('value', stats ->> 'longest_task_streak_days', 'target', 30)),
      ('collector', (coalesce(child_row.xp_total, 0) >= 100), jsonb_build_object('value', coalesce(child_row.xp_total, 0), 'target', 100)),
      ('collectorpro', (coalesce(child_row.xp_total, 0) >= 500), jsonb_build_object('value', coalesce(child_row.xp_total, 0), 'target', 500)),
      ('collectorepic', (coalesce(child_row.xp_total, 0) >= 1000), jsonb_build_object('value', coalesce(child_row.xp_total, 0), 'target', 1000)),
      ('cleaning', (coalesce(cleaning_tasks, 0) >= 25), jsonb_build_object('value', coalesce(cleaning_tasks, 0), 'target', 25, 'category', 'cleaning')),
      ('explorer', (coalesce(unique_completed_tasks, 0) >= 10), jsonb_build_object('value', coalesce(unique_completed_tasks, 0), 'target', 10)),
      ('legend', (coalesce(completed_tasks, 0) >= 100), jsonb_build_object('value', coalesce(completed_tasks, 0), 'target', 100)),
      ('helping', (coalesce(helping_tasks, 0) >= 10), jsonb_build_object('value', coalesce(helping_tasks, 0), 'target', 10, 'category', 'helping')),
      ('levelup', (coalesce(child_row.level, 1) >= 5), jsonb_build_object('value', coalesce(child_row.level, 1), 'target', 5)),
      ('perfectweek', ((stats ->> 'longest_perfect_week_days')::integer >= 7), jsonb_build_object('value', stats ->> 'longest_perfect_week_days', 'target', 7)),
      ('pethero', (coalesce(pet_tasks, 0) >= 20), jsonb_build_object('value', coalesce(pet_tasks, 0), 'target', 20, 'category', 'pet')),
      ('chef', (coalesce(cooking_tasks, 0) >= 10), jsonb_build_object('value', coalesce(cooking_tasks, 0), 'target', 10, 'category', 'cooking')),
      ('organization', (coalesce(organization_tasks, 0) >= 14), jsonb_build_object('value', coalesce(organization_tasks, 0), 'target', 14, 'category', 'organization'))
  ) as unlocked_achievements(achievement_id, is_unlocked, metadata)
  where is_unlocked
  on conflict (child_id, achievement_id) do update
    set metadata = excluded.metadata
    where child_achievements.metadata is distinct from excluded.metadata;

  return query
  select *
  from public.child_achievements
  where child_achievements.child_id = input_child_id
  order by child_achievements.unlocked_at desc;
end;
$$;

revoke all on function public.sync_child_achievements(uuid) from public;

create or replace function public.mark_child_achievement_shown(
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
begin
  if not exists (
    select 1
    from public.children
    where children.id = input_child_id
      and children.login_code = upper(trim(input_login_code))
  ) then
    raise exception 'Child not found';
  end if;

  update public.child_achievements
  set shown_at = coalesce(shown_at, now())
  where child_id = input_child_id
    and achievement_id = input_achievement_id
  returning * into achievement_row;

  if not found then
    raise exception 'Achievement not found';
  end if;

  return achievement_row;
end;
$$;

revoke all on function public.mark_child_achievement_shown(uuid, text, text) from public;
grant execute on function public.mark_child_achievement_shown(uuid, text, text) to anon, authenticated;

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
  synced_achievements as (
    select count(*) as synced_count
    from selected_child
    cross join lateral public.sync_child_achievements(selected_child.id)
  )
  select
    to_jsonb(selected_child.*) as child,
    coalesce(
      (
        select jsonb_agg(to_jsonb(child_tasks.*) order by child_tasks.created_at desc)
        from public.child_tasks
        where child_tasks.child_id = selected_child.id
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
