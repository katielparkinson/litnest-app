import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import Spacer from "./Spacer";
import ThemedButton from "./ThemedButton";
import ThemedDropdown from "./ThemedDropdown";
import ThemedTextInput from "./ThemedTextInput";
import type { BookInput, BookStatus, DropdownOption } from "../types/app";

type BookFormProps = {
  initialValues?: BookInput;
  submitLabel: string;
  loadingLabel: string;
  loading: boolean;
  onSubmit: (data: BookInput) => Promise<void>;
};

const statusData: DropdownOption[] = [
  { label: "To Be Read (TBR)", value: "tbr" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Did Not Finish (DNF)", value: "dnf" },
];

const BookForm = ({
  initialValues,
  submitLabel,
  loadingLabel,
  loading,
  onSubmit,
}: BookFormProps) => {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [author, setAuthor] = useState(initialValues?.author ?? "");
  const [status, setStatus] = useState<BookStatus | null>(
    initialValues?.status ?? null
  );
  const [notes, setNotes] = useState(initialValues?.notes ?? "");

  const handleSubmit = async () => {
    if (!title.trim() || !author.trim()) return;

    await onSubmit({
      title: title.trim(),
      author: author.trim(),
      status: status || "tbr",
      notes: notes.trim() || undefined,
    });
  };

  return (
    <>
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
        onChange={(value) => setStatus(value as BookStatus)}
        placeholder="Select Status..."
      />
      <Spacer />
      <ThemedTextInput
        style={styles.multiline}
        placeholder="Book Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <Spacer />
      <ThemedButton onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? loadingLabel : submitLabel}</Text>
      </ThemedButton>
    </>
  );
};

export default BookForm;

const styles = StyleSheet.create({
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
  buttonText: {
    color: "#fff",
  },
});
