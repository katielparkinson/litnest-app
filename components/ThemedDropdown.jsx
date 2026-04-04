import { StyleSheet, View, useColorScheme } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "../constants/Colors";

import ThemedText from "./ThemedText";

const ThemedDropdown = ({
  label,
  data,
  value,
  onChange,
  placeholder = "Select status...",
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View style={styles.container}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}

      <Dropdown
        style={[
          styles.dropdown,
          {
            backgroundColor: theme.uiBackground,
            borderColor: theme.iconColor,
          },
          style,
        ]}
        containerStyle={[
          styles.dropdownContainer,
          {
            backgroundColor: theme.uiBackground,
            borderColor: theme.iconColor,
          },
        ]}
        placeholderStyle={{
          fontSize: 15,
          color: theme.text,
          opacity: 0.4,
        }}
        selectedTextStyle={{
          fontSize: 15,
          color: theme.text,
        }}
        itemTextStyle={{ color: theme.text }}
        itemContainerStyle={{ borderRadius: 6 }}
        activeColor={`${theme.iconColor}30`}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={(item) => onChange?.(item.value)}
        showsVerticalScrollIndicator={false}
        {...props}
      />
    </View>
  );
};

export default ThemedDropdown;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
    paddingHorizontal: 40,
  },
  label: {
    marginBottom: 6,
    fontSize: 15,
    fontWeight: "500",
  },
  dropdown: {
    height: 56,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 20,
  },
  dropdownContainer: {
    borderRadius: 6,
    borderWidth: 1,
  },
});
