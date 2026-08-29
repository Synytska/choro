import { getFamilyIds } from "@/features/parent-dashboard/api/family";
import { rewardStatus, taskStatus } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase-auth";
import { SupabaseChildRow, SupabaseChildTaskRow, SupabaseRewardRow } from "@/lib/supabase-types";
import { ChildCard, ChildDetailsData, RewardItem, TaskItem, TaskStatus } from "@/lib/types";
import { getRewardImageUri, getTodayDateKey, normalizeLanguage } from "@/lib/utils/utils";

export type ParentDashboardData = {
  children: ChildCard[];
  tasks: TaskItem[];
  rewards: RewardItem[];
};

const childColors = ["#5146E8", "#EC4899", "#10B981", "#F59E0B", "#635BFF", "#06B6D4"];

const emptyDashboardData: ParentDashboardData = {
  children: [],
  tasks: [],
  rewards: [],
};

const MATERIALIZE_CHILD_DAILY_TASKS_RPC = "materialize_child_daily_tasks";

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

const getTaskStatus = (task: SupabaseChildTaskRow): TaskItem["status"] => {
  const status = task.status?.toLowerCase();

  if (status === taskStatus.pending || status === taskStatus.review || status === taskStatus.done) {
    return status as TaskStatus;
  }

  return taskStatus.pending;
};

const getChildrenByFamilyIds = async (familyIds: string[]) => {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .in("family_id", familyIds)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as SupabaseChildRow[];
};

const getChildById = async (id: string, familyIds: string[]) => {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .eq("id", id)
    .in("family_id", familyIds)
    .maybeSingle();

  if (error) throw error;
  return data as SupabaseChildRow | null;
};

const getRewardsByChildIds = async (childIds: string[]) => {
  const { data, error } = await supabase.from("rewards").select("*").in("child_id", childIds);

  if (error) throw error;

  return (data ?? []) as SupabaseRewardRow[];
};

const materializeDailyTasksByChildIds = async (childIds: string[]) => {
  await Promise.all(
    childIds.map(async (childId) => {
      const { error } = await supabase.rpc(MATERIALIZE_CHILD_DAILY_TASKS_RPC, {
        input_child_id: childId,
      });

      if (error) throw error;
    }),
  );
};

const getTasksByChildIds = async (childIds: string[]) => {
  await materializeDailyTasksByChildIds(childIds);

  const { data, error } = await supabase.from("child_tasks").select("*").in("child_id", childIds);

  if (error) throw error;

  return filterVisibleTaskRows((data ?? []) as SupabaseChildTaskRow[]);
};

const getTaskDateKey = (task: SupabaseChildTaskRow) => task.due_at?.slice(0, 10) ?? null;

const filterVisibleTaskRows = (taskRows: SupabaseChildTaskRow[]) => {
  const todayDateKey = getTodayDateKey();

  return taskRows.filter((task) => {
    const status = getTaskStatus(task);

    if (status === taskStatus.review) return true;

    return getTaskDateKey(task) === todayDateKey;
  });
};

const mapDashboardData = (
  childRows: SupabaseChildRow[],
  rewardRows: SupabaseRewardRow[],
  taskRows: SupabaseChildTaskRow[],
): ParentDashboardData => {
  const tasksByChildId = taskRows.reduce<Record<string, SupabaseChildTaskRow[]>>((acc, task) => {
    acc[task.child_id] = [...(acc[task.child_id] ?? []), task];
    return acc;
  }, {});

  const children = childRows.map<ChildCard>((child, index) => {
    const childTasks = tasksByChildId[child.id] ?? [];
    const doneTasks = childTasks.filter((task) => getTaskStatus(task) === "done").length;
    const coinBalance = Number(child.coin_balance ?? 0);
    const safeCoinBalance = Number.isFinite(coinBalance) ? coinBalance : 0;

    return {
      id: child.id,
      name: child.name ?? "Child",
      coins: safeCoinBalance,
      color: childColors[index % childColors.length],
      progress: childTasks.length ? doneTasks / childTasks.length : 0,
      age: child.age,
      gender: child.gender,
      loginCode: child.login_code ?? "",
      avatarId: child.avatar_id ?? null,
      avatarUrl: child.avatar_url ?? null,
      language: normalizeLanguage(child.language),
      coinBalance: safeCoinBalance,
    };
  });

  const tasks = mapTaskItems(taskRows);

  return {
    children,
    tasks,
    rewards: mapRewardItems(rewardRows),
  };
};

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
    proofPhotoUrl: task.proof_photo_url ?? null,
    repeatDays: task.repeat_days ?? [],
    defaultTaskKey: task.default_task_key ?? null,
  }));

const mapChildDetailsData = (
  child: SupabaseChildRow,
  rewardRows: SupabaseRewardRow[],
  taskRows: SupabaseChildTaskRow[],
): ChildDetailsData => ({
  child: mapDashboardData([child], rewardRows, taskRows).children[0],
  tasks: mapTaskItems(taskRows),
  rewards: mapRewardItems(rewardRows),
});

export const childrenDashboardApi = {
  getDashboardData: async (): Promise<ParentDashboardData> => {
    const user = await getCurrentUser();

    if (!user) return emptyDashboardData;

    const familyIds = await getFamilyIds(user.id);
    if (!familyIds.length) return emptyDashboardData;

    const childRows = await getChildrenByFamilyIds(familyIds);
    const childIds = childRows.map((child) => child.id);
    if (!childIds.length) return emptyDashboardData;

    const [rewardRows, taskRows] = await Promise.all([
      getRewardsByChildIds(childIds),
      getTasksByChildIds(childIds),
    ]);

    return mapDashboardData(childRows, rewardRows, taskRows);
  },

  getChildDetails: async (id: string): Promise<ChildDetailsData | null> => {
    const user = await getCurrentUser();

    if (!user) return null;

    const familyIds = await getFamilyIds(user.id);
    if (!familyIds.length) return null;

    const child = await getChildById(id, familyIds);
    if (!child) return null;

    const [rewardRows, taskRows] = await Promise.all([
      getRewardsByChildIds([child.id]),
      getTasksByChildIds([child.id]),
    ]);

    return mapChildDetailsData(child, rewardRows, taskRows);
  },
};
