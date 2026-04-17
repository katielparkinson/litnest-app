import type { ColorSchemeName } from "react-native";

export const Colors = {
  primary: "#8A7CFF",
  warning: "#e48494",
  dark: {
    text: "#E0E0FF",
    title: "#F0F2FF",
    background: "#1E2238",
    navBackground: "#252B45",
    iconColor: "#A0A8FF",
    iconColorFocused: "#CCCCFF",
    uiBackground: "#2A314A",
  },
  light: {
    text: "#3A406B",
    title: "#1E2238",
    background: "#F0F2FF",
    navBackground: "#E8EBFF",
    iconColor: "#6B7ACF",
    iconColorFocused: "#8A7CFF",
    uiBackground: "#E0E4FF",
  },
} as const;

export function getTheme(colorScheme: ColorSchemeName) {
  return colorScheme === "dark" ? Colors.dark : Colors.light;
}
