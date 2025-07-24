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
          color: theme.fontColor.tertiary,
          fontFamily: theme.fontFamily,
          textAlign: "center",
          fontSize: 15,
          textTransform: "uppercase",
          fontWeight: "bold"
        }}
      >
        {text}
      </Text>
    </View>
  );
}
