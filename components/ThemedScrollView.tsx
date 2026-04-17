import type { ComponentProps } from "react";
import { ScrollView, useColorScheme } from "react-native";
import { getTheme } from "../constants/Colors";

type ThemedScrollViewProps = ComponentProps<typeof ScrollView>;

const ThemedScrollView = ({
  style,
  contentContainerStyle,
  children,
  ...props
}: ThemedScrollViewProps) => {
  const theme = getTheme(useColorScheme());

  return (
    <ScrollView
      style={[
        {
          flex: 1,
          backgroundColor: theme.background,
        },
        style,
      ]}
      contentContainerStyle={contentContainerStyle}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  );
};

export default ThemedScrollView;
