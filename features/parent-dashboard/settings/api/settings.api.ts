import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";
import { AppLanguage } from "@/lib/types";

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const settingsApi = {
  updateLanguage: async (language: AppLanguage) => {
    const user = await getRequiredCurrentUser();

    const { data, error } = await supabase
      .from("profiles")
      .update({ language })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const user = await getRequiredCurrentUser();
    const email = user.email;

    if (!email) {
      throw new Error("User email not found");
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: payload.currentPassword,
    });

    if (signInError) {
      throw new Error("Current password is incorrect");
    }

    const { data, error } = await supabase.auth.updateUser({
      password: payload.newPassword,
    });

    if (error) throw error;

    return data;
  },
};
