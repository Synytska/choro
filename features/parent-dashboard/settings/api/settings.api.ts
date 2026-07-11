import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";
import { AppLanguage } from "@/lib/types";

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type NotificationSettingsPayload = {
  childNotificationsEnabled?: boolean;
  parentNotificationsEnabled?: boolean;
};

export const settingsApi = {
  deleteAccount: async () => {
    const { error } = await supabase.rpc("delete_current_user_account");

    if (error) throw error;

    await supabase.auth.signOut();

    return true;
  },

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

  updateNotificationSettings: async (payload: NotificationSettingsPayload) => {
    const user = await getRequiredCurrentUser();
    const updatePayload: Record<string, boolean> = {};

    if (typeof payload.childNotificationsEnabled === "boolean") {
      updatePayload.child_notifications_enabled = payload.childNotificationsEnabled;
    }

    if (typeof payload.parentNotificationsEnabled === "boolean") {
      updatePayload.parent_notifications_enabled = payload.parentNotificationsEnabled;
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updatePayload)
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
