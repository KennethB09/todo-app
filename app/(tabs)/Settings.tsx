import { Ttheme } from "@/types/dataType";
import { View, Text, Image, StyleSheet, Switch, StatusBar } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import ThemePicker from "@/components/ThemePicker";
import { toggleNotificationPermission } from "@/context/notificationContext";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  const { colorScheme, theme, colorTheme, setColorScheme, setColorTheme } = useThemeContext();
  const [allowNotifications, setAllowNotifications] = useState(false);
  const styles = createStyles(theme);

  useEffect(() => {
    async function getPermission() {
      
      try {
        const permission = await AsyncStorage.getItem("notificationsEnabled");
        const data = permission !== null ? JSON.parse(permission) : null;
        if (data) {
          if (data) {
            setAllowNotifications(true);
          } else {
            setAllowNotifications(false)
          }
        } else {
          setAllowNotifications(false)
        }
      } catch (error) {
        console.error(error);
      }
    }

    getPermission()
  }, [])
  
  function handleNotificationPermission() {
    setAllowNotifications(prev => !prev)
    if (allowNotifications) {
      toggleNotificationPermission(false);
    } else {
      toggleNotificationPermission(true);
    }
  };

  return (
    <View style={styles.settingsContainer}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <View style={styles.settingsSafeArea}>
        <View style={styles.settingsHeader}>
          <Image
            style={styles.settingsIcon}
            source={require("../../assets/images/icon.png")}
          />
          <Text style={styles.settingsHeaderText}>TODOit</Text>
        </View>
      </View>

      <Text style={styles.settingsTitle}>Personalize</Text>
      <View style={styles.settingsContentContainer}>
        <View style={styles.settingsContentRow}>
          <View style={styles.settingsContentLabel}>
            <Ionicons
              style={styles.settingsContentIcon}
              name={
                colorScheme === "dark" ? "moon-outline" : "sunny-outline"
              }
            />
            <Text style={styles.settingsContentText}>
              {colorScheme}
            </Text>
          </View>
          <Switch
            trackColor={{
              true: colorTheme,
            }}
            thumbColor={theme.pallete.lightGray}
            onValueChange={() =>
              setColorScheme(colorScheme === "dark" ? "light" : "dark")
            }
            value={colorScheme === "dark"}
          />
        </View>
        <View style={styles.settingsThemeRow}>
          <View style={styles.settingsThemeButton}>
            <Ionicons
              style={styles.settingsThemeIcon}
              name="color-palette-outline"
              size={24}
              color="#fff"
            />
            <Text style={styles.settingsThemeButtonText}>Theme</Text>
          </View>
          <ThemePicker color={colorTheme} setColor={setColorTheme} />
        </View>
      </View>
        <Text style={styles.settingsTitle}>Notification</Text>
        <View style={styles.settingsContentRow}>
          <View style={styles.settingsContentLabel}>
            <Ionicons
              style={styles.settingsContentIcon}
              name="notifications-outline"
            />
            <Text style={styles.settingsContentText}>
              Allow Notifications
            </Text>
          </View>
          <Switch
            trackColor={{
              true: colorTheme,
            }}
            thumbColor={theme.pallete.lightGray}
            onValueChange={handleNotificationPermission}
            value={allowNotifications}
          />
        </View>
    </View>
  )
}

function createStyles(theme: Ttheme) {
  return StyleSheet.create({
    settingsThemeRow: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%"
    },
    settingsThemeIcon: {
      color: theme.fontColor.secondary,
      fontSize: 25,
    },
    settingsThemeButton: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    settingsThemeButtonText: {
      color: theme.fontColor.secondary,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeML,
      textTransform: "capitalize",
      fontWeight: "500",
    },
    settingsContainer: {
      flex: 1,
      padding: 20,
    },
    settingsSafeArea: {
      marginBottom: 20,
    },
    settingsHeader: {
      marginBottom: 20,
      display: "flex",
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    settingsHeaderText: {
      color: theme.fontColor.primary,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeL,
      fontWeight: 500,
    },
    settingsIcon: {
      width: 50,
      height: 50,
      marginBottom: 10,
    },
    settingsTitle: {
      color: theme.fontColor.primary,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeML,
      fontWeight: "semibold",
      marginBottom: 10,
    },
    settingsContentContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      gap: 10,
    },
    settingsContentRow: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    settingsContentLabel: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    settingsContentIcon: {
      color: theme.fontColor.secondary,
      fontSize: 25,
    },
    settingsContentText: {
      color: theme.fontColor.secondary,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeML,
      textTransform: "capitalize",
      fontWeight: "500",
    },
  })
}