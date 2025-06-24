import { useThemeContext } from "@/context/ThemeContext";
import { Ttheme } from "@/types/dataType";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type option = {
  label: string;
  value: "simple" | "scheduled";
};

type RadioButtonProps = {
  options: option[];
  value: string;
  onChange: React.Dispatch<React.SetStateAction<"simple" | "scheduled">>;
};

export default function RadioButton({
  options,
  value,
  onChange,
}: RadioButtonProps) {
  const { theme, colorTheme } = useThemeContext();
  const styles = createStyles(theme);

  return options.map((option) => {
    const isSelected = option.value === value;
    return (
      <TouchableOpacity
        key={option.value}
        onPress={() => onChange(option.value)}
        style={styles.radioButton}
      >
        <Ionicons
          name={
            isSelected ? "radio-button-on-outline" : "radio-button-off-outline"
          }
          color={isSelected ? colorTheme : theme.fontColor.secondary}
          size={20}
        />
        <Text style={styles.label}>{option.label}</Text>
      </TouchableOpacity>
    );
  });
}

function createStyles(theme: Ttheme) {
  return StyleSheet.create({
    radioButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
    },
    label: {
      marginLeft: 10,
      color: theme.fontColor.primary,
      fontSize: theme.fontSizeM,
      textTransform: "capitalize",
      width: 80,
      fontFamily: theme.fontFamily,
    },
  });
}
