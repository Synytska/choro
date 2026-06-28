import { describe, expect, it } from "@jest/globals";

import { AUTH_ERROR } from "@/lib/constants";

import {
  AuthFlowError,
  getAuthErrorMessage,
  isAlreadyRegisteredAuthError,
  isExistingSupabaseIdentity,
  isInvalidLoginCredentialsError,
} from "../auth.errors";

describe("auth errors", () => {
  it("keeps a stable auth code and translation key on AuthFlowError", () => {
    const error = new AuthFlowError(AUTH_ERROR.PROFILE_NOT_FOUND);

    expect(error.code).toBe(AUTH_ERROR.PROFILE_NOT_FOUND);
    expect(error.message).toBe("auth.errors.profileNotFound");
    expect(getAuthErrorMessage(error)).toBe("auth.errors.profileNotFound");
  });

  it("detects invalid login credential messages", () => {
    expect(isInvalidLoginCredentialsError({ message: "Invalid login credentials" })).toBe(true);
    expect(isInvalidLoginCredentialsError({ message: "Some other error" })).toBe(false);
    expect(isInvalidLoginCredentialsError(null)).toBe(false);
  });

  it("detects already registered auth errors", () => {
    expect(isAlreadyRegisteredAuthError({ status: 422, message: "User already registered" })).toBe(
      true,
    );
    expect(isAlreadyRegisteredAuthError({ message: "Account already exists" })).toBe(true);
    expect(isAlreadyRegisteredAuthError({ message: "Network error" })).toBe(false);
  });

  it("detects Supabase's existing identity signup response", () => {
    expect(
      isExistingSupabaseIdentity({
        session: null,
        user: {
          identities: [],
        },
      } as unknown as Parameters<typeof isExistingSupabaseIdentity>[0]),
    ).toBe(true);
    expect(
      isExistingSupabaseIdentity({
        session: null,
        user: {
          identities: [{ id: "identity-1" }],
        },
      } as unknown as Parameters<typeof isExistingSupabaseIdentity>[0]),
    ).toBe(false);
  });
});
