import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import BookForm from "../../../../components/BookForm";
import Spacer from "../../../../components/Spacer";
import ThemedLoader from "../../../../components/ThemedLoader";
import ThemedScrollView from "../../../../components/ThemedScrollView";
import ThemedText from "../../../../components/ThemedText";
import ThemedView from "../../../../components/ThemedView";
import { useBooks } from "../../../../hooks/useBooks";
import type { Book, BookInput } from "../../../../types/app";

const EditBook = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const bookId = Array.isArray(id) ? id[0] : id;
  const { fetchBookById, updateBook } = useBooks();
  const router = useRouter();

  const handleSubmit = async (data: BookInput) => {
    if (!bookId) return;

    setLoading(true);

    try {
      await updateBook(bookId, data);
      router.replace(`/books/${bookId}`);
    } catch (error) {
      Alert.alert(
        "Unable to update book",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!bookId) return;

    async function loadBook() {
      const bookData = await fetchBookById(bookId);
      setBook(bookData ?? null);
    }

    loadBook();
  }, [bookId]);

  if (!book) {
    return (
      <ThemedView safe style={styles.loaderContainer}>
        <ThemedLoader />
      </ThemedView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ThemedScrollView contentContainerStyle={styles.scrollContainer}>
          <ThemedView style={styles.content}>
            <ThemedText title={true} style={styles.heading}>
              Edit Book
            </ThemedText>
            <Spacer />
            <BookForm
              initialValues={book}
              submitLabel="Update Book"
              loadingLabel="Updating..."
              loading={loading}
              onSubmit={handleSubmit}
            />
          </ThemedView>
        </ThemedScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default EditBook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
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
