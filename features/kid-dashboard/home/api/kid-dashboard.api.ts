import { taskStatus } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import {
  AchievementStats,
  ChildAchievement,
  ChildCard,
  ChildDetailsData,
  RewardItem,
  TaskItem,
  TaskStatus,
} from "@/lib/types";
import { getRewardImageUri } from "@/lib/utils/utils";
import { ChildGender } from "@/store/features/onboarding/onboardingSlice";

const KID_DASHBOARD_RPC = "get_kid_dashboard_data";

type KidDashboardPayload = {
  childId: string;
  loginCode: string;
};

type ChildRow = {
  id: string;
  name: string | null;
  age: number;
  gender: ChildGender;
  login_code: string | null;
  avatar_id?: string | null;
  avatar_url?: string | null;
  level?: number;
  xp_total?: number | string | null;
  coin_balance?: number | string | null;
};

type RewardRow = {
  id: string;
  child_id: string;
  name?: string | null;
  coin_amount?: number | string | null;
  image_uri?: string | null;
  icon?: string | null;
};

type ChildTaskRow = {
  id?: string;
  child_id: string;
  title?: string | null;
  created_at?: string | null;
  due_at?: string | null;
  due_time?: string | null;
  status?: string | null;
  emoji?: string | null;
  coin_reward?: number | string | null;
  xp_reward?: number | string | null;
  description?: string | null;
  proof_photo_url?: string | null;
};

type KidDashboardRpcRow = {
  child: ChildRow | null;
  tasks: ChildTaskRow[] | null;
  rewards: RewardRow[] | null;
  achievement_stats?: AchievementStatsRow | null;
  child_achievements?: ChildAchievementRow[] | null;
};

type AchievementStatsRow = {
  longest_task_streak_days?: number | string | null;
  longest_perfect_week_days?: number | string | null;
};

type ChildAchievementRow = {
  id: string;
  child_id: string;
  achievement_id: string;
  unlocked_at: string;
  shown_at?: string | null;
  claimed_at?: string | null;
  metadata?: Record<string, unknown> | null;
};

const formatTaskTime = (task: ChildTaskRow) => {
  const rawTime = task.due_time ?? task.due_at ?? task.created_at;

  if (!rawTime) {
    return "";
  }

  const date = new Date(rawTime);

  if (Number.isNaN(date.getTime())) {
    return rawTime;
  }

  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getTaskStatus = (task: ChildTaskRow): TaskStatus => {
  const status = task.status?.toLowerCase();

  if (status === taskStatus.pending || status === taskStatus.review || status === taskStatus.done) {
    return status as TaskStatus;
  }

  return taskStatus.pending;
};

const getLevelStats = (xpTotal: number) => {
  const safeXpTotal = Math.max(0, Math.floor(xpTotal));
  const level = Math.floor(safeXpTotal / 60) + 1;
  const xpCurrentLevel = safeXpTotal % 60;
  const xpNextLevel = 60;

  return {
    level,
    xpTotal: safeXpTotal,
    xpCurrentLevel,
    xpNextLevel,
    levelProgress: xpCurrentLevel / xpNextLevel,
  };
};

const mapChild = (child: ChildRow, tasks: ChildTaskRow[], rewards: RewardRow[]): ChildCard => {
  const doneTasks = tasks.filter((task) => getTaskStatus(task) === taskStatus.done).length;
  const rewardCoins = rewards.reduce((total, reward) => {
    const coinAmount = Number(reward.coin_amount ?? 0);
    return total + (Number.isFinite(coinAmount) ? coinAmount : 0);
  }, 0);
  const coinBalance = Number(child.coin_balance ?? rewardCoins);
  const levelStats = getLevelStats(Number(child.xp_total ?? 0));

  return {
    id: child.id,
    name: child.name ?? "Kid",
    coins: Number.isFinite(coinBalance) ? coinBalance : rewardCoins,
    color: "#5146E8",
    progress: tasks.length ? doneTasks / tasks.length : 0,
    age: child.age,
    gender: child.gender,
    loginCode: child.login_code ?? "",
    avatarId: child.avatar_id ?? null,
    avatarUrl: child.avatar_url ?? null,
    level: child.level ?? levelStats.level,
    xpTotal: levelStats.xpTotal,
    xpCurrentLevel: levelStats.xpCurrentLevel,
    xpNextLevel: levelStats.xpNextLevel,
    levelProgress: levelStats.levelProgress,
    coinBalance: Number.isFinite(coinBalance) ? coinBalance : rewardCoins,
  };
};

const mapTaskItems = (taskRows: ChildTaskRow[]): TaskItem[] =>
  taskRows.map((task) => ({
    childId: task.child_id,
    title: task.title ?? "Task",
    time: formatTaskTime(task),
    status: getTaskStatus(task),
    id: task.id,
    emoji: task.emoji ?? undefined,
    coinReward: Number(task.coin_reward ?? 1),
    xpReward: Number(task.xp_reward ?? 10),
    //TODO: localize
    description: task.description ?? "No info provided",
    proofPhotoUrl: task.proof_photo_url ?? null,
  }));

const mapRewardItems = (rewardRows: RewardRow[]): RewardItem[] =>
  rewardRows.map((reward) => {
    const coinAmount = Number(reward.coin_amount ?? 0);

    return {
      id: reward.id,
      childId: reward.child_id,
      name: reward.name ?? "Reward",
      coinAmount: Number.isFinite(coinAmount) ? coinAmount : 0,
      icon: reward.icon ?? null,
      imageUri: getRewardImageUri(reward.image_uri, reward.icon),
    };
  });

const toSafeNumber = (value: number | string | null | undefined) => {
  const parsedValue = Number(value ?? 0);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const mapAchievementStats = (stats?: AchievementStatsRow | null): AchievementStats => ({
  longestTaskStreakDays: toSafeNumber(stats?.longest_task_streak_days),
  longestPerfectWeekDays: toSafeNumber(stats?.longest_perfect_week_days),
});

const mapChildAchievements = (achievements?: ChildAchievementRow[] | null): ChildAchievement[] =>
  (achievements ?? []).map((achievement) => ({
    id: achievement.id,
    childId: achievement.child_id,
    achievementId: achievement.achievement_id,
    unlockedAt: achievement.unlocked_at,
    shownAt: achievement.shown_at ?? null,
    claimedAt: achievement.claimed_at ?? null,
    metadata: achievement.metadata ?? {},
  }));

export const kidDashboardApi = {
  getDashboardData: async (payload: KidDashboardPayload): Promise<ChildDetailsData | null> => {
    const { data, error } = await supabase
      .rpc(KID_DASHBOARD_RPC, {
        input_child_id: payload.childId,
        input_login_code: payload.loginCode,
      })
      .maybeSingle();

    if (error) throw error;

    const row = data as KidDashboardRpcRow | null;

    if (!row?.child) {
      return null;
    }

    const tasks = row.tasks ?? [];
    const rewards = row.rewards ?? [];

    return {
      child: mapChild(row.child, tasks, rewards),
      tasks: mapTaskItems(tasks),
      rewards: mapRewardItems(rewards),
      achievementStats: mapAchievementStats(row.achievement_stats),
      childAchievements: mapChildAchievements(row.child_achievements),
    };
  },
};
