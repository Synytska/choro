import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Mock } from "jest-mock";

import { notificationsApi } from "@/features/notifications/api/notifications.api";
import { rewardStatus } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

import { rewardsApi } from "../rewards.api";

type AnyMock = Mock<(...args: any[]) => any>;

jest.mock("@/features/notifications/api/notifications.api", () => ({
  notificationsApi: {
    sendChildRewardGivenNotification: (jest.fn() as AnyMock).mockResolvedValue({ sent: true }),
    sendRewardRequestNotification: (jest.fn() as AnyMock).mockResolvedValue({ sent: true }),
  },
}));

jest.mock("@/features/parent-dashboard/api/family", () => ({
  getFamilyIds: (jest.fn() as AnyMock).mockResolvedValue(["family-1"]),
  getOwnedChildIds: (jest.fn() as AnyMock).mockResolvedValue(["child-1"]),
}));

jest.mock("@/lib/supabase-auth", () => ({
  getRequiredCurrentUser: (jest.fn() as AnyMock).mockResolvedValue({ id: "parent-1" }),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

const mockNotificationsApi = notificationsApi as unknown as {
  sendChildRewardGivenNotification: AnyMock;
  sendRewardRequestNotification: AnyMock;
};

const mockSupabase = supabase as unknown as {
  from: AnyMock;
  rpc: AnyMock;
};

describe("rewardsApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("requests a reward and notifies the parent", async () => {
    const single = (jest.fn() as AnyMock).mockResolvedValue({
      data: { id: "reward-1", status: rewardStatus.requested },
      error: null,
    });

    mockSupabase.rpc.mockReturnValue({ single });

    await expect(
      rewardsApi.requestReward({
        childId: "child-1",
        loginCode: "ABC123",
        rewardId: "reward-1",
      }),
    ).resolves.toEqual({ id: "reward-1", status: rewardStatus.requested });

    expect(mockSupabase.rpc).toHaveBeenCalledWith("request_child_reward", {
      input_child_id: "child-1",
      input_login_code: "ABC123",
      input_reward_id: "reward-1",
    });
    expect(mockNotificationsApi.sendRewardRequestNotification).toHaveBeenCalledWith({
      childId: "child-1",
      loginCode: "ABC123",
      rewardId: "reward-1",
    });
  });

  it("marks requested reward as given and notifies the child", async () => {
    const reward = {
      id: "reward-1",
      child_id: "child-1",
      status: rewardStatus.requested,
      name: "Ice cream",
      coin_amount: 10,
    };
    const selectRewardBuilder = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: (jest.fn() as AnyMock).mockResolvedValue({ data: reward, error: null }),
    };
    const updateRewardBuilder = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: (jest.fn() as AnyMock).mockResolvedValue({
        data: { ...reward, status: rewardStatus.given },
        error: null,
      }),
    };

    mockSupabase.from
      .mockReturnValueOnce(selectRewardBuilder)
      .mockReturnValueOnce(updateRewardBuilder);

    await expect(rewardsApi.giveReward({ rewardId: "reward-1" })).resolves.toEqual({
      ...reward,
      status: rewardStatus.given,
    });

    expect(updateRewardBuilder.update).toHaveBeenCalledWith({
      status: rewardStatus.given,
      given_at: expect.any(String),
    });
    expect(mockNotificationsApi.sendChildRewardGivenNotification).toHaveBeenCalledWith({
      rewardId: "reward-1",
    });
  });
});
