alter table public.children
add column if not exists expo_push_token text,
add column if not exists notifications_permission_status text,
add column if not exists push_token_updated_at timestamptz;

create index if not exists children_expo_push_token_idx
  on public.children(expo_push_token)
  where expo_push_token is not null;

drop function if exists public.register_child_push_token(uuid, text, text, text);

create or replace function public.register_child_push_token(
  input_child_id uuid,
  input_login_code text,
  input_expo_push_token text,
  input_permission_status text
)
returns public.children
language plpgsql
security definer
set search_path = public
as $$
declare
  child_row public.children%rowtype;
begin
  update public.children
  set
    expo_push_token = nullif(trim(input_expo_push_token), ''),
    notifications_permission_status = nullif(trim(input_permission_status), ''),
    push_token_updated_at = now()
  where id = input_child_id
    and login_code = upper(trim(input_login_code))
  returning * into child_row;

  if not found then
    raise exception 'Child not found';
  end if;

  return child_row;
end;
$$;

revoke all on function public.register_child_push_token(uuid, text, text, text) from public;
grant execute on function public.register_child_push_token(uuid, text, text, text) to anon, authenticated;

notify pgrst, 'reload schema';
