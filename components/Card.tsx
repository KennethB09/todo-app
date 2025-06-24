import { View, Text, StyleSheet } from "react-native";
import { todo } from "@/types/dataType";
import Animated, { runOnJS, withTiming } from "react-native-reanimated";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useTodoListData } from "@/context/todoListContext";

type Ttheme = {
  background: string;
  pink: string;
  labelColor: string;
  labelInfo: string;
  listInfo: string;
};

type TCardProps = {
  item: todo;
  styleProps: Ttheme;
  setDeleteTodoId: React.Dispatch<React.SetStateAction<string>>;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteModal: boolean;
};

function Card({
  item,
  styleProps,
  setDeleteTodoId,
  setShowDeleteModal,
  showDeleteModal,
}: TCardProps) {
  const { dispatch, userData } = useTodoListData();

  const countCompletedTasks = userData.tasks.filter(
    (t) => t.todoId === item.id && t.isChecked
  ).length;
  const countTotalTasks = userData.tasks.filter(
    (t) => t.todoId === item.id
  ).length;

  const styles = StyleSheet.create({
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
      color: styleProps.labelColor,
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
      color: styleProps.labelInfo,
      fontFamily: "Poppins_500Medium",
    },
  });

  function onDelete(id: string) {
    setDeleteTodoId(id);
    setShowDeleteModal(!showDeleteModal);
  }

  const translateX = useSharedValue(0);
  const translateXValid = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateXValid.value = event.translationX;
      if (event.translationX > 0) {
        translateX.value = 0;
        translateXValid.value = 0;
      } else if (event.translationX < -80) {
        translateX.value = -80;
        translateXValid.value = -80;
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
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const iconTrashContainerOpacity = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value <= -80 ? 1 : 0);
    return { opacity };
  });

  return (
    <View
      style={{
        justifyContent: "center",
        width: "100%",
        height: 105,
        alignItems: "center",
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          position: "absolute",
          justifyContent: "flex-end",
          flexDirection: "row",
          width: "90%",
          marginHorizontal: 20,
          alignItems: "center",
        }}
      >
        <Animated.View
          style={[iconTrashContainerOpacity, { width: 30, height: 30 }]}
        >
          <Ionicons name="trash-outline" color={"red"} size={30} />
        </Animated.View>

      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Text style={styles.labelColor}>{item.title}</Text>
          <View style={styles.completeContainer}>
            <Text style={styles.completeText}>Completed: </Text>
            <Text style={styles.completeText}>
              {countCompletedTasks} / {countTotalTasks}
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>

    </View>
  );
}

export default Card;
