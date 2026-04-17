import type { ComponentProps } from "react";
import { Text, useColorScheme } from "react-native";
import { getTheme } from "../constants/Colors";

type ThemedTextProps = ComponentProps<typeof Text> & {
  title?: boolean;
};

const ThemedText = ({ style, title = false, ...props }: ThemedTextProps) => {
  const theme = getTheme(useColorScheme());
  const textColor = title ? theme.title : theme.text;

  return <Text style={[{ color: textColor }, style]} {...props} />;
};

export default ThemedText;
