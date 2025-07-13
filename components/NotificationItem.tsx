import { View, Text, StyleSheet } from "react-native";
import { formatDistanceToNow } from "date-fns";
import { notification, Ttheme } from "@/types/dataType";
import { useThemeContext } from "@/context/ThemeContext";

type NotificationItemProps = {
  notification: notification;
};

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const { theme } = useThemeContext();
  const styles = createStyle(theme);

  return (
    <View key={notification.id} style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{notification.title}</Text>
        <Text style={styles.headerTimestamps}>
          {formatDistanceToNow(new Date(notification.timestamp), {
            addSuffix: true,
          })}
        </Text>
      </View>
      <Text style={styles.body}>{notification.content}</Text>
    </View>
  );
}

function createStyle(theme: Ttheme) {
  return StyleSheet.create({
    mainContainer: {
      paddingHorizontal: 20,
      paddingVertical: 10
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end"
    },
    headerTitle: {
      fontFamily: theme.fontFamily,
      color: theme.fontColor.primary,
      fontWeight: "semibold",
      fontSize: theme.fontSizeML,
    },
    headerTimestamps: {
      fontFamily: theme.fontFamily,
      color: theme.fontColor.primary,
      fontWeight: "semibold",
      fontSize: theme.fontSizeS,
    },
    body: {
      fontFamily: theme.fontFamily,
      color: theme.fontColor.secondary,
      fontWeight: "regular",
      fontSize: theme.fontSizeM,
    },
  });
}
