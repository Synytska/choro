import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import type { Mock } from "jest-mock";

import { AUTH_ERROR } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

import { authService } from "../api/auth-api";

type AnyMock = Mock<(...args: any[]) => any>;

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      setSession: jest.fn(),
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
      updateUser: jest.fn(),
    },
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

jest.mock("expo-web-browser", () => ({
  openAuthSessionAsync: jest.fn(),
}));

const mockSupabase = supabase as unknown as {
  auth: {
    getSession: AnyMock;
    resetPasswordForEmail: AnyMock;
    setSession: AnyMock;
    signInWithPassword: AnyMock;
    signInWithOAuth: AnyMock;
    signOut: AnyMock;
    signUp: AnyMock;
    updateUser: AnyMock;
  };
  from: AnyMock;
  rpc: AnyMock;
};

const mockWebBrowser = WebBrowser as unknown as {
  openAuthSessionAsync: AnyMock;
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
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
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
      name: "Parent Name",
      role: "parent",
      onboarding_completed: false,
    };
    const profileBuilder = createProfileInsertBuilder(profile);

    mockSupabase.auth.signUp.mockResolvedValue({
      data: { session: null, user },
      error: null,
    });
    mockSupabase.from.mockReturnValue(profileBuilder);

    await expect(authService.signup("parent@test.com", "password", "Parent Name")).resolves.toEqual(
      {
        session: null,
        user,
        profile,
      },
    );

    expect(profileBuilder.insert).toHaveBeenCalledWith({
      id: "parent-1",
      email: "parent@test.com",
      name: "Parent Name",
      role: "parent",
      onboarding_completed: false,
      language: expect.any(String),
      child_notifications_enabled: true,
      parent_notifications_enabled: true,
      avatar_url: null,
    });
  });

  it("returns kid profile by login code", async () => {
    const child = {
      id: "child-1",
      name: "Mia",
      login_code: "ABC123",
      avatar_id: "avatar-1",
      avatar_url: null,
    };
    const childBuilder = createProfileSelectBuilder(child);

    mockSupabase.rpc.mockReturnValue(childBuilder);

    await expect(authService.kidLogin(" abc123 ")).resolves.toEqual({
      accessToken: "kid-child-1",
      profile: {
        id: "child-1",
        email: "",
        name: "Mia",
        role: "kid",
        avatarId: "avatar-1",
        avatarUrl: null,
        loginCode: "ABC123",
      },
    });

    expect(mockSupabase.rpc).toHaveBeenCalledWith("get_child_by_login_code", {
      input_login_code: "ABC123",
    });
    await expect(AsyncStorage.getItem("@choro/kid-session")).resolves.toEqual(
      JSON.stringify({
        accessToken: "kid-child-1",
        profile: {
          id: "child-1",
          email: "",
          name: "Mia",
          role: "kid",
          avatarId: "avatar-1",
          avatarUrl: null,
          loginCode: "ABC123",
        },
      }),
    );
  });

  it("throws invalid credentials when kid login code is missing", async () => {
    const childBuilder = createProfileSelectBuilder(null);

    mockSupabase.rpc.mockReturnValue(childBuilder);

    await expect(authService.kidLogin("BAD123")).rejects.toMatchObject({
      code: AUTH_ERROR.INVALID_LOGIN_CREDENTIALS,
    });
  });

  it("restores stored kid session when there is no Supabase session", async () => {
    const kidSession = {
      accessToken: "kid-child-1",
      profile: {
        id: "child-1",
        email: "",
        name: "Mia",
        role: "kid",
        avatarId: "avatar-1",
        avatarUrl: null,
        loginCode: "ABC123",
      },
    };

    await AsyncStorage.setItem("@choro/kid-session", JSON.stringify(kidSession));
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    await expect(authService.getCurrentSession()).resolves.toEqual({
      kind: "kid",
      ...kidSession,
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

    await expect(
      authService.signup("parent@test.com", "password", "Parent Name"),
    ).rejects.toMatchObject({
      code: AUTH_ERROR.ACCOUNT_ALREADY_EXISTS,
    });
  });

  it("returns existing profile after Google auth", async () => {
    const user = {
      id: "parent-1",
      email: "parent@test.com",
      user_metadata: { full_name: "Parent Name" },
    };
    const profile = {
      id: "parent-1",
      email: "parent@test.com",
      name: "Parent Name",
      onboarding_completed: true,
    };
    const profileBuilder = createProfileSelectBuilder(profile);

    mockSupabase.auth.signInWithOAuth.mockResolvedValue({
      data: { url: "https://auth.example.com/google" },
      error: null,
    });
    mockWebBrowser.openAuthSessionAsync.mockResolvedValue({
      type: "success",
      url: "choro://auth/callback#access_token=access-token&refresh_token=refresh-token",
    });
    mockSupabase.auth.setSession.mockResolvedValue({
      data: { session: { access_token: "access-token" }, user },
      error: null,
    });
    mockSupabase.from.mockReturnValue(profileBuilder);

    await expect(authService.signInWithGoogle()).resolves.toEqual({
      session: { access_token: "access-token" },
      user,
      profile,
    });

    expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: "choro://auth/callback",
        skipBrowserRedirect: true,
      },
    });
    expect(mockSupabase.auth.setSession).toHaveBeenCalledWith({
      access_token: "access-token",
      refresh_token: "refresh-token",
    });
  });

  it("creates parent profile after first Google auth", async () => {
    const user = {
      id: "parent-1",
      email: "parent@test.com",
      user_metadata: { full_name: "Parent Name" },
    };
    const selectBuilder = createProfileSelectBuilder(null);
    const insertBuilder = createProfileInsertBuilder({
      id: "parent-1",
      email: "parent@test.com",
      name: "Parent Name",
      onboarding_completed: false,
    });

    mockSupabase.auth.signInWithOAuth.mockResolvedValue({
      data: { url: "https://auth.example.com/google" },
      error: null,
    });
    mockWebBrowser.openAuthSessionAsync.mockResolvedValue({
      type: "success",
      url: "choro://auth/callback#access_token=access-token&refresh_token=refresh-token",
    });
    mockSupabase.auth.setSession.mockResolvedValue({
      data: { session: { access_token: "access-token" }, user },
      error: null,
    });
    mockSupabase.from.mockReturnValueOnce(selectBuilder).mockReturnValueOnce(insertBuilder);

    await authService.signInWithGoogle();

    expect(insertBuilder.insert).toHaveBeenCalledWith({
      id: "parent-1",
      email: "parent@test.com",
      name: "Parent Name",
      role: "parent",
      onboarding_completed: false,
      language: expect.any(String),
      child_notifications_enabled: true,
      parent_notifications_enabled: true,
      avatar_url: null,
    });
  });

  it("sends password reset email with app redirect", async () => {
    mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
      data: {},
      error: null,
    });

    await expect(authService.sendPasswordResetEmail(" parent@test.com ")).resolves.toEqual({});

    expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith("parent@test.com", {
      redirectTo: "choro://reset-password",
    });
  });

  it("sets recovery session from password reset callback url", async () => {
    mockSupabase.auth.setSession.mockResolvedValue({
      data: { session: { access_token: "access-token" }, user: { id: "parent-1" } },
      error: null,
    });

    await expect(
      authService.completePasswordRecovery(
        "choro://reset-password#access_token=access-token&refresh_token=refresh-token&type=recovery",
      ),
    ).resolves.toEqual({
      session: { access_token: "access-token" },
      user: { id: "parent-1" },
    });

    expect(mockSupabase.auth.setSession).toHaveBeenCalledWith({
      access_token: "access-token",
      refresh_token: "refresh-token",
    });
  });

  it("updates password for recovery session", async () => {
    mockSupabase.auth.updateUser.mockResolvedValue({
      data: { user: { id: "parent-1" } },
      error: null,
    });

    await expect(authService.resetPassword("new-password")).resolves.toEqual({
      user: { id: "parent-1" },
    });

    expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
      password: "new-password",
    });
    expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});
