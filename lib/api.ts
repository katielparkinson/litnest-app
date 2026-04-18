import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import type { AppUser, Book, BookInput, BookStatus } from "../types/app";

const AUTH_TOKEN_KEY = "litnest-auth-token";

function getDefaultApiBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000";
  }

  return "http://127.0.0.1:3000";
}

const API_BASE_URL = getDefaultApiBaseUrl();

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
};

type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
  };
};

type BooksResponse = {
  books: RawBook[];
};

type BookResponse = {
  book: RawBook;
};

type RawBook = {
  id: string;
  userId: string;
  title: string;
  author: string;
  status: BookStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

function normalizeUser(input: { id: string; email: string }): AppUser {
  return {
    id: input.id,
    email: input.email,
  };
}

function normalizeBook(input: RawBook): Book {
  return {
    id: input.id,
    userId: input.userId,
    title: input.title,
    author: input.author,
    status: input.status,
    notes: input.notes ?? undefined,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  };
}

async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const headers: Record<string, string> = {};

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(payload?.error ?? `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getStoredAuthToken() {
  return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
}

export async function setStoredAuthToken(token: string) {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
}

export async function clearStoredAuthToken() {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
}

export async function registerWithPassword(email: string, password: string) {
  const response = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: { email, password },
  });

  return {
    token: response.token,
    user: normalizeUser(response.user),
  };
}

export async function loginWithPassword(email: string, password: string) {
  const response = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  return {
    token: response.token,
    user: normalizeUser(response.user),
  };
}

export async function fetchCurrentUser(token: string) {
  const response = await apiRequest<{ user: AppUser }>("/auth/me", {
    token,
  });

  return normalizeUser(response.user);
}

export async function logoutFromApi(token: string | null) {
  if (!token) {
    return;
  }

  await apiRequest("/auth/logout", {
    method: "POST",
    token,
  });
}

export async function fetchBooks(token: string, status?: BookStatus) {
  const searchParams = new URLSearchParams();

  if (status) {
    searchParams.set("status", status);
  }

  const query = searchParams.toString();
  const response = await apiRequest<BooksResponse>(
    `/books${query ? `?${query}` : ""}`,
    { token }
  );

  return response.books.map(normalizeBook);
}

export async function fetchBookById(token: string, id: string) {
  const response = await apiRequest<BookResponse>(`/books/${id}`, { token });
  return normalizeBook(response.book);
}

export async function createBook(token: string, input: BookInput) {
  const response = await apiRequest<BookResponse>("/books", {
    method: "POST",
    token,
    body: input,
  });

  return normalizeBook(response.book);
}

export async function updateBook(token: string, id: string, input: BookInput) {
  const response = await apiRequest<BookResponse>(`/books/${id}`, {
    method: "PATCH",
    token,
    body: input,
  });

  return normalizeBook(response.book);
}

export async function deleteBook(token: string, id: string) {
  await apiRequest(`/books/${id}`, {
    method: "DELETE",
    token,
  });
}
