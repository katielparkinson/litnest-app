import { StyleSheet, Text, Image } from "react-native";
import { Link } from "expo-router";

//themed component imports
import ThemedView from "../components/ThemedView";
import ThemedLogo from "../components/ThemedLogo";
import Spacer from "../components/Spacer";
import ThemedText from "../components/ThemedText";

const Home = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title} title={true} fontSize={25}>
        LITNEST
      </ThemedText>
      <ThemedLogo
        style={{
          width: "40%",
          height: undefined,
          aspectRatio: 1,
          resizeMode: "contain",
        }}
      />
      <Spacer height={20} />
      {/*<Image source={uri:'yourimage'}/>*/}
      <ThemedText style={styles.title} title={true}>
        The Number 1
      </ThemedText>
      <Spacer height={10} />
      <ThemedText>Reading List App</ThemedText>
      <Spacer />
      <Link href="/login" style={styles.link}>
        <ThemedText>Login Page</ThemedText>
      </Link>
      <Link href="/register" style={styles.link}>
        <ThemedText>Register Page</ThemedText>
      </Link>
      <Link href="/profile" style={styles.link}>
        <ThemedText>Profile Page</ThemedText>
      </Link>
    </ThemedView>
  );
};

export default Home;

const styles = StyleSheet.create({
  //rules defined inside it
  //container will contain CSS properties, camelcase because it is JS
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
  },
});
