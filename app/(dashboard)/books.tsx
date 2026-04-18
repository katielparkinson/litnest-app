import { FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import Spacer from "../../components/Spacer";
import ThemedCard from "../../components/ThemedCard";
import ThemedDropdown from "../../components/ThemedDropdown";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useBooks } from "../../hooks/useBooks";
import type { Book, BookStatus, DropdownOption } from "../../types/app";

const statusData: DropdownOption[] = [
  { label: "All", value: "all" },
  { label: "To Be Read (TBR)", value: "tbr" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Did Not Finish (DNF)", value: "dnf" },
];

const Books = () => {
  const { books } = useBooks();
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<"all" | BookStatus>("all");

  const filteredBooks = useMemo(() => {
    if (selectedStatus === "all") {
      return books;
    }

    return books.filter((book) => book.status === selectedStatus);
  }, [books, selectedStatus]);

  return (
    <ThemedView style={styles.container} safe>
      <Spacer />
      <ThemedText title style={styles.heading}>
        Your Reading List
      </ThemedText>
      <Spacer height={15} />
      <ThemedDropdown
        label="Filter by Status"
        data={statusData}
        value={selectedStatus}
        onChange={(value) => setSelectedStatus(value as "all" | BookStatus)}
        placeholder="Select Status..."
      />
      <FlatList<Book>
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <ThemedText style={styles.emptyState}>
            No books match this filter yet.
          </ThemedText>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/books/${item.id}`)}>
            <ThemedCard style={styles.card}>
              <ThemedText style={styles.title}>{item.title}</ThemedText>
              <ThemedText>Author: {item.author}</ThemedText>
            </ThemedCard>
          </Pressable>
        )}
      />
    </ThemedView>
  );
};

export default Books;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  heading: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    marginTop: 40,
    width: "100%",
    paddingBottom: 40,
  },
  card: {
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: 10,
    padding: 10,
    paddingLeft: 14,
    borderLeftColor: Colors.primary,
    borderLeftWidth: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyState: {
    textAlign: "center",
    marginTop: 40,
    paddingHorizontal: 24,
  },
});
