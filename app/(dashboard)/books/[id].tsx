import { Alert, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Spacer from "../../../components/Spacer";
import ThemedButton from "../../../components/ThemedButton";
import ThemedCard from "../../../components/ThemedCard";
import ThemedLoader from "../../../components/ThemedLoader";
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import { Colors } from "../../../constants/Colors";
import { useBooks } from "../../../hooks/useBooks";
import type { Book } from "../../../types/app";

const BookDetails = () => {
  const [book, setBook] = useState<Book | null>(null);
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const bookId = Array.isArray(id) ? id[0] : id;
  const { fetchBookById, deleteBook } = useBooks();
  const router = useRouter();

  const handleDelete = () => {
    if (!bookId) return;

    Alert.alert(
      "Delete Book",
      "Are you sure? This action is permanent and cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBook(bookId);
              setBook(null);
              router.replace("/books");
            } catch (error) {
              Alert.alert("Error", "Failed to delete the book. Please try again.");
              console.error("Delete error:", error);
            }
          },
        },
      ],
    );
  };

  useEffect(() => {
    if (!bookId) return;

    async function loadBook() {
      const bookData = await fetchBookById(bookId);
      setBook(bookData ?? null);
    }

    loadBook();
  }, [bookId, fetchBookById]);

  if (!book) {
    return (
      <ThemedView safe style={styles.container}>
        <ThemedLoader />
      </ThemedView>
    );
  }

  return (
    <ThemedView safe style={styles.container}>
      <ThemedCard style={styles.card}>
        <ThemedText style={styles.title}>{book.title}</ThemedText>
        <ThemedText title>
          Author: <ThemedText>{book.author}</ThemedText>
        </ThemedText>
        <Spacer height={10} />
        <ThemedText title>
          Status: <ThemedText>{book.status}</ThemedText>
        </ThemedText>
        <Spacer height={10} />
        <ThemedText title>Book notes:</ThemedText>
        <Spacer height={10} />
        <ThemedText>{book.notes}</ThemedText>
      </ThemedCard>
      <ThemedButton style={styles.delete} onPress={handleDelete}>
        <Text style={{ color: "#fff", textAlign: "center" }}>Delete Book</Text>
      </ThemedButton>
    </ThemedView>
  );
};

export default BookDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  title: {
    fontSize: 22,
    marginVertical: 10,
  },
  card: {
    margin: 20,
  },
  delete: {
    marginTop: 40,
    backgroundColor: Colors.warning,
    width: 200,
    alignSelf: "center",
  },
});
