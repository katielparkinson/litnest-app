import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useBooks } from "../../hooks/useBooks";
import { useRouter } from "expo-router";
import { useState } from "react";

import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import ThemedTextInput from "../../components/ThemedTextInput";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedDropdown from "../../components/ThemedDropdown";
import ThemedScrollView from "../../components/ThemedScrollView";

const Create = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const { createBook } = useBooks();
  const router = useRouter();

  const statusData = [
    { label: "To Be Read (TBR)", value: "tbr" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
    { label: "Did Not Finish (DNF)", value: "dnf" },
  ];

  const handleSubmit = async () => {
    if (!title.trim() || !author.trim()) return;
    setLoading(true);
    await createBook({
      title,
      author,
      status: status || "tbr",
      notes: notes.trim() || undefined,
    });
    //reset fields
    setTitle("");
    setAuthor("");
    setStatus(null);
    setNotes("");

    //redirect user
    router.replace("/books");

    //reset loading state
    setLoading(false);
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

            <ThemedTextInput
              style={styles.input}
              placeholder="Book Title"
              value={title}
              onChangeText={setTitle}
            />
            <Spacer />
            <ThemedTextInput
              style={styles.input}
              placeholder="Author"
              value={author}
              onChangeText={setAuthor}
            />
            <Spacer />
            <ThemedDropdown
              label="Status"
              data={statusData}
              value={status}
              onChange={(value) => setStatus(value)}
              placeholder="Select Status..."
            />
            <Spacer />
            <ThemedTextInput
              style={styles.multiline}
              placeholder="Book Notes"
              value={notes}
              onChangeText={setNotes}
              multiline={true}
            />
            <Spacer />
            <ThemedButton onPress={handleSubmit} disabled={loading}>
              <Text style={{ color: "#fff" }}>
                {loading ? "Saving..." : "Create Book"}
              </Text>
            </ThemedButton>
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
  input: {
    padding: 20,
    borderRadius: 6,
    alignSelf: "stretch",
    marginHorizontal: 40,
  },
  multiline: {
    padding: 20,
    borderRadius: 6,
    minHeight: 100,
    alignSelf: "stretch",
    marginHorizontal: 40,
  },
});
