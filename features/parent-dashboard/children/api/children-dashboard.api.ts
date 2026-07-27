import { getFamilyIds } from "@/features/parent-dashboard/api/family";
import { taskStatus } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase-auth";
import {
  ChildCard,
  ChildDetailsData,
  RewardItem,
  TaskCategory,
  TaskItem,
  TaskStatus,
} from "@/lib/types";
import { getRewardImageUri } from "@/lib/utils/utils";
import { ChildGender } from "@/store/features/onboarding/onboardingSlice";

type ChildRow = {
  id: string;
  family_id: string;
  name: string | null;
  age: number;
  gender: ChildGender;
  created_at: string | null;
  login_code: string | null;
  avatar_id?: string | null;
  avatar_url?: string | null;
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
  completed?: boolean | null;
  is_completed?: boolean | null;
  status?: string | null;
  emoji?: string | null;
  coin_reward?: number | string | null;
  xp_reward?: number | string | null;
  category?: TaskCategory | null;
  proof_photo_url?: string | null;
};

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

const getTaskStatus = (task: ChildTaskRow): TaskItem["status"] => {
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

  return (data ?? []) as ChildRow[];
};

const getChildById = async (id: string, familyIds: string[]) => {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .eq("id", id)
    .in("family_id", familyIds)
    .maybeSingle();

  if (error) throw error;
  return data as ChildRow | null;
};

const getRewardsByChildIds = async (childIds: string[]) => {
  const { data, error } = await supabase.from("rewards").select("*").in("child_id", childIds);

  if (error) throw error;

  return (data ?? []) as RewardRow[];
};

const getTasksByChildIds = async (childIds: string[]) => {
  const { data, error } = await supabase.from("child_tasks").select("*").in("child_id", childIds);

  if (error) throw error;

  return (data ?? []) as ChildTaskRow[];
};

const mapDashboardData = (
  childRows: ChildRow[],
  rewardRows: RewardRow[],
  taskRows: ChildTaskRow[],
): ParentDashboardData => {
  // TODO: Add coins to the database and put real data here.
  const coinsByChildId = rewardRows.reduce<Record<string, number>>((acc, reward) => {
    const coins = Number(reward.coin_amount ?? 0);
    acc[reward.child_id] = (acc[reward.child_id] ?? 0) + (Number.isFinite(coins) ? coins : 0);
    return acc;
  }, {});

  const tasksByChildId = taskRows.reduce<Record<string, ChildTaskRow[]>>((acc, task) => {
    acc[task.child_id] = [...(acc[task.child_id] ?? []), task];
    return acc;
  }, {});

  const children = childRows.map<ChildCard>((child, index) => {
    const childTasks = tasksByChildId[child.id] ?? [];
    const doneTasks = childTasks.filter((task) => getTaskStatus(task) === "done").length;

    return {
      id: child.id,
      name: child.name ?? "Child",
      coins: coinsByChildId[child.id] ?? 0,
      color: childColors[index % childColors.length],
      progress: childTasks.length ? doneTasks / childTasks.length : 0,
      age: child.age,
      gender: child.gender,
      loginCode: child.login_code ?? "",
      avatarId: child.avatar_id ?? null,
      avatarUrl: child.avatar_url ?? null,
    };
  });

  const tasks = mapTaskItems(taskRows);

  return {
    children,
    tasks,
    rewards: mapRewardItems(rewardRows),
  };
};

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
    category: task.category ?? null,
    proofPhotoUrl: task.proof_photo_url ?? null,
  }));

const mapChildDetailsData = (
  child: ChildRow,
  rewardRows: RewardRow[],
  taskRows: ChildTaskRow[],
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
