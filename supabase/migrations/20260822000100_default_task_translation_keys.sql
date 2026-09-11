alter table public.child_tasks
add column if not exists default_task_key text;

alter table public.child_tasks
drop constraint if exists child_tasks_default_task_key_check;

alter table public.child_tasks
add constraint child_tasks_default_task_key_check
check (
  default_task_key is null
  or default_task_key in (
    'arrange',
    'makebed',
    'brushteeth',
    'serve',
    'washdishes',
    'taketrash',
    'cleanroom',
    'waterflowers'
  )
);

update public.child_tasks
set default_task_key = case lower(trim(title))
  when 'arrange the toys' then 'arrange'
  when 'прибери іграшки' then 'arrange'
  when 'make the bed' then 'makebed'
  when 'застели ліжко' then 'makebed'
  when 'brush your teeth' then 'brushteeth'
  when 'почисти зуби' then 'brushteeth'
  when 'serve a table' then 'serve'
  when 'підготуй обідній стіл' then 'serve'
  when 'wash the dishes' then 'washdishes'
  when 'помий посуд' then 'washdishes'
  when 'take out the trash' then 'taketrash'
  when 'винеси сміття' then 'taketrash'
  when 'clean the room' then 'cleanroom'
  when 'прибери у своїй кімнаті' then 'cleanroom'
  when 'water the flowers' then 'waterflowers'
  when 'полий квіти' then 'waterflowers'
  else default_task_key
end
where default_task_key is null;

create index if not exists child_tasks_child_default_task_key_idx
  on public.child_tasks(child_id, default_task_key);

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
    default_task_key,
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
    template_tasks.default_task_key,
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
