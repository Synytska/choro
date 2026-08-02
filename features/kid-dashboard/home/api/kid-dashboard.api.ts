import { rewardStatus, taskStatus } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import {
  SupabaseAchievementStatsRow,
  SupabaseChildAchievementRow,
  SupabaseChildRow,
  SupabaseChildTaskRow,
  SupabaseRewardRow,
} from "@/lib/supabase-types";
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

const KID_DASHBOARD_RPC = "get_kid_dashboard_data";
const BASE_XP_PER_LEVEL = 60;
const XP_LEVEL_INCREMENT = 10;

type KidDashboardPayload = {
  childId: string;
  loginCode: string;
};

type KidDashboardRpcRow = {
  child: SupabaseChildRow | null;
  tasks: SupabaseChildTaskRow[] | null;
  rewards: SupabaseRewardRow[] | null;
  achievement_stats?: SupabaseAchievementStatsRow | null;
  child_achievements?: SupabaseChildAchievementRow[] | null;
};

const formatTaskTime = (task: SupabaseChildTaskRow) => {
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

const getTaskStatus = (task: SupabaseChildTaskRow): TaskStatus => {
  const status = task.status?.toLowerCase();

  if (status === taskStatus.pending || status === taskStatus.review || status === taskStatus.done) {
    return status as TaskStatus;
  }

  return taskStatus.pending;
};

const getTaskDateKey = (task: SupabaseChildTaskRow) => task.due_at?.slice(0, 10) ?? null;

const getTodayDateKey = () => new Date().toISOString().slice(0, 10);

const filterVisibleTaskRows = (taskRows: SupabaseChildTaskRow[]) => {
  const todayDateKey = getTodayDateKey();

  return taskRows.filter((task) => {
    const status = getTaskStatus(task);

    if (status === taskStatus.review) return true;

    return getTaskDateKey(task) === todayDateKey;
  });
};

const getLevelStartXp = (level: number) => {
  const completedLevels = Math.max(0, level - 1);

  return (
    completedLevels * BASE_XP_PER_LEVEL +
    (completedLevels * Math.max(0, completedLevels - 1) * XP_LEVEL_INCREMENT) / 2
  );
};

const getNextLevelXp = (level: number) => getLevelStartXp(level + 1);

const getLevelByXp = (xpTotal: number) => {
  let level = 1;

  while (xpTotal >= getNextLevelXp(level)) {
    level += 1;
  }

  return level;
};

const getLevelStats = (xpTotal: number) => {
  const safeXpTotal = Math.max(0, Math.floor(xpTotal));
  const level = getLevelByXp(safeXpTotal);
  const levelStartXp = getLevelStartXp(level);
  const xpNextLevel = getNextLevelXp(level);
  const currentLevelRange = Math.max(1, xpNextLevel - levelStartXp);
  const currentLevelXp = safeXpTotal - levelStartXp;

  return {
    level,
    xpTotal: safeXpTotal,
    xpCurrentLevel: safeXpTotal,
    xpNextLevel,
    levelProgress: currentLevelXp / currentLevelRange,
  };
};

const mapChild = (
  child: SupabaseChildRow,
  tasks: SupabaseChildTaskRow[],
  rewards: SupabaseRewardRow[],
): ChildCard => {
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
    level: levelStats.level,
    xpTotal: levelStats.xpTotal,
    xpCurrentLevel: levelStats.xpCurrentLevel,
    xpNextLevel: levelStats.xpNextLevel,
    levelProgress: levelStats.levelProgress,
    coinBalance: Number.isFinite(coinBalance) ? coinBalance : rewardCoins,
  };
};

const mapTaskItems = (taskRows: SupabaseChildTaskRow[]): TaskItem[] =>
  taskRows.map((task) => ({
    childId: task.child_id,
    title: task.title ?? "Task",
    time: formatTaskTime(task),
    status: getTaskStatus(task),
    id: task.id,
    emoji: task.emoji ?? undefined,
    coinReward: Number(task.coin_reward ?? 1),
    xpReward: Number(task.xp_reward ?? 10),
    category: task.category ?? null,
    description: task.description ?? undefined,
    proofPhotoUrl: task.proof_photo_url ?? null,
    repeatDays: task.repeat_days ?? [],
  }));

const mapRewardItems = (rewardRows: SupabaseRewardRow[]): RewardItem[] =>
  rewardRows.map((reward) => {
    const coinAmount = Number(reward.coin_amount ?? 0);
    const status = reward.status?.toLowerCase();
    const normalizedStatus =
      status === rewardStatus.requested || status === rewardStatus.given
        ? status
        : rewardStatus.available;

    return {
      id: reward.id,
      childId: reward.child_id,
      name: reward.name ?? "Reward",
      coinAmount: Number.isFinite(coinAmount) ? coinAmount : 0,
      icon: reward.icon ?? null,
      imageUri: getRewardImageUri(reward.image_uri, reward.icon),
      status: normalizedStatus,
      requestedAt: reward.requested_at ?? null,
      givenAt: reward.given_at ?? null,
    };
  });

const toSafeNumber = (value: number | string | null | undefined) => {
  const parsedValue = Number(value ?? 0);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const mapAchievementStats = (stats?: SupabaseAchievementStatsRow | null): AchievementStats => ({
  currentTaskStreakDays: toSafeNumber(stats?.current_task_streak_days),
  longestTaskStreakDays: toSafeNumber(stats?.longest_task_streak_days),
  currentPerfectWeekDays: toSafeNumber(stats?.current_perfect_week_days),
  longestPerfectWeekDays: toSafeNumber(stats?.longest_perfect_week_days),
});

const mapChildAchievements = (
  achievements?: SupabaseChildAchievementRow[] | null,
): ChildAchievement[] =>
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

    const tasks = filterVisibleTaskRows(row.tasks ?? []);
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
