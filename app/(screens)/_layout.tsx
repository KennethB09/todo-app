import { Drawer } from 'expo-router/drawer';
import { View, Pressable, Text, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/context/ThemeContext";
import { DrawerItemList } from "@react-navigation/drawer";

export default function ScreenLayout() {
    const { setColorScheme, colorScheme, theme } = useThemeContext();
    return (
        <Drawer screenOptions={({ navigation }) => ({
            headerLeft: () =>
                <Pressable onPress={navigation.toggleDrawer} style={{ marginLeft: 15 }}>
                    <Ionicons name="menu" color={theme.pink} size={40} />
                </Pressable >,
            drawerStyle: {
                backgroundColor: theme.background,
                borderBottomRightRadius: 0,
                borderTopRightRadius: 0,
            },
            drawerActiveBackgroundColor: colorScheme === "dark" ? '#413f40' : '#efebed',
            drawerInactiveTintColor: theme.textColor,
            drawerActiveTintColor: theme.pink,
            drawerHideStatusBarOnOpen: Platform.OS === "ios"
        })}
            drawerContent={(props) => {
                return (
                    <View style={{ flex: 1, padding: 20 }}>
                        <SafeAreaView style={{ marginBottom: 20 }}>
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ color: theme.pink, fontFamily: theme.fontFamily, fontSize: theme.fontSizeL, fontWeight: 500 }}>MENU</Text>
                            </View>
                            <DrawerItemList {...props} />
                        </SafeAreaView>
                        <View style={{height: 2, backgroundColor: 'gray', marginBottom: 20}}></View>
                        <Pressable onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')} style={{ flexDirection: 'row', gap: 20, justifyContent: 'center', borderRadius: 10, borderColor: 'gray', borderWidth: 2, padding: 10, width: '100%' }}>
                            <Text style={{ color: theme.textColor, fontSize: theme.fontSizeML, fontWeight: 500, fontFamily: theme.fontFamily }}>Theme</Text>
                            <Ionicons name={colorScheme === 'dark' ? 'moon' : 'sunny'} color={theme.textColor} size={25} />
                        </Pressable>
                    </View>
                )
            }}
        >
            <Drawer.Screen name="index" options={{
                headerShown: true, title: "TODO",
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerStyle: { backgroundColor: theme.background, height: 100 },
                headerTitleStyle: { color: theme.pink, fontSize: theme.fontSizeEX, fontFamily: theme.fontFamily, fontWeight: 500 },
                drawerIcon: ({ color }) => (
                    <Ionicons name="list" size={30} color={theme.pink} />
                )
            }}
            />
            <Drawer.Screen name="Archive" options={{
                headerShown: true,
                title: "ARCHIVE",
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerStyle: { backgroundColor: theme.background, height: 100 },
                headerTitleStyle: { color: theme.pink, fontSize: theme.fontSizeEX, fontFamily: theme.fontFamily, fontWeight: 500 },
                drawerIcon: ({ color }) => (
                    <Ionicons name="archive-outline" size={30} color={theme.pink} />
                )
            }}
            />
            <Drawer.Screen name="TodoScreen" options={{
                headerShown: false,
                drawerItemStyle: {display: 'none'}
            }}
            />
        </Drawer>
    )
}