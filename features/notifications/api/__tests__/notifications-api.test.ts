import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Mock } from "jest-mock";

import { supabase } from "@/lib/supabase";

import { notificationsApi } from "../notifications.api";

type AnyMock = Mock<(...args: any[]) => any>;

jest.mock("@/lib/supabase-auth", () => ({
  getRequiredCurrentUser: (jest.fn() as AnyMock).mockResolvedValue({ id: "parent-1" }),
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
    functions: {
      invoke: jest.fn(),
    },
    rpc: jest.fn(),
  },
}));

const mockSupabase = supabase as unknown as {
  from: AnyMock;
  functions: {
    invoke: AnyMock;
  };
  rpc: AnyMock;
};

describe("notificationsApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("stores parent push token and permission status", async () => {
    const profile = {
      id: "parent-1",
      expo_push_token: "ExponentPushToken[parent]",
      notifications_permission_status: "granted",
    };
    const update = jest.fn().mockReturnThis();
    const eq = jest.fn().mockReturnThis();
    const select = jest.fn().mockReturnThis();
    const single = (jest.fn() as AnyMock).mockResolvedValue({ data: profile, error: null });

    mockSupabase.from.mockReturnValue({ update, eq, select, single });

    await expect(
      notificationsApi.savePushRegistration({
        expoPushToken: "ExponentPushToken[parent]",
        permissionStatus: "granted",
      }),
    ).resolves.toEqual(profile);

    expect(mockSupabase.from).toHaveBeenCalledWith("profiles");
    expect(update).toHaveBeenCalledWith({
      expo_push_token: "ExponentPushToken[parent]",
      notifications_permission_status: "granted",
      push_token_updated_at: expect.any(String),
    });
    expect(eq).toHaveBeenCalledWith("id", "parent-1");
  });

  it("invokes reward request notification Edge Function", async () => {
    mockSupabase.functions.invoke.mockResolvedValue({ data: { sent: true }, error: null });

    await expect(
      notificationsApi.sendRewardRequestNotification({
        childId: "child-1",
        loginCode: "ABC123",
        rewardId: "reward-1",
      }),
    ).resolves.toEqual({ sent: true });

    expect(mockSupabase.functions.invoke).toHaveBeenCalledWith("notify-child-reward-redeemed", {
      body: {
        childId: "child-1",
        loginCode: "ABC123",
        rewardId: "reward-1",
      },
    });
  });

  it("invokes child pet grown notification Edge Function", async () => {
    mockSupabase.functions.invoke.mockResolvedValue({ data: { sent: true }, error: null });

    await expect(
      notificationsApi.sendChildPetGrownNotification({
        childId: "child-1",
        loginCode: "ABC123",
        nextLevel: 2,
        nextStage: "hatching",
        previousLevel: 1,
        previousStage: "egg",
      }),
    ).resolves.toEqual({ sent: true });

    expect(mockSupabase.functions.invoke).toHaveBeenCalledWith("notify-child-pet-grown", {
      body: {
        childId: "child-1",
        loginCode: "ABC123",
        nextLevel: 2,
        nextStage: "hatching",
        previousLevel: 1,
        previousStage: "egg",
      },
    });
  });

  it("invokes child achievement unlocked notification Edge Function", async () => {
    mockSupabase.functions.invoke.mockResolvedValue({ data: { sent: true }, error: null });

    await expect(
      notificationsApi.sendChildAchievementUnlockedNotification({
        achievementId: "first_task",
        childId: "child-1",
        loginCode: "ABC123",
      }),
    ).resolves.toEqual({ sent: true });

    expect(mockSupabase.functions.invoke).toHaveBeenCalledWith(
      "notify-child-achievement-unlocked",
      {
        body: {
          achievementId: "first_task",
          childId: "child-1",
          loginCode: "ABC123",
        },
      },
    );
  });
});
