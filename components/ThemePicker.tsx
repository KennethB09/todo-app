import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { Ttheme } from "@/types/dataType";
import { pastelBg } from "@/constants/theme";

const COLORS = pastelBg;

type ThemePickerProps = {
  setColor: React.Dispatch<React.SetStateAction<string>>;
  color: string;
};

export default function ThemePicker({ setColor, color }: ThemePickerProps) {
  const { theme } = useThemeContext();
  const [modalVisible, setModalVisible] = useState(false);
  const styles = createStyles(theme, color);

  const handleColorPick = (color: any) => {
    setColor(color);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.pickerCircle}></View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Choose a color:</Text>
          <View style={styles.colorRow}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorCircle, { backgroundColor: color }]}
                onPress={() => handleColorPick(color)}
              />
            ))}
          </View>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

function createStyles(theme: Ttheme, color: string) {
  return StyleSheet.create({
    container: {
      display: "flex",
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.background,
      padding: 24,
      borderRadius: 12,
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 20,
      marginBottom: 16,
      color: theme.fontColor.primary,
      fontFamily: theme.fontFamily,
    },
    colorRow: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      width: "100%",
      gap: 8,
      marginBottom: 16,
    },
    colorCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginHorizontal: 8,
    },
    closeText: {
      color: theme.pink,
      marginTop: 8,
      fontSize: 16,
    },
    pickerCircle: {
      backgroundColor: color,
      width: 30,
      height: 30,
      borderTopLeftRadius: 50,
      borderBottomLeftRadius: 50,
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
      borderWidth: 1,
      borderColor: theme.fontColor.secondary,
    },
  });
}
