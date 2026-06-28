import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Mock } from "jest-mock";

import { AUTH_ERROR } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

type AnyMock = Mock<(...args: any[]) => any>;

import { authService } from "../api/auth-api";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
    },
    from: jest.fn(),
  },
}));

const mockSupabase = supabase as unknown as {
  auth: {
    signInWithPassword: AnyMock;
    signOut: AnyMock;
    signUp: AnyMock;
  };
  from: AnyMock;
};

const createProfileSelectBuilder = (profile: unknown, error: unknown = null) => ({
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  maybeSingle: (jest.fn() as AnyMock).mockResolvedValue({ data: profile, error }),
});

const createProfileInsertBuilder = (profile: unknown, error: unknown = null) => ({
  insert: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  single: (jest.fn() as AnyMock).mockResolvedValue({ data: profile, error }),
});

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns auth data with profile on successful login", async () => {
    const user = { id: "parent-1", email: "parent@test.com" };
    const profile = {
      id: "parent-1",
      email: "parent@test.com",
      onboarding_completed: true,
    };
    const profileBuilder = createProfileSelectBuilder(profile);

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { session: { access_token: "token" }, user },
      error: null,
    });
    mockSupabase.from.mockReturnValue(profileBuilder);

    await expect(authService.login("parent@test.com", "password")).resolves.toEqual({
      session: { access_token: "token" },
      user,
      profile,
    });

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "parent@test.com",
      password: "password",
    });
    expect(mockSupabase.from).toHaveBeenCalledWith("profiles");
    expect(profileBuilder.eq).toHaveBeenCalledWith("id", "parent-1");
  });

  it("maps invalid Supabase credentials to AuthFlowError", async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { session: null, user: null },
      error: { message: "Invalid login credentials" },
    });

    await expect(authService.login("wrong@test.com", "bad-password")).rejects.toMatchObject({
      code: AUTH_ERROR.INVALID_LOGIN_CREDENTIALS,
    });
  });

  it("signs out and throws when auth user has no profile", async () => {
    const profileBuilder = createProfileSelectBuilder(null);

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { session: null, user: { id: "missing-profile" } },
      error: null,
    });
    mockSupabase.auth.signOut.mockResolvedValue({ error: null });
    mockSupabase.from.mockReturnValue(profileBuilder);

    await expect(authService.login("parent@test.com", "password")).rejects.toMatchObject({
      code: AUTH_ERROR.PROFILE_NOT_FOUND,
    });
    expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it("creates parent profile with onboarding_completed false on signup", async () => {
    const user = { id: "parent-1", email: "parent@test.com", identities: [{ id: "identity-1" }] };
    const profile = {
      id: "parent-1",
      email: "parent@test.com",
      role: "parent",
      onboarding_completed: false,
    };
    const profileBuilder = createProfileInsertBuilder(profile);

    mockSupabase.auth.signUp.mockResolvedValue({
      data: { session: null, user },
      error: null,
    });
    mockSupabase.from.mockReturnValue(profileBuilder);

    await expect(authService.signup("parent@test.com", "password")).resolves.toEqual({
      session: null,
      user,
      profile,
    });

    expect(profileBuilder.insert).toHaveBeenCalledWith({
      id: "parent-1",
      email: "parent@test.com",
      role: "parent",
      onboarding_completed: false,
    });
  });

  it("throws account-exists error when Supabase returns an existing identity", async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      data: {
        session: null,
        user: {
          id: "parent-1",
          identities: [],
        },
      },
      error: null,
    });

    await expect(authService.signup("parent@test.com", "password")).rejects.toMatchObject({
      code: AUTH_ERROR.ACCOUNT_ALREADY_EXISTS,
    });
  });
});
