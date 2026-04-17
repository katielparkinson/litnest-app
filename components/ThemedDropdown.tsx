import { StyleSheet, View, useColorScheme } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import type { DropdownProps } from "react-native-element-dropdown/lib/typescript/components/Dropdown/model";
import { getTheme } from "../constants/Colors";
import type { DropdownOption } from "../types/app";
import ThemedText from "./ThemedText";

type ThemedDropdownProps = Omit<
  DropdownProps<DropdownOption>,
  "data" | "labelField" | "valueField" | "onChange" | "value"
> & {
  label?: string;
  data: DropdownOption[];
  value?: string | null;
  onChange?: (value: string) => void;
};

const ThemedDropdown = ({
  label,
  data,
  value,
  onChange,
  placeholder = "Select status...",
  style,
  ...props
}: ThemedDropdownProps) => {
  const theme = getTheme(useColorScheme());

  return (
    <View style={styles.container}>
      {label ? <ThemedText style={styles.label}>{label}</ThemedText> : null}

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
