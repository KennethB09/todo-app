import { useTodoListStore } from "@/context/zustand";
import { View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";
import { task, Ttheme } from "@/types/dataType";
import { CONVERT_DAYS } from "@/app/(drawer)/(tabs)/Tasks";
import { useThemeContext } from "@/context/ThemeContext";

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

export default function HomeCards({}) {
  const userData = useTodoListStore((state) => state.userData);
  const { theme } = useThemeContext();

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
  const completedTasks = filterTasksForToday(userData.tasks).filter(
    (task: task) => task.isChecked
  ).length;
  const todos = userData.todos.length;
  const styles = createStyles(theme);
  return (
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
  );
}

function createStyles(theme: Ttheme) {
    return StyleSheet.create({
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
    })
}