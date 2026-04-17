import type { ComponentProps } from "react";
import { View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getTheme } from "../constants/Colors";

type ThemedViewProps = ComponentProps<typeof View> & {
  safe?: boolean;
};

const ThemedView = ({ style, safe = false, ...props }: ThemedViewProps) => {
  const theme = getTheme(useColorScheme());
  const insets = useSafeAreaInsets();

  if (!safe) {
    return <View style={[{ backgroundColor: theme.background }, style]} {...props} />;
  }

  return (
    <View
      style={[
        {
          backgroundColor: theme.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedView;
