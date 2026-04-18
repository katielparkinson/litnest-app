import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { Database } from "bun:sqlite";
import { env } from "../env";

const dbDirectory = dirname(env.SQLITE_PATH);
mkdirSync(dbDirectory, { recursive: true });

export const db = new Database(env.SQLITE_PATH, { create: true });
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");
