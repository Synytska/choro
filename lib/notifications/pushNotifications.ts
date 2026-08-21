import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { type Href, router } from "expo-router";
import { Platform } from "react-native";

export const NOTIFICATION_CHANNEL_ID = "choro-default";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const getProjectId = () =>
  Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

const setupAndroidNotificationChannel = async () => {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
    name: "Choro notifications",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF6B00",
  });
};

const getPermissionStatus = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === "granted") {
    return existingStatus;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status;
};

export const registerForPushNotifications = async () => {
  if (Platform.OS === "web") {
    return {
      expoPushToken: null,
      permissionStatus: "unsupported",
    };
  }

  await setupAndroidNotificationChannel();

  const permissionStatus = await getPermissionStatus();

  if (permissionStatus !== "granted") {
    return {
      expoPushToken: null,
      permissionStatus,
    };
  }

  const projectId = getProjectId();

  if (!projectId) {
    return {
      expoPushToken: null,
      permissionStatus: "missing-project-id",
    };
  }

  const { data } = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return {
    expoPushToken: data,
    permissionStatus,
  };
};

export const observeNotificationResponses = () => {
  const redirect = (notification: Notifications.Notification) => {
    const url = notification.request.content.data?.url;

    if (typeof url === "string" && url.length > 0) {
      router.push(url as Href);
    }
  };

  const lastResponse = Notifications.getLastNotificationResponse();

  if (lastResponse?.notification) {
    redirect(lastResponse.notification);
  }

  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    redirect(response.notification);
  });

  return () => subscription.remove();
};
