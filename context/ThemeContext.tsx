import React, { createContext, ReactElement, ReactNode, useContext, useState, useEffect } from "react";
import { Ttheme, TpastelTheme } from "@/types/dataType";
import { Theme } from "@/constants/theme";
import { Appearance } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

type TjsonTheme = {
    colorScheme: "light" | "dark" | null | undefined;
    colorTheme: string;
}

type ThemeContext = {
    theme: Ttheme;
    colorTheme: string;
    setColorTheme: React.Dispatch<React.SetStateAction<string>>;
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
    const [colorTheme, setColorTheme] = useState<string>(theme.pink);

    useEffect(() => {
        async function getTheme() {
            try {
                const json = await AsyncStorage.getItem("todoTheme");
                const theme: TjsonTheme = json != null ? JSON.parse(json) : null;
    
                if (theme) {
                    setColorScheme(theme.colorScheme);
                    setColorTheme(theme.colorTheme);
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
            const json = JSON.stringify({ colorScheme: colorScheme, colorTheme: colorTheme });
            await AsyncStorage.setItem("todoTheme", json);
          } catch (error) {
            console.error(error)
          }
        }
        saveTheme()
    
      }, [colorScheme, colorTheme]);

    return (
        <themeContext.Provider value={{ theme, colorTheme, colorScheme, setColorScheme, setColorTheme }}>
            {children}
        </themeContext.Provider>
    )
}

export { ThemeProvider, useThemeContext }