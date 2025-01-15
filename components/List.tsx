import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Checkbox from "expo-checkbox";
import Animated, { runOnJS, withTiming } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import React from 'react'
import { useThemeContext } from '@/context/ThemeContext';
import { Ttheme, Tlist } from '@/app/(screens)';
import { Ionicons } from '@expo/vector-icons';
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useTodo } from "@/context/context";
import { format } from "date-fns";

type ListProps = {
    item: Tlist
    toggleList: (id: string) => void
    toggleEditModal: (list: Tlist) => void
    onDeleteList: (id: number | string) => void
}

export default function List({ item, toggleList, toggleEditModal, onDeleteList }: ListProps) {

    const { theme, colorScheme } = useThemeContext();
    const styles = createStyles(theme, colorScheme);
    const { data } = useTodo();

    function formatTime(date: Date, type: "MM/dd/yyyy" | 'HH:mm:ss') {
        let formattedTime: string;

        if (type === "MM/dd/yyyy") {
            formattedTime = date !== null || undefined ? format(date, "MM/dd/yyyy") : "";
        } else {
            formattedTime = date !== null || undefined ? format(date, "a HH:mm") : "";
        }
        return formattedTime.toLocaleUpperCase()
    }

    const translateX = useSharedValue(0);
    const translateXValid = useSharedValue(0);
    
    function onToggle() {
        toggleList(item.id)
    }

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            if(event.translationX > 0) {
                translateX.value = 0
                translateXValid.value = 0
            } else {
                translateX.value = event.translationX
                translateXValid.value = event.translationX
            }
        })
        .onEnd(() => {
            translateX.value = withTiming(0, undefined, (isFinished) => {
                if (isFinished && (translateXValid.value < -80)) {
                    runOnJS(onDeleteList)(item.id)
                    translateXValid.value = 0
                }
                translateXValid.value = 0
            })
        })

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const iconContainerOpacity = useAnimatedStyle(() => {
        const opacity = withTiming(translateX.value < -80 ? 1 : 0)
        return { opacity }
    })

    return (
        <View style={{justifyContent: 'center'}}>
            <Animated.View style={[{position: 'absolute', width: 30, height: 30, right: 15, justifyContent: 'center', alignItems: 'center'}, iconContainerOpacity]}>
                <Ionicons name='trash-outline' color={'red'} size={30}/>
            </Animated.View>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[{ flexDirection: 'row', gap: 10, backgroundColor: theme.background }, animatedStyle]}>
                    <View style={{ paddingTop: 5 }}>
                        <Checkbox value={item.isChecked} onValueChange={onToggle} color={data?.bg} />
                    </View>
                    <View style={{ flex: 1, gap: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.listTitle}>{item.name}</Text>
                            <TouchableOpacity onPress={() => toggleEditModal(item)} >
                                <Ionicons name="create-outline" color={data?.bg} size={25} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 30 }}>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <Ionicons name='calendar-outline' style={{ color: data?.bg }} size={15} />
                                <Text style={styles.listInfo}>{item.dueDate?.isEnabled ? formatTime(item.dueDate?.date!, 'MM/dd/yyyy') : 'Not set'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <Ionicons name='time-outline' style={{ color: data?.bg }} size={15} />
                                <Text style={styles.listInfo}>{item.completionTime?.isEnabled ? `${formatTime(item.completionTime?.start!, 'HH:mm:ss')} - ${formatTime(item.completionTime?.end!, 'HH:mm:ss')}` : 'Not set'}</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </GestureDetector>  
        </View>
    )
}

function createStyles(theme: Ttheme, colorScheme: string | null | undefined) {
    return StyleSheet.create({
        listTitle: {
            color: theme.textColor,
            fontFamily: theme.fontFamily,
            fontSize: theme.fontSizeL,
        },
        listInfo: {
            color: theme.listInfo,
            fontFamily: theme.fontFamily,
            fontSize: theme.fontSizeS
        },
        modalDeleteButtonText: {
            color: theme.textColor,
            fontSize: theme.fontSizeM,
            fontWeight: 500,
            fontFamily: theme.fontFamily,
        }
    })
}