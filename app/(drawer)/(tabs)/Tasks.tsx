import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Ttheme } from '@/types/dataType';
import { useThemeContext } from '@/context/ThemeContext';

export default function Task() {
  const { theme, colorTheme } = useThemeContext();
  const styles = createStyle(theme, colorTheme);
  return (
    <View style={styles.mainContainer}>

    </View>
  )
}

function createStyle(theme: Ttheme, colorTheme: string) {
  return StyleSheet.create({
    mainContainer: {
      height: "100%",
      width: "100%",
      backgroundColor: theme.background
    }
  })
}