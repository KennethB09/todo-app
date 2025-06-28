import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";
import Animated, { runOnJS, withTiming } from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import React from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { Ttheme, task } from "@/types/dataType";
import { Ionicons } from "@expo/vector-icons";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { format } from "date-fns";
import { useTodoListData } from "@/context/todoListContext";

type ListProps = {
  item: task;
  toggleList: (id: string) => void;
  toggleEditModal?: (task: task) => void;
  setDeleteId?: React.Dispatch<React.SetStateAction<string>>;
  setShowDeleteModal?: React.Dispatch<React.SetStateAction<boolean>>;
  enablePanGesture: boolean;
  showFromTodo: boolean;
};

export default function Task({
  item,
  toggleList,
  toggleEditModal,
  setDeleteId,
  setShowDeleteModal,
  enablePanGesture,
  showFromTodo,
}: ListProps) {
  const { theme, colorScheme } = useThemeContext();
  const styles = createStyles(theme, colorScheme);
  const { userData } = useTodoListData();

  const todo = userData.todos.filter(todo => todo.id === item.todoId);

  function onDelete(id: string) {
    if (setDeleteId && setShowDeleteModal) {
      setDeleteId(id);
      setShowDeleteModal((prev) => !prev);
    }
  }

  function formatTime(date: Date, type: "MM/dd/yyyy" | "HH:mm:ss") {
    let formattedTime: string;

    if (type === "MM/dd/yyyy") {
      formattedTime =
        date !== null || undefined ? format(date, "MM/dd/yyyy") : "";
    } else {
      formattedTime = date !== null || undefined ? format(date, "a HH:mm") : "";
    }
    return formattedTime.toLocaleUpperCase();
  }

  const translateX = useSharedValue(0);
  const translateXValid = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 0) {
        translateX.value = 0;
        translateXValid.value = 0;
      } else {
        translateX.value = event.translationX;
        translateXValid.value = event.translationX;
      }
    })
    .onEnd(() => {
      translateX.value = withTiming(0, undefined, (isFinished) => {
        if (isFinished && translateXValid.value < -80) {
          runOnJS(onDelete)(item.id);
          translateXValid.value = 0;
        }
        translateXValid.value = 0;
      });
    })
    .enabled(enablePanGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const iconContainerOpacity = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value < -80 ? 1 : 0);
    return { opacity };
  });

  function getSortedRepeatDays(repeat?: number[]): string {
    if (!repeat || repeat.length === 0) return "";

    const dayMap = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Sort and map numbers to day strings
    const sortedDays = [...repeat]
      .sort((a, b) => a - b)
      .map((num) => dayMap[num])
      .filter(Boolean);

    return sortedDays.join(", ");
  }

  return (
    <View style={{ justifyContent: "center" }}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 30,
            height: 30,
            right: 15,
            justifyContent: "center",
            alignItems: "center",
          },
          iconContainerOpacity,
        ]}
      >
        <Ionicons name="trash-outline" color={"red"} size={30} />
      </Animated.View>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              flexDirection: "row",
              gap: 10,
              backgroundColor: theme.background,
            },
            animatedStyle,
          ]}
        >
          <View style={{ paddingTop: 5 }}>
            <Checkbox
              value={item.isChecked}
              onValueChange={() => toggleList(item.id)}
              color={todo[0].bg}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.listTitle}>{item.name}</Text>
              {toggleEditModal && (
                <TouchableOpacity onPress={() => toggleEditModal(item)}>
                  <Ionicons name="create-outline" color={todo[0].bg} size={25} />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ gap: 5 }}>
              {showFromTodo && (
                <Text
                  style={{
                    fontFamily: theme.fontFamily,
                    color: theme.fontColor.secondary,
                    fontSize: theme.fontSizeS,
                    fontWeight: "regular",
                  }}
                >
                  From: {todo[0].title}
                </Text>
              )}
              {item.taskType === "scheduled" && (
                <View style={{ flexDirection: "row", gap: 30 }}>
                  <View style={{ flexDirection: "row", gap: 10, width: "35%" }}>
                    <Ionicons
                      name="calendar-outline"
                      style={{ color: todo[0].bg }}
                      size={15}
                    />
                    <Text style={styles.listInfo}>
                      {item.dueDate?.enabled
                        ? formatTime(item.dueDate.date, "MM/dd/yyyy")
                        : getSortedRepeatDays(item.repeat)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", gap: 10, width: "35%" }}>
                    <Ionicons
                      name="time-outline"
                      style={{ color: todo[0].bg }}
                      size={15}
                    />
                    <Text style={styles.listInfo}>
                      {item.completionTime?.enabled
                        ? `${formatTime(
                            item.completionTime?.start!,
                            "HH:mm:ss"
                          )} - ${formatTime(
                            item.completionTime?.end!,
                            "HH:mm:ss"
                          )}`
                        : "Not set"}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

function createStyles(theme: Ttheme, colorScheme: string | null | undefined) {
  return StyleSheet.create({
    listTitle: {
      color: theme.textColor,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeML,
    },
    listInfo: {
      color: theme.listInfo,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeS,
    },
    modalDeleteButtonText: {
      color: theme.textColor,
      fontSize: theme.fontSizeM,
      fontWeight: 500,
      fontFamily: theme.fontFamily,
    },
  });
}
