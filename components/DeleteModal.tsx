import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeContext } from "@/context/ThemeContext";
import { useTodoListData } from "@/context/todoListContext";
import { Ttheme } from '@/app/(screens)';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type deleteModalProps = {
    id: number | string
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>
    showDeleteModal: boolean
}

export default function DeleteModal({ id, showDeleteModal, setShowDeleteModal }: deleteModalProps) {

    const { theme, colorScheme } = useThemeContext();
    const { dispatch } = useTodoListData();
    const styles = createStyles(theme, colorScheme);
    const windowL = Dimensions.get('window').width
    const windowH = Dimensions.get('window').height

    function deleteTodo(id: number | string) {
        dispatch({ type: 'DELETE_DATA', payload: id })
        setShowDeleteModal(!showDeleteModal)
    }

    return (
        <View style={{
            height: windowH,
            width: windowL,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#rgba(0, 0, 0, 0.61)',
            position: 'absolute'
        }}>

            <View style={styles.mainContainer}>
                <Text style={styles.modalTextTitle}>DELETE TODO</Text>
                <Text style={styles.modalTextPara}>Are you sure you want to delete this TODO?</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                    <TouchableOpacity onPress={() => setShowDeleteModal(!showDeleteModal)} style={styles.cancelButton}>
                        <Text style={[styles.modalDeleteButtonText, { color: theme.pink, }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteTodo(id)} style={styles.yesButton}>
                        <Text style={[styles.modalDeleteButtonText, { color: theme.white, }]}>Yes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

function createStyles(theme: Ttheme, colorScheme: string | null | undefined) {
    return StyleSheet.create({
        modalDeleteButtonText: {
            fontSize: theme.fontSizeM,
            fontWeight: 500,
            fontFamily: theme.fontFamily,
            textAlign: 'center'
        },
        mainContainer: {
            backgroundColor: colorScheme === "dark" ? '#503c4a' : theme.background,
            width: '85%',
            borderRadius: 10,
            padding: 20,
            gap: 10
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