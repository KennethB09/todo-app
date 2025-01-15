import React, { createContext, ReactElement, ReactNode, useContext, useState, useEffect } from "react";
import { Ttheme } from "@/app/(screens)";
import { Theme } from "@/constants/theme";
import { Appearance } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeContext = {
    theme: Ttheme;
    colorScheme: "light" | "dark" | null | undefined;
    setColorScheme: React.Dispatch<React.SetStateAction<"light" | "dark" | null | undefined>>
}

const themeContext = createContext<ThemeContext | undefined>(undefined);

function useThemeContext() {
    const context = useContext(themeContext);

    if (!context) {
        throw new Error("Theme context must be use within a Theme Provider.")
    }

    return context;
};

function ThemeProvider({ children }: { children: ReactNode }): ReactElement {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme())
    const theme = colorScheme === 'dark' ? Theme.dark : Theme.light;

    useEffect(() => {
        async function getTheme() {
            try {
                const json = await AsyncStorage.getItem("todoTheme");
                const theme = json != null ? JSON.parse(json) : null;
    
                if (theme) {
                    setColorScheme(theme)
                } else {
                    setColorScheme(Appearance.getColorScheme())
                }
            } catch (error) {
                console.error(error)
            }
        }

        getTheme()
    }, [])

    useEffect(() => {
        async function saveTheme() {
          try {
            const json = JSON.stringify(colorScheme);
            await AsyncStorage.setItem("todoTheme", json);
          } catch (error) {
            console.error(error)
          }
        }
        saveTheme()
    
      }, [colorScheme]);

    return (
        <themeContext.Provider value={{ theme, colorScheme, setColorScheme }}>
            {children}
        </themeContext.Provider>
    )
}

export { ThemeProvider, useThemeContext }