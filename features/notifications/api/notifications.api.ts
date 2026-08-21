import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";

export type PushNotificationRegistrationPayload = {
  expoPushToken: string | null;
  permissionStatus: string;
};

export type ChildPushNotificationRegistrationPayload = PushNotificationRegistrationPayload & {
  childId: string;
  loginCode: string;
};

export type TaskReviewNotificationPayload = {
  childId: string;
  loginCode: string;
  taskId: string;
};

export type ChildTaskApprovedNotificationPayload = {
  taskId: string;
};

export type RewardRequestNotificationPayload = {
  childId: string;
  loginCode: string;
  rewardId: string;
};

export type ChildRewardGivenNotificationPayload = {
  rewardId: string;
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

  saveChildPushRegistration: async (payload: ChildPushNotificationRegistrationPayload) => {
    const { data, error } = await supabase
      .rpc("register_child_push_token", {
        input_child_id: payload.childId,
        input_expo_push_token: payload.expoPushToken,
        input_login_code: payload.loginCode,
        input_permission_status: payload.permissionStatus,
      })
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

  sendChildTaskApprovedNotification: async (payload: ChildTaskApprovedNotificationPayload) => {
    const { data, error } = await supabase.functions.invoke("notify-child-task-approved", {
      body: payload,
    });

    if (error) throw error;

    console.log("Child task approved notification result:", data);

    return data;
  },

  sendRewardRequestNotification: async (payload: RewardRequestNotificationPayload) => {
    const { data, error } = await supabase.functions.invoke("notify-child-reward-redeemed", {
      body: payload,
    });

    if (error) throw error;

    console.log("Reward request notification result:", data);

    return data;
  },

  sendChildRewardGivenNotification: async (payload: ChildRewardGivenNotificationPayload) => {
    const { data, error } = await supabase.functions.invoke("notify-child-reward-given", {
      body: payload,
    });

    if (error) throw error;

    console.log("Child reward given notification result:", data);

    return data;
  },
};
