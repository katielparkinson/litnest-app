export type BookStatus = "tbr" | "in-progress" | "completed" | "dnf";

export type DropdownOption = {
  label: string;
  value: string;
};

export type Book = {
  id: string;
  userId: string;
  title: string;
  author: string;
  status: BookStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type BookInput = {
  title: string;
  author: string;
  status?: BookStatus;
  notes?: string;
};

export type AppUser = {
  id: string;
  email: string;
};

export type UserContextValue = {
  user: AppUser | null;
  authChecked: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export type BooksContextValue = {
  books: Book[];
  fetchBooks: () => Promise<void>;
  fetchBookById: (id: string) => Promise<Book | undefined>;
  createBook: (data: BookInput) => Promise<void>;
  updateBook: (id: string, data: BookInput) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
};
