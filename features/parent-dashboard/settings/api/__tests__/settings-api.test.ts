import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Mock } from "jest-mock";

import { supabase } from "@/lib/supabase";

import { settingsApi } from "../settings.api";

type AnyMock = Mock<(...args: any[]) => any>;

jest.mock("@/lib/supabase-auth", () => ({
  getRequiredCurrentUser: (jest.fn() as AnyMock).mockResolvedValue({
    id: "parent-1",
    email: "parent@test.com",
  }),
}));

jest.mock("@/lib/supabase-storage", () => ({
  uploadImageToBucket: (jest.fn() as AnyMock).mockResolvedValue("https://storage.test/profile.jpg"),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      updateUser: jest.fn(),
    },
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

const mockSupabase = supabase as unknown as {
  auth: {
    signInWithPassword: AnyMock;
    signOut: AnyMock;
    updateUser: AnyMock;
  };
  from: AnyMock;
  rpc: AnyMock;
};

const createUpdateBuilder = (data: unknown, error: unknown = null) => {
  const update = jest.fn().mockReturnThis();
  const eq = jest.fn().mockReturnThis();
  const select = jest.fn().mockReturnThis();
  const single = (jest.fn() as AnyMock).mockResolvedValue({ data, error });

  return { update, eq, select, single };
};

describe("settingsApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates parent notification preferences", async () => {
    const profile = {
      id: "parent-1",
      child_notifications_enabled: false,
      parent_notifications_enabled: true,
    };
    const builder = createUpdateBuilder(profile);

    mockSupabase.from.mockReturnValue(builder);

    await expect(
      settingsApi.updateNotificationSettings({
        childNotificationsEnabled: false,
        parentNotificationsEnabled: true,
      }),
    ).resolves.toEqual(profile);

    expect(builder.update).toHaveBeenCalledWith({
      child_notifications_enabled: false,
      parent_notifications_enabled: true,
    });
    expect(builder.eq).toHaveBeenCalledWith("id", "parent-1");
  });

  it("deletes current account through RPC and signs out locally", async () => {
    mockSupabase.rpc.mockResolvedValue({ data: null, error: null });
    mockSupabase.auth.signOut.mockResolvedValue({ error: null });

    await expect(settingsApi.deleteAccount()).resolves.toBe(true);

    expect(mockSupabase.rpc).toHaveBeenCalledWith("delete_current_user_account");
    expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});
