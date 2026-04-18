import { db } from "./client";
import type { UserRecord } from "../types";

type UserRow = {
  id: string;
  email: string;
  password_hash: string | null;
  google_subject: string | null;
  created_at: string;
  updated_at: string;
};

const insertUserStatement = db.prepare(`
  INSERT INTO users (id, email, password_hash, google_subject, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const selectUserByEmailStatement = db.prepare(
  "SELECT * FROM users WHERE email = ? LIMIT 1"
);

const selectUserByIdStatement = db.prepare(
  "SELECT * FROM users WHERE id = ? LIMIT 1"
);

function mapUserRow(row: UserRow): UserRecord {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    googleSubject: row.google_subject,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createUser(input: {
  id: string;
  email: string;
  passwordHash: string | null;
  googleSubject?: string | null;
}) {
  const timestamp = new Date().toISOString();
  insertUserStatement.run(
    input.id,
    input.email,
    input.passwordHash,
    input.googleSubject ?? null,
    timestamp,
    timestamp
  );

  return getUserById(input.id);
}

export function getUserByEmail(email: string) {
  const row = selectUserByEmailStatement.get(email) as UserRow | null;
  return row ? mapUserRow(row) : null;
}

export function getUserById(id: string) {
  const row = selectUserByIdStatement.get(id) as UserRow | null;
  return row ? mapUserRow(row) : null;
}
