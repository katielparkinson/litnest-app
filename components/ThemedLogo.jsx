import { Image, useColorScheme } from "react-native";
//images
import DarkLogo from "../assets/img/logo_dark.png";
import LightLogo from "../assets/img/logo_light.png";

const ThemedLogo = ({ ...props }) => {
  const colorScheme = useColorScheme();

  //this is a ternary operator. it evaluates a boolean condition, returning the first expression if true and the second if false. If-else
  const logo = colorScheme === "dark" ? DarkLogo : LightLogo;
  return <Image source={logo} {...props} />;
};

export default ThemedLogo;
