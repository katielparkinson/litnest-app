export type BookStatus = "tbr" | "in-progress" | "completed" | "dnf";

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string | null;
  googleSubject: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BookRecord = {
  id: string;
  userId: string;
  title: string;
  author: string;
  status: BookStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthTokenPayload = {
  sub: string;
  email: string;
};

export type AuthenticatedRequestUser = {
  id: string;
  email: string;
};
