import { StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/context/ThemeContext";
import { format } from "date-fns";

type TaskScheduleProps = {
  color: string;
  dueDateEnable: boolean;
  dueDate: Date;
  completionTimeEnable: boolean;
  completionTimeStart: Date;
  completionTimeEnd: Date;
  repeat: number[];
};

export default function TaskSchedule({
  color,
  dueDate,
  dueDateEnable,
  completionTimeEnable,
  completionTimeStart,
  completionTimeEnd,
  repeat,
}: TaskScheduleProps) {
  const { theme } = useThemeContext();

  const styles = StyleSheet.create({
    taskInfoSchedule: {
      flexDirection: "row",
      gap: 30,
    },
    taskInfoDate: {
      flexDirection: "row",
      gap: 10,
      width: "35%",
    },
    taskInfoText: {
      color: theme.fontColor.secondary,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeS,
    },
    taskInfoTime: {
      flexDirection: "row",
      gap: 10,
      width: "35%",
    },
    parentBg: {
      color: color,
    },
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

  return (
    <View style={styles.taskInfoSchedule}>
      <View style={styles.taskInfoDate}>
        <Ionicons name="calendar-outline" style={styles.parentBg} size={15} />
        <Text style={styles.taskInfoText}>
          {dueDateEnable
            ? formatTime(dueDate, "MM/dd/yyyy")
            : getSortedRepeatDays(repeat)}
        </Text>
      </View>
      <View style={styles.taskInfoTime}>
        <Ionicons name="time-outline" style={styles.parentBg} size={15} />
        <Text style={styles.taskInfoText}>
          {completionTimeEnable
            ? `${formatTime(completionTimeStart, "HH:mm:ss")} - ${formatTime(
                completionTimeEnd,
                "HH:mm:ss"
              )}`
            : "Not set"}
        </Text>
      </View>
    </View>
  );
}
