alter table public.children
add column if not exists language text not null default 'en';

update public.children
set language = 'en'
where language is null;

drop function if exists public.get_child_by_login_code(text);

create or replace function public.get_child_by_login_code(input_login_code text)
returns table (
  id uuid,
  name text,
  login_code text,
  avatar_id text,
  avatar_url text,
  language text
)
language sql
security definer
set search_path = public
as $$
  select
    children.id,
    children.name,
    children.login_code,
    children.avatar_id,
    children.avatar_url,
    children.language
  from public.children
  where children.login_code = upper(trim(input_login_code))
  limit 1;
$$;

revoke all on function public.get_child_by_login_code(text) from public;
grant execute on function public.get_child_by_login_code(text) to anon, authenticated;
