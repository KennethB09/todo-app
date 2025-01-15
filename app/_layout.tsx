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
              <Stack.Screen name="(screens)" options={{ headerShown: false }} />
              <Stack.Screen name="todo" options={{ headerShown: false }} />
            </Stack>
          </TodoProvider>
        </TodoListDataProvider>
      </ThemeProvider>
    </GestureHandlerRootView>

  );
}
