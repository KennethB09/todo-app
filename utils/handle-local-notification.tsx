import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { addMinutes, format } from "date-fns";
import { day } from "@/types/dataType";

export const schedulePushNotification = async (
  isDueDateEnabled: boolean,
  dueDate: Date,
  isReminderEnabled: boolean,
  reminderOffset: number,
  name: string,
  repeat: day[],
  isCompletionTimeEnabled: boolean,
  completionTimeStart: Date
) => {
  const reminderTime = addMinutes(new Date(dueDate), -reminderOffset);

  const reminderFormatted = format(dueDate, "hh:mm a");
  if (isDueDateEnabled) {
    await Notifications.scheduleNotificationAsync({
      identifier: "review",
      content: {
        title: "Reminder!",
        body: `Your task ${name} is due soon at ${reminderFormatted}!`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: isReminderEnabled ? reminderTime : new Date(dueDate),
      },
    });
  } else {
    for (const weekday of repeat) {
      let hour = 8;
      let minute = 0;

      if (isCompletionTimeEnabled && completionTimeStart) {
        const reminderDate = isReminderEnabled
          ? addMinutes(new Date(completionTimeStart), -reminderOffset)
          : new Date(completionTimeStart);
        hour = reminderDate.getHours();
        minute = reminderDate.getMinutes();
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Repeating Task Reminder!",
          body: `Task ${name} is scheduled today!`,
          sound: true
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour,
          minute
        },
      });
    }
  }
};

export const registerForPushNotificationsAsync = async () => {
  let token: string = "";

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FFAABBCC",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
};
