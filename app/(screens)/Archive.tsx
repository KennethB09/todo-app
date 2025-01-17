import { StyleSheet, Platform, ScrollView, SafeAreaView, Pressable, Modal } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { useTodo } from "@/context/context";
import { useTodoListData } from "@/context/todoListContext";
import Card from "@/components/Card";
import { todoList } from ".";
import { Ttheme } from ".";
import Animated, { LinearTransition } from "react-native-reanimated";
import DeleteModal from "@/components/DeleteModal";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Archive() {

  const { setData } = useTodo();
  const { todoList } = useTodoListData();
  const { theme, colorScheme } = useThemeContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTodoId, setDeleteTodoId] = useState<number | string>("")

  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;
  const styles = createStyles(theme, colorScheme);

  const filterdTodos = todoList.filter(t => t.type === 'archive');

  function onPressed(item: todoList) {
    setData(item)
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Container>
        <Animated.FlatList
          contentContainerStyle={styles.contentContainer}
          data={filterdTodos}
          itemLayoutAnimation={LinearTransition}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (

            <Link href={"./TodoScreen"} asChild >
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
        >
          <DeleteModal setShowDeleteModal={setShowDeleteModal} showDeleteModal={showDeleteModal} id={deleteTodoId} />
        </Modal>
      </GestureHandlerRootView>
    </SafeAreaView>
  )
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
    }
  })
}