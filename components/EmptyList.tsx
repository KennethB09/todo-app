import { DimensionValue, Text, View } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";

type EmptyListProps = {
    text: string;
    height: DimensionValue | undefined;
}

export default function EmptyList({ text, height }: EmptyListProps) {
  const { theme } = useThemeContext();

  return (
    <View
      style={{
        width: "100%",
        height: height,
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
