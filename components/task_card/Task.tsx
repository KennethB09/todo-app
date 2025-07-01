import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import Checkbox from "expo-checkbox";
import Animated, { runOnJS, withTiming } from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import React from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { Ttheme, task, todo } from "@/types/dataType";
import { Ionicons } from "@expo/vector-icons";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useTodoListData } from "@/context/todoListContext";
import TaskSchedule from "./TaskSchedule";

type ListProps = {
  item: task;
  toggleEditModal?: (task: task) => void;
  setDeleteId?: React.Dispatch<React.SetStateAction<string>>;
  setShowDeleteModal?: React.Dispatch<React.SetStateAction<boolean>>;
  enablePanGesture: boolean;
  showFromTodo: boolean;
  parentTodo: todo;
};

export default function Task({
  item,
  toggleEditModal,
  setDeleteId,
  setShowDeleteModal,
  enablePanGesture,
  showFromTodo,
  parentTodo,
}: ListProps) {
  const { theme } = useThemeContext();
  const { dispatch } = useTodoListData();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  function onDelete(id: string) {
    if (setDeleteId && setShowDeleteModal) {
      setDeleteId(id);
      setShowDeleteModal((prev) => !prev);
    }
  }

  function toggleList() {
    dispatch({ type: "CHECK_TASK", payload: item.id });
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
        if (isFinished && translateXValid.value <= -80) {
          runOnJS(onDelete)(item.id);
          translateXValid.value = 0;
        }
        translateXValid.value = 0;
      });
    })
    .enabled(enablePanGesture)
    .activateAfterLongPress(150);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const iconContainerOpacity = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value < -80 ? 1 : 0);
    return { opacity };
  });

  return (
    <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }, styles.mainContainer]} onPress={toggleList}>
      <Animated.View style={[styles.animatedView, iconContainerOpacity]}>
        <Ionicons name="trash-outline" color={"red"} size={25} />
      </Animated.View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <Checkbox
            value={item.isChecked}
            color={parentTodo.bg}
            style={styles.checkBox}
          />
          <View style={styles.taskInfoContainer}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskName}>{item.name}</Text>
              {toggleEditModal && (
                <TouchableOpacity onPress={() => toggleEditModal(item)}>
                  <Ionicons
                    name="create-outline"
                    color={parentTodo.bg}
                    size={25}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.taskBody}>
              {showFromTodo && (
                <Text style={styles.taskParentTodoText}>
                  From: {parentTodo.title}
                </Text>
              )}
              {item.taskType === "scheduled" && (
                <TaskSchedule
                  color={parentTodo.bg}
                  dueDate={item.dueDate?.date!}
                  dueDateEnable={item.dueDate?.enabled!}
                  completionTimeEnable={item.completionTime?.enabled!}
                  completionTimeStart={item.completionTime?.start!}
                  completionTimeEnd={item.completionTime?.end!}
                  repeat={item.repeat!}
                />
              )}
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </Pressable>
  );
}

function createStyles(theme: Ttheme) {
  return StyleSheet.create({
    mainContainer: {
      justifyContent: "center",
    },
    animatedView: {
      position: "absolute",
      width: 30,
      height: 30,
      right: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    animatedContainer: {
      flexDirection: "row",
      gap: 10,
      backgroundColor: theme.background,
    },
    checkBox: {
      paddingTop: 5,
    },
    taskHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    taskBody: {
      gap: 5,
    },
    taskParentTodoText: {
      fontFamily: theme.fontFamily,
      color: theme.fontColor.secondary,
      fontSize: theme.fontSizeS,
      fontWeight: "regular",
    },
    taskInfoContainer: {
      flex: 1,
    },
    taskName: {
      color: theme.textColor,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeML,
    },
    modalDeleteButtonText: {
      color: theme.textColor,
      fontSize: theme.fontSizeM,
      fontWeight: 500,
      fontFamily: theme.fontFamily,
    },
  });
}
