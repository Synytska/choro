import {
  AuthFlowError,
  isAlreadyRegisteredAuthError,
  isExistingSupabaseIdentity,
  isInvalidLoginCredentialsError,
} from "@/features/auth/auth.errors";
import { AUTH_ERROR } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

const getProfileByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

const createProfile = async (userId?: string, email?: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      email,
      role: "parent",
      onboarding_completed: false,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const authService = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (isInvalidLoginCredentialsError(error)) {
        throw new AuthFlowError(AUTH_ERROR.INVALID_LOGIN_CREDENTIALS);
      }

      throw error;
    }

    if (!data.user) {
      throw new AuthFlowError(AUTH_ERROR.PROFILE_NOT_FOUND);
    }

    const profile = await getProfileByUserId(data.user.id);

    if (!profile) {
      await supabase.auth.signOut();
      throw new AuthFlowError(AUTH_ERROR.PROFILE_NOT_FOUND);
    }

    return {
      ...data,
      profile,
    };
  },

  signup: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (
      isAlreadyRegisteredAuthError(error) ||
      isExistingSupabaseIdentity(data)
    ) {
      throw new AuthFlowError(AUTH_ERROR.ACCOUNT_ALREADY_EXISTS);
    }

    if (error) {
      throw error;
    }

    const profile = await createProfile(data?.user?.id, email);

    return {
      ...data,
      profile,
    };
  },

  logout: () => supabase.auth.signOut(),
};
