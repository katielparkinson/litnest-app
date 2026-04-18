import { db } from "./client";
import type { BookRecord, BookStatus } from "../types";

type BookRow = {
  id: string;
  user_id: string;
  title: string;
  author: string;
  status: BookStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const insertBookStatement = db.prepare(`
  INSERT INTO books (id, user_id, title, author, status, notes, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const selectBookByIdStatement = db.prepare(
  "SELECT * FROM books WHERE id = ? AND user_id = ? LIMIT 1"
);

const deleteBookStatement = db.prepare(
  "DELETE FROM books WHERE id = ? AND user_id = ?"
);

function mapBookRow(row: BookRow): BookRecord {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    author: row.author,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function listBooks(userId: string, status?: BookStatus) {
  const query = status
    ? "SELECT * FROM books WHERE user_id = ? AND status = ? ORDER BY created_at ASC"
    : "SELECT * FROM books WHERE user_id = ? ORDER BY created_at ASC";

  const rows = (status
    ? db.query(query).all(userId, status)
    : db.query(query).all(userId)) as BookRow[];

  return rows.map(mapBookRow);
}

export function getBookById(id: string, userId: string) {
  const row = selectBookByIdStatement.get(id, userId) as BookRow | null;
  return row ? mapBookRow(row) : null;
}

export function createBook(input: {
  id: string;
  userId: string;
  title: string;
  author: string;
  status: BookStatus;
  notes?: string | null;
}) {
  const timestamp = new Date().toISOString();
  insertBookStatement.run(
    input.id,
    input.userId,
    input.title,
    input.author,
    input.status,
    input.notes ?? null,
    timestamp,
    timestamp
  );

  return getBookById(input.id, input.userId);
}

export function updateBook(
  id: string,
  userId: string,
  input: {
    title: string;
    author: string;
    status: BookStatus;
    notes?: string | null;
  }
) {
  const timestamp = new Date().toISOString();
  db.prepare(`
    UPDATE books
    SET title = ?, author = ?, status = ?, notes = ?, updated_at = ?
    WHERE id = ? AND user_id = ?
  `).run(
    input.title,
    input.author,
    input.status,
    input.notes ?? null,
    timestamp,
    id,
    userId
  );

  return getBookById(id, userId);
}

export function deleteBook(id: string, userId: string) {
  const result = deleteBookStatement.run(id, userId);
  return result.changes > 0;
}
