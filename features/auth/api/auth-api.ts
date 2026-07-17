import AsyncStorage from "@react-native-async-storage/async-storage";

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

const CHILD_LOGIN_RPC = "get_child_by_login_code";
const KID_SESSION_STORAGE_KEY = "@choro/kid-session";

type ChildLoginRow = {
  id: string;
  name: string | null;
  login_code: string | null;
  avatar_id: string | null;
  avatar_url: string | null;
};

type KidSession = {
  accessToken: string;
  profile: {
    id: string;
    email: string;
    name: string;
    role: "kid";
    avatarId: string | null;
    avatarUrl: string | null;
    loginCode: string;
  };
};

const isKidSession = (value: unknown): value is KidSession => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const session = value as Partial<KidSession>;
  const profile = session.profile;

  return (
    typeof session.accessToken === "string" &&
    !!profile &&
    typeof profile === "object" &&
    typeof profile.id === "string" &&
    typeof profile.name === "string" &&
    profile.role === "kid" &&
    typeof profile.loginCode === "string"
  );
};

const saveKidSession = async (session: KidSession) => {
  await AsyncStorage.setItem(KID_SESSION_STORAGE_KEY, JSON.stringify(session));
};

const getStoredKidSession = async () => {
  const storedSession = await AsyncStorage.getItem(KID_SESSION_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(storedSession);

    if (isKidSession(parsedSession)) {
      return parsedSession;
    }
  } catch {
    // Ignore malformed local auth data and clear it below.
  }

  await AsyncStorage.removeItem(KID_SESSION_STORAGE_KEY);
  return null;
};

const clearKidSession = () => AsyncStorage.removeItem(KID_SESSION_STORAGE_KEY);

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

const getChildByLoginCode = async (loginCode: string) => {
  const { data, error } = await supabase
    .rpc(CHILD_LOGIN_RPC, {
      input_login_code: loginCode,
    })
    .maybeSingle();

  if (error) throw error;

  return data as ChildLoginRow | null;
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
      avatar_url: null,
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
    if (!session?.user) {
      const kidSession = await getStoredKidSession();

      return kidSession
        ? {
            kind: "kid" as const,
            ...kidSession,
          }
        : null;
    }

    const profile = await getProfileByUserId(session.user.id);

    if (!profile) {
      await supabase.auth.signOut();
      return null;
    }

    return {
      kind: "parent" as const,
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

    await clearKidSession();

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

  kidLogin: async (loginCode: string) => {
    const normalizedCode = loginCode.trim().toUpperCase();
    const child = await getChildByLoginCode(normalizedCode);

    if (!child) {
      throw new AuthFlowError(AUTH_ERROR.INVALID_LOGIN_CREDENTIALS);
    }

    const kidSession = {
      accessToken: `kid-${child.id}`,
      profile: {
        id: child.id,
        email: "",
        name: child.name ?? "Kid",
        role: "kid" as const,
        avatarId: child.avatar_id ?? null,
        avatarUrl: child.avatar_url ?? null,
        loginCode: child.login_code ?? normalizedCode,
      },
    };

    await saveKidSession(kidSession);

    return kidSession;
  },

  logout: async () => {
    await clearKidSession();

    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return true;
  },
};
