import { Text, View } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";

type EmptyListProps = {
    text: string
}

export default function EmptyList({ text }: EmptyListProps) {
  const { theme } = useThemeContext();

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Text
        style={{
          color: theme.listInfo,
          textAlign: "center",
          fontSize: 20,
        }}
      >
        {text}
      </Text>
    </View>
  );
}
