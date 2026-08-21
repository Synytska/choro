import { describe, expect, it } from "@jest/globals";

import { rewardStatus } from "@/lib/constants";
import { RewardItem } from "@/lib/types";

import { getVisibleParentRewards } from "../rewardFilters";

const createReward = (override: Partial<RewardItem>): RewardItem => ({
  id: "reward-1",
  childId: "child-1",
  name: "Ice cream",
  coinAmount: 10,
  icon: "🍦",
  imageUri: null,
  status: rewardStatus.available,
  requestedAt: null,
  givenAt: null,
  ...override,
});

describe("getVisibleParentRewards", () => {
  it("keeps available and requested rewards for the selected child", () => {
    const rewards = [
      createReward({ id: "available", status: rewardStatus.available }),
      createReward({ id: "requested", status: rewardStatus.requested }),
    ];

    expect(getVisibleParentRewards(rewards, "child-1").map((reward) => reward.id)).toEqual([
      "available",
      "requested",
    ]);
  });

  it("hides given rewards from the parent rewards list", () => {
    const rewards = [
      createReward({ id: "available", status: rewardStatus.available }),
      createReward({ id: "given", status: rewardStatus.given, givenAt: "2026-08-20T10:00:00Z" }),
    ];

    expect(getVisibleParentRewards(rewards, "child-1").map((reward) => reward.id)).toEqual([
      "available",
    ]);
  });

  it("does not include rewards from another child", () => {
    const rewards = [
      createReward({ id: "selected-child", childId: "child-1" }),
      createReward({ id: "other-child", childId: "child-2" }),
    ];

    expect(getVisibleParentRewards(rewards, "child-1").map((reward) => reward.id)).toEqual([
      "selected-child",
    ]);
  });
});
