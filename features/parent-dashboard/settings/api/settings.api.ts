import { getFamilyIds } from "@/features/parent-dashboard/api/family";
import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";
import { uploadImageToBucket } from "@/lib/supabase-storage";
import { AppLanguage } from "@/lib/types";

const PROFILE_AVATARS_BUCKET = "profile-avatars";

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type NotificationSettingsPayload = {
  childNotificationsEnabled?: boolean;
  parentNotificationsEnabled?: boolean;
};

export type UpdateProfileSettingsPayload = {
  name?: string;
  email?: string;
  avatarUri?: string | null;
  avatarMimeType?: string | null;
};

const uploadProfileAvatar = (uri: string, userId: string, mimeType?: string | null) =>
  uploadImageToBucket({ bucket: PROFILE_AVATARS_BUCKET, uri, userId, mimeType });

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

  updateChildrenLanguage: async (language: AppLanguage) => {
    const user = await getRequiredCurrentUser();
    const familyIds = await getFamilyIds(user.id);

    if (!familyIds.length) {
      return [];
    }

    const { data, error } = await supabase
      .from("children")
      .update({ language })
      .in("family_id", familyIds)
      .select();

    if (error) throw error;

    return data ?? [];
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

  updateProfileSettings: async (payload: UpdateProfileSettingsPayload) => {
    const user = await getRequiredCurrentUser();
    const updatePayload: Record<string, string | null> = {};
    const email = payload.email?.trim();

    if (payload.name !== undefined) {
      updatePayload.name = payload.name.trim();
    }

    if (email && email !== user.email) {
      const { error: authError } = await supabase.auth.updateUser({ email });

      if (authError) throw authError;

      updatePayload.email = email;
    }

    if (payload.avatarUri) {
      updatePayload.avatar_url = await uploadProfileAvatar(
        payload.avatarUri,
        user.id,
        payload.avatarMimeType,
      );
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
