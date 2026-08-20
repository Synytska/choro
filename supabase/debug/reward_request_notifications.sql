-- Debug helper for reward request push notifications.
-- Replace values before running in Supabase SQL editor.

select
  rewards.id as reward_id,
  rewards.status as reward_status,
  rewards.requested_at,
  children.id as child_id,
  children.name as child_name,
  families.parent_id,
  profiles.expo_push_token is not null as parent_has_push_token,
  profiles.notifications_permission_status,
  profiles.parent_notifications_enabled
from public.rewards
join public.children on children.id = rewards.child_id
join public.families on families.id = children.family_id
join public.profiles on profiles.id = families.parent_id
where rewards.id = 'PASTE_REWARD_ID_HERE';
