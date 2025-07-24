import { Tabs, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { pastelBg } from "@/constants/theme";
import { useThemeContext } from "@/context/ThemeContext";
import { StyleSheet, View } from "react-native";
import { todo } from "@/types/dataType";
import { useTodoListStore } from "@/context/zustand";
import uuid from 'react-native-uuid';
import * as NavigationBar from 'expo-navigation-bar';

export default function TabLayout() {
  const { colorTheme, theme } = useThemeContext();
  const router = useRouter();
  const createNewTodo = useTodoListStore((state) => state.createTodo);
  NavigationBar.setBackgroundColorAsync(theme.background);
  
  function generateRandomId() {
    return uuid.v4();
  }

  function createTodo() {
    const randomBg = Math.floor(Math.random() * pastelBg.length);
    const newId = generateRandomId();
    const newTodo: todo = {
      id: newId,
      title: "New Todo",
      bg: pastelBg[randomBg],
    };

    createNewTodo(newTodo)
    router.push({ pathname: "/[id]", params: { id: newTodo.id, bg: newTodo.bg } });
  }

  return (
    <Tabs
      screenOptions={{
        lazy: false,
        freezeOnBlur: true,
        popToTopOnBlur: true,
        tabBarActiveTintColor: colorTheme,
        headerShown: true,
        tabBarStyle: {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          paddingTop: 15,
          height: 80,
          backgroundColor: theme.background,
          borderTopWidth: 0,
          shadowColor: "black",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 8,
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          lazy: true,
          freezeOnBlur: true,
          headerShown: true,
          title: "Home",
          headerTitleStyle: {
            color: colorTheme,
            fontSize: theme.fontSizeL,
            fontWeight: "regular",
            fontFamily: theme.fontFamily,
          },
          headerStyle: {
            shadowColor: "transparent",
            backgroundColor: theme.background,
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" color={color} size={28} />
          ),
          sceneStyle: { backgroundColor: theme.background },
        }}
      />
      <Tabs.Screen
        name="Tasks"
        options={{
          lazy: true,
          headerShown: true,
          title: "Tasks",
          headerTitleStyle: {
            color: colorTheme,
            fontSize: theme.fontSizeL,
            fontWeight: "regular",
            fontFamily: theme.fontFamily,
          },
          headerStyle: {
            shadowColor: "transparent",
            backgroundColor: theme.background,
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="list" color={color} size={28} />
          ),
          sceneStyle: { backgroundColor: theme.background },
        }}
      />
      <Tabs.Screen
        name="AddTodo"
        options={{
          title: "",
          tabBarIcon: () => null,
          tabBarButton: (props) => (
            <CustomPlusButton
              onPress={() => {
                createTodo();
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Schedule"
        options={{
          headerShown: true,
          title: "Schedule",
          headerTitleStyle: {
            color: colorTheme,
            fontSize: theme.fontSizeL,
            fontWeight: "regular",
            fontFamily: theme.fontFamily,
          },
          headerStyle: {
            shadowColor: "transparent",
            backgroundColor: theme.background,
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" color={color} size={28} />
          ),
          sceneStyle: { backgroundColor: theme.background },
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          headerShown: true,
          title: "Settings",
          headerTitleStyle: {
            color: colorTheme,
            fontSize: theme.fontSizeL,
            fontWeight: "regular",
            fontFamily: theme.fontFamily,
          },
          headerStyle: {
            shadowColor: "transparent",
            backgroundColor: theme.background,
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" color={color} size={28} />
          ),
          sceneStyle: { backgroundColor: theme.background },
        }}
      />
    </Tabs>
  );
}

const CustomPlusButton = ({ onPress }: any) => {
  const { colorTheme } = useThemeContext();
  return (
    <View style={styles.plusButtonContainer}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.plusButton,
          {
            backgroundColor: colorTheme,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
      >
        <Ionicons name="add" size={45} color="white" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  plusButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    top: -45,
  },
  plusButton: {
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
