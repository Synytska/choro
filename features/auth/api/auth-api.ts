import {
  AuthFlowError,
  isAlreadyRegisteredAuthError,
  isExistingSupabaseIdentity,
  isInvalidLoginCredentialsError,
} from "@/features/auth/auth.errors";
import i18n from "@/i18n";
import { AUTH_ERROR } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { normalizeLanguage } from "@/lib/utils/utils";

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

const createProfile = async (userId?: string, email?: string, name?: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      email,
      name,
      role: "parent",
      onboarding_completed: false,
      language: normalizeLanguage(i18n.language),
      child_notifications_enabled: true,
      parent_notifications_enabled: true,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const authService = {
  getCurrentSession: async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;
    if (!session?.user) return null;

    const profile = await getProfileByUserId(session.user.id);

    if (!profile) {
      await supabase.auth.signOut();
      return null;
    }

    return {
      session,
      user: session.user,
      profile,
    };
  },

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

  signup: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (isAlreadyRegisteredAuthError(error) || isExistingSupabaseIdentity(data)) {
      throw new AuthFlowError(AUTH_ERROR.ACCOUNT_ALREADY_EXISTS);
    }

    if (error) {
      throw error;
    }

    const profile = await createProfile(data?.user?.id, email, name);

    return {
      ...data,
      profile,
    };
  },

  logout: () => supabase.auth.signOut(),
};
