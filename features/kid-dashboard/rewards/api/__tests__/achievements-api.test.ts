import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Mock } from "jest-mock";

import { supabase } from "@/lib/supabase";

import { achievementsApi } from "../achievements.api";

type AnyMock = Mock<(...args: any[]) => any>;

jest.mock("@/lib/supabase", () => ({
  supabase: {
    rpc: jest.fn(),
  },
}));

const mockSupabase = supabase as unknown as {
  rpc: AnyMock;
};

describe("achievementsApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("claims an achievement through the child-safe RPC", async () => {
    const single = (jest.fn() as AnyMock).mockResolvedValue({
      data: { achievement_id: "first_task", claimed_at: "2026-08-21T10:00:00.000Z" },
      error: null,
    });

    mockSupabase.rpc.mockReturnValue({ single });

    await expect(
      achievementsApi.claimAchievement({
        achievementId: "first_task",
        childId: "child-1",
        loginCode: "ABC123",
      }),
    ).resolves.toEqual({
      achievement_id: "first_task",
      claimed_at: "2026-08-21T10:00:00.000Z",
    });

    expect(mockSupabase.rpc).toHaveBeenCalledWith("claim_child_achievement", {
      input_achievement_id: "first_task",
      input_child_id: "child-1",
      input_login_code: "ABC123",
    });
  });
});
