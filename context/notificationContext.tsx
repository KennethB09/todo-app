import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import { useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/utils/handle-local-notification";

interface ILocalNotificationHook {
  expoPushToken: string | undefined;
  notification: Notifications.Notification;
}

export const useLocalNotification = (): ILocalNotificationHook => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(
    {} as Notifications.Notification
  );
  const notificationListener = useRef<Notifications.EventSubscription | undefined>();
  const responseListener = useRef<Notifications.EventSubscription | undefined>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token || "");
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        setNotification(response.notification);
      });

    return () => {
      if (notificationListener.current?.remove) {
        notificationListener.current.remove();
      }
      if (responseListener.current?.remove) {
        responseListener.current.remove();
      }
    };
  }, []);

  return { expoPushToken, notification };
};

export async function toggleNotificationPermission(value: boolean) {
  const { status } = await Notifications.getPermissionsAsync();
  
  if (value) {   
    if (status !== "granted") {
      useLocalNotification()
    };
    await AsyncStorage.setItem('notificationsEnabled', 'true');
  } else {
    await AsyncStorage.setItem('notificationsEnabled', 'false');
    await Notifications.cancelAllScheduledNotificationsAsync();
    Alert.alert(
          'Notification Permission',
          'Enable notifications to recieve reminders.',
          [{ text: 'OK' }]
        );
  }
}