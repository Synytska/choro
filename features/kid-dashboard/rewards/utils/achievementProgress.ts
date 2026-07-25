import { taskStatus } from "@/lib/constants";
import {
  AchievementItem,
  AchievementMetric,
  AchievementProgressItem,
  AchievementStats,
  ChildCard,
  RewardItem,
  TaskItem,
} from "@/lib/types";

type AchievementProgressInput = {
  child?: ChildCard;
  tasks: TaskItem[];
  rewards?: RewardItem[];
  achievementStats?: AchievementStats;
};

const unavailableReasonByMetric: Partial<Record<AchievementMetric, string>> = {
  categoryCompletedTasks: "Task categories are needed to track this achievement.",
};

const normalizeTaskTitle = (title: string) => title.trim().toLowerCase();

const getCompletedTasks = (tasks: TaskItem[]) =>
  tasks.filter((task) => task.status === taskStatus.done);

const getMetricValue = (
  achievement: AchievementItem,
  { achievementStats, child, tasks }: AchievementProgressInput,
) => {
  const completedTasks = getCompletedTasks(tasks);

  switch (achievement.metric) {
    case "streakDays":
      return achievementStats?.longestTaskStreakDays ?? 0;
    case "xpTotal":
      return child?.xpTotal ?? 0;
    case "completedTasks":
      return completedTasks.length;
    case "uniqueCompletedTasks":
      return new Set(completedTasks.map((task) => normalizeTaskTitle(task.title))).size;
    case "level":
      return child?.level ?? 1;
    case "perfectWeek":
      return achievementStats?.longestPerfectWeekDays ?? 0;
    case "categoryCompletedTasks":
      return 0;
    default:
      return 0;
  }
};

const getProgressLabel = (achievement: AchievementItem, value: number) => {
  const safeValue = Math.min(value, achievement.target);

  switch (achievement.metric) {
    case "xpTotal":
      return `${safeValue}/${achievement.target} XP`;
    case "level":
      return `Level ${safeValue}/${achievement.target}`;
    case "streakDays":
    case "perfectWeek":
      return `${safeValue}/${achievement.target} days`;
    default:
      return `${safeValue}/${achievement.target}`;
  }
};

export const calculateAchievements = (
  achievementItems: AchievementItem[],
  input: AchievementProgressInput,
): AchievementProgressItem[] =>
  achievementItems.map((achievement) => {
    const unavailableReason = unavailableReasonByMetric[achievement.metric];
    const value = getMetricValue(achievement, input);
    const cappedValue = Math.min(value, achievement.target);

    return {
      ...achievement,
      value,
      progress: achievement.target ? cappedValue / achievement.target : 0,
      progressLabel: getProgressLabel(achievement, value),
      unlocked: !unavailableReason && value >= achievement.target,
      unavailableReason,
    };
  });
