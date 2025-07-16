import { View } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { notification } from "@/types/dataType";
import { useTodoListStore } from "@/context/zustand";
import NotificationItem from "@/components/NotificationItem";
import GestureWrapper from "@/components/GestureWrapper";
import Animated, { LinearTransition } from "react-native-reanimated";

export default function Notifications() {
 const notifications = useTodoListStore((state) => state.userData.notifications);
 const setNotifications = useTodoListStore((state) => state.setNotifications);
 const deleteNotification = useTodoListStore((state) => state.deleteNotification);

  useEffect(() => {
    async function checkNotifications() {
      try {
        const json = await AsyncStorage.getItem("notificationHistory");
        const data: notification[] = json != null ? JSON.parse(json) : null;
        if (data) {
          setNotifications(data)
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
    checkNotifications();
  }, []);

  async function saveNotification() {
    await AsyncStorage.setItem(
      "notificationHistory",
      JSON.stringify(notifications)
    );
  }
  
  function handleDelete(id: string) {
    deleteNotification(id)
    saveNotification();
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
