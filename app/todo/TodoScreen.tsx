import { View, Text, Pressable, TouchableOpacity, Modal, StyleSheet, TextInput, Platform, ScrollView, Dimensions, StatusBar } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from "expo-router";
import { Tlist, Ttheme } from "../(screens)";
import { useTodo } from "@/context/context";
import { useState } from "react";
import { useTodoListData } from "@/context/todoListContext";
import AddModal from "@/components/AddModal";
import EditList from "@/components/EditList";
import { useLocalNotification } from "@/context/notificationContex";
import * as Notifications from "expo-notifications";
import { schedulePushNotification } from "@/utils/handle-local-notification";
import { Ionicons } from "@expo/vector-icons";
import Animated, { LinearTransition } from "react-native-reanimated";
import List from "@/components/List";
import { useThemeContext } from "@/context/ThemeContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export type TadoListParam = {
    name: string
    isDueDate: boolean
    dueDate: Date | null
    isCompletionTime: boolean
    completionTimeStart: Date | null
    completionTimeEnd: Date | null
    isReminder: boolean
    reminder: Date | null
}

function TodoScreen() {

    const { dispatch } = useTodoListData();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { data, setData } = useTodo();
    const [toggleEdit, setToggleEdit] = useState(false);
    const [editDataList, setEditDataList] = useState<Tlist>();
    const [todoName, setTodoName] = useState(data?.title);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteListId, setDeleteListId] = useState<number | string>();
    const { theme, colorScheme } = useThemeContext();
    useLocalNotification();

    const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;

    function generateRandomId(length = 16) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomId = '';
        for (let i = 0; i < length; i++) {
            randomId += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return randomId;
    }

    async function addList(name: string, dueDate: Date, isDueDate: boolean, isCompletionTime: boolean, completionTimeStart: Date, completionTimeEnd: Date, isReminder: boolean, reminder: number) {
        const newId = generateRandomId(12);
        const newList: Tlist = {
            id: newId,
            name: name,
            isChecked: false,
            dueDate: {
                isEnabled: isDueDate,
                date: dueDate
            },
            completionTime: {
                isEnabled: isCompletionTime,
                start: completionTimeStart,
                end: completionTimeEnd
            },
            reminder: {
                isEnabled: isReminder,
                remind: reminder
            }
        };

        const addData = {
            ...data!,
            list: [...(data?.list || []), newList]
        }

        setData(addData)
        dispatch({ type: "UPDATE_DATA", payload: addData })

        if (isDueDate) {
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: false,
                    shouldSetBadge: false
                })
            });

            await schedulePushNotification(new Date(dueDate), reminder, name);
        };
    };

    async function editList(
        name: string,
        dueDate: Date,
        isDueDate: boolean,
        isCompletionTime: boolean,
        completionTimeStart: Date,
        completionTimeEnd: Date,
        isReminder: boolean,
        reminder: number,
        id: string,
        isChecked: boolean) {

        const editList: Tlist = {
            id: id,
            name: name,
            isChecked: isChecked,
            dueDate: {
                isEnabled: isDueDate,
                date: dueDate
            },
            completionTime: {
                isEnabled: isCompletionTime,
                start: completionTimeStart,
                end: completionTimeEnd
            },
            reminder: {
                isEnabled: isReminder,
                remind: reminder
            }
        };

        const updatedData = {
            ...data!,
            list: data!.list.map(list => list.id === id ? editList : list)
        };

        setData(updatedData);
        dispatch({ type: "UPDATE_DATA", payload: updatedData });

        if (isDueDate) {
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: false,
                    shouldSetBadge: false
                })
            });

            await schedulePushNotification(dueDate, reminder, name);
        }
    };

    function toggleEditModal(list: Tlist) {
        setToggleEdit(!toggleEdit)
        setEditDataList(list)
    }

    function toggleList(id: string) {

        if (!data) return;

        const toggleItem = {
            ...data!,
            list: data?.list.map(i =>
                i.id === id
                    ? { ...i, isChecked: !i.isChecked } // Return the full object with updated isChecked
                    : i
            )
        };

        setData(toggleItem)
        dispatch({ type: "UPDATE_DATA", payload: toggleItem })
    };

    function deleteList(id: number | string) {
        const newList = data!.list.filter(list => list.id !== id);
        const newData = { ...data!, list: newList };

        setData(newData);
        dispatch({ type: "UPDATE_DATA", payload: newData });
        setDeleteModal(!deleteModal);
        setDeleteListId(undefined)
    };

    function saveTodoName() {
        const updatedData = {
            ...data!,
            title: todoName!
        };

        setData(updatedData);
        dispatch({ type: "UPDATE_DATA", payload: updatedData });
    }

    function onDeleteList(id: number | string) {
        setDeleteModal(!deleteModal);
        setDeleteListId(id)
    }

    const styles = createStyles(theme, colorScheme);
    const windowL = Dimensions.get('window').width
    const windowH = Dimensions.get('window').height

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"} backgroundColor={theme.background} />
            <View style={styles.header}>
                <Link href={'/(screens)'}>
                    <Ionicons name="chevron-back" color={theme.pink} size={40} />
                </Link>
                <Pressable onPress={() => setIsOpen(!isOpen)}>
                    <Ionicons name="add-outline" color={theme.pink} size={40} />
                </Pressable>
            </View>

            <View style={styles.titleContainer}>
                <TextInput style={styles.title} value={todoName} onChangeText={(t) => setTodoName(t)} autoFocus={todoName === "New Todo"} onEndEditing={saveTodoName} />
            </View>

            <Container>
                <Animated.FlatList
                    contentContainerStyle={styles.listContainer}
                    data={data?.list}
                    itemLayoutAnimation={LinearTransition}
                    keyboardDismissMode={'on-drag'}
                    keyExtractor={(item, index) => item.id}
                    ListEmptyComponent={
                        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center' }}>
                            <Text style={{ color: theme.listInfo, textAlign: 'center', fontSize: 20 }}>Create Item</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <List item={item} onDeleteList={onDeleteList} toggleList={toggleList} toggleEditModal={toggleEditModal} />
                    )}
                />
            </Container>

            <GestureHandlerRootView>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={isOpen}
                    onRequestClose={() => setIsOpen(!isOpen)}
                >
                    <AddModal addList={addList} isOpen setIsOpen={setIsOpen} />
                </Modal>

                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={toggleEdit}
                    onRequestClose={() => setToggleEdit(!toggleEdit)}
                >
                    <EditList currentListItem={editDataList!} editList={editList} isOpen={toggleEdit} setIsOpen={setToggleEdit} />
                </Modal>

                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={deleteModal}
                    onRequestClose={() => setDeleteModal(!deleteModal)}
                >
                    <View style={{
                        height: windowH,
                        width: windowL,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#rgba(0, 0, 0, 0.61)',
                        position: 'absolute'
                    }}>
                        <View style={{
                            backgroundColor: colorScheme === "dark" ? '#503c4a' : theme.background,
                            width: '85%',
                            borderRadius: 10,
                            padding: 20,
                            gap: 10
                        }}>
                            <Text style={styles.modalTextTitle}>DELETE ITEM</Text>
                            <Text style={styles.modalTextPara}>Are you sure you want to delete this item?</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                                <TouchableOpacity onPress={() => setDeleteModal(!deleteModal)} style={styles.cancelButton}>
                                    <Text style={[styles.modalDeleteButtonText, { color: theme.pink, }]}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteList(deleteListId!)} style={styles.yesButton}>
                                    <Text style={[styles.modalDeleteButtonText, { color: theme.white, }]}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </GestureHandlerRootView>

        </SafeAreaView>
    )
}

export default TodoScreen

function createStyles(theme: Ttheme, colorScheme: string | null | undefined) {
    return StyleSheet.create({
        mainContainer: {
            backgroundColor: theme.background,
            padding: 10,
            height: "100%",
            width: '100%'
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        titleContainer: {

        },
        title: {
            color: theme.pink,
            fontFamily: theme.fontFamily,
            fontSize: theme.fontSizeEX,
            textAlign: 'center'
        },
        listContainer: {
            padding: 10,
            gap: 5,
            height: '100%'
        },
        listTitle: {
            color: theme.white,
            fontFamily: theme.fontFamily,
            fontSize: theme.fontSizeL,
        },
        listInfo: {
            color: theme.listInfo,
            fontFamily: theme.fontFamily,
            fontSize: theme.fontSizeS
        },
        modalDeleteButtonText: {
            color: '#FAF9F6',
            fontSize: theme.fontSizeM,
            fontWeight: 500,
            fontFamily: theme.fontFamily,
            textAlign: 'center'
        },
        cancelButton: {
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.pink,
            paddingVertical: 10,
            paddingHorizontal: 20,
            justifyContent: 'center',
            width: 100,
        },
        yesButton: {
            borderRadius: 10,
            borderWidth: 2,
            borderColor: theme.pink,
            backgroundColor: theme.pink,
            paddingVertical: 10,
            paddingHorizontal: 20,
            justifyContent: 'center',
            width: 100,
        },
        modalTextTitle: {
            color: theme.pink,
            fontSize: theme.fontSizeML,
            fontWeight: 500,
            fontFamily: theme.fontFamily
        },
        modalTextPara: {
            color: theme.textColor,
            fontSize: theme.fontSizeM,
            fontWeight: 400,
            fontFamily: theme.fontFamily
        }
    })
}