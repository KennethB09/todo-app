import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { Ttheme } from "@/types/dataType";
import React from "react";

type deleteModalProps = {
  title: string;
  paragraph: string;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteModal: boolean;
  setDispatch: () => void;
};

export default function DeleteModal({
  title,
  paragraph,
  showDeleteModal,
  setShowDeleteModal,
  setDispatch
}: deleteModalProps) {
  const { theme, colorScheme, colorTheme } = useThemeContext();
  const windowL = Dimensions.get("window").width;
  const windowH = Dimensions.get("window").height;
  const styles = createStyles(theme, colorScheme, windowH, windowL, colorTheme);

  function deleteTodo() {
    setDispatch();
    setShowDeleteModal(!showDeleteModal);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.mainContainer}>
        <Text style={styles.modalTextTitle}>{title}</Text>
        <Text style={styles.modalTextPara}>
          {paragraph}
        </Text>
        <View
          style={{ flexDirection: "row", justifyContent: "flex-end", gap: 10 }}
        >
          <TouchableOpacity
            onPress={() => setShowDeleteModal(!showDeleteModal)}
            style={styles.cancelButton}
          >
            <Text style={[styles.modalDeleteButtonText, { color: colorTheme }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deleteTodo}
            style={styles.yesButton}
          >
            <Text
              style={[styles.modalDeleteButtonText, { color: theme.white }]}
            >
              Yes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function createStyles(theme: Ttheme, colorScheme: string | null | undefined, windowH: number, windowW: number, colorTheme: string) {
  return StyleSheet.create({
    overlay: {
      height: windowH,
      width: windowW,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#rgba(0, 0, 0, 0.61)",
      position: "absolute",
    },
    modalDeleteButtonText: {
      fontSize: theme.fontSizeM,
      fontWeight: 500,
      fontFamily: theme.fontFamily,
      textAlign: "center",
    },
    mainContainer: {
      backgroundColor: theme.background,
      width: "85%",
      borderRadius: 10,
      padding: 20,
      gap: 10,
    },
    cancelButton: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colorTheme,
      paddingVertical: 10,
      paddingHorizontal: 20,
      justifyContent: "center",
      width: 100,
    },
    yesButton: {
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colorTheme,
      backgroundColor: colorTheme,
      paddingVertical: 10,
      paddingHorizontal: 20,
      justifyContent: "center",
      width: 100,
    },
    modalTextTitle: {
      color: colorTheme,
      fontSize: theme.fontSizeML,
      fontWeight: 500,
      fontFamily: theme.fontFamily,
    },
    modalTextPara: {
      color: theme.textColor,
      fontSize: theme.fontSizeM,
      fontWeight: 400,
      fontFamily: theme.fontFamily,
    },
  });
}
