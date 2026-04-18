import { createContext, useEffect, type PropsWithChildren, useState } from "react";
import {
  createBook as createBookRequest,
  deleteBook as deleteBookRequest,
  fetchBookById as fetchBookByIdRequest,
  fetchBooks as fetchBooksRequest,
  getStoredAuthToken,
  updateBook as updateBookRequest,
} from "../lib/api";
import { useUser } from "../hooks/useUser";
import type { Book, BookInput, BooksContextValue } from "../types/app";

export const BooksContext = createContext<BooksContextValue | undefined>(
  undefined,
);

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong";

export function BooksProvider({ children }: PropsWithChildren) {
  const [books, setBooks] = useState<Book[]>([]);
  const { user } = useUser();

  async function fetchBooks() {
    if (!user?.id) return;

    try {
      const token = await getStoredAuthToken();

      if (!token) {
        setBooks([]);
        return;
      }

      const response = await fetchBooksRequest(token);
      setBooks(response);
    } catch (error) {
      console.error("fetchBooks error:", getErrorMessage(error));
    }
  }

  async function fetchBookById(id: string) {
    try {
      const token = await getStoredAuthToken();

      if (!token) {
        return;
      }

      const response = await fetchBookByIdRequest(token, id);
      return response;
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  }

  async function createBook(data: BookInput) {
    if (!user?.id) return;

    try {
      const token = await getStoredAuthToken();

      if (!token) {
        throw new Error("You must be logged in to create a book");
      }

      const response = await createBookRequest(token, data);
      setBooks((prevBooks) => [...prevBooks, response]);
    } catch (error) {
      console.error("createBook error:", getErrorMessage(error));
      throw error;
    }
  }

  async function updateBook(id: string, data: BookInput) {
    try {
      const token = await getStoredAuthToken();

      if (!token) {
        throw new Error("You must be logged in to update a book");
      }

      const response = await updateBookRequest(token, id, data);
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === response.id ? response : book))
      );
    } catch (error) {
      console.error("updateBook error:", getErrorMessage(error));
      throw error;
    }
  }

  async function deleteBook(id: string) {
    try {
      const token = await getStoredAuthToken();

      if (!token) {
        throw new Error("You must be logged in to delete a book");
      }

      await deleteBookRequest(token, id);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (error) {
      console.error(getErrorMessage(error));
      throw error;
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchBooks();
    } else {
      setBooks([]);
    }
  }, [user?.id]);

  return (
    <BooksContext.Provider
      value={{
        books,
        fetchBooks,
        fetchBookById,
        createBook,
        updateBook,
        deleteBook,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
}
