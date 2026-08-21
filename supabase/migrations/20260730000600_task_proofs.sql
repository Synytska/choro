alter table public.child_tasks
add column if not exists proof_photo_url text;

insert into storage.buckets (id, name, public)
values ('task-proofs', 'task-proofs', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Task proofs are publicly readable" on storage.objects;
create policy "Task proofs are publicly readable"
on storage.objects
for select
using (bucket_id = 'task-proofs');

drop policy if exists "Users can upload task proofs to own folder" on storage.objects;
create policy "Users can upload task proofs to own folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'task-proofs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Kids can upload task proofs to child folder" on storage.objects;
create policy "Kids can upload task proofs to child folder"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'task-proofs'
  and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
);

drop policy if exists "Users can update own task proofs" on storage.objects;
create policy "Users can update own task proofs"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'task-proofs'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'task-proofs'
  and (storage.foldername(name))[1] = auth.uid()::text
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

drop function if exists public.submit_child_task_for_review(uuid, uuid, text, text);

create or replace function public.submit_child_task_for_review(
  input_task_id uuid,
  input_child_id uuid,
  input_login_code text,
  input_proof_photo_url text
)
returns setof public.child_tasks
language plpgsql
security definer
set search_path = public
as $$
declare
  task_row public.child_tasks%rowtype;
begin
  if input_proof_photo_url is null or length(trim(input_proof_photo_url)) = 0 then
    raise exception 'Proof photo is required';
  end if;

  select child_tasks.*
    into task_row
  from public.child_tasks
  join public.children on children.id = child_tasks.child_id
  where child_tasks.id = input_task_id
    and child_tasks.child_id = input_child_id
    and upper(children.login_code) = upper(trim(input_login_code))
  for update of child_tasks;

  if not found then
    raise exception 'Task not found';
  end if;

  update public.child_tasks
  set
    status = 'review',
    proof_photo_url = input_proof_photo_url
  where id = input_task_id
  returning * into task_row;

  return next task_row;
end;
$$;

revoke all on function public.submit_child_task_for_review(uuid, uuid, text, text) from public;
grant execute on function public.submit_child_task_for_review(uuid, uuid, text, text) to anon, authenticated;
