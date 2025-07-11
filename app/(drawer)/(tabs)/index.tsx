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
import { useRouter } from "expo-router";
import Card from "@/components/Card";
import { useEffect, useState } from "react";
import { useTodo } from "@/context/context";
import { useTodoListData } from "@/context/todoListContext";
import { format } from "date-fns";
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
import { task, Ttheme, todo, UserData } from "@/types/dataType";
import { CONVERT_DAYS } from "./Tasks";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT * 0.4;
const SNAP_THRESHOLD = -SCREEN_HEIGHT * 0.3;

export function filterTasksForToday(tasks: task[], today = new Date()) {
  const todayDay = today
    .toLocaleString("en-US", { weekday: "long" })
    .toLowerCase();

  const dueDateTask = tasks.filter(
    (t) =>
      t.taskType === "scheduled" &&
      t.dueDate?.enabled &&
      format(t.dueDate.date, "MM/dd/yyyy") === format(today, "MM/dd/yyyy")
  );
  const repeatTask = tasks.filter(
    (t) =>
      t.taskType === "scheduled" &&
      !t.dueDate?.enabled &&
      t.repeat?.includes(CONVERT_DAYS[todayDay])
  );
  const simpleTask = tasks.filter((t) => t.taskType === "simple");

  return [...dueDateTask, ...repeatTask, ...simpleTask];
}

export default function HomeScreen() {
  const { setData } = useTodo();
  const { dispatch, userData } = useTodoListData();
  const { theme, colorScheme } = useThemeContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTodoId, setDeleteTodoId] = useState<string>("");
  const router = useRouter();
  const Container = Platform.OS === "web" ? ScrollView : Animated.View;
  const styles = createStyles(theme, colorScheme);
  const [isExpand, setIsExpand] = useState(false);
  const translateY = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

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

  const todoList = userData.todos;

  useEffect(() => {
    async function fetchData() {
      try {
        const json = await AsyncStorage.getItem("userData");
        const data: UserData = json != null ? JSON.parse(json) : null;
        // console.log(json)
        if (data) {
          dispatch({ type: "SET_DATA", payload: data });
        } else {
          dispatch({ type: "SET_DATA", payload: boilerData });
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
  }, [todoList]);

  function onPressed(item: todo) {
    setData(item);
    router.navigate("/TodoScreen");
  }

  function filterTasksForThisMonth(tasks: task[], today = new Date()) {
    const dueDateTask = tasks.filter(
      (t) =>
        t.taskType === "scheduled" &&
        t.dueDate?.enabled &&
        format(t.dueDate.date, "MM/yyyy") === format(today, "MM/yyyy")
    );
    const repeatTask = tasks.filter(
      (t) => t.taskType === "scheduled" && !t.dueDate?.enabled
    );
    const simpleTask = tasks.filter((t) => t.taskType === "simple");

    return [...dueDateTask, ...repeatTask, ...simpleTask];
  }

  const todayTasks = filterTasksForToday(userData.tasks).length;
  const monthTasks = filterTasksForThisMonth(userData.tasks).length;
  const completedTasks = userData.tasks.filter(
    (task: task) => task.isChecked
  ).length;
  const todos = userData.todos.length;

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <View style={styles.cardContainer}>
        <View style={styles.todaysCard}>
          <Text style={styles.todaysCardTitle}>Todays's Tasks</Text>
          <Text style={styles.cardCount}>
            {completedTasks} / {todayTasks}
          </Text>
          <Text style={styles.todaysCardText}>Completed</Text>
        </View>
        <View style={styles.colCardContainer}>
          <View style={styles.monthCard}>
            <Text style={styles.cardTitle}>This Month</Text>
            <View style={styles.cardCountContainer}>
              <Text style={styles.cardCount}>{monthTasks}</Text>
              <Text style={styles.cardCountLabel}>Tasks</Text>
            </View>
          </View>
          <View style={styles.todosCard}>
            <Text style={styles.cardTitle}>Todo's</Text>
            <Text style={styles.cardCount}>{todos}</Text>
          </View>
        </View>
      </View>

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
          ListEmptyComponent={
            <View
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Text
                style={{
                  color: theme.listInfo,
                  textAlign: "center",
                  fontSize: 20,
                }}
              >
                Create Todo
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable onPress={() => onPressed(item)}>
              <Card
                styleProps={theme}
                item={item}
                setDeleteTodoId={setDeleteTodoId}
                setShowDeleteModal={setShowDeleteModal}
                showDeleteModal={showDeleteModal}
              />
            </Pressable>
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
            setDispatch={{ type: "DELETE_TODO", payload: deleteTodoId }}
            setShowDeleteModal={setShowDeleteModal}
            showDeleteModal={showDeleteModal}
          />
        </Modal>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

function createStyles(theme: Ttheme, colorScheme: string | null | undefined) {
  return StyleSheet.create({
    mainContainer: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.background,
    },
    cardContainer: {
      height: "35%",
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 10,
    },
    todaysCard: {
      backgroundColor: "#D2CCF2",
      paddingHorizontal: 10,
      paddingVertical: 20,
      borderRadius: 10,
      width: "49%",
      justifyContent: "space-between",
      alignItems: "center",
    },
    todaysCardTitle: {
      fontFamily: theme.fontFamily,
      lineHeight: 40,
      fontSize: theme.fontSizeEX,
      fontWeight: "semibold",
      color: theme.fontColor.primary,
    },
    cardCount: {
      textAlign: "center",
      fontSize: theme.fontSizeNumber,
      letterSpacing: -5,
      fontFamily: theme.fontFamily,
      fontWeight: "bold",
      color: theme.pallete.light,
    },
    todaysCardText: {
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeML,
      fontWeight: "semibold",
      color: theme.pallete.lightGray,
    },
    colCardContainer: {
      width: "49%",
      justifyContent: "space-between",
    },
    monthCard: {
      backgroundColor: "#F5E29E",
      padding: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      width: "100%",
      height: "49%",
      justifyContent: "space-between",
    },
    todosCard: {
      backgroundColor: "#A9E8E8",
      paddingHorizontal: 20,
      padding: 10,
      borderRadius: 10,
      width: "100%",
      height: "49%",
      justifyContent: "space-between",
    },
    cardTitle: {
      fontFamily: theme.fontFamily,
      fontSize: theme.fonstSizeTitle,
      fontWeight: "semibold",
      color: theme.fontColor.primary,
    },
    contentContainer: {
      gap: 10,
      height: "auto",
      minHeight: "100%",
      paddingBottom: 120,
    },
    cardCountContainer: {
      width: "100%",
      justifyContent: "center",
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 10,
    },
    cardCountLabel: {
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeM,
      color: theme.pallete.lightGray,
      paddingBottom: 7,
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
