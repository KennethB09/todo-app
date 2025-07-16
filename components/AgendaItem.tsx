import { format } from "date-fns";
import { StyleSheet, Text, View } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { task } from "@/types/dataType";
import { useTodoListStore } from "@/context/zustand";

type AgendaItemProps = {
  item: task;
};

export default function AgendaItem({ item }: AgendaItemProps) {
  const { theme } = useThemeContext();
  const todos = useTodoListStore((state) => state.userData.todos);

  const parentTodo = todos.find((todo) => todo.id === item.todoId);

  const styles = StyleSheet.create({
    mainContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
    },
    timeContainer: {
      width: "25%",
      alignItems: "center",
      justifyContent: "center",
    },
    time: {
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeM,
      color: theme.fontColor.secondary,
      fontWeight: "bold",
    },
    itemContainer: {
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginRight: 10,
      height: 100,
      width: "70%",
    },
    title: {
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeML,
      color: theme.fontColor.primary,
      fontWeight: "semibold",
    },
    label: {
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeM,
      color: theme.fontColor.white,
      fontWeight: "regular",
    },
  });

  let startTime = null;
  let endTime = null;

  if (item.taskType === "scheduled") {
    startTime = format(item.completionTime?.start!, "HH:mm a");
    endTime = format(item.completionTime?.end!, "HH:mm a");
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{startTime ? startTime : "Today"}</Text>
      </View>
      <View style={[styles.itemContainer, { backgroundColor: parentTodo?.bg }]}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.label}>From: {parentTodo?.title}</Text>
        {item.taskType === "scheduled" && (
          <Text style={styles.label}>
            {item.completionTime?.enabled
              ? `${startTime} - ${endTime}`
              : "Not Set"}
          </Text>
        )}
      </View>
    </View>
  );
}
