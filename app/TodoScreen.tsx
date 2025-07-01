import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Platform,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { task, Ttheme } from "@/types/dataType";
import { useTodo } from "@/context/context";
import { useEffect, useMemo, useState } from "react";
import { useTodoListData } from "@/context/todoListContext";
import AddModal from "@/components/AddModal";
import EditTask from "@/components/EditTask";
import { useLocalNotification } from "@/context/notificationContex";
import { Ionicons } from "@expo/vector-icons";
import Animated, { LinearTransition } from "react-native-reanimated";
import Task from "@/components/task_card/Task";
import { useThemeContext } from "@/context/ThemeContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ThemePicker from "@/components/ThemePicker";
import DeleteModal from "@/components/DeleteModal";

export type TadoListParam = {
  name: string;
  isDueDate: boolean;
  dueDate: Date | null;
  isCompletionTime: boolean;
  completionTimeStart: Date | null;
  completionTimeEnd: Date | null;
  isReminder: boolean;
  reminder: Date | null;
};

function TodoScreen() {
  const { dispatch, userData } = useTodoListData();
  const { theme, colorScheme, colorTheme } = useThemeContext();
  const { data, setData } = useTodo();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [editDataList, setEditDataList] = useState<task>();
  const [todoName, setTodoName] = useState(data?.title);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTasktId, setDeleteTaskId] = useState<string>("");
  const [taskData, setTaskData] = useState<task[]>([]);
  const [newTodoBg, setNewTodoBg] = useState<string>(data!.bg);
  useLocalNotification();

  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;
  const parentTodo = data;

  useEffect(() => {
    function getTask() {
      if (!data) return;

      const tasks = userData.tasks.filter((task) => task.todoId === data.id);
      setTaskData(tasks);
    }

    getTask();
  }, [userData.tasks]);

  useEffect(() => {
    function changeBgColor() {
      const updatedData = {
        ...data!,
        bg: newTodoBg,
      };

      setData(updatedData);
      dispatch({ type: "UPDATE_TODO", payload: updatedData });
    }

    changeBgColor();
  }, [newTodoBg]);

  function handleBack() {
    setTaskData([]);
    router.back();
  }

  function toggleEditModal(task: task) {
    setToggleEdit(!toggleEdit);
    setEditDataList(task);

    if (toggleEdit) {
      setEditDataList(undefined);
    }
  }

  function saveTodoName() {
    if (data?.title === todoName) {
      return;
    }

    const updatedData = {
      ...data!,
      title: todoName!,
    };

    setData(updatedData);
    dispatch({ type: "UPDATE_TODO", payload: updatedData });
  }

  const styles = useMemo(
    () => createStyles(theme, colorScheme),
    [theme, colorScheme]
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />
      <View style={styles.header}>
        <Pressable onPress={handleBack}>
          <Ionicons name="arrow-back-outline" color={colorTheme} size={40} />
        </Pressable>
        <View style={styles.headerBtnContainer}>
          <Pressable onPress={() => setIsOpen(!isOpen)}>
            <Ionicons
              name="add-outline"
              color={theme.fontColor.secondary}
              size={40}
            />
          </Pressable>
          <Pressable>
            <ThemePicker color={newTodoBg} setColor={setNewTodoBg} />
          </Pressable>
        </View>
      </View>

      <View>
        <TextInput
          style={styles.title}
          value={todoName}
          onChangeText={(t) => setTodoName(t)}
          autoFocus={todoName === "New Todo"}
          onEndEditing={saveTodoName}
        />
      </View>

      <Container>
        <Animated.FlatList
          contentContainerStyle={styles.listContainer}
          data={taskData}
          itemLayoutAnimation={LinearTransition}
          keyboardDismissMode={"on-drag"}
          keyExtractor={(item, index) => item.id}
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
                Add Task
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Task
              item={item}
              setDeleteId={setDeleteTaskId}
              setShowDeleteModal={setDeleteModal}
              toggleEditModal={toggleEditModal}
              enablePanGesture={true}
              showFromTodo={false}
              parentTodo={parentTodo!}
            />
          )}
        />
      </Container>

      <GestureHandlerRootView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isOpen}
          onRequestClose={() => setIsOpen(!isOpen)}
        >
          <AddModal isOpen setIsOpen={setIsOpen} />
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={toggleEdit}
          onRequestClose={() => setToggleEdit(!toggleEdit)}
        >
          <EditTask
            task={editDataList}
            isOpen={toggleEdit}
            setIsOpen={setToggleEdit}
          />
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={deleteModal}
          onRequestClose={() => setDeleteModal(!deleteModal)}
        >
          <DeleteModal
            title="DELETE TASK"
            paragraph="Are you sure you want to delete this task?"
            setDispatch={{ type: "DELETE_TASK", payload: deleteTasktId }}
            showDeleteModal={deleteModal}
            setShowDeleteModal={setDeleteModal}
          />
        </Modal>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

export default TodoScreen;

function createStyles(theme: Ttheme, colorScheme: string | null | undefined) {
  return StyleSheet.create({
    mainContainer: {
      backgroundColor: theme.background,
      padding: 10,
      height: "100%",
      width: "100%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    headerBtnContainer: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
    },
    title: {
      color: theme.fontColor.primary,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeEX,
      textAlign: "center",
    },
    listContainer: {
      padding: 10,
      gap: 5,
      height: "100%",
    },
    listTitle: {
      color: theme.white,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeL,
    },
    listInfo: {
      color: theme.listInfo,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeS,
    },
    modalDeleteButtonText: {
      color: "#FAF9F6",
      fontSize: theme.fontSizeM,
      fontWeight: 500,
      fontFamily: theme.fontFamily,
      textAlign: "center",
    },
    cancelButton: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.pink,
      paddingVertical: 10,
      paddingHorizontal: 20,
      justifyContent: "center",
      width: 100,
    },
    yesButton: {
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.pink,
      backgroundColor: theme.pink,
      paddingVertical: 10,
      paddingHorizontal: 20,
      justifyContent: "center",
      width: 100,
    },
    modalTextTitle: {
      color: theme.pink,
      fontSize: theme.fontSizeML,
      fontWeight: 500,
      fontFamily: theme.fontFamily,
    },
    modalTextPara: {
      color: theme.textColor,
      fontSize: theme.fontSizeM,
      fontWeight: 400,
      fontFamily: theme.fontFamily,
    },
  });
}
