import type { ComponentProps } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { getTheme } from "../constants/Colors";

type ThemedCardProps = ComponentProps<typeof View>;

const ThemedCard = ({ style, ...props }: ThemedCardProps) => {
  const theme = getTheme(useColorScheme());

  return (
    <View
      style={[{ backgroundColor: theme.uiBackground }, styles.card, style]}
      {...props}
    />
  );
};

export default ThemedCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    padding: 20,
  },
});
