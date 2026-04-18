import {
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useBooks } from "../../hooks/useBooks";
import { useRouter } from "expo-router";
import { useState } from "react";
import BookForm from "../../components/BookForm";
import Spacer from "../../components/Spacer";
import ThemedScrollView from "../../components/ThemedScrollView";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import type { BookInput } from "../../types/app";

const Create = () => {
  const [loading, setLoading] = useState(false);

  const { createBook } = useBooks();
  const router = useRouter();

  const handleSubmit = async (data: BookInput) => {
    setLoading(true);

    try {
      await createBook(data);
      router.replace("/books");
    } catch (error) {
      Alert.alert(
        "Unable to save book",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ThemedScrollView contentContainerStyle={styles.scrollContainer}>
          <ThemedView style={styles.content}>
            <ThemedText title={true} style={styles.heading}>
              Add a New Book
            </ThemedText>
            <Spacer />
            <BookForm
              submitLabel="Create Book"
              loadingLabel="Saving..."
              loading={loading}
              onSubmit={handleSubmit}
            />
          </ThemedView>
        </ThemedScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    justifyContent: "center",
  },
  heading: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
