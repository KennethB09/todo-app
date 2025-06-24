import { Tabs, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { pastelBg } from "@/constants/theme";
import { useThemeContext } from "@/context/ThemeContext";
import { useTodoListData } from "@/context/todoListContext";
import { useTodo } from "@/context/context";
import { StyleSheet, View } from "react-native";
import { todo } from "@/types/dataType";

export default function TabLayout() {
  const { colorTheme, theme, colorScheme } = useThemeContext();
  const { dispatch } = useTodoListData();
  const { setData } = useTodo();
  const navigation = useNavigation();
  const router = useRouter();

  function generateRandomId(length = 16) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomId = "";
    for (let i = 0; i < length; i++) {
      randomId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return randomId;
  }

  function createTodo() {
    const randomBg = Math.floor(Math.random() * pastelBg.length);
    const newId = generateRandomId(12);
    const newTodo: todo = {
      id: newId,
      title: "New Todo",
      bg: pastelBg[randomBg],
    };

    dispatch({ type: "CREATE_TODO", payload: newTodo });
    setData(newTodo);
    router.push("/TodoScreen");
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorTheme,
        headerShown: true,
        headerRight: () => {
          return (
            <Pressable
              onPress={() => {
                // Dispatch drawer toggle action to parent drawer
                navigation.dispatch(DrawerActions.toggleDrawer());
              }}
              style={{ marginRight: 15 }}
            >
              <Ionicons
                name="menu"
                color={
                  colorScheme === "dark"
                    ? theme.pallete.light
                    : theme.pallete.gray
                }
                size={40}
              />
            </Pressable>
          );
        },
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
          animation: "shift"
        }}
      />
      <Tabs.Screen
        name="Tasks"
        options={{
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
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="list" color={color} size={28} />
          ),
          animation: "shift"
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
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" color={color} size={28} />
          ),
          animation: "shift"
        }}
      />
      <Tabs.Screen
        name="Notifications"
        options={{
          headerShown: true,
          title: "Notifications",
          headerTitleStyle: {
            color: colorTheme,
            fontSize: theme.fontSizeL,
            fontWeight: "regular",
            fontFamily: theme.fontFamily,
          },
          headerStyle: {
            shadowColor: "transparent",
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-outline" color={color} size={28} />
          ),
          animation: "shift"
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
