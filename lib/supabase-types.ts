import type { DefaultTaskKey } from "@/lib/defaultTasks";
import type { TaskCategory } from "@/lib/types";
import type { ChildGender } from "@/store/features/onboarding/onboardingSlice";

export type SupabaseFamilyRow = {
  id: string;
};

export type SupabaseChildIdRow = {
  id: string;
};

export type SupabaseChildRow = {
  id: string;
  family_id?: string | null;
  name: string | null;
  age: number;
  gender: ChildGender;
  created_at?: string | null;
  login_code: string | null;
  avatar_id?: string | null;
  avatar_url?: string | null;
  level?: number | string | null;
  xp_total?: number | string | null;
  coin_balance?: number | string | null;
  expo_push_token?: string | null;
  notifications_permission_status?: string | null;
  push_token_updated_at?: string | null;
};

export type SupabaseChildTaskRow = {
  id?: string;
  child_id: string;
  parent_task_id?: string | null;
  title?: string | null;
  created_at?: string | null;
  due_at?: string | null;
  due_time?: string | null;
  completed?: boolean | null;
  is_completed?: boolean | null;
  status?: string | null;
  emoji?: string | null;
  coin_reward?: number | string | null;
  xp_reward?: number | string | null;
  category?: TaskCategory | null;
  description?: string | null;
  proof_photo_url?: string | null;
  repeat_days?: string[] | null;
  default_task_key?: DefaultTaskKey | null;
};

export type SupabaseRewardRow = {
  id: string;
  child_id: string;
  name?: string | null;
  coin_amount?: number | string | null;
  image_uri?: string | null;
  icon?: string | null;
  status?: string | null;
  requested_at?: string | null;
  given_at?: string | null;
};

export type SupabaseAchievementStatsRow = {
  current_task_streak_days?: number | string | null;
  longest_task_streak_days?: number | string | null;
  current_perfect_week_days?: number | string | null;
  longest_perfect_week_days?: number | string | null;
};

export type SupabaseChildAchievementRow = {
  id: string;
  child_id: string;
  achievement_id: string;
  unlocked_at: string;
  shown_at?: string | null;
  claimed_at?: string | null;
  metadata?: Record<string, unknown> | null;
};
