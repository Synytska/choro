import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { useProfile } from "@/features/auth/hooks/useProfile";
import {
  observeNotificationResponses,
  registerForPushNotifications,
} from "@/lib/notifications/pushNotifications";
import {
  selectAuthUserId,
  selectAuthUserLoginCode,
  selectAuthUserRole,
} from "@/store/features/auth/selectors";
import { useAppSelector } from "@/store/hooks";

import { notificationsApi } from "../api/notifications.api";

export function useNotificationObserver() {
  useEffect(() => observeNotificationResponses(), []);
}

export function usePushNotificationRegistration() {
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const childId = useAppSelector(selectAuthUserId);
  const loginCode = useAppSelector(selectAuthUserLoginCode);
  const authRole = useAppSelector(selectAuthUserRole);
  const registrationKeyRef = useRef<string | null>(null);
  const isKidSession = authRole === "kid" && Boolean(childId && loginCode);

  useEffect(() => {
    if (!profile && !isKidSession) return;

    const wantsNotifications =
      profile && !isKidSession
        ? (profile.child_notifications_enabled ?? true) ||
          (profile.parent_notifications_enabled ?? true)
        : true;

    if (!wantsNotifications) {
      registrationKeyRef.current = null;
      return;
    }

    const registrationKey =
      profile && !isKidSession
        ? `parent:${profile.id}:${wantsNotifications}`
        : `kid:${childId}:${loginCode}`;

    if (registrationKeyRef.current === registrationKey) {
      return;
    }

    registrationKeyRef.current = registrationKey;

    const syncPushToken = async () => {
      try {
        const registration = await registerForPushNotifications();

        if (profile && !isKidSession) {
          const updatedProfile = await notificationsApi.savePushRegistration(registration);

          queryClient.setQueryData(["profile"], updatedProfile);
          return;
        }

        if (childId && loginCode) {
          await notificationsApi.saveChildPushRegistration({
            ...registration,
            childId,
            loginCode,
          });
        }
      } catch (error) {
        registrationKeyRef.current = null;
        console.log("Push notification registration error:", error);
      }
    };

    syncPushToken();
  }, [childId, isKidSession, loginCode, profile, queryClient]);
}
