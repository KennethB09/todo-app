import {
  View,
  Text,
  Switch,
  TextInput,
  Pressable,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { day, task, Ttheme } from "@/types/dataType";
import { useState } from "react";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/context/ThemeContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { schedulePushNotification } from "@/utils/handle-local-notification";
import Checkbox from "expo-checkbox";
import { useTodoListStore } from "@/context/zustand";

type modalProps = {
  task: task | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type Tcheckbox = {
  label: string;
  checked: boolean;
  value: day;
};

const EditTask = ({ task, isOpen, setIsOpen }: modalProps) => {
  const [mode, setMode] = useState<"date" | "time">("date");
  const { theme, colorScheme, colorTheme } = useThemeContext();
  const checkPlatform = Platform.OS === "android";
  const [isEmpty, setIsEmpty] = useState(false);
  const editTask = useTodoListStore((state) => state.editTask);

  function getCheckboxArray(selectedDays: day[] | undefined): Tcheckbox[] {
    const allDays: Tcheckbox[] = [
      { label: "Sun", checked: false, value: 1 },
      { label: "Mon", checked: false, value: 2 },
      { label: "Tue", checked: false, value: 3 },
      { label: "Wed", checked: false, value: 4 },
      { label: "Thu", checked: false, value: 5 },
      { label: "Fri", checked: false, value: 6 },
      { label: "Sat", checked: false, value: 7 },
    ];
    if (!selectedDays) return allDays;
    return allDays.map((item) => ({
      ...item,
      checked: selectedDays.includes(item.value),
    }));
  }

  const radioValue: "simple" | "scheduled" = task?.taskType ?? "simple";
  const [name, setName] = useState(task?.name ?? "");
  const [isDueDateEnabled, setIsDueDateEnabled] = useState(
    task?.dueDate?.enabled ?? false
  );
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.dueDate?.date ? new Date(task.dueDate.date) : undefined
  );
  const [isCompletionTimeEnabled, setIsCompletionTimeEnabled] = useState(
    task?.completionTime?.enabled ?? false
  );
  const [completionTimeStart, setCompletionTimeStart] = useState<
    Date | undefined
  >(task?.completionTime?.start);
  const [completionTimeEnd, setCompletionTimeEnd] = useState<Date | undefined>(
    task?.completionTime?.end
  );
  const [isReminderEnabled, setIsReminderEnabled] = useState(
    task?.reminder?.enabled ?? false
  );
  const [reminder, setReminder] = useState<number | undefined>(
    task?.reminder?.remind
  );
  const [checkboxValues, setCheckboxValues] = useState<day[] | undefined>(
    task?.repeat
  );
  const [checkbox, setCheckbox] = useState<Tcheckbox[]>(
    getCheckboxArray(task?.repeat)
  );

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    setDueDate(currentDate!);
    setCompletionTimeStart(currentDate!);
  };

  const onChangeEnd = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    setCompletionTimeEnd(currentDate!);
  };

  const showMode = (
    currentMode: "due_date" | "start_time" | "end_time" | "reminder"
  ) => {
    if (currentMode === "due_date") {
      DateTimePickerAndroid.open({
        value: dueDate!,
        onChange,
        mode: "date",
        is24Hour: true,
      });
    } else if (currentMode === "start_time") {
      DateTimePickerAndroid.open({
        value: dueDate!,
        onChange,
        mode: "time",
        is24Hour: true,
      });
    } else if (currentMode === "end_time") {
      DateTimePickerAndroid.open({
        value: dueDate!,
        onChange: onChangeEnd,
        mode: "time",
        is24Hour: true,
      });
    }
  };

  function showDatePicker(
    type: "due_date" | "start_time" | "end_time",
    mode: "date" | "time"
  ) {
    if (checkPlatform) {
      if (type === "due_date") {
        showMode(type);
      } else if (type === "start_time") {
        showMode(type);
      } else if (type === "end_time") {
        showMode(type);
      }
    } else {
      setMode(mode);
    }
  }

  async function saveTask() {
    
    if (name.length === 0) {
      setIsEmpty(true);
      return;
    }

    let edit_task: task;
    if (radioValue === "scheduled") {
      edit_task = {
        todoId: task!.todoId,
        id: task!.id,
        name: name,
        isChecked: task!.isChecked,
        taskType: task!.taskType,
        dueDate: {
          enabled: isDueDateEnabled!,
          date: dueDate!,
        },
        repeat: checkboxValues,
        completionTime: {
          enabled: isCompletionTimeEnabled!,
          start: completionTimeStart!,
          end: completionTimeEnd!,
        },
        reminder: {
          enabled: isReminderEnabled!,
          remind: reminder!,
        },
      };
    } else {
      edit_task = {
        todoId: task!.todoId,
        id: task!.id,
        name: name,
        isChecked: task!.isChecked,
        taskType: task!.taskType,
      };
    }

    editTask(edit_task)
    setName("");
    setIsOpen(!isOpen);

    if (radioValue === "scheduled") {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });

      await schedulePushNotification(
        isDueDateEnabled,
        new Date(dueDate!),
        isReminderEnabled,
        reminder!,
        name,
        checkboxValues!,
        isCompletionTimeEnabled,
        completionTimeStart!
      );
    }
  }

  function formatTime(date: Date, type: "MM/dd/yyyy" | "HH:mm:ss") {
    let formattedTime: string;

    if (type === "MM/dd/yyyy") {
      formattedTime = format(date, "MM/dd/yyyy");
    } else {
      formattedTime = format(date, "HH:mm a");
    }
    return formattedTime;
  }

  const windowL = Dimensions.get("window").width;
  const windowH = Dimensions.get("window").height;
  const styles = createStyles(theme, colorScheme, windowL, windowH, colorTheme);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Task</Text>
        <Pressable
          onPress={() => setIsOpen(!isOpen)}
          style={styles.headerCloseButton}
        >
          <Ionicons name="close" size={30} color={theme.fontColor.secondary} />
        </Pressable>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Task Name</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(t) => setName(t)}
            value={name}
            autoFocus
          />
          {isEmpty && <Text style={styles.error}>Give task a name</Text>}
        </View>

        {radioValue === "scheduled" && (
          <>
            <View style={styles.sectionContainer}>
              <View style={styles.section}>
                <View style={styles.labelContainer}>
                  <Ionicons
                    name="calendar-outline"
                    color={colorTheme}
                    size={25}
                  />
                  <Text style={styles.label}>Due Date</Text>
                </View>
                <Switch
                  value={isDueDateEnabled}
                  onValueChange={() => setIsDueDateEnabled(!isDueDateEnabled)}
                  style={{ width: 40 }}
                  thumbColor={
                    colorScheme === "dark" ? colorTheme : theme.pallete.light
                  }
                  trackColor={{
                    true:
                      colorScheme === "dark" ? theme.pallete.gray : colorTheme,
                    false: null,
                  }}
                />
              </View>

              {checkPlatform ? (
                <Pressable
                  onPress={() => showDatePicker("due_date", "date")}
                  disabled={!isDueDateEnabled}
                >
                  <Text
                    style={
                      isDueDateEnabled
                        ? styles.textInput
                        : styles.textInputDisable
                    }
                  >
                    {formatTime(dueDate!, "MM/dd/yyyy")}
                  </Text>
                </Pressable>
              ) : (
                <DateTimePicker
                  disabled={!isDueDateEnabled}
                  style={styles.datePicker}
                  themeVariant={colorScheme === "dark" ? "dark" : "light"}
                  testID="dateTimePicker"
                  value={dueDate!}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChange}
                />
              )}
            </View>

            <View
              style={[
                styles.sectionContainer,
                { opacity: isDueDateEnabled ? 0.5 : 1 },
              ]}
            >
              <View style={styles.labelContainer}>
                <Ionicons name="repeat-outline" size={25} color={colorTheme} />
                <Text style={styles.label}>Repeat</Text>
              </View>
              <View style={styles.checkboxContainer}>
                {checkbox.map((item, index) => (
                  <View key={index} style={styles.checkbox}>
                    <Text style={styles.label}>{item.label}</Text>
                    <Checkbox
                      value={item.checked}
                      color={colorTheme}
                      disabled={isDueDateEnabled}
                      onValueChange={() => {
                        const update = [...checkbox];

                        if (update[index].checked) {
                          const remove = checkboxValues!.filter(
                            (day) => day !== update[index].value
                          );
                          setCheckboxValues(remove);
                        } else {
                          setCheckboxValues((prev) => [
                            ...prev!,
                            update[index].value,
                          ]);
                        }

                        update[index].checked = !update[index].checked;
                        setCheckbox(update);
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.section}>
                <View style={styles.labelContainer}>
                  <Ionicons name="time-outline" color={colorTheme} size={25} />
                  <Text style={styles.label}>Completion Time</Text>
                </View>
                <Switch
                  value={isCompletionTimeEnabled}
                  onValueChange={() =>
                    setIsCompletionTimeEnabled(!isCompletionTimeEnabled)
                  }
                  style={{ width: 40 }}
                  thumbColor={
                    colorScheme === "dark" ? colorTheme : theme.pallete.light
                  }
                  trackColor={{
                    true:
                      colorScheme === "dark" ? theme.pallete.gray : colorTheme,
                    false: null,
                  }}
                />
              </View>

              <View style={styles.setTimeContainer}>
                <View style={styles.setTime}>
                  <Text style={styles.label}>Start</Text>

                  {checkPlatform ? (
                    <Pressable
                      onPress={() => showDatePicker("start_time", "time")}
                      style={{ width: 80 }}
                      disabled={!isCompletionTimeEnabled}
                    >
                      <Text
                        style={
                          isCompletionTimeEnabled
                            ? styles.setTimeText
                            : styles.setTimeTextDisable
                        }
                      >
                        {formatTime(dueDate!, "HH:mm:ss")}
                      </Text>
                    </Pressable>
                  ) : (
                    <DateTimePicker
                      disabled={!isCompletionTimeEnabled}
                      style={styles.datePicker}
                      themeVariant={colorScheme === "dark" ? "dark" : "light"}
                      testID="dateTimePicker"
                      value={dueDate!}
                      mode={"time"}
                      is24Hour={true}
                      onChange={onChange}
                    />
                  )}
                </View>

                <View style={styles.setTime}>
                  <Text style={styles.label}>End</Text>

                  {checkPlatform ? (
                    <Pressable
                      onPress={() => showDatePicker("end_time", "time")}
                      style={{ width: 80 }}
                      disabled={!isCompletionTimeEnabled}
                    >
                      <Text
                        style={
                          isCompletionTimeEnabled
                            ? styles.setTimeText
                            : styles.setTimeTextDisable
                        }
                      >
                        {formatTime(completionTimeEnd!, "HH:mm:ss")}
                      </Text>
                    </Pressable>
                  ) : (
                    <DateTimePicker
                      disabled={!isCompletionTimeEnabled}
                      style={styles.datePicker}
                      themeVariant={colorScheme === "dark" ? "dark" : "light"}
                      testID="dateTimePicker"
                      value={completionTimeEnd!}
                      mode={"time"}
                      is24Hour={true}
                      onChange={onChangeEnd}
                    />
                  )}
                </View>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.section}>
                <View style={styles.labelContainer}>
                  <View>
                    <Text style={styles.label}>Reminder</Text>
                  </View>
                </View>
                <Switch
                  value={isReminderEnabled}
                  onValueChange={() => setIsReminderEnabled(!isReminderEnabled)}
                  style={{ width: 40 }}
                  thumbColor={
                    colorScheme === "dark" ? colorTheme : theme.pallete.light
                  }
                  trackColor={{
                    true:
                      colorScheme === "dark" ? theme.pallete.gray : colorTheme,
                    false: null,
                  }}
                />
              </View>
              <Picker
                enabled={isReminderEnabled}
                style={{
                  backgroundColor:
                    colorScheme === "dark"
                      ? theme.pallete.gray
                      : theme.background,
                  borderRadius: 10,
                  color: isReminderEnabled ? theme.textColor : "gray",
                }}
                dropdownIconColor={colorTheme}
                itemStyle={{
                  backgroundColor: theme.background,
                  color: theme.textColor,
                  fontFamily: "Poppins_500Medium",
                  borderRadius: 10,
                }}
                selectedValue={reminder}
                onValueChange={(value) => setReminder(value)}
              >
                <Picker.Item label="15 minutes" value={15} />
                <Picker.Item label="30 minutes" value={30} />
                <Picker.Item label="1 hour" value={60} />
              </Picker>
            </View>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => setIsOpen(!isOpen)}
          style={{
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colorTheme,
            paddingVertical: 10,
            paddingHorizontal: 20,
            justifyContent: "center",
            alignContent: "center",
            width: 100,
          }}
        >
          <Text style={styles.buttonTextCancel}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={saveTask}
          style={{
            borderRadius: 10,
            borderWidth: 2,
            borderColor: colorTheme,
            backgroundColor: colorTheme,
            paddingVertical: 10,
            paddingHorizontal: 20,
            justifyContent: "center",
            alignContent: "center",
            width: 100,
          }}
        >
          <Text style={styles.buttonTextSave}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditTask;

function createStyles(
  theme: Ttheme,
  colorScheme: string | null | undefined,
  windowL: number,
  windowH: number,
  colorTheme: string
) {
  return StyleSheet.create({
    mainContainer: {
      position: "absolute",
      width: windowL,
      height: windowH,
      alignContent: "center",
      justifyContent: "space-between",
      backgroundColor: theme.background,
    },
    error: {
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeS,
      color: "red",
      fontWeight: "semibold",
    },
    formContainer: {
      padding: 20,
      gap: 20,
      height: "80%",
      justifyContent: "flex-start",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 10,
      height: "10%",
    },
    headerTitle: {
      color: colorTheme,
      fontSize: theme.fontSizeL,
      fontWeight: 500,
      fontFamily: theme.fontFamily,
    },
    headerCloseButton: {
      alignItems: "center",
      justifyContent: "center",
    },
    radioContainer: {
      flexDirection: "row",
      gap: 10,
    },
    label: {
      color: theme.textColor,
      fontSize: theme.fontSizeM,
      fontWeight: 500,
      fontFamily: theme.fontFamily,
    },
    touchableOpacity: {},
    title: {
      color: theme.pink,
      fontSize: theme.fontSizeML,
      fontWeight: 500,
      fontFamily: theme.fontFamily,
    },
    datePicker: {
      borderWidth: colorScheme === "dark" ? 0 : 1,
      height: 40,
      borderRadius: 10,
      backgroundColor: colorScheme === "dark" ? "#362932" : theme.background,
    },
    textInput: {
      backgroundColor:
        colorScheme === "dark" ? theme.pallete.gray : theme.background,
      borderWidth: colorScheme === "dark" ? 0 : 1,
      height: 40,
      borderRadius: 10,
      color: theme.textColor,
      textAlignVertical: "center",
      paddingLeft: 10,
      fontFamily: theme.fontFamily,
    },
    textInputDisable: {
      backgroundColor: "#BDBDBD",
      height: 40,
      borderRadius: 10,
      color: "gray",
      textAlignVertical: "center",
      paddingLeft: 10,
      fontFamily: theme.fontFamily,
    },
    labelContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      width: "70%",
    },
    sectionContainer: {
      gap: 10,
    },
    section: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingRight: 10,
    },
    setTimeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
      justifyContent: "center",
    },
    setTime: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      width: "40%",
    },
    setTimeText: {
      backgroundColor:
        colorScheme === "dark" ? theme.pallete.gray : theme.background,
      height: 40,
      borderRadius: 10,
      color: theme.textColor,
      textAlignVertical: "center",
      paddingLeft: 10,
      fontFamily: theme.fontFamily,
      borderWidth: colorScheme === "dark" ? 0 : 1,
    },
    setTimeTextDisable: {
      backgroundColor: colorScheme === "dark" ? "#362932" : theme.background,
      height: 40,
      borderRadius: 10,
      color: "gray",
      textAlignVertical: "center",
      paddingLeft: 10,
      fontFamily: theme.fontFamily,
      borderWidth: colorScheme === "dark" ? 0 : 1,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: 10,
      justifyContent: "flex-end",
      padding: 10,
    },
    buttonTextSave: {
      color: theme.white,
      fontSize: theme.fontSizeM,
      fontWeight: 500,
      fontFamily: theme.fontFamily,
      textAlign: "center",
    },
    buttonTextCancel: {
      color: colorTheme,
      fontSize: theme.fontSizeM,
      fontWeight: 500,
      fontFamily: theme.fontFamily,
      textAlign: "center",
    },
    checkboxContainer: {
      flexWrap: "wrap",
      flexDirection: "row",
      gap: 10,
    },
    checkbox: {
      flexDirection: "row",
      width: 55,
      justifyContent: "space-between",
    },
  });
}
