import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const settingsApi = {
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
