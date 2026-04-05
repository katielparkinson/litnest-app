import { ScrollView, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";

const ThemedScrollView = ({
  style,
  contentContainerStyle,
  children,
  ...props
}) => {
  const colorScheme = useColorScheme();

  return (
    <ScrollView
      style={[
        {
          flex: 1,
          backgroundColor: Colors[colorScheme].background,
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
