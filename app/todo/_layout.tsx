import { Stack } from "expo-router";

export default function ScreenLayout() {
   
    return (
        <Stack>
            <Stack.Screen name="TodoScreen" options={{ headerShown: false }} />
        </Stack>
    )
}