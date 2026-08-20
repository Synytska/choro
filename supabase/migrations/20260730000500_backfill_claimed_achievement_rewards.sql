alter table public.child_xp_events
add column if not exists achievement_id text;

alter table public.child_coin_events
add column if not exists achievement_id text;

create unique index if not exists child_xp_events_achievement_reason_unique
  on public.child_xp_events(child_id, achievement_id, reason)
  where achievement_id is not null;

create unique index if not exists child_coin_events_achievement_reason_unique
  on public.child_coin_events(child_id, achievement_id, reason)
  where achievement_id is not null;

with inserted_xp as (
  insert into public.child_xp_events(child_id, achievement_id, amount, reason)
  select
    child_achievements.child_id,
    child_achievements.achievement_id,
    10,
    'achievement_claimed'
  from public.child_achievements
  where child_achievements.claimed_at is not null
  on conflict do nothing
  returning child_id, amount
),
inserted_coins as (
  insert into public.child_coin_events(child_id, achievement_id, amount, reason)
  select
    child_achievements.child_id,
    child_achievements.achievement_id,
    5,
    'achievement_claimed'
  from public.child_achievements
  where child_achievements.claimed_at is not null
  on conflict do nothing
  returning child_id, amount
),
xp_totals as (
  select inserted_xp.child_id, sum(inserted_xp.amount)::integer as amount
  from inserted_xp
  group by inserted_xp.child_id
),
coin_totals as (
  select inserted_coins.child_id, sum(inserted_coins.amount)::integer as amount
  from inserted_coins
  group by inserted_coins.child_id
),
affected_children as (
  select child_id from xp_totals
  union
  select child_id from coin_totals
)
update public.children
set
  xp_total = xp_total + coalesce(xp_totals.amount, 0),
  coin_balance = coin_balance + coalesce(coin_totals.amount, 0),
  level = public.get_child_level(xp_total + coalesce(xp_totals.amount, 0))
from affected_children
left join xp_totals on xp_totals.child_id = affected_children.child_id
left join coin_totals on coin_totals.child_id = affected_children.child_id
where children.id = affected_children.child_id;
