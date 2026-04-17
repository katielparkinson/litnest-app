import { createContext, useEffect, type PropsWithChildren, useState } from "react";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { client, databases } from "../lib/appwrite";
import { useUser } from "../hooks/useUser";
import type { Book, BookInput, BooksContextValue } from "../types/app";

const DATABASE_ID = "699fd974001f84313604";
const COLLECTION_ID = "699fd9ec0012db8d0fc2";

export const BooksContext = createContext<BooksContextValue | undefined>(
  undefined,
);

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong";

export function BooksProvider({ children }: PropsWithChildren) {
  const [books, setBooks] = useState<Book[]>([]);
  const { user } = useUser();

  async function fetchBooks() {
    if (!user?.$id) return;

    try {
      const response = await databases.listRows<Book>({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        queries: [Query.equal("userId", user.$id), Query.orderAsc("$createdAt")],
      });
      setBooks(response.rows);
    } catch (error) {
      console.error("fetchBooks error:", getErrorMessage(error));
    }
  }

  async function fetchBookById(id: string) {
    try {
      const response = await databases.getRow<Book>({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: id,
      });
      return response;
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  }

  async function createBook(data: BookInput) {
    if (!user?.$id) return;

    try {
      await databases.createRow<Book>({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: ID.unique(),
        data: { userId: user.$id, status: "tbr", ...data },
        permissions: [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ],
      });
    } catch (error) {
      console.error("createBook error:", getErrorMessage(error));
    }
  }

  async function deleteBook(id: string) {
    try {
      await databases.deleteRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: id,
      });
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  }

  useEffect(() => {
    let unsubscribe: VoidFunction | undefined;
    const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`;

    if (user?.$id) {
      fetchBooks();
      unsubscribe = client.subscribe(channel, (response) => {
        const payload = response.payload as Book;
        const event = response.events[0];

        if (payload.userId !== user.$id) return;

        if (event?.includes("create")) {
          setBooks((prevBooks) => [...prevBooks, payload]);
        }

        if (event?.includes("delete")) {
          setBooks((prevBooks) =>
            prevBooks.filter((book) => book.$id !== payload.$id),
          );
        }
      });
    } else {
      setBooks([]);
    }

    return () => {
      unsubscribe?.();
    };
  }, [user?.$id]);

  return (
    <BooksContext.Provider
      value={{ books, fetchBooks, fetchBookById, createBook, deleteBook }}
    >
      {children}
    </BooksContext.Provider>
  );
}
