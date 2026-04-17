import type { ComponentProps } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

type ThemedButtonProps = ComponentProps<typeof Pressable>;

function ThemedButton({ style, ...props }: ThemedButtonProps) {
  const buttonStyle: ThemedButtonProps["style"] = (state) => {
    const resolvedStyle = typeof style === "function" ? style(state) : style;

    return [styles.button, state.pressed && styles.pressed, resolvedStyle];
  };

  return (
    <Pressable style={buttonStyle} {...props} />
  );
}

export default ThemedButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  pressed: {
    opacity: 0.5,
  },
});
