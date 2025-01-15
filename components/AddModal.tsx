import { View, Text, Switch, TextInput, Pressable, SafeAreaView, Platform, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ttheme } from '@/app/(screens)';
import { useState } from 'react';
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from "date-fns";
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/context/ThemeContext";
import DateTimePicker from '@react-native-community/datetimepicker';

type modalProps = {
    addList: (name: string, dueDate: Date, isDueDate: boolean, isCompletionTime: boolean, completionTimeStart: Date, completionTimeEnd: Date, isReminder: boolean, reminder: number) => void
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddModal = ({ addList, isOpen, setIsOpen }: modalProps) => {

    const [name, setName] = useState("");
    const [isDueDateEnabled, setIsDueDateEnabled] = useState(true);
    const [dueDate, setDueDate] = useState<Date>(new Date());
    const [isCompletionTimeEnabled, setIsCompletionTimeEnabled] = useState(true);
    const [completionTimeStart, setCompletionTimeStart] = useState<Date>(new Date());
    const [completionTimeEnd, setCompletionTimeEnd] = useState<Date>(new Date());
    const [isReminderEnabled, setIsReminderEnabled] = useState(true);
    const [reminder, setReminder] = useState<number>(15);
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const { theme, colorScheme } = useThemeContext();
    const checkPlatform = Platform.OS === 'android';

    const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        const currentDate = selectedDate;
        setDueDate(currentDate!);
        setCompletionTimeStart(currentDate!);
    };

    const onChangeEnd = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        const currentDate = selectedDate;
        setCompletionTimeEnd(currentDate!);
    };

    const showMode = (currentMode: 'due_date' | 'start_time' | 'end_time' | 'reminder') => {
        if (currentMode === "due_date") {
            DateTimePickerAndroid.open({
                value: dueDate,
                onChange,
                mode: "date",
                is24Hour: true,
            });
        } else if (currentMode === "start_time") {
            DateTimePickerAndroid.open({
                value: dueDate,
                onChange,
                mode: "time",
                is24Hour: true,
            });
        } else if (currentMode === "end_time") {
            DateTimePickerAndroid.open({
                value: dueDate,
                onChange: onChangeEnd,
                mode: "time",
                is24Hour: true,
            });
        }
    };

    function showDatePicker(type: 'due_date' | 'start_time' | 'end_time', mode: 'date' | 'time') {
        if (checkPlatform) {
            if (type === 'due_date') {
                showMode(type);
            } else if (type === 'start_time') {
                showMode(type);
            } else if (type === 'end_time') {
                showMode(type);
            }
        } else {
            setMode(mode)
        }
    }

    function saveData() {
        addList(name, dueDate, isDueDateEnabled, isCompletionTimeEnabled, completionTimeStart, completionTimeEnd, isReminderEnabled, reminder);
        setName('')
        setIsOpen(!isOpen)
    };

    function formatTime(date: Date, type: "MM/dd/yyyy" | 'HH:mm:ss') {
        let formattedTime: string;

        if (type === "MM/dd/yyyy") {
            formattedTime = format(date, "MM/dd/yyyy")
        } else {
            formattedTime = format(date, "HH:mm a")
        }
        return formattedTime
    };

    const styles = createStyles(theme, colorScheme);
    const windowL = Dimensions.get('window').width
    const windowH = Dimensions.get('window').height

    return (
        <View style={{ width: windowL, height: windowH, alignContent: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: '#rgba(0, 0, 0, 0.61)' }}>
            <View style={styles.mainContainer}>

                <Text style={styles.title}>ADD NEW</Text>

                <View style={{ gap: 10, }}>

                    <View>
                        <TextInput style={styles.textInput} onChangeText={t => setName(t)} value={name} autoFocus />
                    </View>

                    <View style={styles.sectionContainer}>
                        <View style={styles.section}>

                            <View style={styles.labelContainer}>
                                <Ionicons name='calendar-outline' style={{ color: theme.pink }} size={30} />
                                <Text style={styles.label}>Due Date</Text>
                            </View>
                            <Switch value={isDueDateEnabled} onValueChange={() => setIsDueDateEnabled(!isDueDateEnabled)} style={{ width: 40 }} thumbColor={colorScheme === 'dark' ? theme.pink : theme.background } trackColor={{ true: colorScheme === 'dark' ? '#79596e' : theme.pink, false: null }} />

                        </View>

                        {checkPlatform ?
                            <Pressable onPress={() => showDatePicker('due_date', 'date')} disabled={!isDueDateEnabled}>
                                <Text style={isDueDateEnabled ? styles.textInput : styles.textInputDisable}>{formatTime(dueDate, 'MM/dd/yyyy')}</Text>
                            </Pressable>
                            :
                            <DateTimePicker
                                disabled={!isDueDateEnabled}
                                style={styles.datePicker}
                                themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
                                testID="dateTimePicker"
                                value={dueDate}
                                mode={mode}
                                is24Hour={true}
                                onChange={onChange}
                            />
                        }
                    </View>

                    <View style={styles.sectionContainer}>

                        <View style={styles.section}>
                            <View style={styles.labelContainer}>
                                <Ionicons name='time-outline' style={{ color: theme.pink }} size={30} />
                                <Text style={styles.label}>Completion Time</Text>
                            </View>
                            <Switch value={isCompletionTimeEnabled} onValueChange={() => setIsCompletionTimeEnabled(!isCompletionTimeEnabled)} style={{ width: 40 }} thumbColor={colorScheme === 'dark' ? theme.pink : theme.background } trackColor={{ true: colorScheme === 'dark' ? '#79596e' : theme.pink, false: null }} />
                        </View>

                        <View style={styles.setTimeContainer}>

                            <View style={styles.setTime}>
                                <Text style={styles.label}>Start</Text>

                                {checkPlatform ?
                                    <Pressable onPress={() => showDatePicker('start_time', 'time')} style={{ width: 80 }} disabled={!isCompletionTimeEnabled}>
                                        <Text style={isCompletionTimeEnabled ? styles.setTimeText : styles.setTimeTextDisable}>{formatTime(dueDate, 'HH:mm:ss')}</Text>
                                    </Pressable>
                                    :
                                    <DateTimePicker
                                        disabled={!isCompletionTimeEnabled}
                                        style={styles.datePicker}
                                        themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
                                        testID="dateTimePicker"
                                        value={dueDate}
                                        mode={'time'}
                                        is24Hour={true}
                                        onChange={onChange}
                                    />
                                }
                            </View>

                            <View style={styles.setTime}>
                                <Text style={styles.label}>End</Text>

                                {checkPlatform ?
                                    <Pressable onPress={() => showDatePicker('end_time', 'time')} style={{ width: 80 }} disabled={!isCompletionTimeEnabled}>
                                        <Text style={isCompletionTimeEnabled ? styles.setTimeText : styles.setTimeTextDisable}>{formatTime(completionTimeEnd!, 'HH:mm:ss')}</Text>
                                    </Pressable>
                                    :
                                    <DateTimePicker
                                        disabled={!isCompletionTimeEnabled}
                                        style={styles.datePicker}
                                        themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
                                        testID="dateTimePicker"
                                        value={completionTimeEnd!}
                                        mode={'time'}
                                        is24Hour={true}
                                        onChange={onChangeEnd}
                                    />
                                }
                            </View>

                        </View>

                    </View>

                    <View style={styles.sectionContainer}>
                        <View style={styles.section}>
                            <View style={styles.labelContainer}>
                                <View><Text style={styles.label}>Reminder</Text></View>
                            </View>
                            <Switch value={isReminderEnabled} onValueChange={() => setIsReminderEnabled(!isReminderEnabled)} style={{ width: 40 }} thumbColor={colorScheme === 'dark' ? theme.pink : theme.background } trackColor={{ true: colorScheme === 'dark' ? '#79596e' : theme.pink, false: null }} />
                        </View>
                        <Picker
                            enabled={isReminderEnabled}
                            style={{ backgroundColor: colorScheme === 'dark' ? '#362932' : theme.background, borderRadius: 10, color: (isReminderEnabled ? theme.textColor : 'gray') }}
                            dropdownIconColor={theme.pink}
                            itemStyle={{ backgroundColor: theme.background, color: theme.textColor, fontFamily: 'Poppins_500Medium', borderRadius: 10 }}
                            selectedValue={reminder}
                            onValueChange={value => setReminder(value)}>
                            <Picker.Item label="15 minutes" value={15} />
                            <Picker.Item label="30 minutes" value={30} />
                            <Picker.Item label="1 hour" value={60} />
                        </Picker>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={{ borderRadius: 10, borderWidth: 1, borderColor: theme.pink, paddingVertical: 10, paddingHorizontal: 20, justifyContent: 'center' }}>
                        <Text style={styles.buttonTextCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={saveData} style={{ borderRadius: 10, borderWidth: 2, borderColor: theme.pink, backgroundColor: theme.pink, paddingVertical: 10, paddingHorizontal: 20, justifyContent: 'center' }}>
                        <Text style={styles.buttonTextSave}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default AddModal

function createStyles(theme: Ttheme, colorScheme: string | null | undefined) {
    return StyleSheet.create({
        mainContainer: {
            backgroundColor: colorScheme === 'dark' ? '#503c4a' : theme.background,
            width: '85%',
            alignSelf: 'center',
            borderRadius: 10,
            padding: 20,
            gap: 20,

        },
        label: {
            color: theme.textColor,
            fontSize: theme.fontSizeM,
            fontWeight: 500,
            fontFamily: theme.fontFamily
        },
        touchableOpacity: {

        },
        title: {
            color: theme.pink,
            fontSize: theme.fontSizeML,
            fontWeight: 500,
            fontFamily: theme.fontFamily
        },
        datePicker: {
            borderWidth: colorScheme === 'dark' ? 0 : 1,
            height: 40,
            borderRadius: 10,
            backgroundColor: colorScheme === 'dark' ? '#362932' : theme.background
        },
        textInput: {
            backgroundColor: colorScheme === 'dark' ? '#362932' : theme.background,
            borderWidth: colorScheme === 'dark' ? 0 : 1,
            height: 40,
            borderRadius: 10,
            color: theme.textColor,
            textAlignVertical: 'center',
            paddingLeft: 10,
            fontFamily: theme.fontFamily,
        },
        textInputDisable: {
            backgroundColor: '#362932',
            height: 40,
            borderRadius: 10,
            color: 'gray',
            textAlignVertical: 'center',
            paddingLeft: 10,
            fontFamily: theme.fontFamily
        },
        labelContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            width: '70%'
        },
        sectionContainer: {
            gap: 10
        },
        section: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingRight: 10
        },
        setTimeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            justifyContent: 'center'
        },
        setTime: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            width: '40%'
        },
        setTimeText: {
            backgroundColor: colorScheme === 'dark' ? '#362932' : theme.background,
            height: 40,
            borderRadius: 10,
            color: theme.textColor,
            textAlignVertical: 'center',
            paddingLeft: 10,
            fontFamily: theme.fontFamily,
            borderWidth: colorScheme === 'dark' ? 0 : 1,
        },
        setTimeTextDisable: {
            backgroundColor: colorScheme === 'dark' ? '#362932' : theme.background,
            height: 40,
            borderRadius: 10,
            color: 'gray',
            textAlignVertical: 'center',
            paddingLeft: 10,
            fontFamily: theme.fontFamily,
            borderWidth: colorScheme === 'dark' ? 0 : 1,
        },
        buttonContainer: {
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'flex-end',
        },
        buttonTextSave: {
            color: theme.white,
            fontSize: theme.fontSizeM,
            fontWeight: 500,
            fontFamily: theme.fontFamily,
        },
        buttonTextCancel: {
            color: theme.pink,
            fontSize: theme.fontSizeM,
            fontWeight: 500,
            fontFamily: theme.fontFamily,
        }
    })
}