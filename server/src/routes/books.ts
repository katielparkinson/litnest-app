import { randomUUID } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import {
  createBook,
  deleteBook,
  getBookById,
  listBooks,
  updateBook
} from "../db/books";
import { requireAuth } from "../middleware/auth";
import type { BookStatus } from "../types";

const statusEnum = z.enum(["tbr", "in-progress", "completed", "dnf"]);

const createBookSchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().min(1),
  status: statusEnum.default("tbr"),
  notes: z.string().trim().optional()
});

const updateBookSchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().min(1),
  status: statusEnum,
  notes: z.string().trim().optional()
});

const listBooksQuerySchema = z.object({
  status: statusEnum.optional()
});

export const booksRouter = Router();

booksRouter.use(requireAuth);

booksRouter.get("/", (request, response) => {
  const result = listBooksQuerySchema.safeParse(request.query);

  if (!result.success) {
    return response.status(400).json({ error: "Invalid query string" });
  }

  const books = listBooks(request.user!.id, result.data.status as BookStatus | undefined);
  return response.json({ books });
});

booksRouter.get("/:id", (request, response) => {
  const book = getBookById(request.params.id, request.user!.id);

  if (!book) {
    return response.status(404).json({ error: "Book not found" });
  }

  return response.json({ book });
});

booksRouter.post("/", (request, response) => {
  const result = createBookSchema.safeParse(request.body);

  if (!result.success) {
    return response.status(400).json({ error: "Invalid book payload" });
  }

  const book = createBook({
    id: randomUUID(),
    userId: request.user!.id,
    title: result.data.title,
    author: result.data.author,
    status: result.data.status,
    notes: result.data.notes
  });

  return response.status(201).json({ book });
});

booksRouter.patch("/:id", (request, response) => {
  const result = updateBookSchema.safeParse(request.body);

  if (!result.success) {
    return response.status(400).json({ error: "Invalid book payload" });
  }

  const book = updateBook(request.params.id, request.user!.id, {
    title: result.data.title,
    author: result.data.author,
    status: result.data.status,
    notes: result.data.notes
  });

  if (!book) {
    return response.status(404).json({ error: "Book not found" });
  }

  return response.json({ book });
});

booksRouter.delete("/:id", (request, response) => {
  const deleted = deleteBook(request.params.id, request.user!.id);

  if (!deleted) {
    return response.status(404).json({ error: "Book not found" });
  }

  return response.status(204).send();
});
