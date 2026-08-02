import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";

export type PushNotificationRegistrationPayload = {
  expoPushToken: string | null;
  permissionStatus: string;
};

export type TaskReviewNotificationPayload = {
  childId: string;
  loginCode: string;
  taskId: string;
};

export const notificationsApi = {
  savePushRegistration: async (payload: PushNotificationRegistrationPayload) => {
    const user = await getRequiredCurrentUser();

    const { data, error } = await supabase
      .from("profiles")
      .update({
        expo_push_token: payload.expoPushToken,
        notifications_permission_status: payload.permissionStatus,
        push_token_updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  sendTaskReviewNotification: async (payload: TaskReviewNotificationPayload) => {
    const { data, error } = await supabase.functions.invoke("notify-parent-task-review", {
      body: payload,
    });

    if (error) throw error;

    return data;
  },
};
