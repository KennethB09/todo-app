import { View, Text, StyleSheet } from "react-native";
import { todo } from "@/types/dataType";
import { useTodoListStore } from "@/context/zustand";
import { useThemeContext } from "@/context/ThemeContext";

type TCardProps = {
  item: todo;
};

function Card({ item }: TCardProps) {
  const userData = useTodoListStore((state) => state.userData);
  const { theme } = useThemeContext();

  const countCompletedTasks = userData.tasks.filter(
    (t) => t.todoId === item.id && t.isChecked
  ).length;
  const countTotalTasks = userData.tasks.filter(
    (t) => t.todoId === item.id
  ).length;

  const styles = StyleSheet.create({
    mainContainer: {
      justifyContent: "center",
      width: "100%",
      height: 105,
      alignItems: "center",
      paddingHorizontal: 20,
    },
    card: {
      backgroundColor: item.bg,
      justifyContent: "space-between",
      alignItems: "center",
      height: "100%",
      width: "100%",
      paddingHorizontal: 20,
      flexDirection: "row",
      borderRadius: 10,
    },
    labelColor: {
      color: theme.labelColor,
      fontSize: 24,
      fontWeight: 500,
      fontFamily: "Poppins_500Medium",
      maxWidth: "50%",
    },
    completeContainer: {
      flexDirection: "row",
    },
    completeText: {
      fontSize: 16,
      color: theme.labelInfo,
      fontFamily: "Poppins_500Medium",
    },
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.card}>
        <Text style={styles.labelColor}>{item.title}</Text>
        <View style={styles.completeContainer}>
          <Text style={styles.completeText}>Completed: </Text>
          <Text style={styles.completeText}>
            {countCompletedTasks} / {countTotalTasks}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default Card;
