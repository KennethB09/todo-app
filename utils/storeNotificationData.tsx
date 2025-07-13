import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { notification } from "@/types/dataType";

export const checkForMissedNotifications = async (): Promise<void> => {
  try {
    const deliveredNotifications =
      await Notifications.getPresentedNotificationsAsync();

    // Store any notifications that were delivered but not recorded
    for (const notification of deliveredNotifications) {
      await storeNotificationData(notification, "delivered_background");
    }
  } catch (error) {
    console.error("Error checking missed notifications:", error);
  }
};

export const storeNotificationData = async (
  notification: Notifications.Notification,
  type: string
): Promise<void> => {
  try {
    const notificationData: notification = {
      id: notification.request.identifier,
      title: notification.request.content.title || "",
      content: notification.request.content.body || "",
      timestamp: new Date(),
    };

    const json = await AsyncStorage.getItem("notificationHistory");
    let data: notification[] = [];

    if (json !== null) {
      data = JSON.parse(json);
    }

    const exists = data.some((n) => n.id === notificationData.id);

    if (!exists) {
      data.push(notificationData);
      // Store the data object, not the json string
      await AsyncStorage.setItem("notificationHistory", JSON.stringify(data));
    }
  } catch (error) {
    console.error("Error storing notification data:", error);
  }
};
