import {
  View,
  Pressable,
  Modal,
  StyleSheet,
  TextInput,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { task, Ttheme } from "@/types/dataType";
import { useEffect, useMemo, useState, useCallback } from "react";
import AddModal from "@/components/AddModal";
import EditTask from "@/components/EditTask";
import { useLocalNotification } from "@/context/notificationContext";
import { Ionicons } from "@expo/vector-icons";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useThemeContext } from "@/context/ThemeContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ThemePicker from "@/components/ThemePicker";
import DeleteModal from "@/components/DeleteModal";
import GestureWrapper from "@/components/GestureWrapper";
import TaskItem from "@/components/task_card/TaskItem";
import { useTodoListStore } from "@/context/zustand";
import EmptyList from "@/components/EmptyList";

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
  useLocalNotification();

  const { theme, colorScheme, colorTheme } = useThemeContext();

  const { id, bg } = useLocalSearchParams();

  const todos = useTodoListStore((state) => state.userData.todos);
  const getParentTodo = todos.find((todo) => todo.id === id);
  const tasks = useTodoListStore((state) => state.userData.tasks);
  const taskData = tasks.filter((task) => task.todoId === id);
  const todoId = id as string;
  const bgColor = bg as string;
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [editDataList, setEditDataList] = useState<task>();
  const [todoName, setTodoName] = useState(getParentTodo?.title);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTasktId, setDeleteTaskId] = useState<string>("");
  const [newTodoBg, setNewTodoBg] = useState<string>(bgColor);

  const deleteTask = useTodoListStore((state) => state.deleteTask);
  const updateTodo = useTodoListStore((state) => state.updateTodo);

  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;

  useEffect(() => {
    function changeBgColor() {
      const updatedData = {
        ...getParentTodo!,
        bg: newTodoBg,
      };

      updateTodo(updatedData);
    }

    changeBgColor();
  }, [newTodoBg]);

  function handleBack() {
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
    if (getParentTodo?.title === todoName) {
      return;
    }

    const updatedData = {
      ...getParentTodo!,
      title: todoName!,
    };

    updateTodo(updatedData);
  }

  const styles = createStyles(theme, colorScheme);

  function onDelete(id: string) {
    setDeleteTaskId(id);
    setDeleteModal((prev) => !prev);
  }

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
          ListEmptyComponent={<EmptyList text="Add Task" />}
          renderItem={({ item }) => (
            <GestureWrapper onGesureEnd={() => onDelete(item.id)}>
              <TaskItem
                item={item}
                parentTodo={getParentTodo!}
                showFromTodo={false}
                toggleEditModal={toggleEditModal}
              />
            </GestureWrapper>
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
          <AddModal isOpen setIsOpen={setIsOpen} todoId={todoId}/>
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
            setDispatch={() => deleteTask(deleteTasktId)}
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
