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
    storage: {
      from: jest.fn(),
    },
  },
}));

jest.mock("expo-file-system/legacy", () => ({
  readAsStringAsync: jest.fn(async () => "base64-image"),
}));

jest.mock("base64-arraybuffer", () => ({
  decode: jest.fn((value) => value),
}));

const mockSupabase = supabase as unknown as {
  auth: {
    getUser: AnyMock;
  };
  from: AnyMock;
  storage: {
    from: AnyMock;
  };
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
  avatarId: "avatar-1",
  avatarImageUri: "file://avatar.png",
  avatarImageMimeType: "image/png",
  tasks: [
    {
      id: "bed",
      emoji: "🛏️",
      title: "Make the bed",
      selected: true,
      coins: 5,
      category: "organization",
    },
    {
      id: "trash",
      emoji: "🗑️",
      title: "Take out the trash",
      selected: false,
      coins: 2,
      category: "cleaning",
    },
  ],
  prize: {
    name: "Bike",
    coinAmount: "120",
    icon: "🚲",
    imageUri: "file://bike.png",
    imageMimeType: "image/png",
  },
};

describe("onboardingApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Math, "random").mockReturnValue(0.123456789);
    mockSupabase.storage.from.mockImplementation((bucket: string) => ({
      upload: jest.fn(async () => ({ error: null })),
      getPublicUrl: jest.fn((path: string) => ({
        data: {
          publicUrl: `https://storage.test/${bucket}/${path}`,
        },
      })),
    }));
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
      avatar_id: null,
      avatar_url: expect.stringContaining("https://storage.test/child-avatars/parent-1/"),
    });
    expect(tasksBuilder.insert).toHaveBeenCalledWith([
      {
        child_id: "child-1",
        emoji: "🛏️",
        title: "Make the bed",
        coin_reward: 5,
        category: "organization",
        due_at: null,
        repeat_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        status: "pending",
      },
    ]);
    expect(rewardBuilder.insert).toHaveBeenCalledWith({
      child_id: "child-1",
      name: "Bike",
      coin_amount: 120,
      icon: expect.stringContaining("https://storage.test/reward-images/parent-1/"),
      image_uri: expect.stringContaining("https://storage.test/reward-images/parent-1/"),
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

  it("stores prize icon when no prize image is selected", async () => {
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
      avatarImageUri: null,
      prize: {
        ...payload.prize,
        icon: "🎁",
        imageUri: null,
        imageMimeType: null,
      },
      tasks: payload.tasks.map((task) => ({ ...task, selected: false })),
    });

    expect(rewardBuilder.insert).toHaveBeenCalledWith({
      child_id: "child-1",
      name: "Bike",
      coin_amount: 120,
      icon: "🎁",
      image_uri: null,
    });
  });

  it("throws when there is no authenticated user", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await expect(onboardingApi.saveOnboarding(payload)).rejects.toThrow("User not found");
  });
});
