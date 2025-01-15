import { Text, View, StyleSheet, TouchableOpacity, Platform, ScrollView, SafeAreaView, StatusBar, Pressable, Modal } from "react-native";
import { Link } from "expo-router";
import Card from "@/components/Card";
import { useEffect, useState } from "react";
import { useTodo } from "@/context/context";
import { useTodoListData } from "@/context/todoListContext";
import { pastelBg } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/context/ThemeContext";
import Animated, { LinearTransition } from "react-native-reanimated";
import DeleteModal from "@/components/DeleteModal";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export type Tlist = {
  id: string
  name: string
  isChecked: boolean
  dueDate?: {
    isEnabled: boolean
    date: Date
  }
  completionTime?: {
    isEnabled: boolean
    start: Date
    end: Date
  }
  reminder?: {
    isEnabled: boolean
    remind: number
  }
}

export interface todoList {
  id: number | string
  title: string
  type: "archive" | "todo"
  list: Tlist[] | []
  bg: string
}

export type Ttheme = {
  background: string;
  pink: string;
  labelColor: string;
  labelInfo: string;
  listInfo: string;
  white: string;
  fwMedium: number,
  fwRegular: number,
  fontSizeEX: number,
  fontSizeL: number,
  fontSizeML: number,
  fontSizeM: number,
  fontSizeS: number,
  fontFamily: string,
  textColor: string
}

export default function HomeScreen() {

  const todoData: todoList[] = [
    {
      id: 1,
      title: "Example Task",
      type: 'todo',
      list: [{
        id: "1",
        name: 'Toothbrush',
        isChecked: true,
        dueDate: {
          isEnabled: false,
          date: new Date()
        },
        completionTime: {
          isEnabled: false,
          start: new Date(),
          end: new Date()
        },
        reminder: {
          isEnabled: false,
          remind: 15
        }
      }],
      bg: "#E8B7CA"
    }
  ]

  const { setData } = useTodo();
  const { dispatch, todoList } = useTodoListData();
  const { theme, colorScheme } = useThemeContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTodoId, setDeleteTodoId] = useState<number | string>("")

  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;
  const styles = createStyles(theme, colorScheme);

  const filterdTodos = todoList.filter(t => t.type === 'todo');

  useEffect(() => {
    async function fetchData() {
      try {
        const json = await AsyncStorage.getItem("todoData");
        const data: todoList[] = json != null ? JSON.parse(json) : null;
        // console.log(json)
        if (data && data.length) {
          dispatch({ type: "SET_DATA", payload: data })
        } else {
          dispatch({ type: "SET_DATA", payload: todoData })
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, []);

  useEffect(() => {
    async function saveData() {
      try {
        const json = JSON.stringify(todoList);
        await AsyncStorage.setItem("todoData", json);
      } catch (error) {
        console.error(error)
      }
    }
    saveData()

  }, [todoList]);

  function onPressed(item: todoList) {
    setData(item)
  }

  function generateRandomId(length = 16) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < length; i++) {
      randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomId;
  }

  function addTodo() {
    const randomBg = Math.floor(Math.random() * pastelBg.length)
    const newId = generateRandomId(12);
    const todo: todoList = {
      id: newId,
      title: "New Todo",
      type: 'todo',
      list: [],
      bg: pastelBg[randomBg]
    }
    dispatch({ type: "CREATE_DATA", payload: todo })
    setData(todo)
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <Container>
        <Animated.FlatList
          contentContainerStyle={styles.contentContainer}
          data={filterdTodos}
          itemLayoutAnimation={LinearTransition}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}>
              <Text style={{ color: theme.listInfo, textAlign: 'center', fontSize: 20 }}>Create Todo</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Link href={"/todo/TodoScreen"} asChild>
              <Pressable onPress={() => onPressed(item)}>
                <Card styleProps={theme} item={item} setDeleteTodoId={setDeleteTodoId} setShowDeleteModal={setShowDeleteModal} showDeleteModal={showDeleteModal} />
              </Pressable>
            </Link>
          )}
        />
      </Container>
      <GestureHandlerRootView>
        <Modal
          animationType='fade'
          transparent={true}
          visible={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(!showDeleteModal)}
        >
          <DeleteModal setShowDeleteModal={setShowDeleteModal} showDeleteModal={showDeleteModal} id={deleteTodoId} />
        </Modal>
      </GestureHandlerRootView>

      <Link href={"/todo/TodoScreen"} asChild>
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Ionicons name="add-outline" color={theme.white} size={50} />
        </TouchableOpacity>
      </Link>

    </SafeAreaView>
  );
}

function createStyles(theme: Ttheme, colorScheme: string | null | undefined) {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      width: "100%",
      backgroundColor: theme.background,
    },
    contentContainer: {
      gap: 10,
      height: '100%'
    },
    addButton: {
      borderRadius: 100,
      backgroundColor: theme.pink,
      padding: 5,
      position: "absolute",
      bottom: 0,
      right: 0,
      marginRight: 20,
      marginBottom: 70,
    },
  })
}