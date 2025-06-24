import { Drawer } from "expo-router/drawer";
import {
  View,
  Pressable,
  Text,
  Platform,
  Image,
  StyleSheet,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/context/ThemeContext";
import { DrawerItemList } from "@react-navigation/drawer";
import { Ttheme } from "@/types/dataType";
import ThemePicker from "@/components/ThemePicker";

export default function ScreenLayout() {
  const { setColorScheme, setColorTheme, colorScheme, theme, colorTheme } =
    useThemeContext();
  const styles = createStyles(theme);

  return (
    <Drawer
      screenOptions={() => ({
        lazy: true,
        unmountOnBlur: true,
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.background,
          borderBottomLeftRadius: 0,
          borderTopLeftRadius: 0,
        },
        drawerActiveBackgroundColor:
          colorScheme === "dark" ? "#413f40" : "#f0f0f0",
        drawerInactiveTintColor: theme.textColor,
        drawerActiveTintColor: colorTheme,
        drawerHideStatusBarOnOpen: Platform.OS === "ios",
        drawerPosition: "right",
      })}
      drawerContent={(props) => {
        return (
          <View style={styles.drawerContentContainer}>
            <SafeAreaView style={styles.drawerContentSafeArea}>
              <View style={styles.drawerContentHeader}>
                <Image
                  style={styles.drawerContentIcon}
                  source={require("../../assets/images/icon.png")}
                />
                <Text style={styles.drawerContentHeaderText}>TODOit</Text>
              </View>
              <View>
                <DrawerItemList {...props} />
              </View>
            </SafeAreaView>

            <Text style={styles.drawerPersonalizeTitle}>Personalize</Text>
            <View style={styles.drawerPersonalizeContentContainer}>
              <View style={styles.drawerPersonalizeContent}>
                <View style={styles.drawerPersonalizeContentLabel}>
                  <Ionicons
                    style={styles.drawerPersonalizeContentIcon}
                    name={
                      colorScheme === "dark" ? "moon-outline" : "sunny-outline"
                    }
                  />
                  <Text style={styles.drawerPersonalizeContentText}>
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
              <View style={styles.drawerPersonalizeContentTheme}>
                <View style={styles.buttonContent}>
                  <Ionicons
                    style={styles.buttonIcon}
                    name="color-palette-outline"
                    size={24}
                    color="#fff"
                  />
                  <Text style={styles.buttonText}>Theme</Text>
                </View>
                <ThemePicker color={colorTheme} setColor={setColorTheme} />
              </View>
            </View>
          </View>
        );
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Dashboard",
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          drawerLabelStyle: {
            fontSize: theme.fontSizeML,
          },
        }}
      />
    </Drawer>
  );
}

function createStyles(theme: Ttheme) {
  return StyleSheet.create({
    drawerPersonalizeContentTheme: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%"
    },
    buttonIcon: {
      color: theme.fontColor.secondary,
      fontSize: 25,
    },
    buttonContent: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    buttonText: {
      color: theme.fontColor.secondary,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeML,
      textTransform: "capitalize",
      fontWeight: "500",
    },
    drawerContentContainer: {
      flex: 1,
      padding: 20,
    },
    drawerContentSafeArea: {
      marginBottom: 20,
    },
    drawerContentHeader: {
      marginBottom: 20,
      display: "flex",
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    drawerContentHeaderText: {
      color: theme.fontColor.primary,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeL,
      fontWeight: 500,
    },
    drawerContentIcon: {
      width: 50,
      height: 50,
      marginBottom: 10,
    },
    drawerPersonalizeTitle: {
      color: theme.fontColor.primary,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeML,
      fontWeight: "semibold",
      marginBottom: 10,
    },
    drawerPersonalizeContentContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      gap: 10,
    },
    drawerPersonalizeContent: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    drawerPersonalizeContentLabel: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    drawerPersonalizeContentIcon: {
      color: theme.fontColor.secondary,
      fontSize: 25,
    },
    drawerPersonalizeContentText: {
      color: theme.fontColor.secondary,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizeML,
      textTransform: "capitalize",
      fontWeight: "500",
    },
  });
}
