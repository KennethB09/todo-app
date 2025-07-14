import { View } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { notification } from "@/types/dataType";
import { useTodoListData } from "@/context/todoListContext";
import NotificationItem from "@/components/NotificationItem";
import GestureWrapper from "@/components/GestureWrapper";
import Animated, { LinearTransition } from "react-native-reanimated";

export default function Notifications() {
  const { userData, dispatch } = useTodoListData();
  const [notifications, setNotifications] = useState<notification[]>([]);

  useEffect(() => {
    async function checkNotifications() {
      try {
        const json = await AsyncStorage.getItem("notificationHistory");
        const data: notification[] = json != null ? JSON.parse(json) : null;
        if (data) {
          dispatch({ type: "SET_NOTIFICATIONS", payload: data });
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
    checkNotifications();
  }, []);

  useEffect(() => {
    async function saveNotification() {
      await AsyncStorage.setItem(
        "notificationHistory",
        JSON.stringify(userData.notifications)
      );
    }
    saveNotification();
    setNotifications(userData.notifications);
  }, [userData.notifications]);

  function handleDelete(id: string) {
    dispatch({ type: "DELETE_NOTIFICATION", payload: id });
  };

  return (
    <View>
      <Animated.FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode={"on-drag"}
        renderItem={({ item }) => (
          <GestureWrapper onGesureEnd={() => handleDelete(item.id)}>
            <NotificationItem notification={item} />
          </GestureWrapper>
        )}
      />
    </View>
  );
}
