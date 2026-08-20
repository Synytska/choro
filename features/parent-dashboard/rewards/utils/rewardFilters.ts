import { rewardStatus } from "@/lib/constants";
import { RewardItem } from "@/lib/types";

export const getVisibleParentRewards = (rewards: RewardItem[], childId: string) =>
  rewards.filter((reward) => reward.childId === childId && reward.status !== rewardStatus.given);
