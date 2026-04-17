import type { ComponentProps } from "react";
import { TextInput, useColorScheme } from "react-native";
import { getTheme } from "../constants/Colors";

type ThemedTextInputProps = ComponentProps<typeof TextInput>;

const ThemedTextInput = ({ style, ...props }: ThemedTextInputProps) => {
  const theme = getTheme(useColorScheme());

  return (
    <TextInput
      style={[
        {
          backgroundColor: theme.uiBackground,
          color: theme.text,
          padding: 20,
          borderRadius: 6,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedTextInput;
