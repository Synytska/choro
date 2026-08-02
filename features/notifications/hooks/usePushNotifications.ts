import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { useProfile } from "@/features/auth/hooks/useProfile";
import {
  observeNotificationResponses,
  registerForPushNotifications,
} from "@/lib/notifications/pushNotifications";

import { notificationsApi } from "../api/notifications.api";

export function useNotificationObserver() {
  useEffect(() => observeNotificationResponses(), []);
}

export function usePushNotificationRegistration() {
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const registrationKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!profile) return;

    const wantsNotifications =
      (profile.child_notifications_enabled ?? true) ||
      (profile.parent_notifications_enabled ?? true);

    if (!wantsNotifications) {
      registrationKeyRef.current = null;
      return;
    }

    const registrationKey = `${profile.id}:${wantsNotifications}`;

    if (registrationKeyRef.current === registrationKey) {
      return;
    }

    registrationKeyRef.current = registrationKey;

    const syncPushToken = async () => {
      try {
        const registration = await registerForPushNotifications();
        const updatedProfile = await notificationsApi.savePushRegistration(registration);

        queryClient.setQueryData(["profile"], updatedProfile);
      } catch (error) {
        registrationKeyRef.current = null;
        console.log("Push notification registration error:", error);
      }
    };

    syncPushToken();
  }, [profile, queryClient]);
}
