import {
  Text,
  View,
  StyleSheet,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Pressable,
  Modal,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";
import Card from "@/components/Card";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeContext } from "@/context/ThemeContext";
import Animated, {
  LinearTransition,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import DeleteModal from "@/components/DeleteModal";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import { Ttheme, UserData } from "@/types/dataType";
import * as Notifications from "expo-notifications";
import {
  storeNotificationData,
  checkForMissedNotifications,
} from "@/utils/storeNotificationData";
import { AppState, AppStateStatus } from "react-native";
import GestureWrapper from "@/components/GestureWrapper";
import { useTodoListStore } from "@/context/zustand";
import HomeCards from "@/components/HomeCards";
import EmptyList from "@/components/EmptyList";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT * 0.4;
const SNAP_THRESHOLD = -SCREEN_HEIGHT * 0.3;

export default function HomeScreen() {
  const Container = Platform.OS === "web" ? ScrollView : Animated.View;

  const { theme, colorScheme } = useThemeContext();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTodoId, setDeleteTodoId] = useState<string>("");
  const [isExpand, setIsExpand] = useState(false);

  const translateY = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const setData = useTodoListStore((state) => state.setData);
  const deleteTodo = useTodoListStore((state) => state.deleteTodo);
  const todoList = useTodoListStore((state) => state.userData.todos);
  const userData = useTodoListStore((state) => state.userData);
  const styles = createStyles(theme);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      prevTranslationY.value = translateY.value;
    })
    .onUpdate((event) => {
      if (prevTranslationY.value < SNAP_THRESHOLD) {
        translateY.value = prevTranslationY.value + event.translationY;
      } else {
        if (event.translationY > 0) {
          translateY.value = 0;
        } else {
          const newY = event.translationY;
          translateY.value = Math.max(MAX_TRANSLATE_Y, newY);
        }
      }
    })
    .onEnd(() => {
      if (translateY.value < SNAP_THRESHOLD) {
        // Snap to full screen
        translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 20 });
        runOnJS(setIsExpand)(true);
      } else {
        // Return to original position
        translateY.value = withSpring(0, { damping: 20 });
        runOnJS(setIsExpand)(false);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  function handleSeeAllPress() {
    if (translateY.value === MAX_TRANSLATE_Y) {
      translateY.value = withSpring(0, { damping: 20 });
      setIsExpand(false);
    } else {
      translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 20 });
      setIsExpand(true);
    }
  }

  // Boilerplate data to use if no data is found in AsyncStorage
  const boilerData: UserData = {
    todos: [],
    tasks: [],
    notifications: [],
  };

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // This works when app is in foreground
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        storeNotificationData(notification, "received_foreground");
      }
    );

    // This works even when app was closed and user taps notification
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        storeNotificationData(response.notification, "user_interaction");
      });

    // Check for notifications when app becomes active
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        checkForMissedNotifications();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      notificationListener &&
        Notifications.removeNotificationSubscription(notificationListener);
      responseListener &&
        Notifications.removeNotificationSubscription(responseListener);
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const json = await AsyncStorage.getItem("userData");
        const data: UserData = json != null ? JSON.parse(json) : null;
        if (data) {
          setData({
            todos: data.todos,
            tasks: data.tasks,
            notifications: [],
          });
        } else {
          setData({
            todos: boilerData.todos,
            tasks: boilerData.tasks,
            notifications: boilerData.notifications,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function saveData() {
      try {
        const json = JSON.stringify(userData);
        await AsyncStorage.setItem("userData", json);
      } catch (error) {
        console.error(error);
      }
    }
    saveData();
  }, [todoList, userData]);

  function onDelete(id: string) {
    setDeleteTodoId(id);
    setShowDeleteModal(!showDeleteModal);
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <HomeCards />

      <Container
        style={[
          animatedStyle,
          {
            backgroundColor: theme.background,
            zIndex: 10,
            height: isExpand ? "100%" : "75%",
          },
        ]}
      >
        <GestureDetector gesture={panGesture}>
          <View style={styles.todosListHeader}>
            <Text style={styles.todosListHeaderTitle}>Todo's</Text>
            <Pressable onPress={handleSeeAllPress}>
              <Text style={styles.todosHeaderBtn}>
                {isExpand ? "Collapse" : "See All"}
              </Text>
            </Pressable>
          </View>
        </GestureDetector>
        <Animated.FlatList
          contentContainerStyle={styles.contentContainer}
          data={todoList}
          itemLayoutAnimation={LinearTransition}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<EmptyList text="Create Todo" />}
          renderItem={({ item }) => (
            <GestureWrapper onGesureEnd={() => onDelete(item.id)} iconSize={30}>
              <Link
                href={{
                  pathname: "/[id]",
                  params: { id: item.id, bg: item.bg },
                }}
              >
                <Card item={item} />
              </Link>
            </GestureWrapper>
          )}
        />
      </Container>

      <GestureHandlerRootView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(!showDeleteModal)}
        >
          <DeleteModal
            title="DELETE TODO"
            paragraph="Are you sure you want to delete this todo?"
            setDispatch={() => deleteTodo(deleteTodoId)}
            setShowDeleteModal={setShowDeleteModal}
            showDeleteModal={showDeleteModal}
          />
        </Modal>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

function createStyles(theme: Ttheme) {
  return StyleSheet.create({
    mainContainer: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.background,
    },
    contentContainer: {
      gap: 10,
      height: "auto",
      minHeight: "100%",
      paddingBottom: 120,
    },
    todosListHeader: {
      width: "100%",
      height: 70,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 15,
      marginVertical: 10,
    },
    todosListHeaderTitle: {
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeL,
      color: theme.fontColor.primary,
      fontWeight: "semibold",
    },
    todosHeaderBtn: {
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeM,
      color: theme.pallete.lightGray,
    },
    addButton: {
      borderRadius: 100,
      backgroundColor: theme.pink,
      padding: 5,
      position: "absolute",
      bottom: 0,
      right: 0,
      marginRight: 20,
      marginBottom: 70,
    },
  });
}
