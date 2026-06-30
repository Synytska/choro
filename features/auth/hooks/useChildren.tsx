import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import { ChildCard, TaskItem } from "@/lib/types";

type FamilyRow = {
  id: string;
};

type ChildRow = {
  id: string;
  family_id: string;
  name: string | null;
  age: number;
  gender: string;
};

type RewardRow = {
  child_id: string;
  coin_amount?: number | string | null;
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
};

export type ParentDashboardData = {
  children: ChildCard[];
  tasks: TaskItem[];
};

const childColors = ["#5146E8", "#EC4899", "#10B981", "#F59E0B", "#635BFF", "#06B6D4"];

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
  if (task.completed || task.is_completed || task.status?.toLowerCase() === "done") {
    return "done";
  }

  return "pending";
};

const getChildren = async (): Promise<ParentDashboardData> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) {
    return {
      children: [],
      tasks: [],
    };
  }

  const { data: families, error: familiesError } = await supabase
    .from("families")
    .select("*")
    .eq("parent_id", user.id);

  if (familiesError) throw familiesError;

  const familyIds = ((families ?? []) as FamilyRow[]).map((family) => family.id);

  if (!familyIds.length) {
    return {
      children: [],
      tasks: [],
    };
  }

  const { data: childrenRows, error: childrenError } = await supabase
    .from("children")
    .select("*")
    .in("family_id", familyIds);

  if (childrenError) throw childrenError;

  const childRows = (childrenRows ?? []) as ChildRow[];
  const childIds = childRows.map((child) => child.id);

  if (!childIds.length) {
    return {
      children: [],
      tasks: [],
    };
  }

  const [{ data: rewards, error: rewardsError }, { data: childTasks, error: childTasksError }] =
    await Promise.all([
      supabase.from("rewards").select("*").in("child_id", childIds),
      supabase.from("child_tasks").select("*").in("child_id", childIds),
    ]);

  if (rewardsError) throw rewardsError;
  if (childTasksError) throw childTasksError;

  const rewardRows = (rewards ?? []) as RewardRow[];
  const taskRows = (childTasks ?? []) as ChildTaskRow[];

  //TODO: Add coins to the database and put real data here
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
      name: child.name ?? "Child",
      coins: coinsByChildId[child.id] ?? 0,
      color: childColors[index % childColors.length],
      progress: childTasks.length ? doneTasks / childTasks.length : 0,
      age: child.age,
      gender: child.gender,
    };
  });

  const tasks = taskRows.map<TaskItem>((task) => ({
    title: task.title ?? "Task",
    time: formatTaskTime(task),
    status: getTaskStatus(task),
  }));

  return {
    children,
    tasks,
  };
};

export function useChildren() {
  return useQuery({
    queryKey: ["children", "dashboard"],
    queryFn: getChildren,
  });
}
