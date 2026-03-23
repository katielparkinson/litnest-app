import { createContext, useEffect, useState } from "react";
import { databases, client } from "../lib/appwrite.js";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { useUser } from "../hooks/useUser.js";

const DATABASE_ID = "699fd974001f84313604";
const COLLECTION_ID = "699fd9ec0012db8d0fc2";

export const BooksContext = createContext();

export function BooksProvider({ children }) {
  const [books, setBooks] = useState([]);
  const { user } = useUser();

  async function fetchBooks() {
    if (!user?.$id) return;
    try {
      const response = await databases.listRows({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        // filter by document owner instead of custom field
        queries: [
          Query.equal("userId", user.$id),
          Query.orderAsc("$createdAt"),
        ],
      });
      setBooks(response.rows);
      console.log(response.rows);
    } catch (error) {
      console.error("fetchBooks error:", error.message);
    }
  }
  async function fetchBookById(id) {
    try {
      const response = await databases.getRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: id,
      });
      return response;
    } catch (error) {
      console.error(error.message);
    }
  }
  async function createBook(data) {
    try {
      const newBook = await databases.createRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: ID.unique(),
        data: { userId: user.$id, status: "tbr", ...data },
        //status: "tbr" sets default when book is created to tbr
        permissions: [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ],
      });
    } catch (error) {
      console.error("createBook error:", error.message);
    }
  }
  async function deleteBook(id) {
    try {
      await databases.deleteRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: id,
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    let unsubscribe;
    const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`;
    if (user) {
      fetchBooks();
      unsubscribe = client.subscribe(channel, (response) => {
        console.log("Realtime event:", response);
        const { payload, events } = response;
        if (payload.userId !== user.$id) return;
        //const isCreate = events.some((e) => e.endsWith(".create"));
        //const isUpdate = events.some((e) => e.endsWith(".update"));
        //const isDelete = events.some((e) => e.endsWith(".delete"));

        if (events[0].includes("create")) {
          setBooks((prevBooks) => [...prevBooks, payload]);
        }
        if (events[0].includes("delete")) {
          setBooks((prevBooks) =>
            prevBooks.filter((book) => book.$id !== payload.$id),
          );
        }
      });
    } else {
      setBooks([]);
    }
    return () => {
      if (unsubscribe) unsubscribe();
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
