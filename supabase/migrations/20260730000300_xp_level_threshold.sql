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

update public.children
set level = public.get_child_level(xp_total);
