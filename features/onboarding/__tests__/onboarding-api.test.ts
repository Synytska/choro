import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Mock } from "jest-mock";

import { supabase } from "@/lib/supabase";

import { onboardingApi, type SaveOnboardingPayload } from "../api/onboarding.api";

type AnyMock = Mock<(...args: any[]) => any>;

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

const mockSupabase = supabase as unknown as {
  auth: {
    getUser: AnyMock;
  };
  from: AnyMock;
};

const createInsertBuilder = (data: unknown, error: unknown = null) => ({
  insert: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  single: (jest.fn() as AnyMock).mockResolvedValue({ data, error }),
});

const createPlainInsertBuilder = (error: unknown = null) => ({
  insert: (jest.fn() as AnyMock).mockResolvedValue({ error }),
});

const createProfileUpdateBuilder = (error: unknown = null) => ({
  update: jest.fn().mockReturnThis(),
  eq: (jest.fn() as AnyMock).mockResolvedValue({ error }),
});

const payload: SaveOnboardingPayload = {
  childName: "Mia",
  childAge: 8,
  childGender: "girl",
  tasks: [
    { id: "bed", emoji: "🛏️", title: "Make the bed", selected: true },
    { id: "trash", emoji: "🗑️", title: "Take out the trash", selected: false },
  ],
  prize: {
    name: "Bike",
    coinAmount: "120",
    imageUri: "file://bike.png",
  },
};

describe("onboardingApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Math, "random").mockReturnValue(0.123456789);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("saves onboarding data and marks profile as completed", async () => {
    const familyBuilder = createInsertBuilder({ id: "family-1" });
    const childBuilder = createInsertBuilder({ id: "child-1", login_code: "4FZZZX" });
    const tasksBuilder = createPlainInsertBuilder();
    const rewardBuilder = createInsertBuilder({ id: "reward-1" });
    const profileBuilder = createProfileUpdateBuilder();

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "parent-1" } },
      error: null,
    });
    mockSupabase.from.mockImplementation((table: string) => {
      const builders: Record<string, unknown> = {
        families: familyBuilder,
        children: childBuilder,
        child_tasks: tasksBuilder,
        rewards: rewardBuilder,
        profiles: profileBuilder,
      };

      return builders[table];
    });

    const result = await onboardingApi.saveOnboarding(payload);

    expect(familyBuilder.insert).toHaveBeenCalledWith({
      parent_id: "parent-1",
    });
    expect(childBuilder.insert).toHaveBeenCalledWith({
      family_id: "family-1",
      name: "Mia",
      age: 8,
      gender: "girl",
      login_code: expect.any(String),
    });
    expect(tasksBuilder.insert).toHaveBeenCalledWith([
      {
        child_id: "child-1",
        emoji: "🛏️",
        title: "Make the bed",
      },
    ]);
    expect(rewardBuilder.insert).toHaveBeenCalledWith({
      child_id: "child-1",
      name: "Bike",
      coin_amount: 120,
      image_uri: "file://bike.png",
    });
    expect(profileBuilder.update).toHaveBeenCalledWith({
      onboarding_completed: true,
    });
    expect(profileBuilder.eq).toHaveBeenCalledWith("id", "parent-1");
    expect(result).toMatchObject({
      family: { id: "family-1" },
      child: { id: "child-1" },
      reward: { id: "reward-1" },
      childCode: expect.any(String),
    });
  });

  it("skips task insert when no task is selected", async () => {
    const familyBuilder = createInsertBuilder({ id: "family-1" });
    const childBuilder = createInsertBuilder({ id: "child-1" });
    const rewardBuilder = createInsertBuilder({ id: "reward-1" });
    const profileBuilder = createProfileUpdateBuilder();

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "parent-1" } },
      error: null,
    });
    mockSupabase.from.mockImplementation((table: string) => {
      const builders: Record<string, unknown> = {
        families: familyBuilder,
        children: childBuilder,
        rewards: rewardBuilder,
        profiles: profileBuilder,
      };

      return builders[table];
    });

    await onboardingApi.saveOnboarding({
      ...payload,
      tasks: payload.tasks.map((task) => ({ ...task, selected: false })),
    });

    expect(mockSupabase.from).not.toHaveBeenCalledWith("child_tasks");
  });

  it("throws when there is no authenticated user", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await expect(onboardingApi.saveOnboarding(payload)).rejects.toThrow("User not found");
  });
});
