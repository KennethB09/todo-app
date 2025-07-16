import { Ttheme, todo, task } from "@/types/dataType";
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useThemeContext } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import TaskSchedule from "./TaskSchedule";
import { useTodoListStore } from "@/context/zustand";

type TaskItemProps = {
  item: task;
  parentTodo: todo;
  toggleEditModal?: (task: task) => void;
  showFromTodo: boolean;
};

export default function TaskItem({
  item,
  parentTodo,
  toggleEditModal,
  showFromTodo,
}: TaskItemProps) {
  const checkTask = useTodoListStore((state) => state.checkTask);
  const { theme } = useThemeContext();

  function toggleList() {
    checkTask(item.id);
  }

  const styles = createStyle(theme);

  return (
    <Pressable
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1.0 },
        styles.mainContainer,
      ]}
      onPress={toggleList}
    >
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
              <Ionicons name="create-outline" color={parentTodo.bg} size={25} />
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
    </Pressable>
  );
}

function createStyle(theme: Ttheme) {
  return StyleSheet.create({
    mainContainer: {
      justifyContent: "center",
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
  });
}
