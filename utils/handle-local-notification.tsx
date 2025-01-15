import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { addMinutes, format } from "date-fns";

const TWO_WEEKS = 60 * 60 * 24 * 14;

export const schedulePushNotification = async (dueDate: Date, reminderOffset: number, name: string) => {

    // Calculate the reminder time by subtracting minutes from the due date
    const reminderTime = addMinutes(new Date(dueDate), -reminderOffset);
    // console.log(format(reminderTime, 'MM:dd:yyyy:hh:mm a'))
    // Format the reminder time (optional)
    const reminderFormatted = format(dueDate, 'hh:mm a');

    await Notifications.scheduleNotificationAsync({
        identifier: "review",
        content: {
            title: "Reminder!",
            body: `Your task ${name} is due soon at ${reminderFormatted}!`,
            sound: true,

        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: reminderTime
        },
    });
};

export const registerForPushNotificationsAsync = async () => {
    let token: string = "";

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FFAABBCC"
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