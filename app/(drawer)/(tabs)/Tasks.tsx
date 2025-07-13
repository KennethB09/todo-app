import { View, Text, StyleSheet, SectionList } from "react-native";
import React from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { useTodoListData } from "@/context/todoListContext";
import { task, Ttheme, todo, day } from "@/types/dataType";
import { format } from "date-fns";
import TaskItem from "@/components/task_card/TaskItem";

type TconvertDay = {
  [key: string]: day;
  sunday: day;
  monday: day;
  tuesday: day;
  wednesday: day;
  thursday: day;
  friday: day;
  saturday: day;
};

export const CONVERT_DAYS: TconvertDay = {
  sunday: 1,
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
  saturday: 7,
};

export default function Task() {
  const { userData } = useTodoListData();
  const { theme, colorTheme } = useThemeContext();
  const styles = React.useMemo(
    () => createStyle(theme, colorTheme),
    [theme, colorTheme]
  );

  function filterTasksForToday(tasks: task[], today = new Date()) {
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

  function filterTasksForYesterday(tasks: task[]) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const getYesterDay = yesterday
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();

    const dueDateTask = tasks.filter(
      (t) =>
        t.taskType === "scheduled" &&
        t.dueDate?.enabled &&
        format(t.dueDate.date, "MM/dd/yyyy") ===
          format(yesterday, "MM/dd/yyyy") &&
        t.isChecked === false
    );
    const repeatTask = tasks.filter(
      (t) =>
        t.taskType === "scheduled" &&
        !t.dueDate?.enabled &&
        t.repeat?.includes(CONVERT_DAYS[getYesterDay]) &&
        t.isChecked === false
    );

    return [...dueDateTask, ...repeatTask];
  }

  function filterTasksForPastDays(tasks: task[], today = new Date()) {
    const todayDay = today
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const getYesterDay = yesterday
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();

    const dueDateTask = tasks.filter(
      (t) =>
        t.taskType === "scheduled" &&
        t.dueDate?.enabled &&
        format(t.dueDate.date, "MM/dd/yyyy") !==
          format(yesterday, "MM/dd/yyyy") &&
        new Date(t.dueDate.date) < new Date(today.setHours(0, 0, 0, 0)) &&
        t.isChecked === false
    );

    const repeatTask = tasks.filter(
      (t) =>
        t.taskType === "scheduled" &&
        !t.dueDate?.enabled &&
        t.repeat?.length !== 0 &&
        t.isChecked === false &&
        !t.repeat?.includes(CONVERT_DAYS[getYesterDay]) &&
        !t.repeat?.includes(CONVERT_DAYS[todayDay])
    );

    return [...repeatTask, ...dueDateTask];
  }

  const CATEGORIZE_TASKS = React.useMemo(
    () => [
      {
        title: "today",
        data: filterTasksForToday(userData.tasks),
      },
      {
        title: "yesterday",
        data: filterTasksForYesterday(userData.tasks),
      },
      {
        title: "past days",
        data: filterTasksForPastDays(userData.tasks),
      },
    ],
    [userData.tasks]
  );

  const todoMap = React.useMemo(() => {
    const map: Record<string, todo> = {};
    userData.todos.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [userData.todos]);

  return (
    <View style={styles.mainContainer}>
      <SectionList
        sections={CATEGORIZE_TASKS}
        keyExtractor={(task) => task.id}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TaskItem
              item={item}
              showFromTodo={true}
              parentTodo={todoMap[item.todoId]}
            />
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionTitle}>{title}</Text>
        )}
      />
    </View>
  );
}

function createStyle(theme: Ttheme, colorTheme: string) {
  return StyleSheet.create({
    mainContainer: {
      height: "100%",
      width: "100%",
      backgroundColor: theme.background,
    },
    sectionTitle: {
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeML,
      color: theme.fontColor.primary,
      textTransform: "capitalize",
      marginLeft: 15,
    },
    itemContainer: {
      paddingHorizontal: 15,
    },
    contentContainer: {
      paddingBottom: 120,
    },
  });
}
