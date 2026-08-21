alter table public.profiles
add column if not exists parent_notifications_enabled boolean not null default true,
add column if not exists child_notifications_enabled boolean not null default true;
