import { ActivityIndicator, useColorScheme } from "react-native";
import { getTheme } from "../constants/Colors";
import ThemedView from "./ThemedView";

const ThemedLoader = () => {
  const theme = getTheme(useColorScheme());

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color={theme.text} />
    </ThemedView>
  );
};

export default ThemedLoader;
