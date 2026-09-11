import { afterAll, beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Mock } from "jest-mock";

import { rewardStatus, taskStatus } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

import { kidDashboardApi } from "../kid-dashboard.api";

type AnyMock = Mock<(...args: any[]) => any>;

jest.mock("@/lib/supabase", () => ({
  supabase: {
    rpc: jest.fn(),
  },
}));

const mockSupabase = supabase as unknown as {
  rpc: AnyMock;
};

const createRpcBuilder = (data: unknown, error: unknown = null) => ({
  maybeSingle: (jest.fn() as AnyMock).mockResolvedValue({ data, error }),
});

describe("kidDashboardApi", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-08-21T10:00:00.000Z"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("shows today tasks and keeps older review tasks visible for parent approval state", async () => {
    mockSupabase.rpc.mockReturnValue(
      createRpcBuilder({
        child: {
          id: "child-1",
          name: "Mia",
          age: 8,
          login_code: "ABC123",
          coin_balance: 12,
          xp_total: 65,
        },
        tasks: [
          {
            id: "today-pending",
            child_id: "child-1",
            title: "Brush teeth",
            status: taskStatus.pending,
            due_at: "2026-08-21T09:00:00.000Z",
            coin_reward: 2,
          },
          {
            id: "yesterday-pending",
            child_id: "child-1",
            title: "Old pending",
            status: taskStatus.pending,
            due_at: "2026-08-20T09:00:00.000Z",
            coin_reward: 1,
          },
          {
            id: "yesterday-review",
            child_id: "child-1",
            title: "Needs review",
            status: taskStatus.review,
            due_at: "2026-08-20T09:00:00.000Z",
            proof_photo_url: "https://storage.test/proof.jpg",
            coin_reward: 3,
          },
        ],
        rewards: [
          {
            id: "reward-1",
            child_id: "child-1",
            name: "Ice cream",
            coin_amount: 10,
            icon: "🍦",
            status: rewardStatus.available,
          },
        ],
        achievement_stats: {
          current_task_streak_days: 2,
          longest_task_streak_days: 3,
          current_perfect_week_days: 1,
          longest_perfect_week_days: 4,
        },
        child_achievements: [],
      }),
    );

    const result = await kidDashboardApi.getDashboardData({
      childId: "child-1",
      loginCode: "ABC123",
    });

    expect(mockSupabase.rpc).toHaveBeenCalledWith("get_kid_dashboard_data", {
      input_child_id: "child-1",
      input_login_code: "ABC123",
    });
    expect(result?.tasks.map((task) => task.id)).toEqual(["today-pending", "yesterday-review"]);
    expect(result?.child.level).toBe(2);
    expect(result?.child.xpCurrentLevel).toBe(65);
    expect(result?.child.xpNextLevel).toBe(130);
    expect(result?.achievementStats?.currentTaskStreakDays).toBe(2);
  });
});
