import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { getTheme } from "../constants/Colors";
import { BooksProvider } from "../contexts/BooksContext";
import { UserProvider } from "../contexts/UserContext";

const RootLayout = () => {
  const theme = getTheme(useColorScheme());

  return (
    <UserProvider>
      <BooksProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.navBackground },
            headerTintColor: theme.title,
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen name="about" options={{ title: "About" }} />
          <Stack.Screen name="contact" options={{ title: "Contact" }} />
        </Stack>
      </BooksProvider>
    </UserProvider>
  );
};

export default RootLayout;
