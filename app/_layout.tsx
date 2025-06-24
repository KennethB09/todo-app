import 'expo-dev-client';
import { Stack } from "expo-router";
import { TodoProvider } from "@/context/context";
import { TodoListDataProvider } from "@/context/todoListContext";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Poppins_400Regular, Poppins_500Medium } from "@expo-google-fonts/poppins";
import { ThemeProvider } from '@/context/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium
  });

  useEffect(() => {
      if (!loaded) {
        SplashScreen.hideAsync();
      }
    }, [loaded]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <TodoListDataProvider>
          <TodoProvider>
            <Stack>
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
              <Stack.Screen name="TodoScreen" options={{ headerShown: false, animation: "slide_from_right" }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </TodoProvider>
        </TodoListDataProvider>
      </ThemeProvider>
    </GestureHandlerRootView>

  );
}
