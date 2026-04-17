import { useContext } from "react";
import { BooksContext } from "../contexts/BooksContext";
import type { BooksContextValue } from "../types/app";

export function useBooks() {
  const context = useContext(BooksContext) as BooksContextValue | undefined;

  if (!context) {
    throw new Error("useBooks must be used within a BooksProvider");
  }

  return context;
}
