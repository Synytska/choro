alter table public.child_tasks
add column if not exists category text;

alter table public.child_tasks
drop constraint if exists child_tasks_category_check;

alter table public.child_tasks
add constraint child_tasks_category_check
check (
  category is null
  or category in ('cleaning', 'helping', 'pet', 'cooking', 'organization')
);

create index if not exists child_tasks_child_id_category_idx
  on public.child_tasks(child_id, category);

update public.child_tasks
set category = case lower(trim(title))
  when 'arrange the toys' then 'organization'
  when 'make the bed' then 'organization'
  when 'brush your teeth' then 'helping'
  when 'serve a table' then 'cooking'
  when 'wash the dishes' then 'cleaning'
  when 'take out the trash' then 'cleaning'
  when 'clean the room' then 'cleaning'
  when 'water the flowers' then 'helping'
  else category
end
where category is null;
