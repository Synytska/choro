import { AUTH_ERROR } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

export type AuthFlowErrorCode = (typeof AUTH_ERROR)[keyof typeof AUTH_ERROR];

export const authErrorMessages: Record<AuthFlowErrorCode, string> = {
  [AUTH_ERROR.PROFILE_NOT_FOUND]: "auth.errors.profileNotFound",
  [AUTH_ERROR.ACCOUNT_ALREADY_EXISTS]: "auth.errors.accountAlreadyExists",
  [AUTH_ERROR.INVALID_LOGIN_CREDENTIALS]: "auth.errors.invalidLoginCredentials",
  [AUTH_ERROR.UNKNOWN_AUTH_ERROR]: "auth.errors.unknown",
};

export const isExistingSupabaseIdentity = (
  data: Awaited<ReturnType<typeof supabase.auth.signUp>>["data"],
) => {
  const identities = data.user?.identities;

  return Array.isArray(identities) && identities.length === 0;
};

export class AuthFlowError extends Error {
  code: AuthFlowErrorCode;

  constructor(code: AuthFlowErrorCode, message = authErrorMessages[code]) {
    super(message);
    this.name = "AuthFlowError";
    this.code = code;
  }
}

export const getAuthErrorMessage = (error: unknown) => {
  if (error instanceof AuthFlowError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return authErrorMessages[AUTH_ERROR.UNKNOWN_AUTH_ERROR];
};

export const isInvalidLoginCredentialsError = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const message =
    "message" in error && typeof error.message === "string" ? error.message.toLowerCase() : "";

  return message.includes("invalid login credentials") || message.includes("invalid credentials");
};

export const isAlreadyRegisteredAuthError = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const message =
    "message" in error && typeof error.message === "string" ? error.message.toLowerCase() : "";

  const status = "status" in error ? error.status : undefined;

  return (
    status === 422 || message.includes("already registered") || message.includes("already exists")
  );
};
