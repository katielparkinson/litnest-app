import type { ComponentProps } from "react";
import { Image, useColorScheme } from "react-native";
import DarkLogo from "../assets/img/logo_dark.png";
import LightLogo from "../assets/img/logo_light.png";

type ThemedLogoProps = ComponentProps<typeof Image>;

const ThemedLogo = (props: ThemedLogoProps) => {
  const colorScheme = useColorScheme();
  const logo = colorScheme === "dark" ? DarkLogo : LightLogo;

  return <Image source={logo} {...props} />;
};

export default ThemedLogo;
